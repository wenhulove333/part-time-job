'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

var root = '/api';
var children = 'sysUsers';

class SysUserDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {sysUsers: [], attributes: [], page: 1, pageSize: 12, links: {}};
		this.onNavigate = this.onNavigate.bind(this);
		this.onSearch = this.onSearch.bind(this);
		this.onCreate = this.onCreate.bind(this);
	}

	loadFromServer(pageSize) {
		root = "/api";
		children = "sysUsers";
		follow(client, root, [
				{rel: children, params: {size: pageSize}}]
		).then(sysUserCollection => {
			this.page = sysUserCollection.entity.page;
			this.links = sysUserCollection.entity._links;
			return sysUserCollection.entity._embedded.sysUsers.map(sysUser =>
					client({
						method: 'GET',
						path: sysUser._links.self.href
					})
			);
		}).then(sysUserPromises => {
			return when.all(sysUserPromises);
		}).done(sysUsers => {
			this.setState({
				page: this.page,
				sysUsers: sysUsers,
				pageSize: pageSize,
				links: this.links
			});
		});
	}
	
	getsysUsersByName(accountName, pageSize) {
		if (accountName === "") {
			root = "/api";
			children = "sysUsers";
		} else {
			root = "/api/sysUsers/search";
			children = "findByAccountName";
		}
		follow(client, root, [
				{rel: children, params: {accountName: accountName, size: pageSize}}]
		).then(sysUserCollection => {
			this.page = sysUserCollection.entity.page;
			this.links = sysUserCollection.entity._links;
			return sysUserCollection.entity._embedded.sysUsers.map(sysUser =>
					client({
						method: 'GET',
						path: sysUser._links.self.href
					})
			);
		}).then(sysUserPromises => {
			return when.all(sysUserPromises);
		}).done(sysUsers => {
			this.setState({
				page: this.page,
				sysUsers: sysUsers,
				pageSize: pageSize,
				links: this.links
			});
		});
	}
	
	onCreate(newSysUser) {
		root = "/api";
		children = "sysUsers";
		follow(client, root, ['sysUsers']).done(response => {
			client({
				method: 'POST',
				path: response.entity._links.self.href,
				entity: newSysUser,
				headers: {'Content-Type': 'application/json'}
			})
		})
	}

	onNavigate(navUri) {
		client({
			method: 'GET',
			path: navUri
		}).then(sysUserCollection => {
			this.links = sysUserCollection.entity._links;
			this.page = sysUserCollection.entity.page;

			return sysUserCollection.entity._embedded.sysUsers.map(sysUser =>
					client({
						method: 'GET',
						path: sysUser._links.self.href
					})
			);
		}).then(sysUserPromises => {
			return when.all(sysUserPromises);
		}).done(sysUsers => {
			this.setState({
				page: this.page,
				sysUsers: sysUsers,
				pageSize: this.state.pageSize,
				links: this.links
			});
		});
	}
	
	onSearch(e) {
		this.getsysUsersByName(document.getElementById("name").value, this.state.pageSize);
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
		//this.getsysUsersByName('张三', this.state.pageSize);
	}
	// end::register-handlers[]

	render() {
		return (
			<div className="searchBarPlusDataDisplay">
				<div>
					<div className="webdesigntuts-workshop">
					    <input type="search" id="name" placeholder="请输入你所要查询的人名"></input>
						<button onClick={this.onSearch}>搜索</button>
					</div>
					<CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
				</div>
				<div className="datadisplay">
					<SysUserList page={this.state.page}
								  sysUsers={this.state.sysUsers}
								  links={this.state.links}
								  pageSize={this.state.pageSize}
								  onNavigate={this.onNavigate}/>
				</div>
			</div>
		)
	}
}

class SysUserList extends React.Component {

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
		var pageInfo = this.props.page.hasOwnProperty("number") ?
			<h3>SysUsers - Page {this.props.page.number + 1} of {this.props.page.totalPages}</h3> : null;

		var sysUsers = this.props.sysUsers.map(sysUser =>
			<SysUser key={sysUser.entity._links.self.href}
					  sysUser={sysUser}
					  attributes={this.props.attributes}
					  onUpdate={this.props.onUpdate}
					  onDelete={this.props.onDelete}/>
		);

		var navLinks = [];
		if ("first" in this.props.links) {
			navLinks.push(<button key="first" onClick={this.handleNavFirst}>&lt;&lt;</button>);
		}
		if ("prev" in this.props.links) {
			navLinks.push(<button key="prev" onClick={this.handleNavPrev}>&lt;</button>);
		}
		if ("next" in this.props.links) {
			navLinks.push(<button key="next" onClick={this.handleNavNext}>&gt;</button>);
		}
		if ("last" in this.props.links) {
			navLinks.push(<button key="last" onClick={this.handleNavLast}>&gt;&gt;</button>);
		}

		return (
			<div>
				<table>
					<thead>
						<tr>
							<th>账户名</th>
							<th>用户名</th>
							<th>用户所在地</th>
							<th>用户职务</th>
							<th>角色</th>
						</tr>
					</thead>
					<tbody>
						{sysUsers}
					</tbody>
				</table>
				<div>
					{navLinks}
				</div>
			</div>
		)
	}
}

class SysUser extends React.Component {

	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleDelete() {
		this.props.onDelete(this.props.sysUser);
	}
	
	render() {
		return (
			<tr>
				<td>{this.props.sysUser.entity.accountName}</td>
				<td>{this.props.sysUser.entity.name}</td>
				<td>{this.props.sysUser.entity.workPlace}</td>
				<td>{this.props.sysUser.entity.position}</td>
				<td>{this.props.sysUser.entity.roles}</td>
			</tr>
		)
	}
}

class CreateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		var sysUser = {};
		sysUser['accountName'] = ReactDOM.findDOMNode(this.refs['accountName']).value.trim();
		sysUser['name'] = ReactDOM.findDOMNode(this.refs['name']).value.trim();
		sysUser['password'] = ReactDOM.findDOMNode(this.refs['password']).value.trim();
		sysUser['workPlace'] = ReactDOM.findDOMNode(this.refs['workPlace']).value.trim();
		sysUser['position'] = ReactDOM.findDOMNode(this.refs['position']).value.trim();
		sysUser['roles'] = [ReactDOM.findDOMNode(this.refs['position']).value.trim()];
		this.props.onCreate(sysUser);
		window.location = "#";
	}

	render() {
		return (
			<div className="createSysUserDialog">
				<a href="#createEmployee">创建系统用户</a>
			
				<div id="createEmployee" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>创建系统用户</h2>

						<form>
							<p><input type="text" placeholder="请输入账户名" ref="accountName" className="field" /></p>
							<p><input type="text" placeholder="请输入用户名" ref="name" className="field" /></p>
							<p><input type="text" placeholder="请输入密码" ref="password" className="field" /></p>
							<p><input type="text" placeholder="请输入用户所在地" ref="workPlace" className="field" /></p>
							<p><input type="text" placeholder="请输入用户职务" ref="position" className="field" /></p>
							<p><input type="text" placeholder="请输入用户角色" ref="roles" className="field" /></p>
							<button onClick={this.handleSubmit}>创建用户</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

module.exports = SysUserDisplay;

