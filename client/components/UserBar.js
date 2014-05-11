/** @jsx m */

"use strict";
require("./UserBar.scss");

var Notifications = require("./Notifications.js");
var Dropdown = require("./Dropdown.js");

var UserBar = {};

UserBar.controller = function(options) {
  this.user = options.user;

  this.dropdownController = new Dropdown.controller({
    className: "user",
    label: "User"
  });

  this.notificationsController = new Notifications.controller({
    notifications: this.user.get("notifications")
  });

  var _this = this;
  this.handleBookmarkClick = function() {
    console.log("bookmarking");
  };
};

UserBar.view = function(ctrl) {
  var user = ctrl.user.cortex;
  if (!user.loading.val()) {
    //var image = <img src={ctrl.user.imageUrl()} />;
    var dropdownContent = (
      <ul>
        <li><a href="/profile" config={m.route}>Profile</a></li>
        <li><a href="/saved" config={m.route}>Saved searches</a></li>
        <li><a href="/logout" config={m.route}>Log out</a></li>
      </ul>
    );
  }

  return (
    <div className="UserBar">
      {new Notifications.view(ctrl.notificationsController)}
      <span className="icon icon_bookmark" onClick={ctrl.handleBookmarkClick}></span>
      <a href="/history" className="history" config={m.route}><span className="icon icon_history"></span></a>
      {new Dropdown.view(ctrl.dropdownController, dropdownContent)}
    </div>
  );
};

module.exports = UserBar;