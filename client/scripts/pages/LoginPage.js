/** @jsx m */

"use strict";
require("./LoginPage.scss");

var Layout = require("../layouts/FullLayout.js");

var LoginPage = {};

LoginPage.controller = function(options) {
  options = _.extend({id: "LoginPage"}, options);
  this.layoutController = new Layout.controller(options);

  this.email = m.prop("");
  this.password = m.prop("");

  var _this = this;
  this.login = function(e) {
    e.preventDefault();
    console.log("login submit", _this);
  };
};

LoginPage.view = function(ctrl) {
  var content = (
    <div>
      <form onSubmit={ctrl.login}>
        <input type="text" size="30" placeholder="Email" value={ctrl.email()} oninput={m.withAttr("value", ctrl.email)} />
        <input type="password" size="30" placeholder="Password" value={ctrl.password()} oninput={m.withAttr("value", ctrl.password)} />
        <input className="btn" type="submit" value="Log in" />
      </form>
    </div>
  );

  return new Layout.view(ctrl.layoutController, content);
};

module.exports = LoginPage;
