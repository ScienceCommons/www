/** @jsx m */

"use strict";

var Layout = require("../layouts/DefaultLayout.js");

var ProfilePage = {};

ProfilePage.controller = function(options) {
  options = _.extend({id: "ProfilePage"}, options);
  this.layoutController = new Layout.controller(options);
};

ProfilePage.view = function(ctrl) {
  var user = ctrl.user.cortex;
  var articlesContent;
  if (user.articles.count() === 0) {
    articlesContent = (
      <p>
        You have no articles. You can link articles by searching for them and then requesting to be linked.
      </p>
    );
  } else {
    var list = user.articles.map(function(article) {
      return <li>{article.title.val()}</li>
    });
    articlesContent = <ul>{list}</ul>;
  }

  var commentsContent;
  if (user.comments.count() === 0) {
    commentsContent = (
      <p>
        You have no comments.
      </p>
    );
  } else {
    var list = user.comments.map(function(comment) {
      return <li>{comment.body.val()}</li>
    });
    commentsContent = <ul>{list}</ul>;
  }

  var content = (
    <div>
      <h1 className="h1">{[user.first_name.val(), user.middle_name.val(), user.last_name.val()].join(" ")} ({user.email.val()})</h1>

      <h3>Articles</h3>
      {articlesContent}
      
      <h3>Comments</h3>
      {commentsContent}
    </div>
  );

  return new Layout.view(ctrl.layoutController, content);
};

module.exports = ProfilePage;
