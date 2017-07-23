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

class MultiNamesPlusBirthdateSearchLawcaseInfoDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {lawcaseInfoes: [], page: 1, pageSize: 10, links: {}, columns: [], disciplinaryInspectDepartment: ['']};
		this.onNavigate = this.onNavigate.bind(this);
	}

	loadFromServer(namesPlusBirthdate, pageSize) {
		client({
			method: 'POST',
			path: '/lawcaseinfo/multirespondentnamesplusbirthdatesearch',
			params: {size: pageSize, disciplinaryInspectDepartment: this.state.disciplinaryInspectDepartment},
			entity: namesPlusBirthdate,
			headers: {'Content-Type': 'application/json'}
		}).done(response => {
			if ("_embedded" in response.entity) {
				this.setState({
					page: response.entity.page,
					lawcaseInfoes: response.entity._embedded.lawcaseInfoes,
					pageSize: pageSize,
					links: response.entity._links
				});
			} else {
				this.setState({
					page: response.entity.page,
					lawcaseInfoes: [],
					pageSize: pageSize,
					links: response.entity._links
				});
			}
		});
	}
	
	loadColumnsFromServer(accountName) {
		client({
			method: 'GET',
			path: '/columnshowstatus',
			params: {accountName: accountName, infoType: "lawcaseinfo"}
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
			entity: this.props.namesPlusBirthdate,
			headers: {'Content-Type': 'application/json'}
		}).done(response => {
			if ("_embedded" in response.entity) {
				this.setState({
					page: response.entity.page,
					lawcaseInfoes: response.entity._embedded.lawcaseInfoes,
					pageSize: this.state.pageSize,
					links: response.entity._links
				});
			} else {
				this.setState({
					page: response.entity.page,
					lawcaseInfoes: [],
					pageSize: this.state.pageSize,
					links: response.entity._links
				});
			}
		});
	}
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.namesPlusBirthdate.length != 0) {
			this.loadFromServer(nextProps.namesPlusBirthdate, this.state.pageSize);
		} else {
			this.setState({lawcaseInfoes: [], page: 1, pageSize: this.state.pageSize, links: {}});
		}
		
		this.loadColumnsFromServer(nextProps.accountName);
	}
	
	componentDidMount() {
		if (this.props.namesPlusBirthdate.length != 0) {
			this.loadFromServer(this.props.namesPlusBirthdate, this.state.pageSize);
		}
		
		this.loadColumnsFromServer(this.props.accountName);
	}

	render() {
		if (!this.props.showLawcaseInfo) {
			return null;
		}
		
		return (
			<div className="searchBarPlusDataDisplay">
				<div className="datadisplay">
					<LawcaseInfoList page={this.state.page}
								  lawcaseInfoes={this.state.lawcaseInfoes}
								  links={this.state.links}
								  pageSize={this.state.pageSize}
								  onNavigate={this.onNavigate}
					              columns={this.state.columns}/>
				</div>
			</div>
		)
	}
}

class LawcaseInfoList extends React.Component {

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
		var lawcaseInfoes = this.props.lawcaseInfoes.map(lawcaseInfo =>
			<LawcaseInfo lawcaseInfo={lawcaseInfo} columns={this.props.columns}/>
		);
		
		var lawcaseInfoHead = this.props.columns.map(column => <th>{column[1]}</th>);

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
							{lawcaseInfoHead}
						</tr>
					</thead>
					<tbody>
						{lawcaseInfoes}
					</tbody>
				</table>
				<div>
					{pagination}
				</div>
			</div>
		)
	}
}

class LawcaseInfo extends React.Component {

	constructor(props) {
		super(props);
	}
	
	convertDateAsSimpleDisplayTime(gmtTime) {
		var month = gmtTime.getMonth() + 1;
		var day = gmtTime.getDate();
		var simpleTime = [gmtTime.getFullYear(), (month > 9 ? '' : '0') + month,
					 (day > 9 ? '' : '0') + day].join('-');
		return simpleTime;
	}

	render() {
		var lawcaseInfo = this.props.columns.map(column => {
			if (['joinDate', 'caseFilingDate', 'caseCloseDate'].includes(column[0])) {
				var dateStr = new Date(this.props.lawcaseInfo[column[0]].replace(/\+0000/, "Z"));
				return <td>{this.convertDateAsSimpleDisplayTime(dateStr)}</td>;
			} else {
				return <td>{this.props.lawcaseInfo[column[0]]}</td>;
			}
		});
		
		return (
			<tr>
				{lawcaseInfo}
			</tr>
		)
	}
}

module.exports = MultiNamesPlusBirthdateSearchLawcaseInfoDisplay;

