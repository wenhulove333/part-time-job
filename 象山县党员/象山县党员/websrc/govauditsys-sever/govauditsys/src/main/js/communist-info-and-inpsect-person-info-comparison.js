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
		this.onSearch = this.onSearch.bind(this);
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
	
	onSearch(e) {
		var name = document.getElementById("name").value;
		var idNumber = document.getElementById("idnumber").value;
		if (name === "" || idNumber.value === "") {
			window.location = "#alertDialog";
			return;
		}
		
		var state = this.state;
		state.namesplusbirthdate = [name, idNumber.substr(6, 8)];
		state.names = [name];
		state.idnumbers = [idNumber];
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
					<tr>
						<td colSpan="2">
							<div className="webdesigntuts-workshop">
							    <input type="search" id="name" placeholder="请输入要查询的姓名"></input>
							    <input type="search" id="idnumber" placeholder="请输入要查询的或身份证号"></input>
								<button onClick={this.onSearch}>搜索</button>
							</div>
						</td>
					</tr>
					<tr><AlertDialog messageStyle={{color: '#F00'}} title="党员与监察对象信息比对" alertMessage="错误: 姓名或身份证号为空" /></tr>
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
	              显示监察对象信息
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
	              显示处分人员信息
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

class AlertDialog extends React.Component {

	constructor(props) {
		super(props);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(e) {
		e.preventDefault();
		window.location = "#";
	}

	render() {
		return (
			<div className="alertDialog">
				<div id="alertDialog" className="modalDialog">
					<div>
						<a href="#" title="Close" className="close">X</a>

						<h2>{this.props.title}</h2>

						<form>
							<label style={this.props.messageStyle}>{this.props.alertMessage}</label>
							<br />
							<br />
							<br />
							<button onClick={this.handleSubmit}>确定</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

module.exports = CommunistInfoAndInspectPersonInfoComparison;