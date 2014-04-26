"use strict";

var Model = require("backbone").Model;

var Article = Model.extend({
  defaults: {
    "title": "foo bar",
    "abstract": "something about a foo"
  },
  urlRoot: "http://api.papersearch.org/articles"
});

module.exports = Article;
