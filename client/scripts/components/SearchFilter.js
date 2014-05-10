/** @jsx m */

"use strict";
require("./SearchFilter.scss");

var SearchFilter = {};

SearchFilter.view = function(ctrl) {
  return (
    <div className="SearchFilter">
      <label><input type="checkbox" />Replications</label>
      <label><input type="checkbox" />Data/Syntax</label>
      <label><input type="checkbox" />Reproducibility</label>
      <label><input type="checkbox" />Materials</label>
      <label><input type="checkbox" />Registrations</label>
      <label><input type="checkbox" />Disclosures</label>
    </div>
  );
};

module.exports = SearchFilter;
