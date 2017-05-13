'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const when = require('when');
const client = require('./client');

const follow = require('./follow'); // function to hop multiple links by "rel"123

const MultiIdNumbersSearchCommunistInfoDisplay = require('./multi-idnumbers-search-communist-info-display');
const MultiIdNumbersSearchInspectPersonInfoDisplay = require('./multi-idnumbers-search-inspect-person-info-display');
const MultiNamesPlusBirthdateSearchLawcaseInfoDisplay = require('./multi-names-plus-idnumbers-search-lawcase-info-display');

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
			idnumbers: [],
			namesplusbirthdate: [],
			showCommunistInfo: false,
			showInspectPersonInfo: false,
			showLawcaseInfo: false,
			uploadresult: '',
			uploadresultStyle: {color: '#0F0'}
		};
		this.handleFile = this.handleFile.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.initiateUploadResult = this.initiateUploadResult.bind(this);
	}
	
	handleSubmit(fileName) {
		this.initiateUploadResult();
		
		client({
			method: 'POST',
			path: '/upload/excel',
			params: {action: 'namessearch', filename: fileName},
			entity: this.state.data_uri
		}).done(response =>{
			this.setState({data_uri: this.state.data_uri, names: response.entity});
			if(response.hasOwnProperty('entity')) {
				if (response.entity[0] == 'error') {
					var state = this.state;
					state.uploadresultStyle = {color: '#F00'};
					state.uploadresult = response.entity[1];
					this.setState(state);
				} else {
					var state = this.state;
					state.uploadresultStyle = {color: '#0F0'};
					state.uploadresult = '导入成功';
					state.namesplusbirthdate = response.entity.map((item, index)=>{
						if (index % 2 == 1) {
							return item.substr(6, 8);
						}
						
						return item;
					});
					state.names = response.entity.filter((item, index)=>index%2==0);
					state.idnumbers = response.entity.filter((item, index)=>index%2==1);
					this.setState(state);
				}
			} else {
				var state = this.state;
				state.uploadresultStyle = {color: '#F00'};
				state.uploadresult = '未知异常';
				this.setState(state);
			}
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
	
	initiateUploadResult() {
		var state = this.state;
		state.uploadresultStyle = {color: '#000'};
		state.uploadresult = '导入中...';
		this.setState(state);
	}
	
	render() {
		return (
			<div className="subModuleDataDisplay">
				<table>
					<tr>
						<td>请上传党员信息表:</td><td><input type="file" name="file" onChange={this.handleFile}/></td>
						<td style={this.state.uploadresultStyle}>{this.state.uploadresult}</td>
					</tr>
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
				
				<MultiIdNumbersSearchCommunistInfoDisplay idNumbers={this.state.idnumbers}
					showCommunistInfo={this.state.showCommunistInfo} />
				<MultiIdNumbersSearchInspectPersonInfoDisplay idNumbers={this.state.idnumbers}
					showInspectPersonInfo={this.state.showInspectPersonInfo} />
				<MultiNamesPlusBirthdateSearchLawcaseInfoDisplay namesPlusBirthdate={this.state.namesplusbirthdate}
					showLawcaseInfo={this.state.showLawcaseInfo} />
				</div>
		);
	}
}

module.exports = CommunistInfoAndInspectPersonInfoComparison;