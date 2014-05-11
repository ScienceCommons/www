/** @jsx m */

"use strict";
require("./SearchFilter.scss");

var SearchFilter = {};

SearchFilter.view = function(ctrl) {
  return (
    <div className="SearchFilter">
      <div>
        Filter Results
        Clear all
      </div>
      <div>
        Show
        <button type="button" className="active">All</button>
        <button type="button"><span className="icon icon_bookmark"></span></button>
        <button type="button"><span className="icon icon_eye"></span></button>
      </div>
      <div>
        <label><input type="checkbox" />Replications</label>
        <label><input type="checkbox" />Data/Syntax</label>
        <label><input type="checkbox" />Reproducibility</label>
        <label><input type="checkbox" />Materials</label>
        <label><input type="checkbox" />Registrations</label>
        <label><input type="checkbox" />Disclosures</label>
      </div>
    </div>
  );
};

module.exports = SearchFilter;
