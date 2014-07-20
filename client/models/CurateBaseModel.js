/** @jsx m */

"use strict";

var BaseModel = require("./BaseData.js").Model;

var CurateBaseModel = BaseModel.extend({
  sync: function(method, model, options) {
    options = options || {};
    options.config = function(xhr) {
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.withCredentials = true;
    };
    return BaseModel.prototype.sync.call(this, method, model, options);
  }
});

module.exports = CurateBaseModel;
