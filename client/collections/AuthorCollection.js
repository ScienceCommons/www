"use strict";

var _ = require("underscore");
var m = require("mithril");
var CurateBaseCollection = require("./CurateBaseCollection.js");

var AuthorCollection = CurateBaseCollection.extend({
  name: "AuthorCollection",
  model: require("../models/AuthorModel.js"),
  authorLastNames: function() {
    var lastNames = this.authorLastNamesList();
    if (lastNames.length > 1) {
      return _.first(lastNames, lastNames.length-1).join(", ") + " & " + _.last(lastNames);
    } else if (lastNames.length == 1) {
      return _.first(lastNames);
    }
  },
  authorLastNamesList: function() {
    return this.pluck("last_name");
  },
  etAl: function(num) {
    num = num || 1;
    if (this.length > 0) {
      if (this.length > num) {
        return _.map(this.first(num), function(author) { return author.get("last_name"); }).join(", ") + " et al.";
      } else {
        return _.map(this.first(this.length - 1), function(author) { return author.get("last_name"); }).join(", ") + " & " + this.last().get("last_name");
      }
    }
  },
  search: function(options) {
    var query = options.query;
    if (_.isEmpty(query)) {
      return;
    }

    if (options.partial) {
      query = "*" + query + "*";
    }
    var url = "https://www.curatescience.org/authors?q=" + query;
    if (!_.isUndefined(options.from)) {
      url = url + "&from=" + options.from;
    }
    var _this = this;
    var t0 = _.now();
    this.loading = true;
    var res = this.sync("read", this, {url: url})
    res.then(function(res) {
      var t1 = _.now();
      _this.loading = false;
      _this.total = res.total;
      _this.from = res.from;
      _this.reset(res.documents);
      ga('send', 'timing', 'AuthorCollection', 'Search', t1-t0, "/authors?q="+query+"&from="+res.from);
    });

    return res;
  }
});

module.exports = AuthorCollection;
