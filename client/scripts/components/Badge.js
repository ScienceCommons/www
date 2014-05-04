/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var cx = React.addons.classSet;
var Icons = require("../icons.js");

require("../../styles/components/Badge.scss");

var Badge = React.createClass({
  getDefaultProps: function() {
    return {
      active: false
    };
  },
  /*jshint ignore:start */
  render: function() {
    var classes = cx({
      Badge: true,
      active: this.props.active
    });

    return (
      <svg x="0px" y="0px" viewBox="0 0 32 32" className={classes}>
        <g>
          <path d="M16,32C5.532813,32,0,26.467188,0,16S5.532813,0,16,0s16,5.532813,16,16S26.467188,32,16,32z"/>
        </g>
        {Icons[this.props.badge]()}
      </svg>
    );
  }
  /*jshint ignore:end */
});

module.exports = Badge;