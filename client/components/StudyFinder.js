/** @jsx m */

"use strict";
require("./StudyFinder.scss");

var _ = require("underscore");
var m = require("mithril");
var SearchResults = require("./SearchResults.js");
var ArticleCollection = require("../collections/ArticleCollection.js");
var Spinner = require("./Spinner.js");

var StudyFinder = {};

StudyFinder.controller = function(options) {
  this.search = m.prop("");
  this.submitted = m.prop(false);
  this.matchingArticles = new ArticleCollection();
  this.selectedArticle = null;
  this.selectStudy = options.selectStudy;


  var _this = this;
  this.selectArticle = function(article) {
    return function() {
      _this.selectedArticle = article;
      article.get("studies").fetch();
    };
  };
  this.deselectArticle = function() {
    _this.selectedArticle = null;
  };

  this.runSearch = function(e) {
    e.preventDefault();
    _this.submitted(true);
    _this.matchingArticles.search({query: _this.search()});
  };

  this.clickStudyButton = function(study) {
    return function() {
      _this.selectStudy(study);
    };
  };
};

StudyFinder.view = function(ctrl) {
  var content;
  if (ctrl.selectedArticle) {
    content = StudyFinder.articleView(ctrl, ctrl.selectedArticle);
  } else {
    content = StudyFinder.searchView(ctrl);
  }
  return (
    <div className="StudyFinder">
      {content}
    </div>
  );
};

StudyFinder.articleView = function(ctrl, article) {
  var studies = article.get("studies");
  var content;

  if (studies.loading) {
    content = Spinner.view();
  } else if (studies.length === 0) {
    content = "This article has no studies.";
  } else {
    var list = studies.map(function(study) {
      return (
        <li>
          {study.get("authors").join(", ")}
          {study.get("independent_variables").join(", ")}
          {study.get("dependent_variables").join(", ")}
          {study.get("n")}
          {study.get("power")}
          <button type="button" className="btn" onclick={ctrl.clickStudyButton(study)}>Add as replication</button>
        </li>
      );
    });
    content = (
      <div>
        <h6>Studies</h6>
        <ul>{list}</ul>
      </div>
    );
  }

  return (
    <div>
      <button type="button" className="btn" onclick={ctrl.deselectArticle}><span className="icon icon_left_arrow"/></button>
      <h3>{article.get("title")}</h3>
      <h5>{article.get("authorLastNames")}</h5>
      {content}
    </div>
  );
};

StudyFinder.searchView = function(ctrl) {
  var articles = ctrl.matchingArticles;
  var results;
  if (!ctrl.submitted()) {
    results = "";
  } else if (articles.loading) {
    results = Spinner.view();
  } else if (articles.total === 0) {
    results = "No articles found"
  } else {
    var list = articles.map(function(article) {
      return (
        <li className="article" onclick={ctrl.selectArticle(article)}>
          <div className="title">{article.get("title")}</div>
          <div className="authors">({article.get("year")}) {article.get("authors").etAl(3)}</div>
        </li>
      );
    });

    results = (
      <ul className="articles">
        {list}
      </ul>
    );
  }

  return (
    <form onsubmit={ctrl.runSearch}>
      <div className="search">
        <div>Find the article, then pick the study.</div>
        <input placeholder="Find article" type="text" value={ctrl.search()} oninput={m.withAttr("value", ctrl.search)} />
        <button type="submit" className="btn">Search</button>
      </div>

      <div className="results">
        {results}
      </div>
    </form>
  );
};

module.exports = StudyFinder;
