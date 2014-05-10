/** @jsx m */

"use strict";
require("./CommentBox.scss");

var m = require("mithril");
var _ = require("underscore");

var Comment = {};

Comment.view = function(ctrl) {
  var comment = ctrl.comment;
  if (comment.replies && !_.isEmpty(comment.replies.val())) {
    var replies = new CommentList.view({comments: comment.replies});
  }

  return (
    <div className="Comment">
      <h3 key="author">{comment.author.val()}</h3>
      <h6 key="date">{comment.date.val()}</h6>
      <h3 key="title">{comment.title.val()}</h3>
      <p key="body">{comment.body.val()}</p>
      {replies}
    </div>
  );
};

var CommentList = {};

CommentList.view = function(ctrl) {
  var comments = ctrl.comments.map(function(comment) {
    return new Comment.view({comment: comment});
  });

  return (
    <div className="CommentList">
      {comments}
    </div>
  );
};

var CommentForm = {};

CommentForm.controller = function() {
  this.title = m.prop("");
  this.body = m.prop("");
  this.anonymous = m.prop(false);

  var _this = this;
  this.handleSubmit = function(e) {
    e.preventDefault();
    console.log("submitted", _this);
  };
};

CommentForm.view = function(ctrl) {
  return (
    <form className="CommentForm" onSubmit={ctrl.handleSubmit}>
      <input placeholder="title" type="text" value={ctrl.title()} oninput={m.withAttr("value", ctrl.title)}/>
      <textarea value={ctrl.body()} oninput={m.withAttr("value", ctrl.body)}/>
      <label><input type="checkbox" checked={ctrl.anonymous()} onchange={m.withAttr("checked", ctrl.anonymous)} /> Make anonymous</label>
      <input type="submit">Post</input>
    </form>
  );
};

var CommentBox = {};

CommentBox.controller = function(options) {
  this.comments = options.comments;
  this.commentFormController = new CommentForm.controller();
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