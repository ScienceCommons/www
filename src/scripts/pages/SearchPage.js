/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Search = require('../components/Search.js');
var SearchResults = require('../components/SearchResults.js');
var PageHeader = require("../components/PageHeader.js");

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
        <PageHeader />

        <div className="content search_content">
          {content}
        </div>
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = SearchPage;
