/** @jsx m */

"use strict";
require("./CommentBox.scss");

var m = require("mithril");
var _ = require("underscore");

var CommentForm = require("./CommentForm.js");

var Comment = {};

Comment.view = function(ctrl) {
  var comment = ctrl.comment;
  if (!_.isEmpty(comment.get("replies"))) {
    var replies = new CommentList.view({comments: comment.get("replies")});
  }

  return (
    <div className="Comment">
      {comment.get("image")}
      <div className="commentContent">
        <h5>{comment.get("authorName")} - {comment.get("timeAgo")}</h5>
        <p>{comment.get("body")}</p>
        <label onclick={ctrl.reply}><span className="icon icon_reply"></span> Reply</label>

        {replies}
      </div>
    </div>
  );
};

var CommentList = {};

CommentList.view = function(ctrl) {
  var comments = ctrl.comments.map(function(comment) {
    return new Comment.view({comment: comment, reply: function() { alert("reply clicked"); }});
  });

  return (
    <div className="CommentList">
      {comments}
    </div>
  );
};

var CommentBox = {};

CommentBox.controller = function(options) {
  this.comments = options.comments;
  this.commentFormController = new CommentForm.controller({user: options.user, comments: this.comments});
  this.interval = setInterval(m.redraw, 60000); // redraw every minute for time-stamps
  var _this = this;
  this.onunload = function() {
    clearInterval(_this.interval);
  };
};

CommentBox.view = function(ctrl) {
  return (
    <div className="CommentBox">
      {new CommentForm.view(ctrl.commentFormController)}
      {new CommentList.view({comments: ctrl.comments})}
    </div>
  );
};

module.exports = CommentBox;
