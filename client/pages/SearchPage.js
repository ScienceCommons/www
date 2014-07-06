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
  this.controllers.searchResults = new SearchResults.controller({user: options.user});
  this.sortBy = m.prop("relevance");
  var _this = this;
  this.setSort = function(sortBy) {
    return function(e) {
      _this.sortBy(sortBy);
    };
  }
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
            <ul className="sortBy">
              <li>Sort by</li>
              <li className={ctrl.sortBy() === "relevance" ? "active" : ""} onclick={ctrl.setSort("relevance")}>Relevance</li>
              <li className={ctrl.sortBy() === "date" ? "active" : ""} onclick={ctrl.setSort("date")}>Date</li>
            </ul>
            {count}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="filter">
            <ul>
              <li>
                <div>Show</div>
                <div className="btn_group">
                  <button type="button" className="active btn">All</button>
                  <button type="button" className="btn"><span className="icon icon_bookmark"></span></button>
                </div>
              </li>

              <li>
                <div>Articles with</div>
                <label><input type="checkbox" /> <span className="icon icon_replication"></span> Replications</label>
                <label><input type="checkbox" /> <span className="icon icon_sml_data"></span> Data/Syntax</label>
                <label><input type="checkbox" /> <span className="icon icon_sml_reproducible"></span> Reproducibility</label>
                <label><input type="checkbox" /> <span className="icon icon_sml_methods"></span> Materials</label>
                <label><input type="checkbox" /> <span className="icon icon_sml_registration"></span> Registrations</label>
                <label><input type="checkbox" /> <span className="icon icon_sml_disclosure"></span> Disclosures</label>
              </li>

              <li>
                <div>Publication Date</div>
              </li>

              <li>
                <div>Journal</div>
              </li>

              <li>
                <div>Participants (N)</div>
              </li>

              <li>
                <div>Authors</div>
              </li>

              <li>
                <div>Related keywords</div>
              </li>
            </ul>
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
