/** @jsx m */

"use strict";

var _ = require("underscore");
var CurateBaseModel = require("./CurateBaseModel.js");
var CommentModel = require("./CommentModel.js");

var StudyModel = CurateBaseModel.extend({
  relations: {
    //authors: {type: "many", model: require("./UserModel.js")},
    //comments: {type: "many", model: CommentModel},
    files: {type: "many"},
    authors_comments: {type: "many", model: CommentModel},
    independent_variables_comments: {type: "many", model: CommentModel},
    dependent_variables_comments: {type: "many", model: CommentModel},
    n_comments: {type: "many", model: CommentModel},
    power_comments: {type: "many", model: CommentModel},
    effect_size_comments: {type: "many", model: CommentModel},
    replications: {type: "many"} // model is defined below
  },
  defaults: {
    "authors": ["Zhong", "Wang"],
    "independent_variables": [],
    "dependent_variables": [],
    "n": 27,
    "power": 86,
    "effect_size": {d: 1.08},
    "effect_size_comments": [
      {body: "Foo"},
      {body: "This is a test"},
    ],
    "badges": ["data", "methods"],
    "files": [
      {type: "data", name: "Google", url: "google.com"},
      {type: "data", name: "Yahoo", url: "yahoo.com"},
      {type: "materials", name: "Cisco", url: "cisco.com"},
      {type: "registration", name: "Apple", url: "apple.com"}
    ]
  },
  effectSizeKeyMap: {
    "d": "d",
    "eta": "η",
    "r": "r",
    "phi": "φ",
    "eta_sqr": "η²",
    "partial_eta_sqr": "partial η²"
  },
  computeds: {
    displayEffectSize: function() {
      var effectSize = this.get("effectSize");
      return _.compact([this.get("effectSizeMeasure"), this.get("effectSizeValue")]).join(" = ");
    },
    effectSizeMeasure: {
      get: function() {
        return this.effectSizeKeyMap[_.keys(this.get("effect_size"))[0]] || "";
      },
      set: function(measure) {
        var hash = {};
        hash[measure] = this.get("effectSizeValue");
        this.set("effect_size", hash);
      }
    },
    effectSizeValue: {
      get: function() {
        return _.values(this.get("effect_size"))[0] || "";
      },
      set: function(val) {
        var hash = {};
        hash[_.keys(this.get("effect_size"))[0]] = val;
        this.set("effect_size", hash);
      }
    }
  },
  addComment: function(field, comment) {
    this.getComments(field).add(comment);
  },
  getComments: function(field) {
    return this.get(field+"_comments");
  },
  hasBadge: function(name) {
    return _.contains(this.get("badges"), name);
  },
  hasComments: function(field) {
    var comments = this.getComments(field);
    return comments && comments.length > 0;
  },
  hasPendingEdits: function(field) {
    return false;
  },
  urlRoot: "https://api.curatescience.org/studies",
  create: function() {
    throw("Study.create must be done through the collection: article.get('studies')");
  },
  destroy: function() {
    throw("Study.create must be done through the collection: article.get('studies')");
  },
});

StudyModel.prototype.relations.replications.model = StudyModel; // had to do this because of self reference

module.exports = StudyModel;
