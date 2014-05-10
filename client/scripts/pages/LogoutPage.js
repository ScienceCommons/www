/** @jsx m */

"use strict";

var Layout = require("../layouts/FullLayout.js");
var Spinner = require("../components/Spinner.js");

var LogoutPage = {};

LogoutPage.controller = function(options) {
  options = _.extend({id: "LogoutPage"}, options);
  this.layoutController = new Layout.controller(options);

  setTimeout(function() {
    m.route("/login")
  }, 3000);
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
