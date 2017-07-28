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
				alert('您没有修改该用户信息的权限。');
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
							<th>所属纪检部门</th>
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
		this.loadColumnsFromServer = this.loadColumnsFromServer.bind(this);
		this.state = {accountName: '未知生物', communistInfoColumns: [], inspectpersoninfoColumns: [], lawcaseinfoColumns: []};
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
	
	loadColumnsFromServer(accountName) {
		var communistInfoColumns = [];
		var inspectpersoninfoColumns = [];
		var lawcaseinfoColumns = [];
		
		Promise.all([new Promise(function(resolve, reject) {
			client({
				method: 'GET',
				path: '/columnshowstatus',
				params: {accountName: accountName, infoType: "communist"}
			}).done(response => {
				if (!Array.isArray(response.entity)) {
					reject('Exception');
				} else {
					communistInfoColumns = response.entity;
					resolve('Success');
				}
			});
		}),
		new Promise(function(resolve, reject) {
			client({
				method: 'GET',
				path: '/columnshowstatus',
				params: {accountName: accountName, infoType: "inspectpersoninfo"}
			}).done(response => {
				if (!Array.isArray(response.entity)) {
					reject('Exception');
				} else {
					inspectpersoninfoColumns = response.entity;
					resolve('Success');
				}
			});
		}),
		new Promise(function(resolve, reject) {
			client({
				method: 'GET',
				path: '/columnshowstatus',
				params: {accountName: accountName, infoType: "lawcaseinfo"}
			}).done(response => {
				if (!Array.isArray(response.entity)) {
					reject('Exception');
				} else {
					lawcaseinfoColumns = response.entity;
					resolve('Success');
				}
			});
		})]).then(() => {
			var state = this.state;
			state.communistInfoColumns = communistInfoColumns;
			state.inspectpersoninfoColumns = inspectpersoninfoColumns;
			state.lawcaseinfoColumns = lawcaseinfoColumns;
			this.setState(state);
		}).catch(() => {
			var state = this.state;
			this.setState(state);
		});
	}
	
	componentDidMount() {
		this.getAccountName();
		this.loadColumnsFromServer(this.props.sysUser.entity.accountName);
	}
	
	componentWillReceiveProps(nextProps) {
		this.loadColumnsFromServer(this.props.sysUser.entity.accountName);
	}

	handleDelete() {
		this.props.onDelete(this.props.sysUser);
	}
	
	render() {
		if (this.props.sysUser.entity.accountName === "administrator" && this.state.accountName !== "administrator") {
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
					<td>{this.props.sysUser.entity.disciplineInspectionDepartment}</td>
				    <td>
					    <UpdateDialog sysUser={this.props.sysUser} onUpdate={this.props.onUpdate} 
					    		communistInfoColumns={this.state.communistInfoColumns} 
					    		inspectpersoninfoColumns={this.state.inspectpersoninfoColumns} 
					    		lawcaseinfoColumns={this.state.lawcaseinfoColumns} />
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
					<td>{this.props.sysUser.entity.disciplineInspectionDepartment}</td>
					<td>
					    <UpdateDialog sysUser={this.props.sysUser} onUpdate={this.props.onUpdate} 
							    communistInfoColumns={this.state.communistInfoColumns} 
					    		inspectpersoninfoColumns={this.state.inspectpersoninfoColumns} 
					    		lawcaseinfoColumns={this.state.lawcaseinfoColumns} />
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
		this.state = {disciplinaryInspectionsOptions: []};
	}
	
	componentDidMount() {
		client({
			method: 'GET',
			path: '/unionops/getdisciplinaryinspections'
		}).done(response => {
			var state = this.state;
			
			response.entity.map(item => {
				state.disciplinaryInspectionsOptions.push(<option value ={item}>{item}</option>);
			});
			
			this.setState(state);
		});
	}

	handleSubmit(e) {
		e.preventDefault();
		var sysUser = {};
		var i = 0;
		sysUser['accountName'] = ReactDOM.findDOMNode(this.refs['accountName']).value.trim();
		sysUser['name'] = ReactDOM.findDOMNode(this.refs['name']).value.trim();
		sysUser['password'] = ReactDOM.findDOMNode(this.refs['password']).value.trim();
		sysUser['workPlace'] = ReactDOM.findDOMNode(this.refs['workPlace']).value.trim();
		sysUser['position'] = ReactDOM.findDOMNode(this.refs['position']).value.trim();
		sysUser['roles'] = [ReactDOM.findDOMNode(this.refs['roles']).value.trim()];
		var communistInfoColumnCheckBoxes = document.getElementsByName("communistinfo");
		sysUser['communistInfoFrontEndShowStatus'] = 0;
		for (i = 0; i < communistInfoColumnCheckBoxes.length; i++) {                    
            if (communistInfoColumnCheckBoxes[i].checked) {                        
            	sysUser['communistInfoFrontEndShowStatus'] += (1 << i);
            }                
        }
		var inspectPersonInfoColumnCheckBoxes = document.getElementsByName("inspectpersoninfo");
		sysUser['inspectPersonInfoFrontEndShowStatus'] = 0;
		for (i = 0; i < inspectPersonInfoColumnCheckBoxes.length; i++) {                    
            if (inspectPersonInfoColumnCheckBoxes[i].checked) {                        
            	sysUser['inspectPersonInfoFrontEndShowStatus'] += (1 << i);
            }                
        }
		var lawcaseInfoColumnCheckBoxes = document.getElementsByName("lawcaseInfo");
		sysUser['lawcaseInfoFrontEndShowStatus'] = 0;
		for (i = 0; i < lawcaseInfoColumnCheckBoxes.length; i++) {                    
            if (lawcaseInfoColumnCheckBoxes[i].checked) {                        
            	sysUser['lawcaseInfoFrontEndShowStatus'] += (1 << i);
            }                
        }
		sysUser['disciplineInspectionDepartment'] = ReactDOM.findDOMNode(this.refs['disciplineInspectionDepartment']).value.trim();
		ReactDOM.findDOMNode(this.refs['accountName']).value = '';
		ReactDOM.findDOMNode(this.refs['name']).value = '';
		ReactDOM.findDOMNode(this.refs['password']).value = '';
		ReactDOM.findDOMNode(this.refs['workPlace']).value = '';
		ReactDOM.findDOMNode(this.refs['position']).value = '';
		for (i = 0; i < communistInfoColumnCheckBoxes.length; i++) {                    
			communistInfoColumnCheckBoxes[i].checked = true;                
        }
		for (i = 0; i < inspectPersonInfoColumnCheckBoxes.length; i++) {                    
			inspectPersonInfoColumnCheckBoxes[i].checked = true;       
        }
		for (i = 0; i < lawcaseInfoColumnCheckBoxes.length; i++) {                    
            lawcaseInfoColumnCheckBoxes[i].checked = true;        
        }
		this.props.onCreate(sysUser);
		window.location = "#";
	}

	render() {
		var communistInfoColumnsSelect = (
			<p>
			    <span>党员信息库显示条目</span><br/>
			    <div className="columns_selects_block">
			    <input type="checkbox" name="communistinfo" value="党员姓名" defaultChecked="checked" /><span>党员姓名</span>
			    <input type="checkbox" name="communistinfo" value="身份证号" defaultChecked="checked" /><span>身份证号</span>
			    <input type="checkbox" name="communistinfo" value="性别" defaultChecked="checked" /><span>性别</span>
			    <input type="checkbox" name="communistinfo" value="入党日期" defaultChecked="checked" /><span>入党日期</span>	
			    <input type="checkbox" name="communistinfo" value="学历" defaultChecked="checked" /><span>学历</span>
		    	<input type="checkbox" name="communistinfo" value="党支部" defaultChecked="checked" /><span>党支部</span>
			    <input type="checkbox" name="communistinfo" value="上级组织" defaultChecked="checked" /><span>上级组织</span>
			    <input type="checkbox" name="communistinfo" value="籍贯" defaultChecked="checked" /><span>籍贯</span>
			    <input type="checkbox" name="communistinfo" value="民族" defaultChecked="checked" /><span>民族</span>
			    <input type="checkbox" name="communistinfo" value="个人身份" defaultChecked="checked" /><span>个人身份</span>
			    <input type="checkbox" name="communistinfo" value="所属纪检部门" defaultChecked="checked" /><span>所属纪检部门</span>
			    </div>
			</p>
		);
		
		var inspectPersonInfoColumnsSelect = (
			<p>
			    <span>监察对象库显示条目</span><br/>
			    <div className="columns_selects_block">
			    <input type="checkbox" name="inspectpersoninfo" value="姓名" defaultChecked="checked" /><span>姓名</span>
			    <input type="checkbox" name="inspectpersoninfo" value="身份证号" defaultChecked="checked" /><span>身份证号</span>
			    <input type="checkbox" name="inspectpersoninfo" value="性别" defaultChecked="checked" /><span>性别</span>
			    <input type="checkbox" name="inspectpersoninfo" value="学历" defaultChecked="checked" /><span>学历</span>	
			    <input type="checkbox" name="inspectpersoninfo" value="工作单位" defaultChecked="checked" /><span>工作单位</span>
		    	<input type="checkbox" name="inspectpersoninfo" value="所属纪检部门" defaultChecked="checked" /><span>所属纪检部门</span>
			    <input type="checkbox" name="inspectpersoninfo" value="上级组织" defaultChecked="checked" /><span>上级组织</span>
			    </div>
			</p>
		);
		
		var lawcaseInfoColumnsSelect = (
			<p>
			    <span>处分人员信息库显示条目</span><br/>
			    <div className="columns_selects_block">
			    <input type="checkbox" name="lawcaseInfo" value="被调查人" defaultChecked="checked" /><span>被调查人</span>
			    <input type="checkbox" name="lawcaseInfo" value="入党日期" defaultChecked="checked" /><span>入党日期</span>
			    <input type="checkbox" name="lawcaseInfo" value="工作单位及职务" defaultChecked="checked" /><span>工作单位及职务</span>
			    <input type="checkbox" name="lawcaseInfo" value="立案机关" defaultChecked="checked" /><span>立案机关</span>	
			    <input type="checkbox" name="lawcaseInfo" value="立案时间" defaultChecked="checked" /><span>立案时间</span>
		    	<input type="checkbox" name="lawcaseInfo" value="结案时间" defaultChecked="checked" /><span>结案时间</span>
			    <input type="checkbox" name="lawcaseInfo" value="党纪处分" defaultChecked="checked" /><span>党纪处分</span>
			    <input type="checkbox" name="lawcaseInfo" value="政纪处分" defaultChecked="checked" /><span>政纪处分</span>
			    <input type="checkbox" name="lawcaseInfo" value="所属纪检部门" defaultChecked="checked" /><span>所属纪检部门</span>
			    </div>
			</p>
		);
		
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
							{communistInfoColumnsSelect}
							{inspectPersonInfoColumnsSelect}
							{lawcaseInfoColumnsSelect}
							<p>
							    <span>所属纪检部门</span>
							    <br/>
							    <select ref="disciplineInspectionDepartment">
									{this.state.disciplinaryInspectionsOptions}
							    </select>
						    </p>
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
		this.state = {
			value: '管理员',
			firstRender: true,
			communistColumnsTitles: ["党员姓名", "身份证号", "性别", "入党日期", "学历", "党支部", "上级组织", "籍贯", "民族", "个人身份", "所属纪检部门"],
			inpsectPersonInfoTitles: ["姓名", "身份证号", "性别", "学历", "工作单位", "所属纪检部门"],
			lawcaseinfoTitles: ["被调查人", "入党日期", "工作单位及职务", "立案机关", "立案时间", "结案时间", "党纪处分", "政纪处分", "所属纪检部门"]
		};
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleChange = this.handleChange.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		var updatedSysUser = {};
		var i = 0;
		updatedSysUser['accountName'] = ReactDOM.findDOMNode(this.refs['accountName']).value.trim();
		updatedSysUser['name'] = ReactDOM.findDOMNode(this.refs['name']).value.trim();
		if (ReactDOM.findDOMNode(this.refs['password']).value.trim() !== "") {
			updatedSysUser['password'] = ReactDOM.findDOMNode(this.refs['password']).value.trim();
		} else {
			updatedSysUser['password'] = 'cafecafemagicmagic' + this.props.sysUser.entity['password'];
		}
		updatedSysUser['workPlace'] = ReactDOM.findDOMNode(this.refs['workPlace']).value.trim();
		updatedSysUser['position'] = ReactDOM.findDOMNode(this.refs['position']).value.trim();
		updatedSysUser['roles'] = [ReactDOM.findDOMNode(this.refs['roles']).value.trim()];
		
		var communistInfoColumnCheckBoxes = document.getElementsByName("communistinfo" + this.props.sysUser.entity['accountName']);
		updatedSysUser['communistInfoFrontEndShowStatus'] = 0;
		for (i = 0; i < communistInfoColumnCheckBoxes.length; i++) {                    
            if (communistInfoColumnCheckBoxes[i].checked) {                        
            	updatedSysUser['communistInfoFrontEndShowStatus'] += (1 << i);
            }                
        }
		var inspectPersonInfoColumnCheckBoxes = document.getElementsByName("inspectpersoninfo" + this.props.sysUser.entity['accountName']);
		updatedSysUser['inspectPersonInfoFrontEndShowStatus'] = 0;
		for (i = 0; i < inspectPersonInfoColumnCheckBoxes.length; i++) {                    
            if (inspectPersonInfoColumnCheckBoxes[i].checked) {                        
            	updatedSysUser['inspectPersonInfoFrontEndShowStatus'] += (1 << i);
            }                
        }
		var lawcaseInfoColumnCheckBoxes = document.getElementsByName("lawcaseInfo" + this.props.sysUser.entity['accountName']);
		updatedSysUser['lawcaseInfoFrontEndShowStatus'] = 0;
		for (i = 0; i < lawcaseInfoColumnCheckBoxes.length; i++) {                    
            if (lawcaseInfoColumnCheckBoxes[i].checked) {                        
            	updatedSysUser['lawcaseInfoFrontEndShowStatus'] += (1 << i);
            }                
        }
		
		updatedSysUser['disciplineInspectionDepartment'] = ReactDOM.findDOMNode(this.refs['disciplineInspectionDepartment']).value.trim();
		this.props.onUpdate(this.props.sysUser, updatedSysUser);
		window.location = "#";
	}
	
	componentDidMount() {
		client({
			method: 'GET',
			path: '/unionops/getdisciplinaryinspections'
		}).done(response => {
			var disciplinaryInspectionsOptions = '';
			
			response.entity.map(item => {
				disciplinaryInspectionsOptions += '<option value ="' + item + '">' + item + "</option>";
			});
			
			ReactDOM.findDOMNode(this.refs['disciplineInspectionDepartment']).innerHTML = '';
			ReactDOM.findDOMNode(this.refs['disciplineInspectionDepartment']).innerHTML = disciplinaryInspectionsOptions;
		});
		this.setState({value: this.props.sysUser.entity['roles'][0]});
		this.state.firstRender = false;
	}
	
	shouldComponentUpdate(nextProps, nextState) {
		var columnTitles1 = this.state.communistColumnsTitles;
		var columnTitles2 = this.state.inpsectPersonInfoTitles;
		var columnTitles3 = this.state.lawcaseinfoTitles;
		var showTitles1 = nextProps.communistInfoColumns.map(column => column[1]);
		var showTitles2 = nextProps.inspectpersoninfoColumns.map(column => column[1]);
		var showTitles3 = nextProps.lawcaseinfoColumns.map(column => column[1]);
		
		columnTitles1.map(title => {
			var communistInfoColumnCheckBoxes = document.getElementsByName("communistinfo" + this.props.sysUser.entity['accountName']);
			var i = 0;
			for (i = 0; i < communistInfoColumnCheckBoxes.length; i++) {                    
	            if (communistInfoColumnCheckBoxes[i].value === title) {       
	            	if (showTitles1.includes(title)) {
	            		communistInfoColumnCheckBoxes[i].checked = true;
	            	} else {
	            		communistInfoColumnCheckBoxes[i].checked = false;
	            	}
	            	
	            }                
	        }
	    });
		
		columnTitles2.map(title => {
			var inspectpersoninfoColumnCheckBoxes = document.getElementsByName("inspectpersoninfo" + this.props.sysUser.entity['accountName']);
			var i = 0;
			for (i = 0; i < inspectpersoninfoColumnCheckBoxes.length; i++) {                    
	            if (inspectpersoninfoColumnCheckBoxes[i].value === title) {       
	            	if (showTitles2.includes(title)) {
	            		inspectpersoninfoColumnCheckBoxes[i].checked = true;
	            	} else {
	            		inspectpersoninfoColumnCheckBoxes[i].checked = false;
	            	}
	            	
	            }                
	        }
	    });
		
		columnTitles3.map(title => {
			var lawcaseInfoColumnCheckBoxes = document.getElementsByName("lawcaseInfo" + this.props.sysUser.entity['accountName']);
			var i = 0;
			for (i = 0; i < lawcaseInfoColumnCheckBoxes.length; i++) {                    
	            if (lawcaseInfoColumnCheckBoxes[i].value === title) {       
	            	if (showTitles3.includes(title)) {
	            		lawcaseInfoColumnCheckBoxes[i].checked = true;
	            	} else {
	            		lawcaseInfoColumnCheckBoxes[i].checked = false;
	            	}
	            	
	            }                
	        }
	    });
		
		ReactDOM.findDOMNode(this.refs['disciplineInspectionDepartment']).value = this.props.sysUser.entity['disciplineInspectionDepartment'];
		ReactDOM.findDOMNode(this.refs['roles']).value = this.props.sysUser.entity['roles'][0];
		
		return false;
	}
	
	handleChange(event) {
		this.setState({value: event.target.value});
	}
	
	changeStateOfCheckBoxes(columnsSelect, columns) {
		var checkBoxes = columnsSelect.getElementsByTagName("input");
		var checkBoexesDict = {};
		var index = 0;
		for (index = 0; index < checkBoxes.length; index++) {
			checkBoexesDict[checkBoxes[i].value] = checkBoxes[i];
		}
		columns.map(column => {
			checkBoexesDict[column[1]].checked = true;
		})
	}

	render() {
		var columnTitles1 = this.state.communistColumnsTitles;
		var columnTitles2 = this.state.inpsectPersonInfoTitles;
		var columnTitles3 = this.state.lawcaseinfoTitles;
		var showTitles1 = this.props.communistInfoColumns.map(column => column[1]);
		var showTitles2 = this.props.inspectpersoninfoColumns.map(column => column[1]);
		var showTitles3 = this.props.lawcaseinfoColumns.map(column => column[1]);

		var communistInfoColumnsSelect = (
			<p>
			    <span>党员信息库显示条目</span><br/>
			    <div className="columns_selects_block">
			    {columnTitles1.map(title => {
			    	if (showTitles1.includes(title)) {
			    			return <span><input type="checkbox" name={"communistinfo"+this.props.sysUser.entity['accountName']} value={title} defaultChecked="checked" /><span>{title}</span></span>;
			    	} else {
			    		return <span><input type="checkbox" name={"communistinfo"+this.props.sysUser.entity['accountName']} value={title} /><span>{title}</span></span>;
			    	}
			    })}
			    </div>
			</p>
		);
		
		var inspectPersonInfoColumnsSelect = (
			<p>
			    <span>监察对象库显示条目</span><br/>
			    <div className="columns_selects_block">
			    {columnTitles2.map(title => {
			    	if (showTitles2.includes(title)) {
			    			return <span><input type="checkbox" name={"inspectpersoninfo"+this.props.sysUser.entity['accountName']} value={title} defaultChecked="checked" /><span>{title}</span></span>;
			    	} else {
			    		return <span><input type="checkbox" name={"inspectpersoninfo"+this.props.sysUser.entity['accountName']} value={title} /><span>{title}</span></span>;
			    	}
			    })}
			    </div>
			</p>
		);
		
		var lawcaseInfoColumnsSelect = (
			<p>
			    <span>处分人员信息库显示条目</span><br/>
			    <div className="columns_selects_block">
			    {columnTitles3.map(title => {
			    	if (showTitles3.includes(title)) {
			    			return <span><input type="checkbox" name={"lawcaseInfo"+this.props.sysUser.entity['accountName']} value={title} defaultChecked="checked" /><span>{title}</span></span>;
			    	} else {
			    		return <span><input type="checkbox" name={"lawcaseInfo"+this.props.sysUser.entity['accountName']} value={title} /><span>{title}</span></span>;
			    	}
			    })}
			    </div>
			</p>
		);
		
		return (
				<div className="updateSysUserDialog">
				<a href={"#updateSysUserDialog"+this.props.sysUser.entity['accountName']}>修改用户信息</a>
			
				<div id={"updateSysUserDialog"+this.props.sysUser.entity['accountName']} className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>修改用户信息</h2>

						<form>
							<p><input type="text" placeholder="请输入账户名" ref="accountName" className="field" defaultValue={this.props.sysUser.entity['accountName']} /></p>
							<p><input type="text" placeholder="请输入用户名" ref="name" className="field" defaultValue={this.props.sysUser.entity['name']} /></p>
							<p><input type="password" placeholder="请输入密码" ref="password" className="field" /></p>
							<p><input type="text" placeholder="请输入用户所在地" ref="workPlace" className="field" defaultValue={this.props.sysUser.entity['workPlace']} /></p>
							<p><input type="text" placeholder="请输入用户职务" ref="position" className="field" defaultValue={this.props.sysUser.entity['position']} /></p>
							{communistInfoColumnsSelect}
							{inspectPersonInfoColumnsSelect}
							{lawcaseInfoColumnsSelect}
							<p>
							    <span>所属纪检部门</span>
							    <br/>
							    <select ref="disciplineInspectionDepartment" defaultValue={this.props.sysUser.entity['disciplineInspectionDepartment']}>
									<option value ="象山县纪委">象山县纪委</option>
							    </select>
							</p>	
							<p><select ref="roles" defaultValue={this.props.sysUser.entity['roles'][0]}>
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

