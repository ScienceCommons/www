/** @jsx m */

"use strict";

var _ = require("underscore");

var CurateBaseModel = require("./CurateBaseModel.js");
var CommentModel = require("./CommentModel.js");

var FileModel = CurateBaseModel.extend({
  comments: {type: "many", model: CommentModel},
  initialize: function() {
    if (!this.get("id")) {
      this.set("id", _.uniqueId());
    }
  }
});


module.exports = FileModel;
