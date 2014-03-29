/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var DefaultLayout = require("../layouts/DefaultLayout.js");

var ProfilePage = React.createClass({
  /*jshint ignore:start */
  render: function () {
    return (
      <DefaultLayout id="ProfilePage">
        <h1 className="h1">Profile</h1>
      </DefaultLayout>
    );
  }
  /*jshint ignore:end */
});

module.exports = ProfilePage;
