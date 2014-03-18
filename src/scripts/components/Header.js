/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Constants = require("../constants.js");
var cx = React.addons.classSet;

var Header = React.createClass({
  getDefaultProps: function() {
    return {
      quiet: false
    };
  },
  /*jshint ignore:start */
  render: function() {
    var classes = cx({
      header: true,
      row: true,
      quiet: this.props.quiet
    });

    return (
      <div className={classes}>
        <div className="h1 col-xs-offset-0 col-xs-8 col-sm-offset-2 col-sm-8 text-center">{Constants.COMPANY_NAME}</div>
        <div className="col-xs-4 col-sm-2">
          <button type="button">user@curatescience.com</button>
        </div>
      </div>
    );
  }
  /*jshint ignore:end */
});
module.exports = Header;