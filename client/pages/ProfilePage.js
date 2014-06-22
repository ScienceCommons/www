/** @jsx m */

"use strict";
require("./ProfilePage.scss");

var OnUnload = require("../utils/OnUnload.js");
var Layout = require("../layouts/DefaultLayout.js");

var _ = require("underscore");

var ProfilePage = {};

ProfilePage.controller = function(options) {
  options = _.extend({id: "ProfilePage"}, options);
  this.controllers.layout= new Layout.controller(options);
  this.user = options.user;
};

ProfilePage.detailsView = function(user) {
  var areasOfStudy = _.map(user.get("areas_of_study"), function(area) {
    return <div className="section">{area}</div>;
  });

  return (
    <div className="details">
      <button type="button" className="editOrFollow">{user.get("id") === CS.user.id ? "Settings": "Follow"}</button>
      <h1 className="h1 section">{user.get("fullName")}</h1>
      <div className="section">
        <div className="col span_1_of_2">
          <h3>About</h3>
          {user.get("about")}
        </div>
        <div className="col span_1_of_2">
          <div className="areasOfStudy">
            <h3>Areas of Study</h3>
            {areasOfStudy}
          </div>

          <div className="contacts">
            <h3>Contact</h3>

            <div className="section">
              <span className="icon icon_twitter"></span>
              <a href={user.get("twitterUrl")}>{user.get("twitter")}</a>
            </div>

            <div className="section">
              <span className="icon icon_facebook"></span>
              <a href={user.get("facebookUrl")}>{user.get("facebook")}</a>
            </div>

            <div className="section">
              <span className="icon icon_mail"></span>
              <a href={"mailto:" + user.get("email")}>{user.get("email")}</a>
            </div>

            <div className="section">
              <span className="icon icon_comment"></span>
              Send a message
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProfilePage.articlesView = function(user) {
  var content;
  if (user.get("articles").length === 0) {
    content = (
      <p>
        You have no articles. You can link articles by searching for them and then requesting to be linked.
      </p>
    );
  } else {
    var list = _.map(user.get("articles"), function(article) {
      return <li>{article.title}</li>
    });
    content = <ul>{list}</ul>;
  }

  return (
    <div className="articles">
      <h3>Articles</h3>
      {content}
    </div>
  );
};

ProfilePage.recentContributionsView = function(user) {
  var content;
  if (user.get("comments").length === 0) {
    content = (
      <p>
        You have no comments.
      </p>
    );
  } else {
    var list = _.map(user.get("comments"), function(comment) {
      return <li>{comment.body}</li>
    });
    content = <ul>{list}</ul>;
  }

  return (
    <div className="recentContributions">
      <h3>Recent Contributions</h3>
      {content}
    </div>
  );
};

ProfilePage.view = function(ctrl) {
  var user = ctrl.user;

  var content = (
    <div className="section">
      <div className="col span_1_of_2">
        {ProfilePage.detailsView(ctrl.user)}
        {ProfilePage.articlesView(ctrl.user)}
      </div>
      <div className="col span_1_of_2">
        {ProfilePage.recentContributionsView(ctrl.user)}
      </div>
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = ProfilePage;
