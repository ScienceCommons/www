/** @jsx m */

"use strict";

var BaseModel = require("./BaseModel.js");

var CommentModel = BaseModel.extend({
  relations: {
    replies: {type: "many"} // model is defined below
  },
  defaults: {
    "userId": "",
    "body": "",
    "anonymous": false
  },
  computeds: {
    authorName: function() {
      if (this.get("anonymous")) {
        return "Anonymous";
      } else {
        return this.get("author").get("fullName");
      }
    },
    image: function() {
      if (this.get("anonymous")) {
        return <span className="icon icon_person"></span>;
      } else {
        return this.get("author").get("image");
      }
    }
  }
});

CommentModel.prototype.relations.replies.model = CommentModel; // had to do this because of self reference

module.exports = CommentModel;