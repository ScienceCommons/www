/** @jsx m */

"use strict";
require("./FullLayout.scss");

var m = require("mithril");

var UserBar = require("../components/UserBar.js");
var Logo = require("../components/Logo.js");

var FullLayout = {};

FullLayout.controller = function(options) {
  options = options || {};
  this.id = options.id;
  this.header = options.header;
  this.userBarController = new UserBar.controller({user: options.user})
};

FullLayout.view = function(ctrl, content) {
  return (
    <div id={ctrl.id} className="page FullLayout">
      <header>
        {new UserBar.view(ctrl.userBarController)}
        {ctrl.header}
        <a href="/" config={m.route} className="logo">{new Logo.view()}</a>
      </header>

      <div className="text_center">
        {content}
      </div>
    </div>
  );
};

module.exports = FullLayout;
