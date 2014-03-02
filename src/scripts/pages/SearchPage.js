/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Search = require('../components/Search.js');

require('../../styles/search-page.scss');

var SearchPage = React.createClass({
  /*jshint ignore:start */
  render: function () {
    return (
      <div className="search-page">
        <h1 className="h1">Alexandria Search</h1>
        <Search />
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = SearchPage;