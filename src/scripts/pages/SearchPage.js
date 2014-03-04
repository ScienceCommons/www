/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var SearchResults = require('../components/SearchResults.js');
var NavigatableMixin = require('react-router-component').NavigatableMixin;

require('../../styles/search-page.scss');

var SearchPage = React.createClass({
  mixins: [React.addons.LinkedStateMixin, NavigatableMixin],
  getInitialState: function() {
    return {
      newSearch: this.props.query || "",
      query: this.props.query
    };
  },
  updateSearch: function() {
    //this.setState({query: this.state.newSearch });
    this.navigate("/query/"+this.state.newSearch);

    return false;
  },
  /*jshint ignore:start */
  render: function () {
    var content;

    if (this.state.query) {
      content = <SearchResults query={this.state.query}/>;
    }

    return (
      <div className="search-page">
        <h1 className="h1">Alexandria Search</h1>
        <form onSubmit={this.updateSearch}>
          <input type="text" placeholder="Search papers" size="60" valueLink={this.linkState('newSearch')}/>
          <button type="submit">Go</button>
        </form>

        {content}
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = SearchPage;