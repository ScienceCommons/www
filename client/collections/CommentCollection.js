"use strict";

var CurateBaseCollection = require("./CurateBaseCollection.js");

var CommentCollection = CurateBaseCollection.extend({
  model: require("../models/CommentModel.js")/*,
  url: function() {
    var url = "https://www.curatescience.org/" + this.commentableType + "/" + this.commentableID + "/comments";
    if (this.field) {
      url = url + "/" + this.field;
    }
    return url;
  }
  */
});

module.exports = CommentCollection;
