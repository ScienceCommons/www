/** @jsx m */

"use strict";

var BaseModel = require("./BaseModel.js");

var CommentModel = BaseModel.extend({
  relations: {
    replies: {type: "many"} // model is defined below
  },
  defaults: {
    "author": "",
    "userId": "",
    "body": "",
    "gravatar": "8c51e26145bc08bb6f43bead1b5ad07f.png", // me
    "anonymous": false
  },
  computeds: {
    image: function() {
      var gravatar = this.get("gravatar");

      if (this.get("anonymous") === false && gravatar) {
        return <img src={"//www.gravatar.com/avatar/" + gravatar} className="commentImage"/>;
      } else {
        return <span className="icon icon_person commentImage"></span>;
      }
    }
  }
});

CommentModel.prototype.relations.replies.model = CommentModel; // had to do this because of self reference

module.exports = CommentModel;