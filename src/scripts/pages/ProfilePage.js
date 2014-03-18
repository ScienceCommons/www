/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var PageHeader = require("../components/PageHeader.js");

var ProfilePage = React.createClass({
  /*jshint ignore:start */
  render: function () {
    return (
      <div className="page">
        <PageHeader />

        <div className="content profile_content">
          <h1 className="h1">Profile</h1>
        </div>
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = ProfilePage;
