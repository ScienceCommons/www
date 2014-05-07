/**
 * @jsx React.DOM
 */

"use strict";

var _ = require("underscore");
var React = require("react/addons");

require("../../styles/components/CommentBox.scss");

var Comment = React.createClass({
  /*jshint ignore:start */
  render: function() {
    var comment = this.props.comment;
    if (comment.replies && !_.isEmpty(comment.replies.val())) {
      var replies = <CommentList comments={comment.replies} />;
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
  }
  /*jshint ignore:end */
});

var CommentList = React.createClass({
  /*jshint ignore:start */
  render: function() {
    var comments = this.props.comments.map(function(comment) {
      return <Comment comment={comment} />
    });

    return (
      <div className="CommentList">
        {comments}
      </div>
    );
  }
  /*jshint ignore:end */
});

var CommentForm = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      body: "",
      title: "",
      anonymous: false
    };
  },
  handleSubmit: function() {
    var _this = this;

    return function(e) {
      e.preventDefault();
      console.log("submitted", _this.state);
    };
  },
  /*jshint ignore:start */
  render: function() {
    return (
      <form className="CommentForm" onSubmit={this.handleSubmit()}>
        <input placeholder="title" type="text" valueLink={this.linkState("title")} />
        <textarea valueLink={this.linkState("body")} />
        <label><input type="checkbox" checkedLink={this.linkState("anonymous")} /> Make anonymous</label>
        <input type="submit">Post</input>
      </form>
    );
  }
  /*jshint ignore:end */
});

var CommentBox = React.createClass({
  getDefaultProps: function() {
    return {
      comments: []
    };
  },
  /*jshint ignore:start */
  render: function() {
    return (
      <div className="CommentBox">
        <CommentForm />
        <CommentList comments={this.props.comments} />
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = CommentBox;