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
  pill: function() {
    return {
      label: _.compact([this.get("first_name"), this.get("middle_name"), this.get("last_name")]).join(" "),
      value: this
    };
  }
});

module.exports = AuthorModel;
