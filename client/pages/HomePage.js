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

  this.mostCuratedArticles = [
    new ArticleModel({
      title: "Feeling the future: Experimental evidence for anomalous retroactive influences on congnition and affect",
      authors_denormalized: [{lastName: "Bern"}],
      publication_date: "2011-6-1"
    }, {silent: true}),
    new ArticleModel({
      title: "Automaticity of social behavior: Direct effects of trait construct and stereotype activiation on action",
      authors_denormalized: [{lastName: "Bargh"}, {lastName: "Chen"}, {lastName: "Burrows"}],
      publication_date: "1996-6-1"
    }, {silent: true}),
    new ArticleModel({
      title: "Coherent arbitrariness: Stable demand curves without stable preference",
      authors_denormalized: [{lastName: "Airely"}],
      publication_date: "2003-6-1"
    }, {silent: true})
  ];
  this.recentlyCuratedArticles = new ArticleCollection([], {
    url: "https://curatescience.org/articles/recent"
  });
  this.recentlyCuratedArticles.fetch();
};

HomePage.articleView = function(article) {
  return (
    <div className="articleView" onclick={visitArticle(article)}>
      <div className="title">{article.get("title")}</div>
      <div className="authors">({article.get("year")}) {article.get("authors").etAl(3)}</div>
      <div className="badges">
        {new Badge.view({badge: "data", active: true})}
        {new Badge.view({badge: "methods", active: true})}
        {new Badge.view({badge: "registration"})}
        {new Badge.view({badge: "disclosure"})}
      </div>
    </div>
  );
};

HomePage.view = function(ctrl) {
  var mostCuratedArticlesContent = _.map(ctrl.mostCuratedArticles, HomePage.articleView);

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
          <h2>Most Curated</h2>
          {mostCuratedArticlesContent}
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
