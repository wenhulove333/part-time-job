'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const ReactTabs	= require('react-tabs');
const client = require('./client');
const Tab = ReactTabs.Tab;
const Tabs = ReactTabs.Tabs;
const TabList = ReactTabs.TabList;
const TabPanel = ReactTabs.TabPanel;
const CommunistInfoDisplay = require('./communist-info-display');
const InspectPersonInfoDisplay = require('./inspect-person-info-display');
const LawcaseInfoDisplay = require('./lawcase-info-display');
const SysUserDisplay = require('./system-user-mgmt');
const CommunistInfoAndInspectPersonInfoComparison = require('./communist-info-and-inpsect-person-info-comparison');
const AdminOps = require('./admin-ops');
const LawcaseInfoStatisticsAnalysis = require('./lawcase-info-statistics-analysis');
const UserInfoDisplay = require('./user-info-mgmt');

const DatePickerDemo = require('./date-picker');

class Entry extends React.Component {
	constructor(props) {
		super(props);
		this.state = {role: '普通用户', accountName: 'unknown', disciplinaryInspections: [""]};
	}
	
	handleSelect(index, last) {
		console.log('Selected tab: ' + index + ', Last tab: ' + last);
	}
	
	getUserName() {
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
					role: result.entity.roles[0],
					accountName: result.entity.accountName
				});
			});
		});
	}
	
	componentDidMount() {
		this.getUserName();
	}

	render() {
		if ("管理员" === this.state.role) {
			return (
				<Tabs
					onSelect={this.handleSelect}
					selectedIndex={0}
				>
					<TabList activeTabClassName="ss_tab_selected">
						<Tab activeTabClassName="ss_tab_selected">党员信息查询</Tab>
						<Tab activeTabClassName="ss_tab_selected">监察对象信息查询</Tab>
						<Tab activeTabClassName="ss_tab_selected">处分人员信息查询</Tab>
						<Tab activeTabClassName="ss_tab_selected">信息比对</Tab>
						<Tab activeTabClassName="ss_tab_selected">统计分析</Tab>
						<Tab activeTabClassName="ss_tab_selected">管理员操作</Tab>
						<Tab activeTabClassName="ss_tab_selected">系统用户管理</Tab>
					</TabList>
		
					<TabPanel>
						<CommunistInfoDisplay accountName={this.state.accountName} role={this.state.role} />
					</TabPanel>
					<TabPanel>
						<InspectPersonInfoDisplay accountName={this.state.accountName} role={this.state.role} />
					</TabPanel>
					<TabPanel>
						<LawcaseInfoDisplay accountName={this.state.accountName} role={this.state.role} />
					</TabPanel>
					<TabPanel>
						<CommunistInfoAndInspectPersonInfoComparison accountName={this.state.accountName} />
					</TabPanel>
					<TabPanel>
						<LawcaseInfoStatisticsAnalysis accountName={this.state.accountName} />
					</TabPanel>					
					<TabPanel>
						<AdminOps />
					</TabPanel>
					<TabPanel>
						<SysUserDisplay />
					</TabPanel>				
					</Tabs>
			);
	} else {
		return (
				<Tabs
					onSelect={this.handleSelect}
					selectedIndex={0}
				>
					<TabList activeTabClassName="ss_tab_selected">
						<Tab activeTabClassName="ss_tab_selected">党员信息查询</Tab>
						<Tab activeTabClassName="ss_tab_selected">监察对象信息查询</Tab>
						<Tab activeTabClassName="ss_tab_selected">处分人员信息查询</Tab>
						<Tab activeTabClassName="ss_tab_selected">信息比对</Tab>
						<Tab activeTabClassName="ss_tab_selected">统计分析</Tab>
						<Tab activeTabClassName="ss_tab_selected">用户信息</Tab>
					</TabList>
		
					<TabPanel>
						<CommunistInfoDisplay accountName={this.state.accountName} role={this.state.role} />
					</TabPanel>
					<TabPanel>
						<InspectPersonInfoDisplay accountName={this.state.accountName} role={this.state.role} />
					</TabPanel>
					<TabPanel>
						<LawcaseInfoDisplay accountName={this.state.accountName} role={this.state.role} />
					</TabPanel>
					<TabPanel>
						<CommunistInfoAndInspectPersonInfoComparison accountName={this.state.accountName} />
					</TabPanel>
					<TabPanel>
						<LawcaseInfoStatisticsAnalysis accountName={this.state.accountName} />
					</TabPanel>	
					<TabPanel>
						<UserInfoDisplay />
					</TabPanel>	
				</Tabs>
			);
		}		
	}
}

ReactDOM.render(
	<Entry />,
	document.getElementById('react')
)

class Header extends React.Component {
	constructor(props) {
		super(props);
		this.state = {userName: '未知生物', from: '未知星球', position: '神秘人物'};
	}
	
	getUserName() {
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
					userName: result.entity.name,
					from: result.entity.workPlace,
					position: result.entity.position
				});
			});
		});
	}
	
	componentDidMount() {
		this.getUserName();
	}

	render() {
		return (
			<div className="statusheader">
		    	<div className="systemflag">
		    		<span>象山县党员和监察对象查询比对系统</span>
		    	</div>
		    	<div className="headerlogin">
			        <span>您好,来自</span><span>{this.state.from}</span><span>的</span><span>{this.state.position}</span><span>{this.state.userName}</span><span>.</span>        <span></span>
			        <span>|</span><div>
				        <form action="/logout" method="post">
				            <input type="submit" value="注销"/>
				        </form>
			        </div>
		        </div>
		    </div>
		);
	}
}

ReactDOM.render(
	<Header />,
	document.getElementById('header')
)
