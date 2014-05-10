/** @jsx m */

"use strict";
require("./PageHeader.scss");

var m = require("mithril");

var Search = require("./Search.js");
var UserBar = require("./UserBar.js");
var Logo = require("./Logo.js");


var PageHeader = {};

PageHeader.controller = function(options) {
  options = options || {};
  this.userBarController = new UserBar.controller({user: options.user})
  this.searchController = new Search.controller();
};

PageHeader.view = function(ctrl) {
  if (ctrl.user) {
    var userBar = new UserBar.view(ctrl.userBarController);
  }

  return (
    <header className="PageHeader">
      {userBar}
      <a href="/" config={m.route} className="logoLink">{new Logo.view()}</a>
      {new Search.view(ctrl.searchController)}
    </header>
  );
};

module.exports = PageHeader;
