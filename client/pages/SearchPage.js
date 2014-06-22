/** @jsx m */

"use strict";
require("./SearchPage.scss");

var _ = require("underscore");

var OnUnload = require("../utils/OnUnload.js");
var Layout = require("../layouts/DefaultLayout.js");
var SearchResults = require("../components/SearchResults.js");

var SearchPage = {};

SearchPage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "SearchPage"}, options);
  this.controllers.layout = new Layout.controller(options);
  this.controllers.searchResults = new SearchResults.controller();
};

SearchPage.view = function(ctrl) {
  var content = (
    <div>
      {new SearchResults.view(ctrl.controllers.searchResults)}
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = SearchPage;
