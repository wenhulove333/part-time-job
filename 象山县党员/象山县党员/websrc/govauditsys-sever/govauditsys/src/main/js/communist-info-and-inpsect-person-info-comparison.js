'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"123

const MultiNamesSearchCommunistInfoDisplay = require('./multi-names-search-communist-info-display');
const MultiNamesSearchInspectPersonInfoDisplay = require('./multi-names-search-inspect-person-info-display');
const MultiNamesSearchLawcaseInfoDisplay = require('./multi-names-search-lawcase-info-display');

const styles = {
	label: {
		display: 'block'
	},
	input: {
		width: 100
	}
};

class CommunistInfoAndInspectPersonInfoComparison extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data_uri: null,
			names: [],
			showCommunistInfo: false,
			showInspectPersonInfo: false,
			showLawcaseInfo: false
		};
		this.handleFile = this.handleFile.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	handleSubmit(fileName) {
		client({
			method: 'POST',
			path: '/upload/excel',
			params: {action: 'namessearch', filename: fileName},
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
			
			this.handleSubmit(file.name);
		}.bind(this);
		
		reader.readAsDataURL(file);
	}
	
	onInputChange(name) {
		return (event) => {
			const target = event.target;
			const value = target.type === 'checkbox' ? target.checked : +target.value;
		    this.setState({[name]: value})
		};
	}
	
	render() {
		return (
			<div className="subModuleDataDisplay">
				<table>
					<tr><td>请上传党员信息表:</td><td><input type="file" name="file" onChange={this.handleFile}/></td></tr>
				</table>
				
				<div>
	            <label style={styles.label}>
	              <input
	                type="checkbox"
	                id="showCommunistInfo"
	                checked={this.state.showCommunistInfo}
	                onChange={this.onInputChange('showCommunistInfo')}
	              />
	              显示党员信息
	            </label>
	            </div>

	          <div>
	            <label style={styles.label}>
	              <input
	                type="checkbox"
	                id="showInspectPersonInfo"
	                checked={this.state.showInspectPersonInfo}
	                onChange={this.onInputChange('showInspectPersonInfo')}
	              />
	              显示处分人员信息
	            </label>
	          </div>

	          <div>
	            <label style={styles.label}>
	              <input
	                type="checkbox"
	                id="showLawcaseInfo"
	                checked={this.state.showLawcaseInfo}
	                onChange={this.onInputChange('showLawcaseInfo')}
	              />
	              显示案件信息
	            </label>
	          </div>
				
				<MultiNamesSearchCommunistInfoDisplay names={this.state.names}
					showCommunistInfo={this.state.showCommunistInfo} />
				<MultiNamesSearchInspectPersonInfoDisplay names={this.state.names}
					showInspectPersonInfo={this.state.showInspectPersonInfo} />
				<MultiNamesSearchLawcaseInfoDisplay names={this.state.names}
					showLawcaseInfo={this.state.showLawcaseInfo} />
				</div>
		);
	}
}

module.exports = CommunistInfoAndInspectPersonInfoComparison;