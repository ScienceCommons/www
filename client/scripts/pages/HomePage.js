/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var FullLayout = require("../layouts/FullLayout.js")
var Search = require("../components/Search.js");

require("../../styles/pages/HomePage.scss");

var HomePage = React.createClass({
  /*jshint ignore:start */
  render: function () {
    return (
      <FullLayout id="HomePage" user={{email: "user@curatescience.org"}}>
        <Search query={this.props.query} className="inline_block header_search"/>
      </FullLayout>
    );
  }
  /*jshint ignore:end */
});

module.exports = HomePage;
