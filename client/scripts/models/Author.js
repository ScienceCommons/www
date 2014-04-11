"use strict";

var Model = require("backbone").Model;

var Author = Model.extend({
  defaults: {
    name: "Stephen"
  }
});

module.exports = Author;
