/** @jsx m */

"use strict";

var CurateBaseModel = require("./CurateBaseModel.js");

var ReplicationModel = CurateBaseModel.extend({
  name: "Replication",
  relations: ["Study", function() {
    return {
      "replicating_study": {type: "one", model: require("./StudyModel.js")}
    };
  }],
  urlRoot: "https://www.curatescience.org/replications",
});

module.exports = ReplicationModel;
