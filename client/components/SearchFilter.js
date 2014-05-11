/** @jsx m */

"use strict";
require("./SearchFilter.scss");

var SearchFilter = {};

SearchFilter.view = function(ctrl) {
  return (
    <div className="SearchFilter">
      <div className="section">
        <div className="col span_1_of_2">Filter Results</div>
        <div className="col span_1_of_2">Clear all</div>
      </div>

      <div className="section">
        <div>Show</div>
        <button type="button" className="active">All</button>
        <button type="button"><span className="icon icon_bookmark"></span></button>
        <button type="button"><span className="icon icon_eye"></span></button>
      </div>

      <div className="section">
        <div>Articles with</div>
        <label><input type="checkbox" />Replications</label>
        <label><input type="checkbox" />Data/Syntax</label>
        <label><input type="checkbox" />Reproducibility</label>
        <label><input type="checkbox" />Materials</label>
        <label><input type="checkbox" />Registrations</label>
        <label><input type="checkbox" />Disclosures</label>
      </div>

      <div className="section">
        <div>Publication Date</div>
      </div>

      <div className="section">
        <div>Journal</div>
      </div>

      <div className="section">
        <div>Participants (N)</div>
      </div>

      <div className="section">
        <div>Authors</div>
      </div>

      <div className="section">
        <div>Related keywords</div>
      </div>
    </div>
  );
};

module.exports = SearchFilter;
