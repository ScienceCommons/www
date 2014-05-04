/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var FullLayout = require("../layouts/FullLayout.js")

var AboutPage = React.createClass({
  /*jshint ignore:start */
  render: function () {
    return (
      <FullLayout id="AboutPage">
        <h1>About</h1>
      </FullLayout>
    );
  }
  /*jshint ignore:end */
});

module.exports = AboutPage;
