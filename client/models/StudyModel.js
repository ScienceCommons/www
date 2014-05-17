/** @jsx m */

"use strict";

var BaseModel = require("./BaseModel.js");

var StudyModel = BaseModel.extend({
  relations: {
    //authors: {type: "many", model: require("./UserModel.js")},
    replications: {type: "many"} // model is defined below
  },
  defaults: {
    "authors": "Zhong et al.",
    "independentVariables": "Transcribe unethical vs ethical deed",
    "dependentVariables": "Desirability of cleaning-related products",
    "n": 27,
    "power": 86,
    "effectSize": 1.08 
  }
});

StudyModel.prototype.relations.replications.model = StudyModel; // had to do this because of self reference

module.exports = StudyModel;