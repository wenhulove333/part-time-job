'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const ReactTabs	= require('react-tabs');
const Tab = ReactTabs.Tab;
const Tabs = ReactTabs.Tabs;
const TabList = ReactTabs.TabList;
const TabPanel = ReactTabs.TabPanel;
const CommunistInfoDisplay = require('./communist-info-display');
const InspectPersonInfoDisplay = require('./inspect-person-info-display');
const LawcaseInfoDisplay = require('./lawcase-info-display');

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
					<CommunistInfoDisplay />
				</TabPanel>
				<TabPanel>
					<InspectPersonInfoDisplay />
				</TabPanel>
				<TabPanel>
					<LawcaseInfoDisplay />
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

