/**
 * @jsx React.DOM
 */

// taken from: http://codepen.io/georgehastings/pen/skznp

'use strict';

var React = require('react/addons');

require('../../styles/spinner.scss');

var Spinner = React.createClass({
  /*jshint ignore:start */
  render: function() {
    return (
      <ul className="loader">
        <li></li>
        <li></li>
        <li></li>
      </ul>
    );
  }
  /*jshint ignore:end */
});
module.exports = Spinner;