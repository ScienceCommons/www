"use strict";

var _ = require("underscore");
var Cortex = require("cortexjs");

var defaults = {
  "title": "",
  "abstract": "",
  "tags": ["Moral purity", "Physical cleansing", "Cleansing products"],
  "doi": "",
  "publication_date": ""
};

var ArticleModel = function(data, callback) {
  return new Cortex(_.defaults(data, defaults), callback);
};

module.exports = ArticleModel;