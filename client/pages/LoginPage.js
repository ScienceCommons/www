/** @jsx m */

"use strict";
require("./LoginPage.scss");

var _ = require("underscore");

var OnUnload = require("../utils/OnUnload.js");
var Layout = require("../layouts/FullLayout.js");

var LoginPage = {};

LoginPage.controller = function(options) {
  OnUnload(this);
  this.controllers.layout = new Layout.controller(_.extend({id: "LoginPage"}, options));

  this.email = m.prop("");
  this.password = m.prop("");

  var _this = this;
  this.login = function(e) {
    e.preventDefault();
    if (_this.email() === "stephen@curatescience.org" && _this.password() === "rabbitears") {
      CS.user = {};
      m.route("/");
    }
  };
};

LoginPage.view = function(ctrl) {
  var content = (
    <div>
      <form onsubmit={ctrl.login}>
        <input type="text" size="30" placeholder="Email" value={ctrl.email()} oninput={m.withAttr("value", ctrl.email)} />
        <input type="password" size="30" placeholder="Password" value={ctrl.password()} oninput={m.withAttr("value", ctrl.password)} />
        <input className="btn" type="submit" value="Log in" />
      </form>
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = LoginPage;
