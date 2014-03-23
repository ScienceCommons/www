/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var Search = require("../components/Search.js");
var SearchResults = require("../components/SearchResults.js");
var PageHeader = require("../components/PageHeader.js");

require("../../styles/pages/SearchPage.scss");

var SearchPage = React.createClass({
  /*jshint ignore:start */
  render: function () {
    var content;

    if (this.props.query) {
      content = <SearchResults query={this.props.query}/>;
    }

    return (
      <div id="SearchPage" className="page">
        <PageHeader query={this.props.query} />

        <div className="content">
          {content}
        </div>
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = SearchPage;
