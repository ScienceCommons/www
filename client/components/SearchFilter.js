/** @jsx m */

"use strict";
require("./SearchFilter.scss");

var SearchFilter = {};

SearchFilter.view = function(ctrl) {
  return (
    <ul className="SearchFilter">
      <li>
        <div>Show</div>
        <div className="btn_group">
          <button type="button" className="active btn">All</button>
          <button type="button" className="btn"><span className="icon icon_bookmark"></span></button>
          <button type="button" className="btn"><span className="icon icon_eye"></span></button>
        </div>
      </li>

      <li>
        <div>Articles with</div>
        <label><input type="checkbox" />Replications</label>
        <label><input type="checkbox" />Data/Syntax</label>
        <label><input type="checkbox" />Reproducibility</label>
        <label><input type="checkbox" />Materials</label>
        <label><input type="checkbox" />Registrations</label>
        <label><input type="checkbox" />Disclosures</label>
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
  );
};

module.exports = SearchFilter;
