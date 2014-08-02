/** @jsx m */

"use strict";
require("./CommentBox.scss");

var m = require("mithril");
var _ = require("underscore");

var CommentList = require("./CommentList.js");
var CommentForm = require("./CommentForm.js");

var CommentBox = {};

CommentBox.controller = function(options) {
  this.user = options.user;
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
      {new CommentList.view({comments: ctrl.comments, user: ctrl.user, reply: true})}
    </div>
  );
};

module.exports = CommentBox;
