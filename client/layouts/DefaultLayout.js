/** @jsx m */

"use strict";
require("./DefaultLayout.scss");

var m = require("mithril");

var Search = require("../components/Search.js");
var UserBar = require("../components/UserBar.js");
var Logo = require("../components/Logo.js");

var DefaultLayout = {};

DefaultLayout.controller = function(options) {
  options = options || {};
  this.id = options.id
  this.userBarController = new UserBar.controller({user: options.user})
  this.searchController = new Search.controller({query: m.route.param("query")});
};

DefaultLayout.view = function(ctrl, content) {
  if (ctrl.user) {
    var userBar = new UserBar.view(ctrl.userBarController);
  }

  return (
    <div id={ctrl.id} className="page DefaultLayout">
      <header>
        <div className="banner">
          {userBar}
          <a href="/" config={m.route} className="logoLink">{new Logo.view()}</a>
        </div>
        {new Search.view(ctrl.searchController)}
      </header>

      <div className="content">{content}</div>
    </div>
  );
};

module.exports = DefaultLayout;