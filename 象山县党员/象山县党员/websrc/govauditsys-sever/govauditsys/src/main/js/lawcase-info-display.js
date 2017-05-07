'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

import DatePicker from 'react-datepicker';
import moment from 'moment';

var root = '/api';
var children = 'lawcaseInfoes';

class LawcaseInfoDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {lawcaseInfoes: [], attributes: [], page: 1, pageSize: 20, links: {}, startTime: '', endTime: ''};
		this.onNavigate = this.onNavigate.bind(this);
		this.onSearch = this.onSearch.bind(this);
		this.handleSelectStartTime = this.handleSelectStartTime.bind(this);
		this.handleSelectEndTime = this.handleSelectEndTime.bind(this);
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

	loadFromServer(pageSize) {
		root = "/api";
		children = "lawcaseInfoes";
		follow(client, root, [
				{rel: children, params: {size: pageSize}}]
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
	
	getlawcaseInfoesContaining(respondentName, punishmentContent, startTime, endTime, pageSize) {
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
		
		if (this.state.startTime.constructor.name !== 'String') {
			var startDate = new Date(this.state.startTime);
			var startMonth = startDate.getMonth() + 1;
			var startDay = startDate.getDate();
			startTime = [startDate.getFullYear(), (startMonth > 9 ? '' : '0') + startMonth,
						 (startDay > 9 ? '' : '0') + startDay].join('-');
		}
				
		if (this.state.endTime.constructor.name !== 'String') {
		    var endDate = new Date(this.state.endTime);
			var endMonth = endDate.getMonth() + 1;
			var endDay = endDate.getDate();
			endTime = [endDate.getFullYear(), (endMonth > 9 ? '' : '0') + endMonth,
						 (endDay > 9 ? '' : '0') + endDay].join('-');
		}
		
		this.getlawcaseInfoesContaining(
			document.getElementById("name").value,
			document.getElementById("punishmentContent").value,
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

	// tag::register-handlers[]
	componentDidMount() {
		this.loadFromServer(this.state.pageSize);
		//this.getlawcaseInfoesByName('张三', this.state.pageSize);
	}
	// end::register-handlers[]

	render() {
		return (
			<div className="searchBarPlusDataDisplay">
				<div className="webdesigntuts-workshop">
				    <input type="search" id="name" placeholder="请输入你所要查询的人名"></input>
				    <input type="search" id="punishmentContent" placeholder="请输入你所要查询的处分内容"></input>
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
								  onNavigate={this.onNavigate}/>
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
		var lawcaseInfoes = this.props.lawcaseInfoes.map(lawcaseInfo =>
			<LawcaseInfo key={lawcaseInfo.entity._links.self.href}
					  lawcaseInfo={lawcaseInfo}
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
							<th>被调查人</th>
							<th>出生年月</th>
							<th>入党日期</th>
							<th>工作单位及职务</th>
							<th>立案时间</th>
							<th>结案时间</th>
							<th>党纪处分</th>
							<th>政纪处分</th>
						</tr>
					</thead>
					<tbody>
						{lawcaseInfoes}
					</tbody>
				</table>
				<div>
					{navLinks}
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
		var birthDate = new Date(this.props.lawcaseInfo.entity.birthDate.replace(/\+0000/, "Z"));
		var joinDate = new Date(this.props.lawcaseInfo.entity.joinDate.replace(/\+0000/, "Z"));
		var caseFilingDate = new Date(this.props.lawcaseInfo.entity.caseFilingDate.replace(/\+0000/, "Z"));
		var caseCloseDate = new Date(this.props.lawcaseInfo.entity.caseCloseDate.replace(/\+0000/, "Z"));
		
		return (
			<tr>
				<td>{this.props.lawcaseInfo.entity.respondentName}</td>
				<td>{this.convertDateAsSimpleDisplayTime(birthDate)}</td>
				<td>{this.convertDateAsSimpleDisplayTime(joinDate)}</td>
				<td>{this.props.lawcaseInfo.entity.workPlaceAndPosition}</td>
				<td>{this.convertDateAsSimpleDisplayTime(caseFilingDate)}</td>
				<td>{this.convertDateAsSimpleDisplayTime(caseCloseDate)}</td>
				<td>{this.props.lawcaseInfo.entity.partyDisciplinePunishment}</td>
				<td>{this.props.lawcaseInfo.entity.politicalDisciplinePunishment}</td>
			</tr>
		)
	}
}

module.exports = LawcaseInfoDisplay;

