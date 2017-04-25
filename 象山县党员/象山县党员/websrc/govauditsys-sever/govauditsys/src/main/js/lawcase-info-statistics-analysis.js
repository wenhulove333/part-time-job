'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"123

const ReactD3 = require('react-d3-components');
const BarChart = ReactD3.BarChart;
const PieChart = ReactD3.PieChart;
const LineChart = ReactD3.LineChart;

class BarChartAnalysis extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {dataSrc : [
		    {
			    label: 'somethingA',
			    values: [{x: 'SomethingA', y: 10}, {x: 'SomethingB', y: 4}, {x: 'SomethingC', y: 3}]
		    },
		    {
			    label: 'somethingB',
			    values: [{x: 'SomethingA', y: 6}, {x: 'SomethingB', y: 8}, {x: 'SomethingC', y: 5}]
		    },
		    {
			    label: 'somethingC',
			    values: [{x: 'SomethingA', y: 6}, {x: 'SomethingB', y: 8}, {x: 'SomethingC', y: 5}]
		    }
	    ]}
	}

	render() {
		return (
			<BarChart
            groupedBars
            data={this.state.dataSrc}
            width={900}
            height={600}
            margin={{top: 10, bottom: 50, left: 50, right: 10}}/>
		);
	}
}

class PieChartAnalysis extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {dataSrc : {
		        label: 'somethingA',
		        values: [{x: 'SomethingA', y: 10}, {x: 'SomethingB', y: 4}, {x: 'SomethingC', y: 3}]
			},
			sort : null // d3.ascending, d3.descending, func(a,b) { return a - b; }, etc...
		}
	}
	
	render() {
		return (
			<PieChart
            data={this.state.dataSrc}
            width={900}
            height={600}
            margin={{top: 10, bottom: 10, left: 100, right: 100}}
            sort={this.state.sort}
            />
		);
	}
}

class LineChartAnalysis extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {dataSrc : [
		    	{
			        label: 'somethingA',
			        values: [{x: 0, y: 2}, {x: 1.3, y: 5}, {x: 3, y: 6}, {x: 3.5, y: 6.5}, {x: 4, y: 6}, {x: 4.5, y: 6}, {x: 5, y: 7}, {x: 5.5, y: 8}]
		        },
		        {
			        label: 'somethingB',
			        values: [{x: 0, y: 3}, {x: 1.3, y: 4}, {x: 3, y: 7}, {x: 3.5, y: 8}, {x: 4, y: 7}, {x: 4.5, y: 7}, {x: 5, y: 7.8}, {x: 5.5, y: 9}]
		        }
		    ]
		}
	}
		
	render() {
		return (
			<LineChart
            data={this.state.dataSrc}
            width={900}
            height={600}
            margin={{top: 10, bottom: 50, left: 50, right: 10}}/>
		);
	}
}

class LawcaseInfoStatisticsAnalysis extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		var divStyle = {
            textAlign:'center',
            fontWeight:'bold'
	    };
		
		return (
			<div className="subModuleDataDisplay">
				<BarChartAnalysis />
				<div style={divStyle}><span>近三年全县党员和监察对象违法违纪案件分布情况分析图</span></div>
				<PieChartAnalysis />
				<div style={divStyle}><span>近三年全县党员和监察对象案件总体数量比较情况分析图</span></div>
				<LineChartAnalysis />
				<div style={divStyle}><span>近三年全县党员和监察对象违法违纪案件增加和减少情况分析图</span></div>
			</div>
		);
	}
}

module.exports = LawcaseInfoStatisticsAnalysis;