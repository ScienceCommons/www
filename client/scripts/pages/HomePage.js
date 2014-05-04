/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var FullLayout = require("../layouts/FullLayout.js")
var Search = require("../components/Search.js");
var Router = require("react-router-component");
var Link = Router.Link;

require("../../styles/pages/HomePage.scss");

var HomePage = React.createClass({
  /*jshint ignore:start */
  render: function () {
    var whatIsLink = <Link href="/about" className="aboutLink">What is Curate Science?</Link>;
    return (
      <FullLayout id="HomePage" user={this.props.user} header={whatIsLink}>
        <Search query={this.props.query} className="inline_block header_search"/>
      </FullLayout>
    );
  }
  /*jshint ignore:end */
});

module.exports = HomePage;
