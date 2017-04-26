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
	}
	
	render() {
		var divStyle = {
            textAlign:'center',
            fontWeight:'bold'
		};
		
		var dataSrc = [
			[
				{
					label: "xxx",
					values: [{x: 'xxx', y: 0}, [{x: 'xxx', y: 0}, [{x: 'xxx', y: 0}]
				}
			],
			[
				{
					label: "yyy",
					values: [{x: 'xxx', y: 0}, [{x: 'xxx', y: 0}, [{x: 'xxx', y: 0}]
				}
			],
			[
				{
					label: "zzz",
					values: [{x: 'xxx', y: 0}, [{x: 'xxx', y: 0}, [{x: 'xxx', y: 0}]
				}
			]
		];
		
		for(var key in this.props.data) {
			dataSrc.push([{label: key, values: this.props.data[key]}]);
		} 
		
		return (
			<div>
				<div className="divabreastDisplay" >
					<div style={divStyle}><span>{dataSrc[0][0]['label']}</span></div>
					<BarChart
		            groupedBars
		            data={this.state.dataSrc[0]}
		            width={300}
		            height={200}
		            margin={{top: 10, bottom: 50, left: 50, right: 10}}/>
				</div>
				<div className="divabreastDisplay" >
					<div style={divStyle}><span>{dataSrc[1][0]['label']}</span></div>
					<BarChart
		            groupedBars
		            data={this.state.dataSrc[1]}
		            width={300}
		            height={200}
		            margin={{top: 10, bottom: 50, left: 50, right: 10}}/>
				</div>
				<div className="divabreastDisplay" >
					<div style={divStyle}><span>{dataSrc[2][0]['label']}</span></div>
					<BarChart
		            groupedBars
		            data={this.state.dataSrc[2]}
		            width={300}
		            height={200}
		            margin={{top: 10, bottom: 50, left: 50, right: 10}}/>
				</div>
			</div>
		);
	}
}

class PieChartAnalysis extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {dataSrc : [
				{
					label: '2015',
			        values: [{x: 'xxx', y: 0}, {x: 'yyy', y: 0}, {x: 'zzz', y: 0}]
				},
				{
					label: '2016',
			        values: [{x: 'xxx', y: 10}, {x: 'yyy', y: 8}, {x: 'zzz', y: 3}]
				},
				{
					label: '2017',
			        values: [{x: 'xxx', y: 10}, {x: 'yyy', y: 4}, {x: 'zzz', y: 7}]
				}
			],
			sort : null // d3.ascending, d3.descending, func(a,b) { return a - b; }, etc...
		}
	}
	
	render() {
		var divStyle = {
            textAlign:'center',
            fontWeight:'bold'
		};
		
		return (
			<div>
				<div className="divabreastDisplay" >
					<div style={divStyle}><span>{this.state.dataSrc[0]['label']}</span></div>
					<PieChart
		            data={this.state.dataSrc[0]}
		            width={300}
		            height={300}
		            margin={{top: 50, bottom: 50, left: 50, right: 50}}
		            sort={this.state.sort}
		            />
				</div>
				<div className="divabreastDisplay" >
					<div style={divStyle}><span>{this.state.dataSrc[1]['label']}</span></div>
					<PieChart
		            data={this.state.dataSrc[1]}
		            width={300}
		            height={300}
		            margin={{top: 50, bottom: 50, left: 50, right: 50}}
		            sort={this.state.sort}
		            />
				</div>
				<div className="divabreastDisplay" >
					<div style={divStyle}><span>{this.state.dataSrc[2]['label']}</span></div>
					<PieChart
		            data={this.state.dataSrc[2]}
		            width={300}
		            height={300}
		            margin={{top: 50, bottom: 50, left: 50, right: 50}}
		            sort={this.state.sort}
		            />
				</div>
			</div>
		);
	}
}

class LineChartAnalysis extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {dataSrc : [
		    	{
			        label: '2015',
			        values: [{x: "2015", y: 2}, {x: "2016", y: 5}, {x: "2017", y: 6}]
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
		this.state = {dataSrc : {}}
	}
	
	loadFromServer() {
		var myDate = new Date();
		var currentYear = myDate.getFullYear();
		years = [currentYear - 2, currentYear - 1, currentYear];
		this.setState({dataSrc : {}});
		
		years.map(year => client({
			method: 'GET',
			path: '/lawcaseinfo/partydisciplinepunishmentcountgroupsearch',
			params: {year: year},
		}).done(response => {
			this.state.dataSrc[year] = response;
		}));
		
		this.setState(this.state);
	}
	
	componentDidMount() {
		this.loadFromServer();
	}
	
	render() {
		var divStyle = {
            textAlign:'center',
            fontWeight:'bold'
	    };
		
		return (
			<div className="subModuleDataDisplay">
				<PieChartAnalysis data={this.state.dataSrc} />
				<div style={divStyle}><span>近三年全县党员和监察对象违法违纪案件分布情况分析图</span></div>
				<BarChartAnalysis data={this.state.dataSrc} />
				<div style={divStyle}><span>近三年全县党员和监察对象案件总体数量比较情况分析图</span></div>
				<LineChartAnalysis data={this.state.dataSrc} />
				<div style={divStyle}><span>近三年全县党员和监察对象违法违纪案件增加和减少情况分析图</span></div>
			</div>
		);
	}
}

module.exports = LawcaseInfoStatisticsAnalysis;