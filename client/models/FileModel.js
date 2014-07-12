/** @jsx m */

"use strict";

var CurateBaseModel = require("./CurateBaseModel.js");
var CommentModel = require("./CommentModel.js");

var FileModel = CurateBaseModel.extend({
  comments: {type: "many", model: CommentModel}
});


module.exports = FileModel;
