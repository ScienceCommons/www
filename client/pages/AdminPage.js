/** @jsx m */

"use strict";
require("./AdminPage.scss");

var _ = require("underscore");
var m = require("mithril");

var Layout = require("../layouts/DefaultLayout.js");
var OnUnload = require("../utils/OnUnload.js");
var UserCollection = require("../collections/UserCollection.js");
var Spinner = require("../components/Spinner.js");

var AdminPage = {};

AdminPage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "AdminPage"}, options);
  this.user = options.user;
  this.controllers.layout = new Layout.controller(options);

  this.query = m.prop("");
  this.admins = new UserCollection([]);
  this.admins.fetchAdmins();
  this.users = new UserCollection([]);

  var _this = this;
  this.findUser = function(e) {
    e.preventDefault();
    _this.users.search({query: _this.query()});
  };
  this.addUser = function(e) {
    e.preventDefault();
  };
};

AdminPage.view = function(ctrl) {
  var searchResults;
  if (ctrl.query()) {
    if (ctrl.users.loading) {
      searchResults = Spinner.view();
    } else if (ctrl.query() === ctrl.users.query) {
      if (ctrl.users.error) {
        searchResults = "Error: " + ctrl.users.error;
      } else if(ctrl.users.length > 0) {
        searchResults = userActionTable(ctrl, ctrl.users);
      }
    }
  }

  var content = (
    <div>
      <h1>Administration</h1>

      <h3>Current admins</h3>
      {userActionTable(ctrl, ctrl.admins)}

      <h3>Find users</h3>
      <form onsubmit={ctrl.findUser}>
        <input type="text" value={ctrl.query()} oninput={m.withAttr("value", ctrl.query)} />
      </form>
      <div className="results">
        {searchResults}
      </div>

      <h3>Add a user</h3>
      <form onsubmit={ctrl.addUser}>
        <input type="text" placeholder="Name"/>
        <input type="email" placeholder="Email"/>
        <button type="submit">Add</button>
      </form>
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

// helpers

var toggleAdmin = function(user) {
  return function(e) {
    user.toggleAdmin();
  };
};

var userActionTable = function(ctrl, users) {
  var rows = users.map(function(user) {
    var isAdmin = user.get("admin");
    return <tr>
      <td>{user.get("name")}</td>
      <td>{user.get("email")}</td>
      <td>{isAdmin ? "Yes" : "No"}</td>
      <td><button type="button" className="btn" onclick={toggleAdmin(user)} disabled={user.get("id") === ctrl.user.get("id")}>{isAdmin ? "Revoke admin" : "Make admin"}</button></td>
    </tr>;
  });

  return <table className="userActionTable center">
    <thead><tr>
      <th>Name</th>
      <th>Email</th>
      <th>admin?</th>
      <th>Actions</th>
    </tr></thead>
    <tbody>
      {rows}
    </tbody>
  </table>;
};

module.exports = AdminPage;

