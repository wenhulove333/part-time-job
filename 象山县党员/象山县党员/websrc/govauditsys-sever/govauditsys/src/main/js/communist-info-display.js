'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

var root = '/api';
var children = 'communistInfoes';

class CommunistInfoDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {communistInfoes: [], attributes: [], page: 1, pageSize: 20, links: {}};
		this.onNavigate = this.onNavigate.bind(this);
		this.onSearch = this.onSearch.bind(this);
	}

	loadFromServer(pageSize) {
		root = "/api";
		children = "communistInfoes";
		follow(client, root, [
				{rel: children, params: {size: pageSize}}]
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
	
	getCommunistInfoesByName(name, pageSize) {
		if (name === "") {
			root = "/api";
			children = "communistInfoes";
		} else {
			root = "/api/communistInfoes/search";
			children = "findByNameContaining";
		}
		
		follow(client, root, [
				{rel: children, params: {name: name, size: pageSize}}]
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
		this.getCommunistInfoesByName(document.getElementById("name").value, this.state.pageSize);
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
		//this.getCommunistInfoesByName('张三', this.state.pageSize);
	}
	// end::register-handlers[]

	render() {
		return (
			<div className="searchBarPlusDataDisplay">
				<div className="webdesigntuts-workshop">
				    <input type="search" id="name" placeholder="请输入要查询的姓名或身份证号"></input>
					<button onClick={this.onSearch}>搜索</button>
				</div>
				<div className="datadisplay">
					<CommunistInfoList page={this.state.page}
								  communistInfoes={this.state.communistInfoes}
								  links={this.state.links}
								  pageSize={this.state.pageSize}
								  onNavigate={this.onNavigate}/>
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
			<h3>CommunistInfoes - Page {this.props.page.number + 1} of {this.props.page.totalPages}</h3> : null;

		var communistInfoes = this.props.communistInfoes.map(communistInfo =>
			<CommunistInfo key={communistInfo.entity._links.self.href}
					  communistInfo={communistInfo}
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
							<th>党员姓名</th>
							<th>身份证号</th>
							<th>性别</th>
							<th>入党日期</th>
							<th>学历</th>
							<th>党支部</th>
							<th>上级组织</th>
							<th>籍贯</th>
							<th>民族</th>
							<th>个人身份</th>
						</tr>
					</thead>
					<tbody>
						{communistInfoes}
					</tbody>
				</table>
				<div>
					{navLinks}
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
		return (
			<tr>
				<td>{this.props.communistInfo.entity.name}</td>
				<td>{this.props.communistInfo.entity.idNumber}</td>
				<td>{this.props.communistInfo.entity.gender}</td>
				<td>{this.props.communistInfo.entity.joinDate}</td>
				<td>{this.props.communistInfo.entity.education}</td>
				<td>{this.props.communistInfo.entity.partyBranch}</td>
				<td>{this.props.communistInfo.entity.superiorOrg}</td>
				<td>{this.props.communistInfo.entity.nativePlace}</td>
				<td>{this.props.communistInfo.entity.nation}</td>
				<td>{this.props.communistInfo.entity.individualStatus}</td>
			</tr>
		)
	}
}

module.exports = CommunistInfoDisplay;

