/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var Constants = require("../constants.js");
var Search = require("./Search.js");
var UserBar = require("./UserBar.js");
var Link = require("react-router-component").Link;
var Logo = require("./Logo.js");

require("../../styles/components/PageHeader.scss");

var PageHeader = React.createClass({
  /*jshint ignore:start */
  render: function() {
    if (this.props.user) {
      var userBar = <UserBar user={this.props.user} />;
    }

    return (
      <header className="PageHeader">
        <Link href="/" className="logoLink"><Logo /></Link>
        <Search query={this.props.query} className="inline_block header_search"/>
        {userBar}
      </header>
    );
  }
  /*jshint ignore:end */
});
module.exports = PageHeader;
