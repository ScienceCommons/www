/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var NavigatableMixin = require("react-router-component").NavigatableMixin;
var Constants = require("../constants.js");
var Search = require('../components/Search.js');

require("../../styles/search-page.scss");

var HomePage = React.createClass({
  /*jshint ignore:start */
  render: function () {
    return (
      <div className="home-page">
        <div className="header row">
          <div className="h1 col-xs-offset-0 col-xs-8 col-sm-offset-2 col-sm-8 text-center">{Constants.COMPANY_NAME}</div>
          <div className="col-xs-4 col-sm-2">
            <button type="button">user@curatescience.com</button>
          </div>
        </div>

        <Search className="text-center"/>
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = HomePage;