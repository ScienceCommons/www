/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");

var ReproducibleIcon = React.createClass({
  /*jshint ignore:start */
  render: function() {
    return (
      <g className="svg_icon">
        <path d="M9.999986,7.999988h11.999984v3.999995h-3.999994l5.999992,7.999989l5.999992-7.999989h-3.999994V7.999988
        c0-2.206052-1.793943-3.999995-3.999996-3.999995H9.999986c-2.206051,0-3.999994,1.793943-3.999994,3.999995v1.999998h3.999994
        V7.999988z"/>
        <path d="M21.999969,23.999968H9.999986v-3.999996h3.999995l-5.999992-7.999989l-5.999992,7.999989h3.999995v3.999996
          c0,2.206051,1.793943,3.999994,3.999994,3.999994h11.999984c2.206053,0,3.999996-1.793943,3.999996-3.999994v-1.999998h-3.999996
          V23.999968z"/>
      </g>
    );
  }
  /*jshint ignore:end */
});

module.exports = ReproducibleIcon;