'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

class MultiNamesSearchInspectPersonInfoDisplay extends React.Component {

	constructor(props) {
		super(props);
		this.state = {inspectPersonInfoes: [], page: 1, pageSize: 6, links: {}};
		this.onNavigate = this.onNavigate.bind(this);
	}

	loadFromServer(names, pageSize) {
		client({
			method: 'POST',
			path: '/inspectpersoninfo/multinamesearch',
			params: {size: pageSize},
			entity: names,
			headers: {'Content-Type': 'application/json'}
		}).done(response => {
			if ("_embedded" in response.entity) {
				this.setState({
					page: response.entity.page,
					inspectPersonInfoes: response.entity._embedded.inspectPersonInfoes,
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
					inspectPersonInfoes: response.entity._embedded.inspectPersonInfoes,
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
		var inspectPersonInfoes = this.props.inspectPersonInfoes.map(inspectPersonInfo =>
			<InspectPersonInfo inspectPersonInfo={inspectPersonInfo}/>
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
				<td>{this.props.inspectPersonInfo.name}</td>
				<td>{this.props.inspectPersonInfo.idNumber}</td>
				<td>{this.props.inspectPersonInfo.gender}</td>
				<td>{this.props.inspectPersonInfo.education}</td>
				<td>{this.props.inspectPersonInfo.workPlace}</td>
			</tr>
		)
	}
}

module.exports = MultiNamesSearchInspectPersonInfoDisplay;

