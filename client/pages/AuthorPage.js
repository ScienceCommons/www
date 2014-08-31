/** @jsx m */

"use strict";

var _ = require("underscore");
var m = require("mithril");

var OnUnload = require("../utils/OnUnload.js");
var Layout = require("../layouts/DefaultLayout.js");
var Spinner = require("../components/Spinner.js");
var AuthorModel = require("../models/AuthorModel.js");

var AuthorPage = {};

AuthorPage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "AuthorPage"}, options);
  this.controllers.layout = new Layout.controller(options);
  this.loading = m.prop(true);
  this.author = new AuthorModel();
  window.author = this.author;
};

AuthorPage.view = function(ctrl) {
  var author = ctrl.author;
  var articles = author.get("articles");
  if (articles.length > 0) {
    var articlesList = _.map(articles, AuthorPage.articleView);
    var articlesContent = (
      <div>
        <h3>{articles.length} Article{articles.length > 1 ? "s" : ""}</h3>
        <ul>
          {articlesList}
        </ul>
      </div>
    );
  }

  var content = (
    <div>
      <h1 className="h1">{author.get("fullName")}</h1>
      <h5>{author.get("email")}</h5>
      {articlesContent}
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

AuthorPage.articleView = function(article) {
  return <h5>{article.title}</h5>;
};

module.exports = AuthorPage;
