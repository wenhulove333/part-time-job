'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

import DatePicker from 'react-datepicker';
import moment from 'moment';

class DatePickerDemo extends React.Component {
  constructor() {
    super();
    this.state = {
      startDate: moment()
    };
  }

  render() {
    return (
      <DatePicker
        selected={this.state.startDate}
        onChange={this.handleChange.bind(this)}
      />
    );
  }

  handleChange(date) {
    this.setState({
      startDate: date
    });
  }
}

module.exports = DatePickerDemo;