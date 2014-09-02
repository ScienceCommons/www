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
  }
});

module.exports = AuthorCollection;
