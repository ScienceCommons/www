/** @jsx m */

"use strict";

var _ = require("underscore");

var CurateBaseModel = require("./CurateBaseModel.js");
var CommentModel = require("./CommentModel.js");

var LinkModel = CurateBaseModel.extend({
  name: "Link",
  relations: {
    comments: {type: "many", model: CommentModel, urlAction: "comments"},
  },
  urlRoot: "/links",
  defaults: {
    name: "",
    url: "",
    comments: [
      {comment: "This link has a comment"},
      {comment: "This link has a second comment"}
    ]
  }
});


module.exports = LinkModel;
