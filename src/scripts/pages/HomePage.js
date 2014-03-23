/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var Constants = require("../constants.js");
var Search = require('../components/Search.js');
var UserDropdown = require('../components/UserDropdown.js');

require("../../styles/pages/HomePage.scss");

var HomePage = React.createClass({
  /*jshint ignore:start */
  render: function () {
    return (
      <div id="HomePage" className="page">
        <header>
          <div className="pull_right">
            <UserDropdown />
          </div>
          <h1 className="company_name text_center">{Constants.COMPANY_NAME}</h1>
        </header>

        <div className="text_center">
          <Search query={this.props.query} className="inline_block header_search"/>
        </div>
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = HomePage;
