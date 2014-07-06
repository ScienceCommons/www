/** @jsx m */

"use strict";
require("./BookmarksPage.scss");

var _ = require("underscore");
var Layout = require("../layouts/DefaultLayout.js");
var OnUnload = require("../utils/OnUnload.js");

var BookmarksPage = {};

BookmarksPage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "BookmarksPage"}, options);
  this.user = options.user;
  this.controllers.layout = new Layout.controller(options);
};

BookmarksPage.view = function(ctrl) {
  var content;
  var bookmarks = ctrl.user.get("bookmarks");

  if (bookmarks.length > 0) {
    var list = _.map(ctrl.user.get("bookmarks"), function(bookmark) {
      return <li>{bookmark}</li>;
    });

    content = (
      <div>
        <h1>Bookmarks</h1>
        <ul>
          {list}
        </ul>
      </div>
    );
  } else {
    content = (
      <div>
        <h1>Bookmarks</h1>
        <p>You don't have any bookmarks</p>
      </div>
    );
  }

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = BookmarksPage;
