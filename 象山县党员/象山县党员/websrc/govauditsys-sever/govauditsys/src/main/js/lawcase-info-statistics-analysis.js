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
		
		var dataSrcs = [];
		
		for(var key in this.props.data) {
			dataSrcs.push([{label: key, values: this.props.data[key]}]);
		} 
		
		var barCharts = <div style={divStyle}><span>没有获取到任何数据！！！</span></div>;
		
		if (dataSrcs.length != 0) {
			barCharts = dataSrcs.map(dataSrc =>
				<div className="divabreastDisplay" >
					<div style={divStyle}><span>{dataSrc[0]['label']}</span></div>
					<BarChart
			        groupedBars
			        data={dataSrc}
			        width={900 / dataSrcs.length}
			        height={600 / dataSrcs.length}
			        margin={{top: 10, bottom: 50, left: 50, right: 10}}/>
				</div>
			);
		}
		
		return (
			<div>
				{barCharts}
			</div>
		);
	}
}

class PieChartAnalysis extends React.Component {
	constructor(props) {
		super(props);
	}
	
	render() {
		var divStyle = {
            textAlign:'center',
            fontWeight:'bold'
		};
		
		var sort = null;
		var dataSrcs = [];
		
		for(var key in this.props.data) {
			dataSrcs.push({label: key, values: this.props.data[key]});
		}
		
		var pieCharts = <div style={divStyle}><span>没有获取到任何数据！！！</span></div>;
		
		if (dataSrcs.length != 0) {
			pieCharts = dataSrcs.map(dataSrc =>
				<div className="divabreastDisplay" >
					<div style={divStyle}><span>{dataSrc['label']}</span></div>
					<PieChart
		            data={dataSrc}
		            width={900 / dataSrcs.length}
		            height={900 / dataSrcs.length}
		            margin={{top: 80, bottom: 80, left: 80, right: 80}}
		            sort={sort}
		            />
				</div>
			);
		}
		
		return (
			<div>
				{pieCharts}
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
			        values: [{x: "2015", y: 5}, {x: "2016", y: 7}, {x: "2017", y: 9}]
		        }
		    ]
		}
	}

	render() {
		var myDate = new Date();
		var currentYear = myDate.getFullYear();
		var years = [(currentYear - 2).toString(), (currentYear - 1).toString(), currentYear.toString()];
		var dataSrcs = [
	    	{
		        label: 'LineChart',
		        values: [{x: years[0], y: 0}, {x: years[1], y: 0}, {x: years[2], y: 0}]
	        }
	    ];
		
		for(var key in this.props.data) {
			var sum = 0;
			for (var item in this.props.data[key]) {
				sum += this.props.data[key][item]['y'];
			}
			
			dataSrcs[0]['values'][years.indexOf(key)]['y'] = sum;
			sum = 0;
		}
		
		return (
			<LineChart
            data={this.state.dataSrc}
            width={900}
            height={600}
            margin={{top: 50, bottom: 50, left: 50, right: 50}}/>
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
		var years = [currentYear - 2, currentYear - 1, currentYear];
		var dataSrc = {};

		Promise.all(years.map(year => new Promise(function(resolve, reject) {
			client({
				method: 'GET',
				path: '/lawcaseinfo/partydisciplinepunishmentcountgroupsearch',
				params: {year: year},
			}).done(response => {
				if (!Array.isArray(response.entity)) {
					reject('Exception');
				} else {
					if (response.entity.length != 0) {
						dataSrc[year] = response.entity;
					}
					resolve('Success');
				}
			});
		}))).then(() => {
			this.setState({dataSrc:dataSrc});
		}).catch(() => {
			this.state = {dataSrc : {}}
		});
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