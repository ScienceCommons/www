/** @jsx m */

"use strict";
require("./SearchPage.scss");

var _ = require("underscore");

var OnUnload = require("../utils/OnUnload.js");
var Layout = require("../layouts/DefaultLayout.js");
var SearchResults = require("../components/SearchResults.js");
var SearchFilter = require("../components/SearchFilter.js");

var SearchPage = {};

SearchPage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "SearchPage"}, options);
  this.controllers.layout = new Layout.controller(options);
  this.controllers.searchResults = new SearchResults.controller({user: options.user});
};

SearchPage.view = function(ctrl) {
  var results = ctrl.controllers.searchResults.results;
  if (!results.loading) {
    var count = "" + results.total + " Results";
  }
  var content = (
    <table className="filterAndResults">
      <thead>
        <tr>
          <th>Filter results Clear all</th>
          <th>
            <div className="sort">
              Sort by
              <span>Relavance</span>
              <span>Date</span>
            </div>
            {count}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            {new SearchFilter.view()}
          </td>
          <td>
            {new SearchResults.view(ctrl.controllers.searchResults)}
          </td>
        </tr>
      </tbody>
    </table>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = SearchPage;
