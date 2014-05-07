/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var Constants = require("../constants.js");
var UserBar = require("../components/UserDropdown.js");
var Logo = require("../components/Logo.js");

require("../../styles/layouts/FullLayout.scss");

var FullPageLayout = React.createClass({
  /*jshint ignore:start */
  render: function () {
    if (this.props.user) {
      var userBar = <UserBar user={this.props.user} />;
    }

    return (
      <div id={this.props.id} className="page FullLayout">
        <header className="PageHeader">
          {this.props.header}
          {userBar}
        </header>

        <div className="text_center">
          <Logo />
          {this.props.children}
        </div>
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = FullPageLayout;
