'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

import DatePicker from 'react-datepicker';
import moment from 'moment';

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import UltimatePagination from 'react-ultimate-pagination-material-ui';
const lightMuiTheme = getMuiTheme(lightBaseTheme);
const parseUrl = require('./parse-url');

var root = '/api';
var children = 'userOperationLoggings';

class UserOperationLoggingDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {userOperationLoggings: [], attributes: [], page: 1, pageSize: 12, links: {}, startTime: '', endTime: ''};
		this.onNavigate = this.onNavigate.bind(this);
		this.onSearch = this.onSearch.bind(this);
		this.handleSelectStartTime = this.handleSelectStartTime.bind(this);
		this.handleSelectEndTime = this.handleSelectEndTime.bind(this);
	}

	loadFromServer(pageSize) {
		root = "/api";
		children = "userOperationLoggings";
		follow(client, root, [
				{rel: children, params: {size: pageSize}}]
		).then(userOperationLoggingCollection => {
			this.page = userOperationLoggingCollection.entity.page;
			this.links = userOperationLoggingCollection.entity._links;
			return userOperationLoggingCollection.entity._embedded.userOperationLoggings.map(userOperationLogging =>
					client({
						method: 'GET',
						path: userOperationLogging._links.self.href
					})
			);
		}).then(userOperationLoggingPromises => {
			return when.all(userOperationLoggingPromises);
		}).done(userOperationLoggings => {
			this.setState({
				page: this.page,
				userOperationLoggings: userOperationLoggings,
				pageSize: pageSize,
				links: this.links
			});
		});
	}
	
	getUserOperationLoggingsByOperatorDuringSpecificTimeRange(operator, startTime, endTime, pageSize) {
		if (operator === ""
			&& startTime === "1970-01-01 00:00:00"
			&& endTime == "2099-12-31 23:59:59") {
			return;
		}
		
		if (false) {
			root = "/api";
			children = "userOperationLoggings";
		} else {
			root = "/api/userOperationLoggings/search";
			children = "findByOperatorContaining";
		}
		
		follow(client, root, [
				{rel: children, params: {operator: operator, startTime: startTime, endTime: endTime, size: pageSize}}]
		).then(userOperationLoggingCollection => {
			this.page = userOperationLoggingCollection.entity.page;
			this.links = userOperationLoggingCollection.entity._links;
			return userOperationLoggingCollection.entity._embedded.userOperationLoggings.map(userOperationLogging =>
					client({
						method: 'GET',
						path: userOperationLogging._links.self.href
					})
			);
		}).then(userOperationLoggingPromises => {
			return when.all(userOperationLoggingPromises);
		}).done(userOperationLoggings => {
			this.setState({
				page: this.page,
				userOperationLoggings: userOperationLoggings,
				pageSize: pageSize,
				links: this.links
			});
		});
	}

	onNavigate(navUri) {
		client({
			method: 'GET',
			path: navUri
		}).then(userOperationLoggingCollection => {
			this.links = userOperationLoggingCollection.entity._links;
			this.page = userOperationLoggingCollection.entity.page;

			return userOperationLoggingCollection.entity._embedded.userOperationLoggings.map(userOperationLogging =>
					client({
						method: 'GET',
						path: userOperationLogging._links.self.href
					})
			);
		}).then(userOperationLoggingPromises => {
			return when.all(userOperationLoggingPromises);
		}).done(userOperationLoggings => {
			this.setState({
				page: this.page,
				userOperationLoggings: userOperationLoggings,
				pageSize: this.state.pageSize,
				links: this.links
			});
		});
	}
	
	onSearch(e) {
		var startTime = "1970-01-01";
		var endTime = "2099-12-31";
		
		if (this.state.startTime.toString() !== '') {
			var startDate = new Date(this.state.startTime);
			var startMonth = startDate.getMonth() + 1;
			var startDay = startDate.getDate();
			startTime = [startDate.getFullYear(), (startMonth > 9 ? '' : '0') + startMonth,
						 (startDay > 9 ? '' : '0') + startDay].join('-');
		}
				
		if (this.state.endTime.toString() !== '') {
		    var endDate = new Date(this.state.endTime);
			var endMonth = endDate.getMonth() + 1;
			var endDay = endDate.getDate();
			endTime = [endDate.getFullYear(), (endMonth > 9 ? '' : '0') + endMonth,
						 (endDay > 9 ? '' : '0') + endDay].join('-');
		}
		
		this.getUserOperationLoggingsByOperatorDuringSpecificTimeRange(
			document.getElementById("name").value,
			startTime + ' 00:00:00',
			endTime + ' 23:59:59',
			this.state.pageSize
		);
	}
	
	handleSelectStartTime(startTime) {
		var state = this.state;
		
		if (startTime == null) {
			startTime = '';
		}
		
		state.startTime = startTime;
		
		this.setState(state);
	}
	
	handleSelectEndTime(endTime) {
		var state = this.state;
		
		if (endTime == null) {
			endTime = '';
		}
		
		state.endTime = endTime;
		
		this.setState(state);
	}

	// tag::websocket-handlers[]
	refreshAndGoToLastPage(message) {
		follow(client, root, [{
			rel: children,
			params: {size: this.state.pageSize}
		}]).done(response => {
			if (response.entity._links.last !== undefined) {
				this.onNavigate(response.entity._links.last.href);
			} else {
				this.onNavigate(response.entity._links.self.href);
			}
		})
	}

	// tag::register-handlers[]
	componentDidMount() {
//		var startTime = "1970-01-01";
//		var endTime = "2099-12-31";
//		this.getUserOperationLoggingsByOperatorDuringSpecificTimeRange(
//			"",
//			'1970-01-01 00:00:00',
//			'2099-12-31 23:59:59',
//			this.state.pageSize
//		);
	}
	// end::register-handlers[]

	render() {
		return (
			<div className="searchBarPlusDataDisplay">
				<div className="webdesigntuts-workshop">
				    <input type="search" id="name" placeholder="请输入你所要查询的系统用户"></input>
				    <DatePicker
						dateFormat="YYYY-MM-DD"
						selected={this.state.startTime}
						onChange={this.handleSelectStartTime}
				    	placeholderText="请选择开始时间"
				    	locale="zh-cn"
					/>
					<DatePicker
						dateFormat="YYYY-MM-DD"
						selected={this.state.endTime}
						onChange={this.handleSelectEndTime}
				    	placeholderText="请选择结束时间"
				    	locale="zh-cn"
					/>
					<button onClick={this.onSearch}>搜索</button>
				</div>
				<div className="datadisplay">
					<UserOperationLoggingList page={this.state.page}
								  userOperationLoggings={this.state.userOperationLoggings}
								  links={this.state.links}
								  pageSize={this.state.pageSize}
								  onNavigate={this.onNavigate}/>
				</div>
			</div>
		)
	}
}

