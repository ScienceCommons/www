/** @jsx m */

"use strict";
require("./UserBar.scss");

var _ = require("underscore");

var OnUnload = require("../utils/OnUnload.js");
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
  }
};

UserBar.view = function(ctrl) {
  var user = ctrl.user;
  if (!user) {
    return <ul className="UserBar"/>;
  }

  if (user.canEdit()) {
    var extras = [
      <li className="separator"></li>,
      <li onclick={route("/articles/new")}>Add an article</li>
    ];
  }

  var dropdownContent = (
    <ul>
      <li onclick={route("/profile")}>Profile</li>
      <li onclick={route("/bookmarks")}>Bookmarks</li>
      <li onclick={route("/logout")}>Log out</li>
      {extras}
    </ul>
  );

  return (
    <ul className="UserBar">
      <li>{new Dropdown.view(ctrl.controllers.dropdown, dropdownContent)}</li>
    </ul>
  );
};

function route(path) {
  return function(e) {
    return m.route(path);
  };
};

module.exports = UserBar;
