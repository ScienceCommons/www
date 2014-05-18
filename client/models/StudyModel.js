/** @jsx m */

"use strict";

var BaseModel = require("./BaseModel.js");
var CommentModel = require("./CommentModel.js");

var StudyModel = BaseModel.extend({
  relations: {
    //authors: {type: "many", model: require("./UserModel.js")},
    //comments: {type: "many", model: CommentModel},
    independentVariablesComments: {type: "many", model: CommentModel},
    dependentVariablesComments: {type: "many", model: CommentModel},
    nComments: {type: "many", model: CommentModel},
    powerComments: {type: "many", model: CommentModel},
    effectComments: {type: "many", model: CommentModel},
    replications: {type: "many"} // model is defined below
  },
  defaults: {
    "authors": "Zhong et al.",
    "independentVariables": "Transcribe unethical vs ethical deed",
    "dependentVariables": "Desirability of cleaning-related products",
    "n": 27,
    "power": 86,
    "effectSize": 1.08 
  },
  hasComments: function(field) {
    var comments = this.get(field+"Comments");
    return comments && comments.length > 0;
  }
});

StudyModel.prototype.relations.replications.model = StudyModel; // had to do this because of self reference

module.exports = StudyModel;