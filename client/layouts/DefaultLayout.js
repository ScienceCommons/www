/** @jsx m */

"use strict";
require("./DefaultLayout.scss");

var m = require("mithril");

var OnUnload = require("../utils/OnUnload.js");
var Search = require("../components/Search.js");
var UserBar = require("../components/UserBar.js");
var Logo = require("../components/Logo.js");

var DefaultLayout = {};

DefaultLayout.controller = function(options) {
  options = options || {};
  this.id = options.id;
  OnUnload(this);

  this.controllers.userBar = new UserBar.controller({user: options.user});
  this.controllers.search = new Search.controller({query: m.route.param("query")});
};

DefaultLayout.view = function(ctrl, content) {
  return (
    <div id={ctrl.id} className="page DefaultLayout">
      <header>
        <div className="banner">
          {new UserBar.view(ctrl.controllers.userBar)}
          <a href="/" config={m.route} className="logoLink">{new Logo.view()}</a>
        </div>
        {new Search.view(ctrl.controllers.search)}
      </header>

      <div className="content">{content}</div>
    </div>
  );
};

module.exports = DefaultLayout;
