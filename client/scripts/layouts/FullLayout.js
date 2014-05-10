/** @jsx m */

"use strict";
require("./FullLayout.scss");

var UserBar = require("../components/UserBar.js");
var Logo = require("../components/Logo.js");

var FullLayout = {};

FullLayout.controller = function(options) {
  options = options || {};
  this.id = options.id;
  this.userBarController = new UserBar.controller({user: options.user})
};

FullLayout.view = function(ctrl, content) {
  if (ctrl.user) {
    var userBar = new UserBar.view(ctrl.userBarController);
  }

  return (
    <div id={ctrl.id} className="page FullLayout">
      <header className="PageHeader">
        {userBar}
        {ctrl.header}
      </header>

      <div className="text_center">
        {new Logo.view()}
        {content}
      </div>
    </div>
  );
};

module.exports = FullLayout;
