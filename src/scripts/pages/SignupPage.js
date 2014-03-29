/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var FullLayout = require("../layouts/FullLayout.js");

require("../../styles/pages/SignupPage.scss");

var SignupPage = React.createClass({
  /*jshint ignore:start */
  render: function () {
    return (
      <FullLayout id="SignupPage">
        <h1>Sorry, signup is not available at this time</h1>
        <p>
          Please wait for an email letting you know when you can sign up
        </p>
      </FullLayout>
    );
  }
  /*jshint ignore:end */
});

module.exports = SignupPage;
