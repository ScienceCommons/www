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
  document.title = "Curate Science";
};

DefaultLayout.view = function(ctrl, content) {
  return (
    <div id={ctrl.id} className="page DefaultLayout">
      <header>
        <table className="banner">
          <tbody>
            <tr>
              <td className="logo_td"><a href="/" config={m.route} className="logoLink">{new Logo.view()}</a></td>
              <td>{new Search.view(ctrl.controllers.search)}</td>
              <td className="user_bar_td">{new UserBar.view(ctrl.controllers.userBar)}</td>
            </tr>
          </tbody>
        </table>
      </header>

      <div className="content">{content}</div>
    </div>
  );
};

module.exports = DefaultLayout;
