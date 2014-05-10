/** @jsx m */

"use strict";
require("./SearchPage.scss");


var SearchResults = require("../components/SearchResults.js");
var Layout = require("../layouts/DefaultLayout.js");

var SearchPage = {};

SearchPage.controller = function(options) {
  options = _.extend({id: "SearchPage"}, options);
  this.layoutController = new Layout.controller(options);
  this.searchResultsController = new SearchResults.controller();
};

SearchPage.view = function(ctrl) {
  var content = (
    <div>
      {new SearchResults.view(ctrl.searchResultsController)}
    </div>
  );

  return new Layout.view(ctrl.layoutController, content);
};

module.exports = SearchPage;
