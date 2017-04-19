'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

var root = '/api';
var children = 'inspectPersonInfoes';

class InspectPersonInfoDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {inspectPersonInfoes: [], attributes: [], page: 1, pageSize: 12, links: {}};
		this.onNavigate = this.onNavigate.bind(this);
		this.onSearch = this.onSearch.bind(this);
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
	
	getInspectPersonInfoesByName(name, pageSize) {
		if (name === "") {
			root = "/api";
			children = "inspectPersonInfoes";
		} else {
			root = "/api/inspectPersonInfoes/search";
			children = "findByNameContaining";
		}
		
		follow(client, root, [
				{rel: children, params: {name: name, size: pageSize}}]
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
		this.getInspectPersonInfoesByName(document.getElementById("name").value, this.state.pageSize);
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
				    <input type="search" id="name" placeholder="请输入你所要查询的人名"></input>
					<button onClick={this.onSearch}>搜索</button>
				</div>
				<div className="datadisplay">
					<InspectPersonInfoList page={this.state.page}
								  inspectPersonInfoes={this.state.inspectPersonInfoes}
								  links={this.state.links}
								  pageSize={this.state.pageSize}
								  onNavigate={this.onNavigate}/>
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
			<h3>CommunistInfoes - Page {this.props.page.number + 1} of {this.props.page.totalPages}</h3> : null;

		var inspectPersonInfoes = this.props.inspectPersonInfoes.map(inspectPersonInfo =>
			<InspectPersonInfo key={inspectPersonInfo.entity._links.self.href}
					  inspectPersonInfo={inspectPersonInfo}/>
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
							<th>姓名</th>
							<th>身份证号</th>
							<th>性别</th>
							<th>学历</th>
							<th>工作单位</th>
						</tr>
					</thead>
					<tbody>
						{inspectPersonInfoes}
					</tbody>
				</table>
				<div>
					{navLinks}
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
			</tr>
		)
	}
}

module.exports = InspectPersonInfoDisplay;

