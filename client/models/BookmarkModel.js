"use strict";

var _ = require("underscore");
var CurateBaseModel = require("./CurateBaseModel.js");

var BookmarkModel = CurateBaseModel.extend({
  name: "Bookmark"
});

module.exports = BookmarkModel;
