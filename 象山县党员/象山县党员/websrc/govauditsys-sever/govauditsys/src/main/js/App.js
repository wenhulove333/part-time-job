'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const ReactTabs	= require('react-tabs');
const Tab = ReactTabs.Tab;
const Tabs = ReactTabs.Tabs;
const TabList = ReactTabs.TabList;
const TabPanel = ReactTabs.TabPanel;
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

const stompClient = require('./websocket-listener');

const root = '/api';

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {communistInfoes: [], attributes: [], page: 1, pageSize: 20, links: {}};
		this.updatePageSize = this.updatePageSize.bind(this);
		this.onCreate = this.onCreate.bind(this);
		this.onUpdate = this.onUpdate.bind(this);
		this.onDelete = this.onDelete.bind(this);
		this.onNavigate = this.onNavigate.bind(this);
		this.refreshCurrentPage = this.refreshCurrentPage.bind(this);
		this.refreshAndGoToLastPage = this.refreshAndGoToLastPage.bind(this);
	}

	loadFromServer(pageSize) {
		follow(client, root, [
				{rel: 'communistInfoes', params: {size: pageSize}}]
		).then(communistInfoCollection => {
			return client({
				method: 'GET',
				path: communistInfoCollection.entity._links.profile.href,
				headers: {'Accept': 'application/schema+json'}
			}).then(schema => {
				// tag::json-schema-filter[]
				/**
				 * Filter unneeded JSON Schema properties, like uri references and
				 * subtypes ($ref).
				 */
				Object.keys(schema.entity.properties).forEach(function (property) {
					if (schema.entity.properties[property].hasOwnProperty('format') &&
						schema.entity.properties[property].format === 'uri') {
						delete schema.entity.properties[property];
					}
					else if (schema.entity.properties[property].hasOwnProperty('$ref')) {
						delete schema.entity.properties[property];
					}
				});

				this.schema = schema.entity;
				this.links = communistInfoCollection.entity._links;
				return communistInfoCollection;
				// end::json-schema-filter[]
			});
		}).then(communistInfoCollection => {
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
				attributes: Object.keys(this.schema.properties),
				pageSize: pageSize,
				links: this.links
			});
		});
	}

	// tag::on-create[]
	onCreate(newCommunistInfo) {
		follow(client, root, ['communistInfoes']).done(response => {
			client({
				method: 'POST',
				path: response.entity._links.self.href,
				entity: newCommunistInfo,
				headers: {'Content-Type': 'application/json'}
			})
		})
	}
	// end::on-create[]

	// tag::on-update[]
	onUpdate(communistInfo, updatedCommunistInfo) {
		client({
			method: 'PUT',
			path: communistInfo.entity._links.self.href,
			entity: updatedCommunistInfo,
			headers: {
				'Content-Type': 'application/json',
				'If-Match': communistInfo.headers.Etag
			}
		}).done(response => {
			/* Let the websocket handler update the state */
		}, response => {
			if (response.status.code === 403) {
				alert('ACCESS DENIED: You are not authorized to update ' +
					communistInfo.entity._links.self.href);
			}
			if (response.status.code === 412) {
				alert('DENIED: Unable to update ' + communistInfo.entity._links.self.href +
					'. Your copy is stale.');
			}
		});
	}
	// end::on-update[]

	// tag::on-delete[]
	onDelete(communistInfo) {
		client({method: 'DELETE', path: communistInfo.entity._links.self.href}
		).done(response => {/* let the websocket handle updating the UI */},
		response => {
			if (response.status.code === 403) {
				alert('ACCESS DENIED: You are not authorized to delete ' +
					communistInfo.entity._links.self.href);
			}
		});
	}
	// end::on-delete[]

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
				attributes: Object.keys(this.schema.properties),
				pageSize: this.state.pageSize,
				links: this.links
			});
		});
	}

	updatePageSize(pageSize) {
		if (pageSize !== this.state.pageSize) {
			this.loadFromServer(pageSize);
		}
	}

	// tag::websocket-handlers[]
	refreshAndGoToLastPage(message) {
		follow(client, root, [{
			rel: 'communistInfoes',
			params: {size: this.state.pageSize}
		}]).done(response => {
			if (response.entity._links.last !== undefined) {
				this.onNavigate(response.entity._links.last.href);
			} else {
				this.onNavigate(response.entity._links.self.href);
			}
		})
	}

	refreshCurrentPage(message) {
		follow(client, root, [{
			rel: 'communistInfoes',
			params: {
				size: this.state.pageSize,
				page: this.state.page.number
			}
		}]).then(communistInfoCollection => {
			this.links = communistInfoCollection.entity._links;
			this.page = communistInfoCollection.entity.page;

			return communistInfoCollection.entity._embedded.communistInfoes.map(communistInfo => {
				return client({
					method: 'GET',
					path: communistInfo._links.self.href
				})
			});
		}).then(communistInfoPromises => {
			return when.all(communistInfoPromises);
		}).then(communistInfoes => {
			this.setState({
				page: this.page,
				communistInfoes: communistInfoes,
				attributes: Object.keys(this.schema.properties),
				pageSize: this.state.pageSize,
				links: this.links
			});
		});
	}
	// end::websocket-handlers[]

	// tag::register-handlers[]
	componentDidMount() {
		this.loadFromServer(this.state.pageSize);
		stompClient.register([
			{route: '/topic/newCommunistInfo', callback: this.refreshAndGoToLastPage},
			{route: '/topic/updateCommunistInfo', callback: this.refreshCurrentPage},
			{route: '/topic/communistInfo', callback: this.refreshCurrentPage}
		]);
	}
	// end::register-handlers[]

	render() {
		return (
			<div className="datadisplay">
				<CommunistInfoList page={this.state.page}
							  communistInfoes={this.state.communistInfoes}
							  links={this.state.links}
							  pageSize={this.state.pageSize}
							  attributes={this.state.attributes}
							  onNavigate={this.onNavigate}
							  onUpdate={this.onUpdate}
							  onDelete={this.onDelete}
							  updatePageSize={this.updatePageSize}/>
			</div>
		)
	}
}

class CreateDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		var newCommunistInfo = {};
		this.props.attributes.forEach(attribute => {
			newCommunistInfo[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.props.onCreate(newCommunistInfo);
		this.props.attributes.forEach(attribute => {
			ReactDOM.findDOMNode(this.refs[attribute]).value = ''; // clear out the dialog's inputs
		});
		window.location = "#";
	}

	render() {
		var inputs = this.props.attributes.map(attribute =>
				<p key={attribute}>
					<input type="text" placeholder={attribute} ref={attribute} className="field" />
				</p>
		);
		return (
			<div>
				<a href="#createCommunistInfo">Create</a>

				<div id="createCommunistInfo" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Create new communist information</h2>

						<form>
							{inputs}
							<button onClick={this.handleSubmit}>Create</button>
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
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		var updatedCommunistInfo = {};
		this.props.attributes.forEach(attribute => {
			updatedCommunistInfo[attribute] = ReactDOM.findDOMNode(this.refs[attribute]).value.trim();
		});
		this.props.onUpdate(this.props.communistInfo, updatedCommunistInfo);
		window.location = "#";
	}

	render() {
		var inputs = this.props.attributes.map(attribute =>
				<p key={this.props.communistInfo.entity[attribute]}>
					<input type="text" placeholder={attribute}
						   defaultValue={this.props.communistInfo.entity[attribute]}
						   ref={attribute} className="field" />
				</p>
		);

		var dialogId = "updateCommunistInfo-" + this.props.communistInfo.entity._links.self.href;

		return (
			<div>
				<a href={"#" + dialogId}>Update</a>

				<div id={dialogId} className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>Update an communist information</h2>

						<form>
							{inputs}
							<button onClick={this.handleSubmit}>Update</button>
						</form>
					</div>
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

// tag::employee[]
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
// end::employee[]

class Entry extends React.Component {
	handleSelect(index, last) {
		console.log('Selected tab: ' + index + ', Last tab: ' + last);
	}

	render() {
		return (
			<Tabs
				onSelect={this.handleSelect}
				selectedIndex={0}
			>
				<TabList>
					<Tab>党员信息查询</Tab>
					<Tab>检查对象信息查询</Tab>
					<Tab>案件信息查询</Tab>
					<Tab>党员和监察对象信息比对</Tab>
					<Tab>案件统计分析</Tab>
					<Tab>管理员操作</Tab>
					<Tab>系统用户管理</Tab>
				</TabList>
	
				<TabPanel>
					<App />
				</TabPanel>
				<TabPanel>
					<h2>检查对象信息查询</h2>
				</TabPanel>
				<TabPanel>
					<h2>案件信息查询</h2>
				</TabPanel>
				<TabPanel>
					<h2>党员和监察对象信息比对</h2>
				</TabPanel>
				<TabPanel>
					<h2>案件统计分析</h2>
				</TabPanel>					
				<TabPanel>
					<h2>管理员操作</h2>
				</TabPanel>
				<TabPanel>
					<h2>系统用户管理</h2>
				</TabPanel>				
				</Tabs>
		);
	}
}

ReactDOM.render(
	<Entry />,
	document.getElementById('react')
)

