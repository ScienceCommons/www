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
      <div>
        <h3>Please use one of your social networking accounts to log into Curate Science:</h3>
        <a href="/auth/google_oauth2">
          <div className="Y3d isa Ndb" title="Login with Google+" role="button" tabindex="0">
            <div className="Ega"></div>
            <div className="tLb">Login with Google+</div>
          </div>
        </a>
      </div>
      <h3>or</h3>
      <div>
        <h3>Beta by invitation only</h3>
      </div>
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = LoginPage;
