"use strict";

var CurateBaseCollection = require("./CurateBaseCollection.js");

var StudyCollection = CurateBaseCollection.extend({
  name: "StudyCollection",
  model: require("../models/StudyModel.js"),
  comparator: function(model) {
    return model.get("number").toString();
  }
});

module.exports = StudyCollection;
