/** @jsx m */

"use strict";
require("./HomePage.scss");

var m = require("mithril");
var Layout = require("../layouts/FullLayout.js")
var Search = require("../components/Search.js");

var HomePage = {};

HomePage.controller = function(options) {
  //var header = <a href="/about" className="aboutLink" config={m.route}>What is Curate Science?<a/>;
  var header = "What is Curate Science?";

  options = _.extend({id: "HomePage", header: header}, options);

  this.layoutController = new Layout.controller(options);
  this.searchController = new Search.controller({});
};

HomePage.view = function(ctrl) {
  var content = (
    <div>
      {new Search.view(ctrl.searchController)}
    </div>
  );

  return new Layout.view(ctrl.layoutController, content);
};

module.exports = HomePage;
