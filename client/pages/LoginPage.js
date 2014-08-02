/** @jsx m */

"use strict";
require("./LoginPage.scss");

var _ = require("underscore");
var m = require("mithril");

var OnUnload = require("../utils/OnUnload.js");
var Layout = require("../layouts/FullLayout.js");

var LoginPage = {};

LoginPage.controller = function(options) {
  OnUnload(this);
  this.controllers.layout = new Layout.controller(_.extend({id: "LoginPage"}, options));

  this.email = m.prop("");
  this.password = m.prop("");
  this.error = m.prop(false);

  var _this = this;
  this.login = function(e) {
    e.preventDefault();

    _this.error(false);
    m.request({method: "POST", url: "https://www.curatescience.org/users/sign_in.json", data: {
      password: _this.password(),
      email: _this.email()
    }}).then(function(data) {
      console.log("logged in", data);
      CS.user = {};
      m.route("/");
    }, function(err) {
      console.log("failed to log in", err);
      _this.error("Log in failed: Wrong email and/or password");
    });
  };
};

LoginPage.view = function(ctrl) {
  if (ctrl.error()) {
    var error = <h3>{ctrl.error()}</h3>;
  }

  var content = (
    <div>
      <form onsubmit={ctrl.login}>
        <input type="text" size="30" placeholder="Email" value={ctrl.email()} oninput={m.withAttr("value", ctrl.email)} />
        <input type="password" size="30" placeholder="Password" value={ctrl.password()} oninput={m.withAttr("value", ctrl.password)} />
        <input className="btn" type="submit" value="Log in" />
      </form>
      {error}
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = LoginPage;
