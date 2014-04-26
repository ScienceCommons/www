/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var FullLayout = require("../layouts/FullLayout.js")

require("../../styles/pages/NotFoundPage.scss");

var NotFoundPage = React.createClass({
  /*jshint ignore:start */
  render: function () {
    return (
      <FullLayout id="NotFoundPage">
        <h1>Sorry, we could not find the page you were looking for</h1>
        <p>
          Our team has been notified of this error.
        </p>
      </FullLayout>
    );
  }
  /*jshint ignore:end */
});

module.exports = NotFoundPage;
