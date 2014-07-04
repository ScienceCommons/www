/** @jsx m */

"use strict";
require("./Search.scss");

var m = require("mithril");

var Search = {};

Search.controller = function(options) {
  options = options || {};

  this.query = m.prop(options.query || "");
  this.size = options.size || 30;
  this.className = options.className || "";

  var _this = this;
  this.updateSearch = function(e) {
    e.preventDefault();
    m.route("/query/"+_this.query());
  };
};

Search.view = function(ctrl) {
  return (
    <form onsubmit={ctrl.updateSearch} className={"Search " + ctrl.className}>
      <input type="search" placeholder="Search for articles" autocomplete="off" size={ctrl.size} value={ctrl.query()} oninput={m.withAttr("value", ctrl.query)} />
    </form>
  );
};

module.exports = Search;
