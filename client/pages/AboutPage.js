/** @jsx m */

"use strict";

var Layout = require("../layouts/FullLayout.js")

var AboutPage = {};

AboutPage.controller = function(options) {
  options = _.extend({id: "AboutPage"}, options);
  this.layoutController = new Layout.controller(options);
};

AboutPage.view = function(ctrl) {
  var content = (
    <div>
      <h1>About</h1>
    </div>
  );

  return new Layout.view(ctrl.layoutController, content);
};

module.exports = AboutPage;
