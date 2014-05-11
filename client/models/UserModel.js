"use strict";


var BaseModel = require("./BaseModel.js");

var UserModel = BaseModel.extend({
  defaults: {
    "email": "stephen@curatescience.org",
    "first_name": "Stephen",
    "middle_name": "",
    "last_name": "Demjanenko",
    "articles": [],
    "comments": [],
    "gravatar": "8c51e26145bc08bb6f43bead1b5ad07f.png", // me
    "notifications": [
      {title: "foo", body: "foo body", read: false},
      {title: "bar", body: "bar body", read: true}
    ]
  },
  logout: function() {},
  computeds: {
    gravatarUrl: function() {
      return "//www.gravatar.com/avatar/" + this.get("gravatar");
    }
  }
});

module.exports = UserModel;