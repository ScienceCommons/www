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
  urlRoot: "https://www.curatescience.org/links",
  defaults: {
    name: "",
    url: ""
  }
});


module.exports = LinkModel;
