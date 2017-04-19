'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"

var root = '/api';
var children = 'sysUsers';

class AdminOps extends React.Component {
	constructor(props) {
		super(props);
		this.state = {data_uri: null};
		this.handleFile = this.handleFile.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleSubmit() {
		client({
			method: 'POST',
			path: '/upload/excelforsearch',
			entity: this.state.data_uri
		}).done(response =>{
			console.log(response);
		});
	}
	
	handleFile(e) {
		var reader = new FileReader();
		var file = e.target.files[0];
		
		reader.onload = function(upload) {
			this.setState({
				data_uri: upload.target.result
			});
		}.bind(this);
		
		reader.readAsDataURL(file);
	}
	
	render() {
		return (
			<div>
				<table>
					<tr><td>File to upload:</td><td><input type="file" name="file" onChange={this.handleFile}/></td></tr>
					<tr><td></td><td><button onClick={this.handleSubmit}>上传文件</button></td></tr>
				</table>
			</div>
		);
	}
}

module.exports = AdminOps;