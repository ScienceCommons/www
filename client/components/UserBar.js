/** @jsx m */

"use strict";
require("./UserBar.scss");

var _ = require("underscore");

var OnUnload = require("../utils/OnUnload.js");
var Notifications = require("./Notifications.js");
var Dropdown = require("./Dropdown.js");

var UserBar = {};

UserBar.controller = function(options) {
  OnUnload(this);
  this.user = options.user;

  if (this.user) {
    this.controllers.dropdown = new Dropdown.controller({
      className: "user",
      label: <img src={this.user.get("gravatarUrl")} />
    });

    this.controllers.notifications = new Notifications.controller({
      notifications: this.user.get("notifications")
    });
  }
};

UserBar.view = function(ctrl) {
  var user = ctrl.user;
  if (!user) {
    return <ul className="UserBar"/>;
  }

  var dropdownContent = (
    <ul>
      <li><a href="/profile" config={m.route}>Profile</a></li>
      <li><a href="/saved" config={m.route}>Saved searches</a></li>
      <li><a href="/logout" config={m.route}>Log out</a></li>
    </ul>
  );

  return (
    <ul className="UserBar">
      <li>{new Notifications.view(ctrl.controllers.notifications)}</li>
      <li><a href="/bookmarks" config={m.route}><span className="icon icon_bookmark"></span></a></li>
      <li><a href="/history" className="history" config={m.route}><span className="icon icon_history"></span></a></li>
      <li>{new Dropdown.view(ctrl.controllers.dropdown, dropdownContent)}</li>
    </ul>
  );
};

module.exports = UserBar;
