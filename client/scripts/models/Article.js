"use strict";

var Model = require("backbone").Model;

var Article = Model.extend({
  defaults: {
    "title": "foo bar",
    "abstract": "something about a foo"
  }
});

module.exports = Article;
