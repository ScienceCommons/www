/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var PageHeader = require("../components/PageHeader.js");

var NotFoundPage = React.createClass({
  /*jshint ignore:start */
  render: function () {
    return (
      <div className="page">
        <PageHeader />

        <div className="content">
          <h1>Sorry, we could not find the page you were looking for</h1>
          <p>
            Our team has been emailed about this error.
          </p>
        </div>
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = NotFoundPage;
