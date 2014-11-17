"use strict";

var _ = require("underscore");
var CurateBaseModel = require("./CurateBaseModel.js");

var BookmarkModel = CurateBaseModel.extend({
  name: "Bookmark",
  relations: {
    "bookmarkable": {type: "one", model: require("./ArticleModel.js")}
  }
});

module.exports = BookmarkModel;
