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
var children = 'inspectPersonInfoes';

class InspectPersonInfoDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {inspectPersonInfoes: [], attributes: [], page: 1, pageSize: 20, links: {}};
		this.onNavigate = this.onNavigate.bind(this);
		this.onSearch = this.onSearch.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
	}

	loadFromServer(pageSize) {
		root = "/api";
		children = "inspectPersonInfoes";
		follow(client, root, [
				{rel: children, params: {size: pageSize}}]
		).then(inspectPersonInfoCollection => {
			this.page = inspectPersonInfoCollection.entity.page;
			this.links = inspectPersonInfoCollection.entity._links;
			return inspectPersonInfoCollection.entity._embedded.inspectPersonInfoes.map(inspectPersonInfo =>
					client({
						method: 'GET',
						path: inspectPersonInfo._links.self.href
					})
			);
		}).then(inspectPersonInfoPromises => {
			return when.all(inspectPersonInfoPromises);
		}).done(inspectPersonInfoes => {
			this.setState({
				page: this.page,
				inspectPersonInfoes: inspectPersonInfoes,
				pageSize: pageSize,
				links: this.links
			});
		});
	}
	
	getInspectPersonInfoesContaining(name, workPlace, pageSize) {
		if (name === "" && workPlace === "") {
			return;
		}
		
		if (false) {
			root = "/api";
			children = "inspectPersonInfoes";
		} else {
			root = "/api/inspectPersonInfoes/search";
			children = "findByNameContaining";
		}
		
		follow(client, root, [
				{rel: children, params: {name: name, workPlace: workPlace, size: pageSize}}]
		).then(inspectPersonInfoCollection => {
			this.page = inspectPersonInfoCollection.entity.page;
			this.links = inspectPersonInfoCollection.entity._links;
			return inspectPersonInfoCollection.entity._embedded.inspectPersonInfoes.map(inspectPersonInfo =>
					client({
						method: 'GET',
						path: inspectPersonInfo._links.self.href
					})
			);
		}).then(inspectPersonInfoPromises => {
			return when.all(inspectPersonInfoPromises);
		}).done(inspectPersonInfoes => {
			this.setState({
				page: this.page,
				inspectPersonInfoes: inspectPersonInfoes,
				pageSize: pageSize,
				links: this.links
			});
		});
	}

	onUpdate(inspectPersonInfo, updatedInspectPersonInfo) {
        client({
                method: 'PUT',
                path: inspectPersonInfo.entity._links.self.href,
                entity: updatedInspectPersonInfo,
                headers: {
    				'Content-Type': 'application/json'
    			}
        }).done(response => {
            if (response.status.code === 403) {
				alert("您没有修改监察对象信息的权限。");
			} else {
				var inspectPersonInfoes = this.state.inspectPersonInfoes;
				inspectPersonInfoes.map((inspectPersonInfoMap, index) => {
					if (inspectPersonInfo.entity._links.self.href === inspectPersonInfoMap.entity._links.self.href) {
						for (var key in updatedInspectPersonInfo) {
							inspectPersonInfoes[index].entity[key] = updatedInspectPersonInfo[key];
						}
					}
				});
				this.setState({inspectPersonInfoes:inspectPersonInfoes});
			}
        });
	}
	
	onNavigate(navUri) {
		client({
			method: 'GET',
			path: navUri
		}).then(inspectPersonInfoCollection => {
			this.links = inspectPersonInfoCollection.entity._links;
			this.page = inspectPersonInfoCollection.entity.page;

			return inspectPersonInfoCollection.entity._embedded.inspectPersonInfoes.map(inspectPersonInfo =>
					client({
						method: 'GET',
						path: inspectPersonInfo._links.self.href
					})
			);
		}).then(inspectPersonInfoPromises => {
			return when.all(inspectPersonInfoPromises);
		}).done(inspectPersonInfoes => {
			this.setState({
				page: this.page,
				inspectPersonInfoes: inspectPersonInfoes,
				pageSize: this.state.pageSize,
				links: this.links
			});
		});
	}
	
	onSearch(e) {
		this.getInspectPersonInfoesContaining(
			document.getElementById("name").value,
			document.getElementById("workplace").value,
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
		//this.loadFromServer(this.state.pageSize);
	}
	// end::register-handlers[]

	render() {
		return (
			<div className="searchBarPlusDataDisplay">
				<div className="webdesigntuts-workshop">
				    <input type="search" id="name" placeholder="请输入要查询的姓名或身份证号"></input>
				    <input type="search" id="workplace" placeholder="请输入要查询的工作单位"></input>
					<button onClick={this.onSearch}>搜索</button>
				</div>
				<div className="datadisplay">
					<InspectPersonInfoList page={this.state.page}
								  inspectPersonInfoes={this.state.inspectPersonInfoes}
								  links={this.state.links}
								  pageSize={this.state.pageSize}
								  onNavigate={this.onNavigate}
								  onUpdate={this.onUpdate}/>
				</div>
			</div>
		)
	}
}

