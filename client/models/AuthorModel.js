/** @jsx m */

"use strict";

var _ = require("underscore");

var CurateBaseModel = require("./CurateBaseModel.js");

var AuthorModel = CurateBaseModel.extend({
  name: "Author",
  relations: ["Article", function() {
    return {
      "articles": {type: "many", model: require("./ArticleModel.js"), urlAction: "articles"}
    };
  }],
  defaults: {
    first_name: "",
    last_name: "",
    middle_name: "",
    orcid: "",
    job_title: "",
    affiliations: []
  },
  computeds: {
    fullName: function() {
      return _.compact([this.get("first_name"), this.get("middle_name"), this.get("last_name")]).join(" ");
    }
  },
  pill: function() {
    return { label: this.get("fullName"), value: this };
  },
  urlRoot: "https://www.curatescience.org/authors",
});

module.exports = AuthorModel;
