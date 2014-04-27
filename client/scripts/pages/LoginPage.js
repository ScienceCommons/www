
/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var FullLayout = require("../layouts/FullLayout.js");

require("../../styles/pages/LoginPage.scss");

var LoginPage = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      email: "",
      password: ""
    };
  },
  componentDidMount: function() {
    this.refs.email.getDOMNode().focus();
  },
  handleSubmit: function(e) {
    e.preventDefault();
    console.log("login submit", this.state);
  },
  /*jshint ignore:start */
  render: function () {
    return (
      <FullLayout id="LoginPage">
        <form onSubmit={this.handleSubmit}>
          <input type="text" size="30" placeholder="Email" ref="email" valueLink={this.linkState("email")} />
          <input type="password" size="30" placeholder="Password" valueLink={this.linkState("password")} />
          <input className="btn" type="submit" value="Log in" />
        </form>
      </FullLayout>
    );
  }
  /*jshint ignore:end */
});

module.exports = LoginPage;
