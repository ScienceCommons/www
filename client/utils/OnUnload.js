"use strict";

var _ = require("underscore");

var OnUnload = function(ctrl) {
  ctrl.controllers = {};
  ctrl.onunload = function(e) {
    _.each(ctrl.controllers, function(subCtrl) {
      if (_.isFunction(subCtrl.onunload)) {
        subCtrl.onunload(e);
      }
    });
  };
};

module.exports = OnUnload;
