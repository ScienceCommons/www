/** @jsx m */

"use strict";
require("./AdminPage.scss");

var _ = require("underscore");
var m = require("mithril");

var Layout = require("../layouts/DefaultLayout.js");
var OnUnload = require("../utils/OnUnload.js");
var UserCollection = require("../collections/UserCollection.js");

var AdminPage = {};

AdminPage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "AdminPage"}, options);
  this.controllers.layout = new Layout.controller(options);

  this.query = m.prop("");
  this.users = new UserCollection([]);

  var _this = this;
  this.handleSubmit = function(e) {
    e.preventDefault();
    _this.users.search({query: _this.query()});
  };
};

AdminPage.view = function(ctrl) {
  var results;
  if (ctrl.query() && ctrl.users.query === ctrl.query()) {
    if (ctrl.users.loading) {
      results = "Searching...";
    } else if (ctrl.users.error) {
      results = "Error: " + ctrl.users.error;
    } else if(ctrl.users.length > 0) {
      var list = ctrl.users.map(function(user) {
        return <li>{user.get("name")}</li>;
      });
      results = <ul>{list}</ul>;
    }
  }

  var content = (
    <div>
      <h1>Administration</h1>

      <h3>Find users</h3>
      <form onsubmit={ctrl.handleSubmit}>
        <input type="text" value={ctrl.query()} oninput={m.withAttr("value", ctrl.query)} />
      </form>
      {results}
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = AdminPage;

