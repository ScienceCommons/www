/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Search = require('../components/Search.js');
var SearchResults = require('../components/SearchResults.js');
var Constants = require("../constants.js");
var Link = require('react-router-component').Link;

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
          <Link className="h1 inline-block" href={"/"}>{Constants.COMPANY_NAME}</Link>
          <Search query={this.props.query} className="inline-block"/>

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