/** @jsx m */

"use strict";

var _ = require("underscore");
var Layout = require("../layouts/FullLayout.js");
var OnUnload = require("../utils/OnUnload.js");

var AboutPage = {};

AboutPage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "AboutPage"}, options);
  this.controllers.layout = new Layout.controller(options);
};

AboutPage.view = function(ctrl) {
  var content = (
    <div>
      <h1>About</h1>
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = AboutPage;
