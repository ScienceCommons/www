/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var Router = require("react-router-component");

var FullLayout = require("../layouts/FullLayout.js");
var Spinner = require("../components/Spinner.js");

require("../../styles/pages/LogoutPage.scss");

var LogoutPage = React.createClass({
  mixins: [Router.NavigatableMixin],
  componentDidMount: function() {
    this.props.user.logout();
    this.navigate("/login");
  },
  /*jshint ignore:start */
  render: function () {
    return (
      <FullLayout id="LogoutPage" user={this.props.user}>
        <Spinner />
      </FullLayout>
    );
  }
  /*jshint ignore:end */
});

module.exports = LogoutPage;
