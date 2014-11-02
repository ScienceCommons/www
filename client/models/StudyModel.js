/** @jsx m */

"use strict";

var _ = require("underscore");
var CurateBaseModel = require("./CurateBaseModel.js");
var CommentModel = require("./CommentModel.js");
var LinkModel = require("./LinkModel.js");

var StudyModel = CurateBaseModel.extend({
  name: "Study",
  relations: {
    //authors: {type: "many", model: require("./UserModel.js")},
    //comments: {type: "many", model: CommentModel},
    links: {type: "many", model: LinkModel},
    authors_comments: {type: "many", model: CommentModel},
    independent_variables_comments: {type: "many", model: CommentModel},
    dependent_variables_comments: {type: "many", model: CommentModel},
    n_comments: {type: "many", model: CommentModel},
    power_comments: {type: "many", model: CommentModel},
    effect_size_comments: {type: "many", model: CommentModel},
    replications: {type: "many", model: require("./ReplicationModel.js"), urlAction: "replications"} // model is defined below
  },
  defaults: {
    "authors": ["Zhong", "Wang"],
    "independent_variables": [],
    "dependent_variables": [],
    "n": 27,
    "power": 86,
    "effect_size": {d: 1.08},
    "effect_size_comments": [
      {comment: "Foo"},
      {comment: "This is a test"},
    ],
    "badges": [],
    "links": [
      {type: "data", name: "Google.docx", url: "google.com"},
      {type: "data", name: "Yahoo.docx", url: "yahoo.com"},
      {type: "materials", name: "Cisco.docx", url: "cisco.com"},
      {type: "registration", name: "Apple.docx", url: "apple.com"}
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
  addReplication: function(replicationStudy) {
    if (this.get("article_id") !== replicationStudy.get("article_id")) {
      this.get("replications").add({
        article_id: this.get("article_id"),
        replicating_study_id: replicationStudy.get("id"),
        study_id: this.get("id"),
        replicating_study: replicationStudy
      }, {sync: true});
    }
  },
  removeReplication: function(replicationStudy) {
    var existing = this.get("replications").find(function(replication) { return replication.get("replicating_study_id") === replicationStudy.get("id"); });
    this.get("replications").remove(existing, {sync: true});
  },
  hasBadge: function(name) {
    if (this.get("links").length > 0) {
      return this.get("links").any(function(link) { return link.get("type") === name; });
    } else {
      return _.contains(this.get("badges"), name);
    }
  },
  hasComments: function(field) {
    var comments = this.getComments(field);
    return comments && comments.length > 0;
  },
  commentable: function(field) {
    return _.contains(["independent_variables", "dependent_variables", "n", "power", "effect_size"], field);
  },
  hasPendingEdits: function(field) {
    return false;
  },
  urlRoot: "https://www.curatescience.org/studies",
  create: function() {
    throw("Study.create must be done through the collection: article.get('studies')");
  },
  destroy: function() {
    throw("Study.create must be done through the collection: article.get('studies')");
  },
  linksByType: function(type) {
    return this.get("links").filter(function(link) {
      return link.get("type") === type;
    });
  }
});

module.exports = StudyModel;
