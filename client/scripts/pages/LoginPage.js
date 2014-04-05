
/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var FullLayout = require("../layouts/FullLayout.js");

require("../../styles/pages/LoginPage.scss");

var LoginPage = React.createClass({
  componentDidMount: function() {
    this.refs.email.getDOMNode().focus();
  },
  /*jshint ignore:start */
  render: function () {
    return (
      <FullLayout id="LoginPage">
        <h3>Log in</h3>
        <form>
          <input type="text" size="30" placeholder="Email" ref="email"/>
          <input type="password" size="30" placeholder="Password" />
        </form>
      </FullLayout>
    );
  }
  /*jshint ignore:end */
});

module.exports = LoginPage;
