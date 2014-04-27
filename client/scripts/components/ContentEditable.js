/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");

var ContentEditable = React.createClass({
  getDefaultProps: function() {
    return {
      editable: false
    };
  },
  data: function() {
    return this.props.children;
  },
  handleChange: function() {
    var newVal = this.refs.editable.getDOMNode().innerHTML;
    this.data().set(newVal);
  },
  /*jshint ignore:start */
  render: function () {
    return <span contentEditable={this.props.editable} ref="editable" onChange={this.handleChange} onBlur={this.handleChange}>{this.data().val()}</span>
  }
  /*jshint ignore:end */
});

module.exports = ContentEditable;