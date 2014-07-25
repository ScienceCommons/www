/** @jsx m */

"use strict";
require("./AdminPage.scss");

var _ = require("underscore");
var m = require("mithril");

var Layout = require("../layouts/DefaultLayout.js");
var OnUnload = require("../utils/OnUnload.js");
var UserCollection = require("../collections/UserCollection.js");
var Spinner = require("../components/Spinner.js");
var User = require("../models/UserModel.js");

var AdminPage = {};

AdminPage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "AdminPage"}, options);
  this.user = options.user;
  this.controllers.layout = new Layout.controller(options);

  this.admins = new UserCollection([]);
  this.admins.fetchAdmins();
  this.betaMailList = new UserCollection([]);
  this.betaMailList.fetchBetaMailList();
  this.users = new UserCollection([]);

  this.query = m.prop("");
  this.newUserName = m.prop("");
  this.newUserEmail = m.prop("");
  this.addingUser = m.prop(false);
  this.addingUserError = m.prop(null);
  this.newUser = new User({});

  var _this = this;
  this.findUser = function(e) {
    e.preventDefault();
    _this.users.search({query: _this.query()});
  };

  this.addUser = function(e) {
    e.preventDefault();
    if (_this.addingUser()) {
      return;
    }
    _this.addingUser(true);
    _this.addingUserError(null);
    _this.newUser.save().then(function() {
      _this.addingUser(false);
      _this.newUser = new User({});
      m.redraw();
    }, function(err) {
      _this.addingUser(false);
      _this.addingUserError(err.error);
      m.redraw();
    });
  };

  this.inviteBetaUser = function(user) {
    return function(e) {
      user.save();
    };
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

  var betaRows = ctrl.betaMailList.map(function(user) {
    return <tr>
      <td>{user.get("email")}</td>
      <td>
        <button type="button" onclick={ctrl.inviteBetaUser(user)} disabled={!!user.get("id")}>
          {user.get("id") ? "Invited" : "Invite"}
        </button>
      </td>
    </tr>
  });

  var betaTable = <table className="betaMailList center">
    <tbody>
      {betaRows}
    </tbody>
  </table>;

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
        {ctrl.addingUserError()}
        <input type="text" placeholder="Name" value={ctrl.newUser.get("name")} oninput={m.withAttr("value", ctrl.newUser.setter("name"))}/>
        <input type="email" placeholder="Email" value={ctrl.newUser.get("email")} oninput={m.withAttr("value", ctrl.newUser.setter("email"))}/>
        <button type="submit" disabled={ctrl.addingUser()}>{ctrl.addingUser() ? "Adding..." : "Add"}</button>
      </form>

      <h3>Beta mail list</h3>
      {betaTable}
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

