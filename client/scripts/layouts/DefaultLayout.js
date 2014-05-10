/** @jsx m */

"use strict";
require("./DefaultLayout.scss");

var PageHeader = require("../components/PageHeader.js");

var DefaultLayout = {};

DefaultLayout.controller = function(options) {
  options = options || {};
  this.id = options.id
  this.pageHeaderController = new PageHeader.controller({user: options.user, query: options.query})
};

DefaultLayout.view = function(ctrl, content) {
  return (
    <div id={ctrl.id} className="page DefaultLayout">
      {new PageHeader.view(ctrl.pageHeaderController)}
      <div className="content">{content}</div>
    </div>
  );
};

module.exports = DefaultLayout;
