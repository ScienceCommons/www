/** @jsx m */

"use strict";

var _ = require("underscore");
var m = require("mithril");

var OnUnload = require("../utils/OnUnload.js");
var Layout = require("../layouts/DefaultLayout.js");
var Spinner = require("../components/Spinner.js");
var UserModel = require("../models/UserModel.js");

var AuthorPage = {};

AuthorPage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "AuthorPage"}, options);
  this.controllers.layout = new Layout.controller(options);
  this.loading = m.prop(true);
  this.author = new UserModel({id: options.authorId}, {callback: m.redraw, loading: true})
};

AuthorPage.view = function(ctrl) {
  var loading = ctrl.author.loading;
  var author = ctrl.author.cortex;
  var content;

  if (loading) {
    content = new Spinner.view();
  } else if (author) {
    content = (
      <div>
        <h1 className="h1">{author.name.val()}</h1>
      </div>
    );
  } else {
    content = <h1>Author not found</h1>
  }

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = AuthorPage;
