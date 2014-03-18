/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var NavigatableMixin = require("react-router-component").NavigatableMixin;

var Search = React.createClass({
  mixins: [React.addons.LinkedStateMixin, NavigatableMixin],
  getInitialState: function() {
    return {
      query: this.props.query || ""
    };
  },
  getDefaultProps: function() {
    return {
      size: 30
    };
  },
  updateSearch: function() {
    this.navigate("/query/"+this.state.query);
    return false;
  },
  componentDidMount: function() {
    this.refs.searchBox.getDOMNode().focus();
  },
  /*jshint ignore:start */
  render: function() {
    return (
      <form onSubmit={this.updateSearch} className={this.props.className}>
        <input type="text" placeholder="Search papers" className="no_outline" size={this.props.size} valueLink={this.linkState('query')} ref="searchBox" />
      </form>
    );
  }
  /*jshint ignore:end */
});

module.exports = Search;
