/** @jsx m */

"use strict";

var _ = require("underscore");
var vagueTime = require("vague-time/lib/vagueTime-en");

var CurateBaseModel = require("./CurateBaseModel.js");

var CommentModel = CurateBaseModel.extend({
  relations: {
    comments: {type: "many", urlAction: "comments"} // model is defined below
  },
  defaults: {
    "owner_id": "",
    "comment": "",
    "anonymous": false
    // ts
  },
  computeds: {
    authorName: function() {
      if (this.get("anonymous") || !this.get("author")) {
        return "Anonymous";
      } else {
        return this.get("author").get("fullName");
      }
    },
    date: function() {
      if (this.get("created_at")) {
        return new Date(this.get("created_at"));
      }
    },
    timeAgo: function() {
      var date = this.get("date");
      if (date) {
        return vagueTime.get({ to: date });
      }
    },
    image: function() {
      if (this.get("anonymous")) {
        return <span className="icon icon_person"></span>;
      } else {
        var author = this.get("author");
        if (author && author.get("image")) {
          return author.get("image");
        }
      }
      return <span className="icon icon_person"></span>;
    }
  },
  urlRoot: "https://www.curatescience.org/comments"
});

CommentModel.prototype.relations.comments.model = CommentModel; // had to do this because of self reference

module.exports = CommentModel;
