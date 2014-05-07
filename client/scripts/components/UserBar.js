/**
 * @jsx React.DOM
 */

"use strict";
var React = require("react/addons");
var Router = require("react-router-component");
var Link = Router.Link;
var UserDropdown = require("./UserDropdown.js");
var Notifications = require("./Notifications.js");

var UserBar = React.createClass({
  handleBookmarkClick: function() {
    console.log("bookmarking");
  },
  /*jshint ignore:start */
  render: function() {
    return (
      <div className="UserBar">
        <Notifications />
        <span className="icon icon_bookmark" onClick={this.handleBookmarkClick}></span>
        <Link href="/history"><span className="icon icon_history"></span></Link>
        <UserDropdown user={this.props.user} />
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = UserBar;