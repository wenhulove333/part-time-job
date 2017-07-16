'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

import lightBaseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import UltimatePagination from 'react-ultimate-pagination-material-ui';
const lightMuiTheme = getMuiTheme(lightBaseTheme);

const follow = require('./follow'); // function to hop multiple links by "rel"
const parseUrl = require('./parse-url');

var root = '/api';
var children = 'communistInfoes';

class CommunistInfoDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {communistInfoes: [], attributes: [], page: 1, pageSize: 20, links: {}, columns: []};
		this.onNavigate = this.onNavigate.bind(this);
		this.onSearch = this.onSearch.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
	}

	loadFromServer(accountName) {
		client({
			method: 'GET',
			path: '/columnshowstatus',
			params: {accountName: accountName, infoType: "communist"}
		}).then(response => {
			return response;
		}).done(result => {
			this.setState({columns: result.entity});
		});
		
	}
	
	getCommunistInfoesContaining(name, partyBranch, pageSize) {
		if (name === "" && partyBranch === "") {
			return;
		}
		
		if (false) {
			root = "/api";
			children = "communistInfoes";
		} else {
			root = "/api/communistInfoes/search";
			children = "findByNameContaining";
		}
		
		follow(client, root, [
				{rel: children, params: {name: name, partyBranch: partyBranch, size: pageSize}}]
		).then(communistInfoCollection => {
			this.page = communistInfoCollection.entity.page;
			this.links = communistInfoCollection.entity._links;
			return communistInfoCollection.entity._embedded.communistInfoes.map(communistInfo =>
					client({
						method: 'GET',
						path: communistInfo._links.self.href
					})
			);
		}).then(communistInfoPromises => {
			return when.all(communistInfoPromises);
		}).done(communistInfoes => {
			this.setState({
				page: this.page,
				communistInfoes: communistInfoes,
				pageSize: pageSize,
				links: this.links
			});
		});
	}
	
	onUpdate(communistInfo, updatedCommunistInfo) {
        client({
                method: 'PUT',
                path: communistInfo.entity._links.self.href,
                entity: updatedCommunistInfo,
                headers: {
    				'Content-Type': 'application/json'
    			}
        }).done(response => {
            if (response.status.code === 403) {
				alert("您没有修改党员信息的权限。");
			} else {
				var communistInfoes = this.state.communistInfoes;
				communistInfoes.map((communistInfoMap, index) => {
					if (communistInfo.entity['idNumber'] == communistInfoMap.entity['idNumber']) {
						for (var key in updatedCommunistInfo) {
							communistInfoes[index].entity[key]=updatedCommunistInfo[key];
						}
					}
				});
				this.setState({communistInfoes:communistInfoes});
			}
        });
	}

	onNavigate(navUri) {
		client({
			method: 'GET',
			path: navUri
		}).then(communistInfoCollection => {
			this.links = communistInfoCollection.entity._links;
			this.page = communistInfoCollection.entity.page;

			return communistInfoCollection.entity._embedded.communistInfoes.map(communistInfo =>
					client({
						method: 'GET',
						path: communistInfo._links.self.href
					})
			);
		}).then(communistInfoPromises => {
			return when.all(communistInfoPromises);
		}).done(communistInfoes => {
			this.setState({
				page: this.page,
				communistInfoes: communistInfoes,
				pageSize: this.state.pageSize,
				links: this.links
			});
		});
	}
	
	onSearch(e) {
		this.getCommunistInfoesContaining(
			document.getElementById("name").value,
			document.getElementById("partyBranch").value,
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
		this.loadFromServer(this.props.accountName);
		//this.getCommunistInfoesByName('张三', this.state.pageSize);
	}
	// end::register-handlers[]
	
	componentWillReceiveProps(nextProps) {
		this.loadFromServer(nextProps.accountName);
	}

	render() {
		return (
			<div className="searchBarPlusDataDisplay">
				<div className="webdesigntuts-workshop">
				    <input type="search" id="name" placeholder="请输入要查询的姓名或身份证号"></input>
				    <input type="search" id="partyBranch" placeholder="请输入要查询的党支部"></input>
					<button onClick={this.onSearch}>搜索</button>
				</div>
				<div className="datadisplay">
					<CommunistInfoList page={this.state.page}
								  communistInfoes={this.state.communistInfoes}
								  links={this.state.links}
								  pageSize={this.state.pageSize}
								  onNavigate={this.onNavigate}
								  onUpdate={this.onUpdate}
								  columns={this.state.columns}
					              role={this.props.role}/>
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
			<h3>CommunistInfoes - Page {this.props.page.number + 1} of {this.props.page.totalPages}</h3> : null;
			
		var communistInfoHead = this.props.columns.map(column => <th>{column[1]}</th>);
		if (this.props.role === "管理员") {
			communistInfoHead.push(<th></th>);
		}

		var communistInfoes = this.props.communistInfoes.map(communistInfo =>
			<CommunistInfo key={communistInfo.entity._links.self.href}
					  communistInfo={communistInfo}
					  attributes={this.props.attributes}
					  onUpdate={this.props.onUpdate}
					  onDelete={this.props.onDelete}
					  columns={this.props.columns}
			          role={this.props.role}/>
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
							{communistInfoHead}
						</tr>
					</thead>
					<tbody>
						{communistInfoes}
					</tbody>
					<tfoot>
						<span>总计{this.props.page.totalElements}条记录</span>
					</tfoot>
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
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleDelete() {
		this.props.onDelete(this.props.communistInfo);
	}
	
	render() {
		var communistInfo = this.props.columns.map(column => <td>{this.props.communistInfo.entity[column[0]]}</td>);
		if (this.props.role === "管理员") {
			communistInfo.push(<td><UpdateDialog communistInfo={this.props.communistInfo} onUpdate={this.props.onUpdate} columns={this.props.columns} /></td>);
		}
		
		return (
			<tr>
				{communistInfo}
			</tr>
		)
	}
}

class UpdateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleSubmit(e) {
		e.preventDefault();
		var updatedCommunistInfo = this.props.communistInfo.entity;
		this.props.columns.map(column => {
			updatedCommunistInfo[column[0]] = ReactDOM.findDOMNode(this.refs[column[0]]).value.trim();
		});
		this.props.onUpdate(this.props.communistInfo, updatedCommunistInfo);
		window.location = "#";
	}

	render() {
		var urlArr = this.props.communistInfo.entity._links.self.href.split('/');
		var communistInfoId = urlArr[urlArr.length - 1];
		
		var communistInfoInputs = this.props.columns.map(column => <p><input type="text" placeholder={"请输入" + column[1]} defaultValue={this.props.communistInfo.entity[column[0]]} ref={column[0]} className="field" /></p>);
		
		return (
				<div className="updateCommunistInfoDialog">
				<a href={"#updateCommunistInfoDialog" + communistInfoId}>修改党员信息</a>
			
				<div id={"updateCommunistInfoDialog" + communistInfoId} className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>修改党员信息</h2>

						<form>
							{communistInfoInputs}
							<button onClick={this.handleSubmit}>提交</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

module.exports = CommunistInfoDisplay;

