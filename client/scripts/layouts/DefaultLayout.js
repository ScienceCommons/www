/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var PageHeader = require("../components/PageHeader.js");

require("../../styles/layouts/DefaultLayout.scss");

var DefaultLayout = React.createClass({
  /*jshint ignore:start */
  render: function () {
    return (
      <div id={this.props.id} className="page DefaultLayout">
        <PageHeader user={this.props.user} query={this.props.query} />

        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = DefaultLayout;
