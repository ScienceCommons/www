/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Search = require('../components/Search.js');
var SearchResults = require('../components/SearchResults.js');
var NavigatableMixin = require('react-router-component').NavigatableMixin;
var Constants = require("../constants.js");

require('../../styles/search-page.scss');

var SearchPage = React.createClass({
  /*jshint ignore:start */
  render: function () {
    var content;

    if (this.props.query) {
      content = <SearchResults query={this.props.query}/>;
    }

    return (
      <div className="search-page container-fluid">
        <div className="header row">
          <div className="h1 inline-block">{Constants.COMPANY_NAME}</div>
          <Search query={this.props.query}/>

          <button type="button" className="pull-right">user@curatescience.com</button>
        </div>
        <div className="row">
          {content}
        </div>
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = SearchPage;