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
};

LoginPage.view = function(ctrl) {
  var content = (
    <div>
      <a href="/auth/google_oauth2">
        <div className="Y3d isa Ndb" title="Sign in with Google" role="button" tabindex="0">
          <div className="Ega"></div>
          <div className="tLb">Sign in</div>
        </div>
      </a>
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = LoginPage;
