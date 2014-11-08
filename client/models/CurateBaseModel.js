/** @jsx m */

"use strict";

var _ = require("underscore");
var BaseModel = require("./BaseData.js").Model;

var CurateBaseModel = BaseModel.extend({
  sync: function(method, model, options) {
    options = options || {};
    options.config = function(xhr) {
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.withCredentials = true;
    };
    return BaseModel.prototype.sync.call(this, method, model, _.extend(options, {
      unwrapError: function(response) {
        model.resetErrors();
        model.addError(undefined, response.error);
        _.each(response.messages, function(messages, key) {
          _.each(messages, function(message) {
            model.addError(key, message);
          });
        });
      }
    }));
  }
});

module.exports = CurateBaseModel;
