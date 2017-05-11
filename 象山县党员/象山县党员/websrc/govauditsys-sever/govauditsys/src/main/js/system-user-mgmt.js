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

var root = '/api';
var children = 'sysUsers';

class SysUserDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {sysUsers: [], attributes: [], page: 1, pageSize: 12, links: {}};
		this.onNavigate = this.onNavigate.bind(this);
		this.onSearch = this.onSearch.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
		this.onDelete = this.onDelete.bind(this);
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
	
	getsysUsersByName(name, pageSize) {
		if (name === "") {
			root = "/api";
			children = "sysUsers";
		} else {
			root = "/api/sysUsers/search";
			children = "findByNameContaining";
		}
		follow(client, root, [
				{rel: children, params: {name: name, size: pageSize}}]
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
			}).done(reponse => {
				if (response.status.code === 403) {
					alert("您没有创建用户的权限。");
				} else {
					this.loadFromServer(this.state.pageSize);
				}
			})
		})
	}
	
	onDelete(newSysUser) {
		client({
			method: 'DELETE',
			path: newSysUser.entity._links.self.href
		}).done(response => {
			if (response.status.code === 403) {
				alert('您没有删除该用户的权限。');
			} else {
				this.loadFromServer(this.state.pageSize);
			}
		})
	}
	
	onUpdate(sysUser, updatedSysUser) {
		client({
			method: 'PUT',
			path: sysUser.entity._links.self.href,
			entity: updatedSysUser,
			headers: {
				'Content-Type': 'application/json'
			}
		}).done(response => {
			if (response.status.code === 403) {
				alert('您没有更新该用户的权限。');
			} else {
				this.loadFromServer(this.state.pageSize);
			}
		});
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
					    <input type="search" id="name" placeholder="请输入你所要查询的用户名"></input>
						<button onClick={this.onSearch}>搜索</button>
					</div>
					<CreateDialog attributes={this.state.attributes} onCreate={this.onCreate}/>
				</div>
				<div className="datadisplay">
					<SysUserList page={this.state.page}
								  sysUsers={this.state.sysUsers}
								  links={this.state.links}
								  pageSize={this.state.pageSize}
								  onNavigate={this.onNavigate}
								  onDelete={this.onDelete}
								  onUpdate={this.onUpdate}/>
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
							<th>账户名</th>
							<th>用户名</th>
							<th>用户所在地</th>
							<th>用户职务</th>
							<th>角色</th>
							<th> </th>
							<th> </th>
						</tr>
					</thead>
					<tbody>
						{sysUsers}
					</tbody>
				</table>
				<div>
					{pagination}
				</div>
			</div>
		)
	}
}

class SysUser extends React.Component {

	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
		this.state = {accountName: '未知生物'};
	}
	
	getAccountName() {
		client({
			method: 'GET',
			path: '/userdetails'
		}).then(response => {
			return response;
		}).done(result => {
			client({
				method: 'GET',
				path: '/api/sysUsers/search/findByAccountName',
				params: {accountName: result.entity.username}
			}).then(response => {
				return response;
			}).done(result => {
				this.setState({
					accountName: result.entity.accountName,
				});
			});
		});
	}
	
	componentDidMount() {
		this.getAccountName();
	}

	handleDelete() {
		this.props.onDelete(this.props.sysUser);
	}
	
	render() {
		if (this.props.sysUser.entity.accountName == "administrator") {
			return null;
		}
		
		if (this.state.accountName === this.props.sysUser.entity.accountName) {
			return (
				<tr>
					<td>{this.props.sysUser.entity.accountName}</td>
					<td>{this.props.sysUser.entity.name}</td>
					<td>{this.props.sysUser.entity.workPlace}</td>
					<td>{this.props.sysUser.entity.position}</td>
					<td>{this.props.sysUser.entity.roles}</td>
				    <td>
					    <UpdateDialog sysUser={this.props.sysUser} onUpdate={this.props.onUpdate} />
					</td>
				</tr>
			)
		} else {
			return (
				<tr>
					<td>{this.props.sysUser.entity.accountName}</td>
					<td>{this.props.sysUser.entity.name}</td>
					<td>{this.props.sysUser.entity.workPlace}</td>
					<td>{this.props.sysUser.entity.position}</td>
					<td>{this.props.sysUser.entity.roles}</td>
					<td>
					    <UpdateDialog sysUser={this.props.sysUser} onUpdate={this.props.onUpdate} />
					</td>
					<td>
						<button onClick={this.handleDelete}>删除用户</button>
					</td>
				</tr>
			)
		}
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
		sysUser['roles'] = [ReactDOM.findDOMNode(this.refs['roles']).value.trim()];
		this.props.onCreate(sysUser);
		window.location = "#";
	}

	render() {
		return (
			<div className="createSysUserDialog">
				<a href="#createSysUserDialog">创建系统用户</a>
			
				<div id="createSysUserDialog" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>创建系统用户</h2>

						<form>
							<p><input type="text" placeholder="请输入账户名" ref="accountName" className="field" /></p>
							<p><input type="text" placeholder="请输入用户名" ref="name" className="field" /></p>
							<p><input type="password" placeholder="请输入密码" ref="password" className="field" /></p>
							<p><input type="text" placeholder="请输入用户所在地" ref="workPlace" className="field" /></p>
							<p><input type="text" placeholder="请输入用户职务" ref="position" className="field" /></p>
							<p><select ref="roles">
							  <option value ="普通用户">普通用户</option>
							  <option value ="管理员">管理员</option>
							</select></p>
							<button onClick={this.handleSubmit}>创建用户</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

class UpdateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.state = {value: '管理员'};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		var updatedSysUser = {};
		updatedSysUser['accountName'] = this.props.sysUser.entity['accountName'];
		updatedSysUser['name'] = this.props.sysUser.entity['name'];
		updatedSysUser['password'] = ReactDOM.findDOMNode(this.refs['password']).value.trim();
		updatedSysUser['workPlace'] = this.props.sysUser.entity['workPlace'];
		updatedSysUser['position'] = this.props.sysUser.entity['position'];
		updatedSysUser['roles'] = [ReactDOM.findDOMNode(this.refs['roles']).value.trim()];
		this.props.onUpdate(this.props.sysUser, updatedSysUser);
		window.location = "#";
	}
	
	componentDidMount() {
		this.setState({value: this.props.sysUser.entity['roles'][0]});
	}
	
	handleChange(event) {
		this.setState({value: event.target.value});
	}

	render() {
		return (
				<div className="updateSysUserDialog">
				<a href={"#updateSysUserDialog"+this.props.sysUser.entity['accountName']}>修改用户信息</a>
			
				<div id={"updateSysUserDialog"+this.props.sysUser.entity['accountName']} className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>修改用户信息</h2>

						<form>
							<p><input type="password" placeholder="请输入密码" ref="password" className="field" /></p>
							<p><select ref="roles" value={this.state.value} onChange={this.handleChange}>
								<option value ="普通用户">普通用户</option>
								<option value ="管理员">管理员</option>
							</select></p>
							<button onClick={this.handleSubmit}>提交</button>
						</form>
					</div>
				</div>
			</div>
		)
	}

}

module.exports = SysUserDisplay;

