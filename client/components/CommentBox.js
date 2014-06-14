/** @jsx m */

"use strict";
require("./CommentBox.scss");

var DropdownSelect = require("./DropdownSelect.js");

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

var CommentForm = {};

CommentForm.controller = function(options) {
  CommentForm.reset(this);
  this.user = options.user;
  this.comments = options.comments;


  this.dropdownSelectController = new DropdownSelect.controller({
    options: [
      {value: false, content: <img src={this.user.get("gravatarUrl")} className="userImage" />},
      {value: true, content: <div className="userImage"><span className="icon icon_person"></span></div>}
    ],
    value: this.anonymous,
    onchange: this.anonymous
  });

  var _this = this;

  this.handleSubmit = function(e) {
    e.preventDefault();
    _this.comments.add({
      "author": _this.user,
      "date": "4-1-2014",
      "body": _this.body(),
      "anonymous": _this.anonymous()
    });
    CommentForm.reset(_this);
  };

  this.handleInput = function() {
    _this.body(this.value);
    CommentForm.autosize(this);
  };
};

CommentForm.autosize = function(el) {
  el.style.height = "auto";
  el.style.height = el.scrollHeight+'px';
};

CommentForm.reset = function(ctrl) {
  ctrl.body = m.prop("");
  ctrl.anonymous = m.prop(false);
};

CommentForm.view = function(ctrl) {
  return (
    <form className="CommentForm" onsubmit={ctrl.handleSubmit}>
      <button type="submit" className="btn post">Post</button>

      <div className="commentWrapper">
        {new DropdownSelect.view(ctrl.dropdownSelectController)}
        <div className="textareaWrapper">
          <textarea value={ctrl.body()} oninput={ctrl.handleInput} placeholder="Add a comment"/>
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
