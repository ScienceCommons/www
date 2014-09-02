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
  this.author.set("articles", [
    {
      title: "Feeling the future: Experimental evidence for anomalous retroactive influences on congnition and affect",
      authors_denormalized: [{lastName: "Bern"}],
      publication_date: "2011-6-1"
    }, {
      title: "Automaticity of social behavior: Direct effects of trait construct and stereotype activiation on action",
      authors_denormalized: [{lastName: "Bargh"}, {lastName: "Chen"}, {lastName: "Burrows"}],
      publication_date: "1996-6-1"
    },
    {
      title: "Coherent arbitrariness: Stable demand curves without stable preference",
      authors_denormalized: [{lastName: "Airely"}],
      publication_date: "2003-6-1"
    }
  ]);
  window.author = this.author;
};

AuthorPage.view = function(ctrl) {
  var author = ctrl.author;
  var articles = author.get("articles");
  if (articles.length > 0) {
    var articlesList = articles.map(AuthorPage.articleView);
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
  return <h5>{article.get("title")}</h5>;
};

module.exports = AuthorPage;