class InspectPersonInfoList extends React.Component {

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
		var inspectPersonInfoes = this.props.inspectPersonInfoes.map(inspectPersonInfo =>
			<InspectPersonInfo key={inspectPersonInfo.entity._links.self.href}
					  inspectPersonInfo={inspectPersonInfo}
					  onUpdate={this.props.onUpdate}/>
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
							<th>姓名</th>
							<th>身份证号</th>
							<th>性别</th>
							<th>学历</th>
							<th>工作单位</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{inspectPersonInfoes}
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

class InspectPersonInfo extends React.Component {

	constructor(props) {
		super(props);
	}
	
	render() {
		return (
			<tr>
				<td>{this.props.inspectPersonInfo.entity.name}</td>
				<td>{this.props.inspectPersonInfo.entity.idNumber}</td>
				<td>{this.props.inspectPersonInfo.entity.gender}</td>
				<td>{this.props.inspectPersonInfo.entity.education}</td>
				<td>{this.props.inspectPersonInfo.entity.workPlace}</td>
				<td>
					<UpdateDialog inspectPersonInfo={this.props.inspectPersonInfo} onUpdate={this.props.onUpdate} />
				</td>
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
		var updatedInspectPersonInfo = {};
		updatedInspectPersonInfo['name'] = ReactDOM.findDOMNode(this.refs['name']).value.trim();
		updatedInspectPersonInfo['idNumber'] = ReactDOM.findDOMNode(this.refs['idNumber']).value.trim();
		updatedInspectPersonInfo['gender'] = ReactDOM.findDOMNode(this.refs['gender']).value.trim();
		updatedInspectPersonInfo['education'] = ReactDOM.findDOMNode(this.refs['education']).value.trim();
		updatedInspectPersonInfo['workPlace'] = ReactDOM.findDOMNode(this.refs['workPlace']).value.trim();
		this.props.onUpdate(this.props.inspectPersonInfo, updatedInspectPersonInfo);
		window.location = "#";
	}

	render() {
		var urlArr = this.props.inspectPersonInfo.entity._links.self.href.split('/');
		var inspectPersonInfoId = urlArr[urlArr.length - 1];
		
		return (
				<div className="updateInspectPersonInfoDialog">
				<a href={"#updateInspectPersonInfoDialog" + inspectPersonInfoId}>修改监察对象信息</a>
			
				<div id={"updateInspectPersonInfoDialog" + inspectPersonInfoId} className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>修改监察对象信息</h2>

						<form>
							<p><input type="text" placeholder="请输入姓名" defaultValue={this.props.inspectPersonInfo.entity['name']} ref="name" className="field" /></p>
							<p><input type="text" placeholder="请输入身份证号" defaultValue={this.props.inspectPersonInfo.entity['idNumber']} ref="idNumber" className="field" /></p>
							<p><input type="text" placeholder="请输入性别" defaultValue={this.props.inspectPersonInfo.entity['gender']} ref="gender" className="field" /></p>
							<p><input type="text" placeholder="请输入学历" defaultValue={this.props.inspectPersonInfo.entity['education']} ref="education" className="field" /></p>
							<p><input type="text" placeholder="请输入工作单位" defaultValue={this.props.inspectPersonInfo.entity['workPlace']} ref="workPlace" className="field" /></p>
							<button onClick={this.handleSubmit}>提交</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

module.exports = InspectPersonInfoDisplay;

