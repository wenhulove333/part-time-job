'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

var root = '/api';
var children = 'userOperationLoggings';

class UserOperationLoggingDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {userOperationLoggings: [], attributes: [], page: 1, pageSize: 12, links: {}};
		this.onNavigate = this.onNavigate.bind(this);
		this.onSearch = this.onSearch.bind(this);
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
		if (operator === "") {
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
		this.getUserOperationLoggingsByOperatorDuringSpecificTimeRange(
			document.getElementById("name").value,
			'2009-12-31T16:00:00.000+000',
			'2098-12-31T16:00:00.000+000',
			this.state.pageSize
		);
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
		this.loadFromServer(this.state.pageSize);
	}
	// end::register-handlers[]

	render() {
		return (
			<div className="searchBarPlusDataDisplay">
				<div className="webdesigntuts-workshop">
				    <input type="search" id="name" placeholder="请输入你所要查询的系统用户"></input>
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
		}
		if ("next" in this.props.links) {
			navLinks.push(<button key="next" onClick={this.handleNavNext}>后一页</button>);
		}
		if ("last" in this.props.links) {
			navLinks.push(<button key="last" onClick={this.handleNavLast}>尾页</button>);
		}

		return (
			<div>
				<table>
					<thead>
						<tr>
							<th>系统用户</th>
							<th>查看时间</th>
							<th>查看信息</th>
							<th>被查看人</th>
						</tr>
					</thead>
					<tbody>
						{userOperationLoggings}
					</tbody>
				</table>
				<div>
					{navLinks}
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
		var logDate = new Date(this.props.userOperationLogging.entity.time);
		
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

