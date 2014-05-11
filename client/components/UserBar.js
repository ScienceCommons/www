/** @jsx m */

"use strict";
require("./UserBar.scss");

var Notifications = require("./Notifications.js");
var Dropdown = require("./Dropdown.js");

var UserBar = {};

UserBar.controller = function(options) {
  this.user = options.user;

  if (this.user) {
    this.dropdownController = new Dropdown.controller({
      className: "user",
      label: <img src={this.user.get("gravatarUrl")} />
    });

    this.notificationsController = new Notifications.controller({
      notifications: this.user.get("notifications")
    });

    var _this = this;
    this.handleBookmarkClick = function() {
      console.log("bookmarking");
    };
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
      <li>{new Notifications.view(ctrl.notificationsController)}</li>
      <li><span className="icon icon_bookmark" onclick={ctrl.handleBookmarkClick}></span></li>
      <li><a href="/history" className="history" config={m.route}><span className="icon icon_history"></span></a></li>
      <li>{new Dropdown.view(ctrl.dropdownController, dropdownContent)}</li>
    </ul>
  );
};

module.exports = UserBar;