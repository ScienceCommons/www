/** @jsx m */

"use strict";

var CurateBaseModel = require("./CurateBaseModel.js");

var AuthorModel = CurateBaseModel.extend({
  defaults: {
    first_name: "",
    last_name: "",
    middle_name: ""
  },
  pill: function() {
    return {
      label: this.get("last_name"),
      value: this.get()
    };
  }
});

module.exports = AuthorModel;
