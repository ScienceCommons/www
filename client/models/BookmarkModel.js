"use strict";

var _ = require("underscore");
var CurateBaseModel = require("./CurateBaseModel.js");

var BookmarkModel = CurateBaseModel.extend({
  name: "Bookmark",
  relations: {
    "bookmarkable": {type: "one", model: require("./ArticleModel.js")}
  },
  urlRoot: "https://www.curatescience.org/bookmarks"
});

module.exports = BookmarkModel;
