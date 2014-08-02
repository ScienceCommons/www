/** @jsx m */

"use strict";

var _ = require("underscore");

var CurateBaseModel = require("./CurateBaseModel.js");
var CommentModel = require("./CommentModel.js");

var FileModel = CurateBaseModel.extend({
  relations: {
    comments: {type: "many", model: CommentModel, urlAction: "comments"},
  },
  initialize: function() {
    if (!this.get("id")) {
      this.set("id", _.uniqueId());
    }
  },
  urlRoot: "/files",
  defaults: {
    name: "",
    url: "",
    comments: [
      {comment: "This file has a comment"},
      {comment: "This file has a second comment"}
    ]
  }
});


module.exports = FileModel;
