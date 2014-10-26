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
    fullName: {
      get: function() {
        return _.compact([this.get("first_name"), this.get("middle_name"), this.get("last_name")]).join(" ");
      },
      set: function(val) {
        var names = val.split(/\s+/);
        var first_name = "";
        var middle_name = "";
        var last_name = "";
        if (names.length === 1) {
          first_name = names[0];
        } else if (names.length === 2) {
          first_name = names[0];
          last_name = names[1];
        } else if (names.length === 3) {
          first_name = names[0];
          middle_name = names[1];
          last_name = names[2];
        } else if (names.length > 3) {
          first_name = names.shift();
          last_name = names.join(" ");
        }

        this.set({first_name: first_name, middle_name: middle_name, last_name: last_name});
      }
    }
  },
  pill: function() {
    return { label: this.get("fullName"), value: this };
  },
  urlRoot: "https://www.curatescience.org/authors",
});

module.exports = AuthorModel;
