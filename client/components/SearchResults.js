/** @jsx m */

"use strict";
require("./SearchResults.scss");

var _ = require("underscore");
var m = require("mithril");

var ArticleModel = require("../models/ArticleModel.js");
var Spinner = require("./Spinner.js");
var SearchFilter = require("./SearchFilter.js");
var Badge = require("./Badge.js");

var SearchResults = {};

SearchResults.controller = function() {
  this.results = m.prop([]);
  this.total = m.prop(0);
  this.from = m.prop(0);
  this.resultsPerPage = m.prop(20);
  this.loading = m.prop(true);

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
    _this.loading(true);

    var query = m.route.param("query");
    var t0 = _.now();
    m.request({method: "GET", url: "https://api.curatescience.org/articles?q="+query+"&from="+_this.from(), background: true}).then(function(res) {
      var t1 = _.now();

      _this.results(_.map(res.documents, function(doc) { return new ArticleModel(doc); }));
      _this.loading(false);
      _this.total(res.total);
      _this.from(res.from);
      m.redraw();

      // log timing
      ga('send', 'timing', 'SearchResults', 'Fetch', t1-t0, "/articles?q="+query+"&from="+res.from);
    });
  };

  this.fetchResults();
};

SearchResults.itemView = function(article) {
  return (
    <li className="searchResult section">
      <div className="col span_3_of_4">
        <a href={"/articles/"+article.get("id")} config={m.route}>{article.get("title")}</a>
        <div className="authors">({article.get("year")}) {article.get("authorsEtAl")}</div>
      </div>
      <div className="col span_1_of_4 badges">
        {new Badge.view({badge: "data", active: true})}
        {new Badge.view({badge: "methods", active: true})}
        {new Badge.view({badge: "registration"})}
        {new Badge.view({badge: "disclosure"})}
      </div>
    </li>
  );
};

SearchResults.view = function(ctrl) {
  var content;

  if (ctrl.loading()) {
    content = new Spinner.view();
  } else if (ctrl.total() > 0) {
    content = <ul>{_.map(ctrl.results(), function(article) { return new SearchResults.itemView(article); })}</ul>;
  } else {
    content = <h3>Sorry, no results were found</h3>;
  }

  if (ctrl.total() > 0) {
    var nav = (
      <div className="search_nav">
        <div className="sort">
          Sort by
          <span>Relavance</span>
          <span>Date</span>
        </div>
        {ctrl.total()} Results
      </div>
    );

    if (ctrl.from() + ctrl.resultsPerPage() < ctrl.total()) {
      var more = (
        <div className="section more">
          <button type="button" onclick={ctrl.nextPage}>More results</button>
        </div>
      );
    }
  }

  return (
    <div className="section SearchResults">
      
      <div className="col span_1_of_6">{new SearchFilter.view()}</div>
      <div className="col span_5_of_6">
        {nav}
        {content}
        {more}
      </div>
    </div>
  );
};

module.exports = SearchResults;
