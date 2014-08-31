/** @jsx m */

"use strict";

var _ = require("underscore");

var CurateBaseModel = require("./CurateBaseModel.js");

var AuthorModel = CurateBaseModel.extend({
  //relations: {
  //  "articles": {type: "many", model: require("./ArticleModel.js"), urlAction: "articles"}
  //},
  defaults: {
    first_name: "John",
    last_name: "Smith",
    middle_name: "Rob",
    orcid: "",
    affiliation: "",
    email: "john.rob.smith@gmail.com",
    is_user: "",
    articles: [
      {
        title: "Feeling the future: Experimental evidence for anomalous retroactive influences on congnition and affect",
        authors_denormalized: [{lastName: "Bern"}],
        publication_date: "2011-6-1"
      }, {
        title: "Automaticity of social behavior: Direct effects of trait construct and stereotype activiation on action",
        authors_denormalized: [{lastName: "Bargh"}, {lastName: "Chen"}, {lastName: "Burrows"}],
        publication_date: "1996-6-1"
      },
      {
        title: "Coherent arbitrariness: Stable demand curves without stable preference",
        authors_denormalized: [{lastName: "Airely"}],
        publication_date: "2003-6-1"
      }
    ]
  },
  computeds: {
    fullName: function() {
      return _.compact([this.get("first_name"), this.get("middle_name"), this.get("last_name")]).join(" ");
    }
  },
  pill: function() {
    return { label: this.get("fullName"), value: this };
  }
});

module.exports = AuthorModel;
