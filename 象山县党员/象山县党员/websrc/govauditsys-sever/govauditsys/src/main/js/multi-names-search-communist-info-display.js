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
		this.state = {communistInfoes: [], page: 1, pageSize: 6, links: {}};
		this.onNavigate = this.onNavigate.bind(this);
	}

	loadFromServer(names, pageSize) {
		client({
			method: 'POST',
			path: '/communistinfo/multinamesearch',
			params: {size: pageSize},
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
			}
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
			}
		});
	}
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.names.length != 0) {
			this.loadFromServer(nextProps.names, this.state.pageSize);
		}
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
								  onNavigate={this.onNavigate}/>
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
			<CommunistInfo communistInfo={communistInfo}/>
		);

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
							<th>党员姓名</th>
							<th>身份证号</th>
							<th>性别</th>
							<th>入党日期</th>
							<th>学历</th>
							<th>党支部</th>
							<th>上级组织</th>
							<th>籍贯</th>
							<th>民族</th>
							<th>个人身份</th>
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
		return (
			<tr>
				<td>{this.props.communistInfo.name}</td>
				<td>{this.props.communistInfo.idNumber}</td>
				<td>{this.props.communistInfo.gender}</td>
				<td>{this.props.communistInfo.joinDate}</td>
				<td>{this.props.communistInfo.education}</td>
				<td>{this.props.communistInfo.partyBranch}</td>
				<td>{this.props.communistInfo.superiorOrg}</td>
				<td>{this.props.communistInfo.nativePlace}</td>
				<td>{this.props.communistInfo.nation}</td>
				<td>{this.props.communistInfo.individualStatus}</td>
			</tr>
		)
	}
}

module.exports = MultiNamesSearchCommunistInfoDisplay;

