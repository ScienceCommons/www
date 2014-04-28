"use strict";

var _ = require("underscore");
var Cortex = require("cortexjs");

var defaults = {
  "title": "",
  "abstract": "",
  "tags": ["Moral purity", "Physical cleansing", "Cleansing products"],
  "doi": "",
  "publication_date": "",
  "authors_denormalized": [],
  "journal": "Science"
};

var ArticleModel = function(data, options) {
  data = _.defaults(data, defaults);
  options = options || {};
  this.cortex = new Cortex(data, options.callback);
  this.loading = options.loading;
};

ArticleModel.prototype.url = function() {
  return window.location.protocol+"//api.curatescience.org/articles/" + this.cortex.id.val();
};

ArticleModel.prototype.fetch = function(callback) {
  var t0 = _.now();
  if (this.xhr) {
    this.xhr.abort();
  }

  var xhr = new XMLHttpRequest();
  var _this = this;
  xhr.onload = function() {
    _this.xhr = null;
    _this.loading = false;
    var data = JSON.parse(xhr.responseText);
    var t1 = _.now();
    _this.cortex.set(_.defaults(data, defaults));
    if (_.isFunction(callback)) {
      callback();
    }
    ga('send', 'timing', 'Article', 'Fetch', t1-t0, _this.cortex.id.val());
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