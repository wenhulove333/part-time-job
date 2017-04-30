'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"123

const UserOperationLoggingDisplay = require('./user-operation-logging-display');

class AdminOps extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data_uri: null,
			uploadresult: {uploadcommunistinfo: '', uploadinspectpersoninfo: '', uploadlawcaseinfo: ''},
			uploadresultStyle: {uploadcommunistinfo: {color: '#0F0'}, uploadinspectpersoninfo: {color: '#0F0'}, uploadlawcaseinfo: {color: '#0F0'}}
		}
		var divStyle = {
	            textAlign:'center',
	            fontWeight:'bold'
			};
		this.handleCommunistInfoFile = this.handleCommunistInfoFile.bind(this);
		this.handleInspectPersonInfoFile = this.handleInspectPersonInfoFile.bind(this);
		this.handleLawcaseInfoFile = this.handleLawcaseInfoFile.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleSubmit(action) {
		client({
			method: 'POST',
			path: '/upload/excel',
			params: {action: action},
			entity: this.state.data_uri
		}).done(response =>{
			if(response.hasOwnProperty('entity') && response.entity.constructor.name === 'Array') {
				if (response.entity[0] == 'success') {
					var state = this.state;
					state.uploadresultStyle[action] = {color: '#0F0'};
					state.uploadresult[action] = '导入成功';
					this.setState(state);
				} else {
					var state = this.state;
					state.uploadresultStyle[action] = {color: '#F00'};
					state.uploadresult[action] = '导入失败';
					this.setState(state);
				}
			} else {
				var state = this.state;
				state.uploadresultStyle[action] = {color: '#F00'};
				state.uploadresult[action] = '未知异常';
				this.setState(state);
			}
		});
	}
	
	handleCommunistInfoFile(e) {
		var reader = new FileReader();
		var file = e.target.files[0];
		
		reader.onload = function(upload) {
			this.setState({
				data_uri: upload.target.result
			});
			
			this.handleSubmit('uploadcommunistinfo');
		}.bind(this);
		
		reader.readAsDataURL(file);
	}
	
	handleInspectPersonInfoFile(e) {
		var reader = new FileReader();
		var file = e.target.files[0];
		
		reader.onload = function(upload) {
			this.setState({
				data_uri: upload.target.result
			});
			
			this.handleSubmit('uploadinspectpersoninfo');
		}.bind(this);
		
		reader.readAsDataURL(file);
	}
	
	handleLawcaseInfoFile(e) {
		var reader = new FileReader();
		var file = e.target.files[0];
		
		reader.onload = function(upload) {
			this.setState({
				data_uri: upload.target.result
			});
			
			this.handleSubmit('uploadlawcaseinfo');
		}.bind(this);
		
		reader.readAsDataURL(file);
	}
	
	render() {
		return (
			<div className="subModuleDataDisplay">
				<table>
					<tr>
						<td>导入党员信息:</td>
						<td><input type="file" name="file" onChange={this.handleCommunistInfoFile}/></td>
						<td style={this.state.uploadresultStyle['uploadcommunistinfo']}>{this.state.uploadresult['uploadcommunistinfo']}</td>
					</tr>
					<tr>
						<td>导入监察对象信息:</td>
						<td><input type="file" name="file" onChange={this.handleInspectPersonInfoFile}/></td>
						<td style={this.state.uploadresultStyle['uploadinspectpersoninfo']}>{this.state.uploadresult['uploadinspectpersoninfo']}</td>
					</tr>
					<tr>
						<td>导入案件信息:</td>
						<td><input type="file" name="file" onChange={this.handleLawcaseInfoFile}/></td>
						<td style={this.state.uploadresultStyle['uploadlawcaseinfo']}>{this.state.uploadresult['uploadlawcaseinfo']}</td>
					</tr>
				</table>
				<UserOperationLoggingDisplay />
				</div>
		);
	}
}

module.exports = AdminOps;