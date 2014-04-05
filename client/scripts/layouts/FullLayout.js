/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var Constants = require("../constants.js");
var UserDropdown = require("../components/UserDropdown.js");

require("../../styles/layouts/FullLayout.scss");

var FullPageLayout = React.createClass({
  /*jshint ignore:start */
  render: function () {
    if (this.props.user) {
      var userDropdown = <UserDropdown user={this.props.user} />;
    }

    return (
      <div id={this.props.id} className="page FullLayout">
        <header className="PageHeader">
          {userDropdown}
          <h1 className="company_name text_center">{Constants.COMPANY_NAME}</h1>
        </header>

        <div className="text_center">
          {this.props.children}
        </div>
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = FullPageLayout;
