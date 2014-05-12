/** @jsx m */

"use strict";
require("./CommentBox.scss");

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

        {replies}
      </div>
    </div>
  );
};

var CommentList = {};

CommentList.view = function(ctrl) {
  var comments = _.map(ctrl.comments, function(comment) {
    return new Comment.view({comment: comment});
  });

  return (
    <div className="CommentList">
      {comments}
    </div>
  );
};

var CommentForm = {};

CommentForm.controller = function(options) {
  this.body = m.prop("");
  this.anonymous = m.prop(false);
  this.user = options.user;

  var _this = this;
  this.handleSubmit = function(e) {
    e.preventDefault();
    console.log("submitted", _this);
  };
};

CommentForm.view = function(ctrl) {
  return (
    <form className="CommentForm" onSubmit={ctrl.handleSubmit}>
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
  this.commentFormController = new CommentForm.controller({user: options.user});
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