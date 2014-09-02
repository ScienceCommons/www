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
    first_name: "John",
    last_name: "Smith",
    middle_name: "Rob",
    orcid: "",
    affiliation: "",
    email: "john.rob.smith@gmail.com",
    is_user: ""
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
