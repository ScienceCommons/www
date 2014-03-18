/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var NavigatableMixin = require("react-router-component").NavigatableMixin;
var Constants = require("../constants.js");
var Search = require('../components/Search.js');
var PageHeader = require("../components/PageHeader.js");

require("../../styles/search-page.scss");

var HomePage = React.createClass({
  /*jshint ignore:start */
  render: function () {
    return (
      <div className="page">
        <PageHeader />
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = HomePage;
