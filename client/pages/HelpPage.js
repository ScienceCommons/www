/** @jsx m */

"use strict";
//require("./HelpPage.scss");

var _ = require("underscore");
var Layout = require("../layouts/FullLayout.js");
var OnUnload = require("../utils/OnUnload.js");

var HelpPage = {};

HelpPage.controller = function(options){
  OnUnload(this);
  options = _.extend({id: "HelpPage"}, options);
  this.controllers.layout = new Layout.controller(options);
};

HelpPage.view = function(ctrl) {
  var content = (
    <div class="main-container push">
      <header class="page-header"><h1>HELP</h1></header>
    </div>

  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = HelpPage;
