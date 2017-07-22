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
var children = 'lawcaseInfoes';

class LawcaseInfoDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {lawcaseInfoes: [], attributes: [], page: 1, pageSize: 20, links: {}, startTime: '', endTime: '', columns: []};
		this.onNavigate = this.onNavigate.bind(this);
		this.onSearch = this.onSearch.bind(this);
		this.handleSelectStartTime = this.handleSelectStartTime.bind(this);
		this.handleSelectEndTime = this.handleSelectEndTime.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handlePunishmentClassChange = this.handlePunishmentClassChange.bind(this);
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
	
	loadFromServer(accountName) {
		client({
			method: 'GET',
			path: '/columnshowstatus',
			params: {accountName: accountName, infoType: "lawcaseinfo"}
		}).then(response => {
			return response;
		}).done(result => {
			this.setState({columns: result.entity});
		});
		
	}
	
	getlawcaseInfoesContaining(respondentName, filingOffice, punishmentContent, startTime, endTime, pageSize) {
		if (respondentName === "" && filingOffice === "" && punishmentContent === "") {
			return;
		}
		
		if (false) {
			root = "/api";
			children = "lawcaseInfoes";
		} else {
			root = "/api/lawcaseInfoes/search";
			children = "findByRespondentNameContaining";
		}
		follow(client, root, [
				{rel: children, params: {
					respondentName: respondentName,
					filingOffice: filingOffice,
					punishmentContent: punishmentContent,
					startTime: startTime,
					endTime: endTime,
					size: pageSize}}]
		).then(lawcaseInfoCollection => {
			this.page = lawcaseInfoCollection.entity.page;
			this.links = lawcaseInfoCollection.entity._links;
			return lawcaseInfoCollection.entity._embedded.lawcaseInfoes.map(lawcaseInfo =>
					client({
						method: 'GET',
						path: lawcaseInfo._links.self.href
					})
			);
		}).then(lawcaseInfoPromises => {
			return when.all(lawcaseInfoPromises);
		}).done(lawcaseInfoes => {
			this.setState({
				page: this.page,
				lawcaseInfoes: lawcaseInfoes,
				pageSize: pageSize,
				links: this.links
			});
		});
	}
	
	onUpdate(lawcaseInfo, updatedLawcaseInfo) {
        client({
                method: 'PUT',
                path: lawcaseInfo.entity._links.self.href,
                entity: updatedLawcaseInfo,
                headers: {
    				'Content-Type': 'application/json'
    			}
        }).done(response => {
            if (response.status.code === 403) {
				alert("您没有修改处分人员信息的权限。");
			} else {
				var lawcaseInfoes = this.state.lawcaseInfoes;
				lawcaseInfoes.map((lawcaseInfoMap, index) => {
					if (lawcaseInfo.entity._links.self.href === lawcaseInfoMap.entity._links.self.href) {
						for (var key in updatedLawcaseInfo) {
							lawcaseInfoes[index].entity[key] = updatedLawcaseInfo[key];
						}
					}
				});
				this.setState({lawcaseInfoes:lawcaseInfoes});
			}
        });
	}

	onNavigate(navUri) {
		client({
			method: 'GET',
			path: navUri
		}).then(lawcaseInfoCollection => {
			this.links = lawcaseInfoCollection.entity._links;
			this.page = lawcaseInfoCollection.entity.page;

			return lawcaseInfoCollection.entity._embedded.lawcaseInfoes.map(lawcaseInfo =>
					client({
						method: 'GET',
						path: lawcaseInfo._links.self.href
					})
			);
		}).then(lawcaseInfoPromises => {
			return when.all(lawcaseInfoPromises);
		}).done(lawcaseInfoes => {
			this.setState({
				page: this.page,
				lawcaseInfoes: lawcaseInfoes,
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
		
		this.getlawcaseInfoesContaining(
			document.getElementById("name").value,
			document.getElementById("filingOffice").value,
			document.getElementById("selectDisciplinePunishmentGroupDefault").selectedOptions[0].value,
			startTime + ' 00:00:00',
			endTime + ' 23:59:59',
			this.state.pageSize);
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
	
	componentDidMount() {
		this.loadFromServer(this.props.accountName);
	}
	
	componentWillReceiveProps(nextProps) {
		this.loadFromServer(nextProps.accountName);
	}

	handleChange(event) {
		document.getElementById("punishmentContent").value = event.target.value;
	}
	
	handlePunishmentClassChange(event) {
		document.getElementById("selectDisciplinePunishmentGroupDefault").innerHTML = '';
		
		if (event.target.value === "党纪") {
			document.getElementById("selectDisciplinePunishmentGroupDefault").innerHTML = '<option value ="">全部</option><option value ="警告">警告</option><option value ="严重警告">严重警告</option><option value ="撤销党内职务">撤销党内职务</option><option value ="留党察看">留党察看</option><option value ="开除党籍">开除党籍</option>';
		} else {
			document.getElementById("selectDisciplinePunishmentGroupDefault").innerHTML = '<option value ="">全部</option><option value ="警告">警告</option><option value ="记过">记过</option><option value ="记大过">记大过</option><option value ="降级">降级</option><option value ="撤职">撤职</option><option value ="开除">开除</option>';
		}
	}
	
	render() {
		var punishmentClassSelect = (
			<select ref="selectPunishmentClass" onChange={this.handlePunishmentClassChange}>
				<option value ="党纪">党纪</option>
				<option value ="政纪">政纪</option>
			</select>
		);
		
		var punishmentSelectDefault = (
			<select id="selectDisciplinePunishmentGroupDefault">
				<option value ="">全部</option>
				<option value ="警告">警告</option>
				<option value ="严重警告">严重警告</option>
				<option value ="撤销党内职务">撤销党内职务</option>
				<option value ="留党察看">留党察看</option>
				<option value ="开除党籍">开除党籍</option>
			</select>
		);
		
		return (
			<div className="searchBarPlusDataDisplay">
				<div className="webdesigntuts-workshop">
				    <input type="search" id="name" placeholder="请输入查询姓名"></input>
				    <input type="search" id="filingOffice" placeholder="请输入立案机关"></input>
				    <div style={{display: "inline-block", float: "left"}}>
				    	{punishmentClassSelect}
				    	{punishmentSelectDefault}
			    	</div>
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
					<LawcaseInfoList page={this.state.page}
								  lawcaseInfoes={this.state.lawcaseInfoes}
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

class LawcaseInfoList extends React.Component {

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
		var lawcaseInfoHead = this.props.columns.map(column => <th>{column[1]}</th>);
		if (this.props.role === "管理员") {
			lawcaseInfoHead.push(<th></th>);
		}
		
		var lawcaseInfoes = this.props.lawcaseInfoes.map(lawcaseInfo =>
			<LawcaseInfo key={lawcaseInfo.entity._links.self.href}
					  lawcaseInfo={lawcaseInfo}
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
							{lawcaseInfoHead}
						</tr>
					</thead>
					<tbody>
						{lawcaseInfoes}
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

class LawcaseInfo extends React.Component {

	constructor(props) {
		super(props);
		this.handleDelete = this.handleDelete.bind(this);
	}

	handleDelete() {
		this.props.onDelete(this.props.lawcaseInfo);
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
				var dateStr = new Date(this.props.lawcaseInfo.entity[column[0]].replace(/\+0000/, "Z"));
				return <td>{this.convertDateAsSimpleDisplayTime(dateStr)}</td>;
			} else {
				return <td>{this.props.lawcaseInfo.entity[column[0]]}</td>;
			}
		});
		if (this.props.role === "管理员") {
			lawcaseInfo.push(<td><UpdateDialog lawcaseInfo={this.props.lawcaseInfo} onUpdate={this.props.onUpdate} columns={this.props.columns} /></td>);
		}
		
		return (
			<tr>
				{lawcaseInfo}
			</tr>
		)
	}
}

class UpdateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	convertDateAsSimpleDisplayTime(gmtTime) {
		var month = gmtTime.getMonth() + 1;
		var day = gmtTime.getDate();
		var simpleTime = [gmtTime.getFullYear(), (month > 9 ? '' : '0') + month,
					 (day > 9 ? '' : '0') + day].join('-');
		return simpleTime;
	}
	
	handleSubmit(e) {
		e.preventDefault();
		var updatedLawcaseInfo = {};
		var updatedLawcaseInfo = this.props.lawcaseInfo.entity;
		this.props.columns.map(column => {
			updatedLawcaseInfo[column[0]] = ReactDOM.findDOMNode(this.refs[column[0]]).value.trim();
		});
		this.props.onUpdate(this.props.lawcaseInfo, updatedLawcaseInfo);
		window.location = "#";
	}

	render() {
		var urlArr = this.props.lawcaseInfo.entity._links.self.href.split('/');
		var lawcaseInfoId = urlArr[urlArr.length - 1];
		
		//var birthDate = new Date(this.props.lawcaseInfo.entity.birthDate.replace(/\+0000/, "Z"));
		var joinDate = new Date(this.props.lawcaseInfo.entity.joinDate.replace(/\+0000/, "Z"));
		var caseFilingDate = new Date(this.props.lawcaseInfo.entity.caseFilingDate.replace(/\+0000/, "Z"));
		var caseCloseDate = new Date(this.props.lawcaseInfo.entity.caseCloseDate.replace(/\+0000/, "Z"));
		
		var lawcaseInfoInputs = this.props.columns.map(column => {
			if (['joinDate', 'caseFilingDate', 'caseCloseDate'].includes(column[0])) {
				var dateStr = new Date(this.props.lawcaseInfo.entity[column[0]].replace(/\+0000/, "Z"));
				return <p><input type="text" placeholder={"请输入" + column[1]} defaultValue={this.convertDateAsSimpleDisplayTime(dateStr)} ref={column[0]} className="field" /></p>;
			} else {
				return <p><input type="text" placeholder={"请输入" + column[1]} defaultValue={this.props.lawcaseInfo.entity[column[0]]} ref={column[0]} className="field" /></p>;
			}
		});
		
		return (
				<div className="updatelawcaseInfoDialog">
				<a href={"#updatelawcaseInfoDialog" + lawcaseInfoId}>修改处分人员信息</a>
			
				<div id={"updatelawcaseInfoDialog" + lawcaseInfoId} className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>修改处分人员信息</h2>

						<form>
							{lawcaseInfoInputs}
							<button onClick={this.handleSubmit}>提交</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

module.exports = LawcaseInfoDisplay;

