/**
 * @jsx React.DOM
 */

// taken from: http://codepen.io/georgehastings/pen/skznp

"use strict";

var React = require("react/addons");

require("../../styles/components/Spinner.scss");

var Spinner = React.createClass({
  /*jshint ignore:start */
  render: function() {
    return (
      <ul className="Spinner">
        <li></li>
        <li></li>
        <li></li>
      </ul>
    );
  }
  /*jshint ignore:end */
});

module.exports = Spinner;
