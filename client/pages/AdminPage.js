/** @jsx m */

"use strict";
require("./AdminPage.scss");

var _ = require("underscore");
var Layout = require("../layouts/DefaultLayout.js");
var OnUnload = require("../utils/OnUnload.js");

var AdminPage = {};

AdminPage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "AdminPage"}, options);
  this.controllers.layout = new Layout.controller(options);
};

AdminPage.view = function(ctrl) {
  var content = (
    <div>
      Admin page
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = AdminPage;

