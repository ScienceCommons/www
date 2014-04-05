/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");

require("../../styles/components/SearchFilter.scss");

var SearchFilter = React.createClass({
  /*jshint ignore:start */
  render: function() {
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
  }
  /*jshint ignore:end */
});

module.exports = SearchFilter;
