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
        <h3>Register for an invite</h3>
        <form action="http://christianbattista.us7.list-manage.com/subscribe/post?u=d140eca9cfe4a96473dac6ea5&amp;id=fba08af7dd" method="post" target="_blank">
          <input type="email" value="" name="EMAIL" placeholder="Enter email address" size="30" required />
          <div style={{"position": "absolute", "left": "-5000px"}}>
            <input type="text" name="b_d140eca9cfe4a96473dac6ea5_fba08af7dd" value="" />
          </div>
          <button type="submit">Request invite</button>
        </form>
      </FullLayout>
    );
  }
  /*jshint ignore:end */
});

module.exports = SignupPage;