class UserOperationLoggingList extends React.Component {

	constructor(props) {
		super(props);
		this.handleNavFirst = this.handleNavFirst.bind(this);
		this.handleNavPrev = this.handleNavPrev.bind(this);
		this.handleNavNext = this.handleNavNext.bind(this);
		this.handleNavLast = this.handleNavLast.bind(this);
		this.handleInput = this.handleInput.bind(this);
		this.onPageChangeFromPagination = this.onPageChangeFromPagination.bind(this);
		this.state = {
			currentPage: 1
	    };
	}

	handleInput(e) {
		e.preventDefault();
		var pageSize = ReactDOM.findDOMNode(this.refs.pageSize).value;
		if (/^[0-9]+$/.test(pageSize)) {
			this.props.updatePageSize(pageSize);
		} else {
			ReactDOM.findDOMNode(this.refs.pageSize).value = pageSize.substring(0, pageSize.length - 1);
		}
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
		var userOperationLoggings = this.props.userOperationLoggings.map(userOperationLogging =>
			<UserOperationLogging key={userOperationLogging.entity._links.self.href}
					  userOperationLogging={userOperationLogging}
					  attributes={this.props.attributes}
					  onUpdate={this.props.onUpdate}
					  onDelete={this.props.onDelete}/>
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
							<th>系统用户</th>
							<th>查看时间</th>
							<th>查看信息</th>
							<th>查看对象</th>
						</tr>
					</thead>
					<tbody>
						{userOperationLoggings}
					</tbody>
				</table>
				<div>
					{pagination}
				</div>
			</div>
		)
	}
}

class UserOperationLogging extends React.Component {

	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleDelete() {
		this.props.onDelete(this.props.communistInfo);
	}
	
	render() {
		var logDate = new Date(this.props.userOperationLogging.entity.time.replace(/\+0000/, "Z"));
		
		return (
			<tr>
				<td>{this.props.userOperationLogging.entity.operator}</td>
				<td>{logDate.toLocaleString()}</td>
				<td>{this.props.userOperationLogging.entity.log}</td>
				<td>{this.props.userOperationLogging.entity.userName}</td>
			</tr>
		)
	}
}

module.exports = UserOperationLoggingDisplay;

