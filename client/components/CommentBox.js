/** @jsx m */

"use strict";
require("./CommentBox.scss");

var CommentModel = require("../models/CommentModel.js");

var m = require("mithril");
var _ = require("underscore");

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
        <h5>{comment.get("author")} - 2 days ago</h5>
        <p>{comment.get("body")}</p>
        <label onclick={ctrl.reply}><span className="icon icon_reply"></span> Reply</label>

        {replies}
      </div>
    </div>
  );
};

var CommentList = {};

CommentList.view = function(ctrl) {
  var comments = _.map(ctrl.comments, function(comment) {
    return new Comment.view({comment: comment, reply: function() { alert("reply clicked"); }});
  });

  return (
    <div className="CommentList">
      {comments}
    </div>
  );
};

var CommentForm = {};

CommentForm.controller = function(options) {
  CommentForm.reset(this);
  this.user = options.user;
  this.comments = options.comments;

  var _this = this;
  this.handleSubmit = function(e) {
    e.preventDefault();
    _this.comments.push(new CommentModel({
      "author": _this.user.get("fullName"),
      "date": "4-1-2014",
      "body": _this.body()
    }));
    CommentForm.reset(_this);
  };
};

CommentForm.reset = function(ctrl) {
  ctrl.body = m.prop("");
  ctrl.anonymous = m.prop(false);
};

CommentForm.view = function(ctrl) {
  return (
    <form className="CommentForm" onsubmit={ctrl.handleSubmit}>
      <button type="submit" className="btn">Post</button>

      <div className="commentWrapper">
        <img src={ctrl.user.get("gravatarUrl")} className="userImage" />
        <div className="textareaWrapper">
          <textarea value={ctrl.body()} oninput={m.withAttr("value", ctrl.body)} placeholder="Add a comment"/>
        </div>
      </div>
    </form>
  );
};

var CommentBox = {};

CommentBox.controller = function(options) {
  this.comments = options.comments;
  this.commentFormController = new CommentForm.controller({user: options.user, comments: this.comments});
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