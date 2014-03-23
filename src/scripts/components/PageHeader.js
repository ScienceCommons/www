/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var Constants = require("../constants.js");
var Search = require("./Search.js");
var UserDropdown = require("./UserDropdown.js");
var Link = require("react-router-component").Link;

require("../../styles/components/PageHeader.scss");

var PageHeader = React.createClass({
  /*jshint ignore:start */
  render: function() {
    return (
      <header className="PageHeader">
        <Link className="company_name h1 inline_block" href={"/"}>{Constants.COMPANY_NAME}</Link>
        <Search query={this.props.query} className="inline_block header_search"/>
        <UserDropdown />
      </header>
    );
  }
  /*jshint ignore:end */
});
module.exports = PageHeader;
