/**
 * @jsx React.DOM
 */

'use strict';

var _ = require('underscore');
var React = require('react/addons');
var SearchResults = require('./SearchResults.js');
var Spinner = require('./Spinner.js');

var SampleResults = require("../data.js").Articles;
// CSS
require('../../styles/reset.css');
require('../../styles/main.css');

var Search = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      newSearch: "",
      loading: false
    };
  },
  runSearch: function() {
    var numResults = _.random(2, 8);
    var _this = this;
    if (_this.state.timeout)
      clearTimeout(_this.state.timeout);

    var timeout = setTimeout(function() {
      _this.setState({
        loading: false,
        results: _.sample(SampleResults, numResults)
      });
    }, 1000);

    _this.setState({
      currentSearch: this.state.newSearch,
      loading: true,
      timeout: timeout
    });

    return false;
  },
  /*jshint ignore:start */
  render: function() {
    var content;

    if (this.state.currentSearch) {
      if (this.state.loading) {
        content = (
          <div>
            <Spinner />
          </div>
        );
      } else {
        content = (
          <div>
            <h2 className="h2">{this.state.results.length} results match "{this.state.currentSearch}"</h2>
            <SearchResults results={this.state.results}/>
          </div>
        );
      }
    }

    return (
      <div>
        <form onSubmit={this.runSearch}>
          <input type="text" placeholder="Search papers" size="60" valueLink={this.linkState('newSearch')}/>
          <button type="submit">Go</button>
        </form>
        {content}
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = Search;
