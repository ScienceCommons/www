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
        <a href="/auth/google_oauth2">
          <div className="Y3d isa Ndb" title="Sign in with Google" role="button" tabindex="0">
            <div className="Ega"></div>
            <div className="tLb">Sign in</div>
          </div>
        </a>
      </div>
      <h3>or</h3>
      <div>
        <h3>Register for an invite</h3>
        <form action="http://christianbattista.us7.list-manage.com/subscribe/post?u=d140eca9cfe4a96473dac6ea5&amp;id=fba08af7dd" method="post" target="_blank">
          <input type="email" value="" ref="email" name="EMAIL" placeholder="Enter email address" size="30" required />
          <div style={{"position": "absolute", "left": "-5000px"}}>
            <input type="text" name="b_d140eca9cfe4a96473dac6ea5_fba08af7dd" value="" />
          </div>
          <button type="submit" className="btn">Request invite</button>
        </form>
      </div>
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = LoginPage;
