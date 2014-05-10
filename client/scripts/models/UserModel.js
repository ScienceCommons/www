"use strict";

var _ = require("underscore");
var Cortex = require("cortexjs");

var defaults = {
  "email": "stephen@curatescience.org",
  "first_name": "Stephen",
  "middle_name": "",
  "last_name": "Demjanenko",
  "articles": [],
  "comments": [],
  "gravatarLink": "8c51e26145bc08bb6f43bead1b5ad07f.png",
  "notifications": [
    {title: "foo", body: "foo body", read: false},
    {title: "bar", body: "bar body", read: true}
  ]
};

var UserModel = function(data, options) {
  data = _.defaults(data, defaults);
  options = options || {};
  this.cortex = new Cortex(data, options.callback);
};

UserModel.prototype.logout = function(callback) {
  var _this = this;
  setTimeout(function() {
    CS.user = null;
    _this.cortex.set({loading: true});
    if (_.isFunction(callback)) {
      callback();
    }
  }, 1000);
};

UserModel.prototype.imageUrl = function() {
  var link = this.cortex.gravatarLink.val();
  return "//www.gravatar.com/avatar/" + link;
};

module.exports = UserModel;