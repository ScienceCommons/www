/** @jsx m */

"use strict";
require("./SearchResults.scss");

var _ = require("underscore");
var m = require("mithril");

var ArticleModel = require("../models/ArticleModel.js");
var ArticleCollection = require("../collections/ArticleCollection.js");
var Spinner = require("./Spinner.js");
var Badge = require("./Badge.js");

var SearchResults = {};

SearchResults.controller = function(options) {
  options = options || {};
  this.user = options.user;
  this.results = new ArticleCollection([]);
  this.from = m.prop(0);
  this.resultsPerPage = m.prop(20);

  var _this = this;
  this.previousPage = function() {
    _this.from(Math.max(_this.from()-_this.resultsPerPage(), 0));
    _this.fetchResults();
  };

  this.nextPage = function() {
    _this.from(_this.from() + _this.resultsPerPage());
    _this.fetchResults();
  };

  this.fetchResults = function() {
    _this.results.search({query: m.route.param("query"), from: _this.from()});
  };

  this.fetchResults();
};

SearchResults.itemView = function(article, user) {
  return (
    <li className="searchResult">
      <header><a href={"/articles/"+article.get("id")} config={m.route}>{article.get("title")}</a></header>
      <div className="authors">
        <button type="button" className={"btn btn_subtle bookmark " + (user.hasArticleBookmarked(article) ? "active" : "")} onclick={toggleBookmark(article, user)}>
          <span className="icon icon_bookmark"></span>
        </button>
        ({article.get("year")}) {article.get("authors").etAl(3)
      }</div>

      <ul className="badges">
        <li>{new Badge.view({badge: "data", active: true})}</li>
        <li>{new Badge.view({badge: "methods", active: true})}</li>
        <li>{new Badge.view({badge: "registration"})}</li>
        <li>{new Badge.view({badge: "disclosure"})}</li>
      </ul>
    </li>
  );
};

SearchResults.view = function(ctrl) {
  var content;

  if (ctrl.results.loading) {
    content = new Spinner.view();
  } else if (ctrl.results.total > 0) {
    content = <ul>{ctrl.results.map(function(article) { return new SearchResults.itemView(article, ctrl.user); })}</ul>;
  } else {
    content = <h3>Sorry, no results were found</h3>;
  }

  if (ctrl.results.total > 0) {
    if (ctrl.from() + ctrl.resultsPerPage() < ctrl.results.total) {
      var more = (
        <div className="more">
          <button type="button" onclick={ctrl.nextPage}>More results</button>
        </div>
      );
    }
  }

  return (
    <div className="SearchResults">
      {content}
      {more}
    </div>
  );
};

// helpers

function toggleBookmark(article, user) {
  return function(e) {
    return user.toggleArticleBookmark(article);
  };
};

module.exports = SearchResults;
