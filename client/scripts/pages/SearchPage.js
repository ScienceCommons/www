/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var SearchResults = require("../components/SearchResults.js");
var DefaultLayout = require("../layouts/DefaultLayout.js");

require("../../styles/pages/SearchPage.scss");

var SearchPage = React.createClass({
  /*jshint ignore:start */
  render: function () {
    var content;

    if (this.props.query) {
      content = <SearchResults query={this.props.query}/>;
    }

    return (
      <DefaultLayout id="SearchPage" query={this.props.query} user={this.props.user}>
        {content}
      </DefaultLayout>
    );
  }
  /*jshint ignore:end */
});

module.exports = SearchPage;
