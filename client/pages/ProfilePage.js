/** @jsx m */

"use strict";

var Layout = require("../layouts/DefaultLayout.js");

var _ = require("underscore");

var ProfilePage = {};

ProfilePage.controller = function(options) {
  options = _.extend({id: "ProfilePage"}, options);
  this.layoutController = new Layout.controller(options);
  this.user = options.user;
};

ProfilePage.view = function(ctrl) {
  var user = ctrl.user;
  var articlesContent;
  if (user.get("articles").length === 0) {
    articlesContent = (
      <p>
        You have no articles. You can link articles by searching for them and then requesting to be linked.
      </p>
    );
  } else {
    var list = _.map(user.get("articles"), function(article) {
      return <li>{article.title}</li>
    });
    articlesContent = <ul>{list}</ul>;
  }

  var commentsContent;
  if (user.get("comments").length === 0) {
    commentsContent = (
      <p>
        You have no comments.
      </p>
    );
  } else {
    var list = _.map(user.get("comments"), function(comment) {
      return <li>{comment.body}</li>
    });
    commentsContent = <ul>{list}</ul>;
  }

  var content = (
    <div>
      <h1 className="h1">{[user.get("first_name"), user.get("middle_name"), user.get("last_name")].join(" ")} ({user.get("email")})</h1>

      <h3>Articles</h3>
      {articlesContent}
      
      <h3>Comments</h3>
      {commentsContent}
    </div>
  );

  return new Layout.view(ctrl.layoutController, content);
};

module.exports = ProfilePage;
