'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

class MultiNamesSearchLawcaseInfoDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {lawcaseInfoes: [], page: 1, pageSize: 6, links: {}};
		this.onNavigate = this.onNavigate.bind(this);
	}

	loadFromServer(names, pageSize) {
		client({
			method: 'POST',
			path: '/lawcaseinfo/multirespondentnamesearch',
			params: {size: pageSize},
			entity: names,
			headers: {'Content-Type': 'application/json'}
		}).done(response => {
			if ("_embedded" in response.entity) {
				this.setState({
					page: response.entity.page,
					lawcaseInfoes: response.entity._embedded.lawcaseInfoes,
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
					lawcaseInfoes: response.entity._embedded.lawcaseInfoes,
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
		return (
			<div className="searchBarPlusDataDisplay">
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
			<LawcaseInfo lawcaseInfo={lawcaseInfo}/>
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
	}
	
	convertDateAsSimpleDisplayTime(gmtTime) {
		var month = gmtTime.getMonth() + 1;
		var day = gmtTime.getDate();
		var simpleTime = [gmtTime.getFullYear(), (month > 9 ? '' : '0') + month,
					 (day > 9 ? '' : '0') + day].join('-');
		return simpleTime;
	}

	render() {
		var birthDate = new Date(this.props.lawcaseInfo.birthDate.replace(/\+0000/, "Z"));
		var joinDate = new Date(this.props.lawcaseInfo.joinDate.replace(/\+0000/, "Z"));
		var caseFilingDate = new Date(this.props.lawcaseInfo.caseFilingDate.replace(/\+0000/, "Z"));
		var caseCloseDate = new Date(this.props.lawcaseInfo.caseCloseDate.replace(/\+0000/, "Z"));
		
		return (
			<tr>
				<td>{this.props.lawcaseInfo.respondentName}</td>
				<td>{this.convertDateAsSimpleDisplayTime(birthDate)}</td>
				<td>{this.convertDateAsSimpleDisplayTime(joinDate)}</td>
				<td>{this.props.lawcaseInfo.workPlaceAndPosition}</td>
				<td>{this.convertDateAsSimpleDisplayTime(caseFilingDate)}</td>
				<td>{this.convertDateAsSimpleDisplayTime(caseCloseDate)}</td>
				<td>{this.props.lawcaseInfo.partyDisciplinePunishment}</td>
				<td>{this.props.lawcaseInfo.politicalDisciplinePunishment}</td>
			</tr>
		)
	}
}

module.exports = MultiNamesSearchLawcaseInfoDisplay;

