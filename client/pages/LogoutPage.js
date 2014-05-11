/** @jsx m */

"use strict";

var _ = require("underscore");

var Layout = require("../layouts/FullLayout.js");
var Spinner = require("../components/Spinner.js");

var LogoutPage = {};

LogoutPage.controller = function(options) {
  this.layoutController = new Layout.controller(_.extend({id: "LogoutPage"}, options));

  setTimeout(function() {
    delete CS.user;
    m.route("/login");
  }, 2000);
};

LogoutPage.view = function(ctrl) {
  var content = (
    <div>
      <h3>Logging out</h3>
      {new Spinner.view()}
    </div>
  );

  return new Layout.view(ctrl.layoutController, content);
};

module.exports = LogoutPage;
