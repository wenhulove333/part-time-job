'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"123

const MultiCondSearchCommunistInfoDisplay = require('./multi-cond-search-communist-info-display');

var root = '/api';
var children = 'sysUsers';

class AdminOps extends React.Component {
	constructor(props) {
		super(props);
		this.state = {data_uri: null, names: []};
		this.handleFile = this.handleFile.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleSubmit() {
		client({
			method: 'POST',
			path: '/upload/excelforsearch',
			entity: this.state.data_uri
		}).done(response =>{
			this.setState({data_uri: this.state.data_uri, names: response.entity});
		});
	}
	
	handleFile(e) {
		var reader = new FileReader();
		var file = e.target.files[0];
		
		reader.onload = function(upload) {
			this.setState({
				data_uri: upload.target.result
			});
			
			this.handleSubmit();
		}.bind(this);
		
		reader.readAsDataURL(file);
	}
	
	render() {
		return (
			<div className="subModuleDataDisplay">
				<table>
					<tr><td>请上传党员信息表:</td><td><input type="file" name="file" onChange={this.handleFile}/></td></tr>
				</table>
				<MultiCondSearchCommunistInfoDisplay names={this.state.names} />
			</div>
		);
	}
}

module.exports = AdminOps;