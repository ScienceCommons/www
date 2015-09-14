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
      <div class="login-buttons">
        <h3>Please use one of your social networking accounts to log into Curate Science:</h3>
        <a href="/auth/google_oauth2">
          <div className="Y3d isa Ndb" title="Login with Google+" role="button" tabindex="0">
            <div className="Ega"></div>
            <div className="tLb">Login with Google+</div>
          </div>
        </a>
      </div>
      <div>
        <h3>For news and updates about Curate Science, please sign up for our email newsletter below:</h3>
        <form action="http://curatescience.us8.list-manage.com/subscribe/post?u=0833383918fc50773891d363a&amp;id=aaad5734e3" method="post" target="_blank">
          <input type="email" ref="email" name="EMAIL" placeholder="Enter email address" size="30" required />
          <div style={{"position": "absolute", "left": "-5000px"}}>
            <input type="text" name="b_d140eca9cfe4a96473dac6ea5_fba08af7dd" value="" />
          </div>
          <button type="submit" className="btn">Sign Up</button>
        </form>
      </div>
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = LoginPage;
