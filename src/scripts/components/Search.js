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
      <form onSubmit={this.updateSearch} className="text-center">
        <input type="text" placeholder="Search papers" size="60" valueLink={this.linkState('query')} ref="searchBox" />
        <button type="submit">Search</button>
      </form>
    );
  }
  /*jshint ignore:end */
});

module.exports = Search;
