/** @jsx m */

"use strict";

var _ = require("underscore");

var CurateBaseModel = require("./CurateBaseModel.js");

var AuthorModel = CurateBaseModel.extend({
  defaults: {
    first_name: "",
    last_name: "",
    middle_name: ""
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
