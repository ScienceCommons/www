/** @jsx m */

"use strict";

var _ = require("underscore");
var vagueTime = require("vague-time/lib/vagueTime-en");

var BaseModel = require("./BaseData.js").Model;

var CommentModel = BaseModel.extend({
  relations: {
    replies: {type: "many"} // model is defined below
  },
  defaults: {
    "userId": "",
    "body": "",
    "anonymous": false
    // ts
  },
  initialize: function() {
    if (!this.get("ts")) {
      this.set("ts", _.now(), {silent: true});
    }
  },
  computeds: {
    authorName: function() {
      if (this.get("anonymous") || !this.get("author")) {
        return "Anonymous";
      } else {
        return this.get("author").get("fullName");
      }
    },
    timeAgo: function() {
      return vagueTime.get({
        to: this.get("ts")
      });
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
