/** @jsx m */

"use strict";
require("./HomePage.scss");

var _ = require("underscore");
var m = require("mithril");

var OnUnload = require("../utils/OnUnload.js");
var Layout = require("../layouts/FullLayout.js")
var Search = require("../components/Search.js");
var Spinner = require("../components/Spinner.js");
var ArticleModel = require("../models/ArticleModel.js");
var ArticleCollection = require("../collections/ArticleCollection.js");
var Badge = require("../components/Badge.js");

var HomePage = {};

HomePage.controller = function(options) {
  OnUnload(this);
  this.controllers.layout= new Layout.controller(_.extend({
    id: "HomePage",
    header: <a href="/about" className="aboutLink" config={m.route}>What is Curate Science?</a>
  }, options));
  this.controllers.search= new Search.controller({});

  this.recentlyAddedArticles = new ArticleCollection([], {
    url: "https://www.curatescience.org/articles/recently_added"
  });
  this.recentlyAddedArticles.fetch({data: {limit: 5}});
  this.recentlyCuratedArticles = new ArticleCollection([], {
    url: "https://www.curatescience.org/articles/recent"
  });
  this.recentlyCuratedArticles.fetch({data: {limit: 5}});
};

HomePage.articleView = function(article) {
  return (
    <div className="articleView" onclick={visitArticle(article)} title={article.get("title")}>
      <div className="title">{article.get("title")}</div>
      <div className="authors">({article.get("year")}) {article.authors().etAl(3)}</div>
      <ul className="badges">
        <li title="Data &amp; Syntax">{Badge.view({badge: "data", active: article.hasBadge("data")})}</li>
        <li title="Materials">{Badge.view({badge: "materials", active: article.hasBadge("materials")})}</li>
        <li title="Registration">{Badge.view({badge: "registration", active: article.hasBadge("registration")})}</li>
        <li title="Disclosure">{Badge.view({badge: "disclosure", active: article.hasBadge("disclosure")})}</li>
      </ul>
    </div>
  );
};

HomePage.view = function(ctrl) {
  var recentlyAddedArticlesContent;
  if (ctrl.recentlyAddedArticles.loading) {
    recentlyAddedArticlesContent = Spinner.view();
  } else {
    recentlyAddedArticlesContent = ctrl.recentlyAddedArticles.map(HomePage.articleView);
  }

  var recentlyUpdatedArticlesContent;
  if (ctrl.recentlyCuratedArticles.loading) {
    recentlyUpdatedArticlesContent = Spinner.view();
  } else {
    recentlyUpdatedArticlesContent = ctrl.recentlyCuratedArticles.map(HomePage.articleView);
  }

  var content = (
    <div>
      <div>
        {new Search.view(ctrl.controllers.search)}
      </div>

      <div className="section">
        <div className="col span_1_of_2 articles">
          <h2>Recently Added</h2>
          {recentlyAddedArticlesContent}
        </div>
        <div className="col span_1_of_2 articles">
          <h2>Recently Updated</h2>
          {recentlyUpdatedArticlesContent}
        </div>
      </div>
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

// helpers
function visitArticle(article) {
  return function() {
    m.route("/articles/" + article.get("id"));
  };
};

module.exports = HomePage;
