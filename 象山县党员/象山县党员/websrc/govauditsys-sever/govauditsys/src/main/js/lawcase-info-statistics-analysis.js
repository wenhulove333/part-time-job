'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"123

const Promise = require("bluebird");

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
			
		var tooltip = function(x, y, y0) {
		    return x + ": " + y0;
		};
		
		for(var key in this.props.data) {
			if (key !== "") {
				dataSrcs.push([{label: key, values: this.props.data[key]}]);
			}
		} 
		
		var barCharts = <div style={divStyle}><span>没有获取到任何数据！！！</span></div>;
		
		if (dataSrcs.length != 0) {
			barCharts = dataSrcs.map(dataSrc =>
				<div className="divabreastDisplay" >
					<div style={divStyle}><span>{dataSrc[0]['label']}</span></div>
					<BarChart
				        data={dataSrc}
				        width={400}
				        height={300}
						tooltipHtml={tooltip}
						xAxis={{tickDirection: 'diagonal'}}
				        margin={{top: 10, bottom: 100, left: 50, right: 10}}/>
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
			if (key !== "") {
				dataSrcs.push({label: key, values: this.props.data[key]});
			}
		}
		
		var tooltip = function(x, y) {
		    return x + ": " + y;
		};
		
		var pieCharts = <div style={divStyle}><span>没有获取到任何数据！！！</span></div>;
		
		if (dataSrcs.length != 0) {
			pieCharts = dataSrcs.map(dataSrc =>
				<div className="divabreastDisplay" >
					<div style={divStyle}><span>{dataSrc['label']}</span></div>
					<PieChart
		            data={dataSrc}
		            width={400}
		            height={400}
		            margin={{top: 80, bottom: 80, left: 80, right: 80}}
					tooltipHtml={tooltip}
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
	}

	render() {
		var myDate = new Date();
		var currentYear = myDate.getFullYear();
		var minYear = currentYear;
		var maxYear = currentYear;
		for(var key in this.props.data) {
			var intKey = parseInt(key);
			if (intKey < minYear) {
				minYear = intKey;
			}
		}
		if (maxYear - minYear < 2) {
			minYear = maxYear - 2;
		}
		var years = [];
		var dataSrcs = [
	    	{
		        label: 'LineChart',
		        values: []
	        }
	    ];
		for (var i = minYear; i <= maxYear; i++) {
			years.push(i)
			dataSrcs[0].values.push({x: i, y: 0});
		};
		
		var tooltip = function(label, data) {
		    return data.x + ": " + data.y;
		};
		
		var valuesAccessor = function(stack) { return stack.values; };
		var xAccessor = function(element) { return parseInt(element.x); };
		var yAccessor = function(element) { return element.y; };
		
		for(var key in this.props.data) {
			var sum = 0;
			var strKey = parseInt(key);
			for (var item in this.props.data[key]) {
				sum += this.props.data[key][item]['y'];
			}
			
			dataSrcs[0]['values'][years.indexOf(strKey)]['y'] = sum;
			sum = 0;
		}
		
		return (
				<LineChart
                data={dataSrcs}
                width={900}
                height={600}
                margin={{top: 10, bottom: 50, left: 50, right: 10}}
                tooltipHtml={tooltip}
				xScale={d3.time.scale().domain([minYear, maxYear]).range([0, 900 - 100])}
				xAxis={{tickFormat: d3.format("d")}}
                />
		);
	}
}

class LawcaseInfoStatisticsAnalysis extends React.Component {
	constructor(props) {
		super(props);
		this.state = {dataSrc : {}, options: [<option value ="全部">全部</option>], currentOption: "全部", disciplinaryInspectDepartment: ['']};
		this.handleChange = this.handleChange.bind(this);
	}
	
	loadFromServer(years, punishmentClass) {
		var dataSrc = {};
		var disciplinaryInspectDepartment = this.state.disciplinaryInspectDepartment;
		var defaultPath = "/lawcaseinfo/getpartydisciplinepunishmentcountgroupbyyear";

		if (punishmentClass === "政纪") {
			defaultPath = "/lawcaseinfo/getpoliticaldisciplinepunishmentcountgroupbyyear";
		}
		
		client({
			method: 'GET',
			path: '/getdisciplinaryinpectiondepartment',
			params: {accountName: this.props.accountName}
		}).then(response => {
			return response;
		}).done(result => {
			this.state.disciplinaryInspectDepartment = result.entity;
			disciplinaryInspectDepartment = result.entity;
			Promise.all(years.map(year => new Promise(function(resolve, reject) {
				client({
					method: 'GET',
					path: defaultPath,
					params: {year: year, disciplinaryInspectDepartment: disciplinaryInspectDepartment},
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
				var state = this.state;
				state.dataSrc = dataSrc;
				for(var key in dataSrc) {
					state.options.push(<option value ={key}>{key}</option>);
				}
				state.disciplinaryInspectDepartment = disciplinaryInspectDepartment;
				this.setState(state);
			}).catch(() => {
				this.setState({dataSrc : {}, options: [<option value ="全部">全部</option>], currentOption: "全部"});
			});
		});
	}
	
	loadFromServerBySelectedYear(years, punishmentClass) {
		var dataSrc = {};
		var disciplinaryInspectDepartment = this.state.disciplinaryInspectDepartment;
		
		var defaultPath = "/lawcaseinfo/getpartydisciplinepunishmentcountgroupbyyear";

		if (punishmentClass === "政纪") {
			defaultPath = "/lawcaseinfo/getpoliticaldisciplinepunishmentcountgroupbyyear";
		}

		Promise.all(years.map(year => new Promise(function(resolve, reject) {
			client({
				method: 'GET',
				path: defaultPath,
				params: {year: year, disciplinaryInspectDepartment: disciplinaryInspectDepartment},
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
			var state = this.state;
			state.dataSrc = dataSrc;
			this.setState(state);
		}).catch(() => {
			this.setState({dataSrc : {}, options: [<option value ="全部">全部</option>], currentOption: "全部"});
		});
	}
	
	componentDidMount() {
		var myDate = new Date();
		var currentYear = myDate.getFullYear();
		var years = [];
		for (var i = 1949; i <= currentYear; i++) {years.push(i)};
		
		this.loadFromServer(years);
	}
	
	handleChange(event) {
		if (document.getElementById("selectYear").selectedOptions[0].value == "全部") {
			var myDate = new Date();
			var currentYear = myDate.getFullYear();
			var years = [];
			for (var i = 1949; i <= currentYear; i++) {years.push(i)};
			this.loadFromServerBySelectedYear(years, document.getElementById("selectPunishmentClass").selectedOptions[0].value);
		} else {
			this.loadFromServerBySelectedYear([document.getElementById("selectYear").selectedOptions[0].value], document.getElementById("selectPunishmentClass").selectedOptions[0].value);
		}
	}
	
	render() {
		var divStyle = {
            textAlign:'center',
            fontWeight:'bold',
            margin: '0px 0px 100px 0px'
	    };
		
		return (
			<div className="subModuleDataDisplay">
				<div style={divStyle}>
					<label>
					请选择要统计分析的年份：
					<select id="selectYear" value={this.state.value} onChange={this.handleChange}>
						{this.state.options}
					</select>
					</label>
					<label>
					请选择要统计的处分类型：
					<select id="selectPunishmentClass" value={this.state.value} onChange={this.handleChange}>
						<option value ="党纪">党纪</option>
						<option value ="政纪">政纪</option>
					</select>
					</label>
				</div>
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