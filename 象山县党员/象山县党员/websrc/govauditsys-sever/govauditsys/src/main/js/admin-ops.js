'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"123

class AdminOps extends React.Component {
	constructor(props) {
		super(props);
		this.state = {data_uri: null, names: []};
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
			this.setState({data_uri: this.state.data_uri, names: response.entity});
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
			
			this.handleSubmit('uploadinspectpersoninfoinfo');
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
					<tr><td>导入党员信息:</td><td><input type="file" name="file" onChange={this.handleCommunistInfoFile}/></td></tr>
					<tr><td>导入监察对象信息:</td><td><input type="file" name="file" onChange={this.handleInspectPersonInfoFile}/></td></tr>
					<tr><td>导入案件信息:</td><td><input type="file" name="file" onChange={this.handleLawcaseInfoFile}/></td></tr>
				</table>
				
				</div>
		);
	}
}

module.exports = AdminOps;