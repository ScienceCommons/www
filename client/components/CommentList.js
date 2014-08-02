/** @jsx m */
"use strict";

require("./CommentList.scss");

var m = require("mithril");
var _ = require("underscore");

var Comment = {};

Comment.view = function(ctrl) {
  var comment = ctrl.comment;
  if (!_.isEmpty(comment.get("replies"))) {
    var replies = new CommentList.view({comments: comment.get("replies")});
  }
  if (comment.get("owner_id") === ctrl.user.get("id")) {
    var deleteButton = <button type="button" className="btn" onclick={ctrl.reply}>Delete</button>;
  }
  if (ctrl.reply) {
    var replyButton = <button type="button" className="btn" onclick={ctrl.reply}><span className="icon icon_reply"></span> Reply</button>;
  }

  return (
    <div className="Comment">
      <div className="commentHeader">
        {comment.get("image")}
        <h5>{comment.get("authorName")} - {comment.get("timeAgo")}</h5>
      </div>
      <div className="commentContent">
        <p>{comment.get("comment")}</p>

        <div className="btn_group">
          {replyButton}
          {deleteButton}
        </div>

        {replies}
      </div>
    </div>
  );
};

var CommentList = {};

CommentList.view = function(ctrl) {
  var comments = ctrl.comments.map(function(comment) {
    return new Comment.view({comment: comment, user: ctrl.user, reply: (ctrl.reply ? reply : false)});
  });

  return (
    <div className="CommentList">
      {comments}
    </div>
  );
};

module.exports = CommentList;

// helpers

function reply () {
  alert("reply clicked");
}
