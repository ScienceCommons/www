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

var ArticleModel = function(data, options) {
  data = _.defaults(data, defaults);
  options = options || {};
  this.cortex = new Cortex(data, options.callback);
  this.loading = options.loading;
};

ArticleModel.prototype.url = function() {
  return "http://api.papersearch.org/articles/" + this.cortex.id.val();
};

ArticleModel.prototype.fetch = function(callback) {
  if (this.xhr) {
    this.xhr.abort();
  }

  var xhr = new XMLHttpRequest();
  var _this = this;
  xhr.onload = function() {
    _this.xhr = null;
    _this.loading = false;
    var data = JSON.parse(xhr.responseText);
    _this.cortex.set(_.defaults(data, defaults));
    if (_.isFunction(callback)) {
      callback();
    }
  };

  xhr.open("get", this.url(), true);
  xhr.send();
  this.loading = true;
  this.xhr = xhr;
};

ArticleModel.prototype.unmount = function() {
  if (this.xhr) {
    this.xhr.abort();
  }
}

module.exports = ArticleModel;