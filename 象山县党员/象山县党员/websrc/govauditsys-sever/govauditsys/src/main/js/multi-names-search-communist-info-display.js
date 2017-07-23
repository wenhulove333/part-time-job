'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import UltimatePagination from 'react-ultimate-pagination-material-ui';
const lightMuiTheme = getMuiTheme(lightBaseTheme);
const parseUrl = require('./parse-url');

class MultiNamesSearchCommunistInfoDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {communistInfoes: [], page: 1, pageSize: 10, links: {}, columns: [], disciplinaryInspectDepartment: ['']};
		this.onNavigate = this.onNavigate.bind(this);
		this.loadColumnsFromServer = this.loadColumnsFromServer.bind(this);
	}

	loadFromServer(names, pageSize) {
		client({
			method: 'POST',
			path: '/communistinfo/multinamesearch',
			params: {size: pageSize, disciplinaryInspectDepartment: this.state.disciplinaryInspectDepartment},
			entity: names,
			headers: {'Content-Type': 'application/json'}
		}).done(response => {
			if ("_embedded" in response.entity) {
				this.setState({
					page: response.entity.page,
					communistInfoes: response.entity._embedded.communistInfoes,
					pageSize: pageSize,
					links: response.entity._links
				});
			} else {
				this.setState({
					page: response.entity.page,
					communistInfoes: [],
					pageSize: this.state.pageSize,
					links: response.entity._links
				});
			}
		});
	}
	
	loadColumnsFromServer(accountName) {
		client({
			method: 'GET',
			path: '/columnshowstatus',
			params: {accountName: accountName, infoType: "communist"}
		}).then(response => {
			return response;
		}).done(result => {
			this.setState({columns: result.entity});
		});
		
		client({
			method: 'GET',
			path: '/getdisciplinaryinpectiondepartment',
			params: {accountName: accountName}
		}).then(response => {
			return response;
		}).done(result => {
			this.setState({disciplinaryInspectDepartment: result.entity});
		});
	}

	onNavigate(navUri) {
		client({
			method: 'POST',
			path: navUri,
			entity: this.props.names,
			headers: {'Content-Type': 'application/json'}
		}).done(response => {
			if ("_embedded" in response.entity) {
				this.setState({
					page: response.entity.page,
					communistInfoes: response.entity._embedded.communistInfoes,
					pageSize: this.state.pageSize,
					links: response.entity._links
				});
			} else {
				this.setState({
					page: response.entity.page,
					communistInfoes: [],
					pageSize: this.state.pageSize,
					links: response.entity._links
				});
			}
		});
	}
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.names.length != 0) {
			this.loadFromServer(nextProps.names, this.state.pageSize);
		} else {
			this.setState({communistInfoes: [], page: 1, pageSize: this.state.pageSize, links: {}});
		}
		
		this.loadColumnsFromServer(nextProps.accountName);
	}
	
	componentDidMount() {
		if (this.props.names.length != 0) {
			this.loadFromServer(this.props.names, this.state.pageSize);
		}
		this.loadColumnsFromServer(this.props.accountName);
	}

	render() {
		if (!this.props.showCommunistInfo) {
			return null;
		}
		
		return (
			<div className="searchBarPlusDataDisplay">
				<div className="datadisplay">
					<CommunistInfoList page={this.state.page}
								  communistInfoes={this.state.communistInfoes}
								  links={this.state.links}
								  pageSize={this.state.pageSize}
								  onNavigate={this.onNavigate}
					              columns={this.state.columns}/>
				</div>
			</div>
		)
	}
}

class CommunistInfoList extends React.Component {

	constructor(props) {
		super(props);
		this.handleNavFirst = this.handleNavFirst.bind(this);
		this.handleNavPrev = this.handleNavPrev.bind(this);
		this.handleNavNext = this.handleNavNext.bind(this);
		this.handleNavLast = this.handleNavLast.bind(this);
		this.onPageChangeFromPagination = this.onPageChangeFromPagination.bind(this);
		this.state = {
			currentPage: 1
	    };
	}

	handleNavFirst(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.first.href);
	}

	handleNavPrev(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.prev.href);
	}

	handleNavNext(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.next.href);
	}

	handleNavLast(e) {
		e.preventDefault();
		this.props.onNavigate(this.props.links.last.href);
	}

	onPageChangeFromPagination(newPage) {
		var urlParser = parseUrl(this.props.links.first.href);
		urlParser.changeParam('page', (newPage - 1));
		this.props.onNavigate(urlParser.toUrl());
		this.setState({currentPage: newPage});
	    console.log(newPage);
	}
	
	render() {
		var communistInfoes = this.props.communistInfoes.map(communistInfo =>
			<CommunistInfo communistInfo={communistInfo} columns={this.props.columns}/>
		);
		
		var communistInfoHead = this.props.columns.map(column => <th>{column[1]}</th>);

		var navLinks = [];
		if ("first" in this.props.links) {
			navLinks.push(<button key="first" onClick={this.handleNavFirst}>首页</button>);
		}
		if ("prev" in this.props.links) {
			navLinks.push(<button key="prev" onClick={this.handleNavPrev}>前一页</button>);
			var urlParser = parseUrl(this.props.links.prev.href);
			this.state.currentPage = parseInt(urlParser.getParam('page')) + 2;
		}
		if ("next" in this.props.links) {
			navLinks.push(<button key="next" onClick={this.handleNavNext}>后一页</button>);
			var urlParser = parseUrl(this.props.links.next.href);
			this.state.currentPage = parseInt(urlParser.getParam('page'));
		}
		if ("last" in this.props.links) {
			navLinks.push(<button key="last" onClick={this.handleNavLast}>尾页</button>);
		}
		
		var pagination = null; 
		
		if (this.props.page.totalPages > 1) {
			pagination = (<MuiThemeProvider muiTheme={lightMuiTheme}>
				<UltimatePagination
		            currentPage={this.state.currentPage}
		            totalPages={this.props.page.totalPages}
		            boundaryPagesRange={0}
		            siblingPagesRange={7}
		            hidePreviousAndNextPageLinks={false}
		            hideFirstAndLastPageLinks={false}
		            hideEllipsis={true}
		            onChange={this.onPageChangeFromPagination}
				/>
			</MuiThemeProvider>);
		}

		return (
			<div>
				<table>
					<thead>
						<tr>
							{communistInfoHead}
						</tr>
					</thead>
					<tbody>
						{communistInfoes}
					</tbody>
				</table>
				<div>
					{pagination}
				</div>
			</div>
		)
	}
}

class CommunistInfo extends React.Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		var communistInfo = this.props.columns.map(column => <td>{this.props.communistInfo[column[0]]}</td>);
		
		return (
			<tr>
				{communistInfo}
			</tr>
		)
	}
}

module.exports = MultiNamesSearchCommunistInfoDisplay;

