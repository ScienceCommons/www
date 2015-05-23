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
    m.route("/query/"+encodeURIComponent(_this.query()));
  };
};

Search.view = function(ctrl) {
  return (
    <form onsubmit={ctrl.updateSearch} className={"Search " + ctrl.className}>
      <input type="text" placeholder="Search for articles" autocomplete="off" size={ctrl.size} value={ctrl.query()} oninput={m.withAttr("value", ctrl.query)} />
      &nbsp;<span class="glyphicon glyphicon-info-sign tooltip white-big-tooltip" title="Search for published articles (e.g., &quot;&lt;a href=&quot;https://www.curatescience.org/beta/#/query/bargh%20warmth&quot;&gt;Bargh warmth&lt;/a&gt;&quot;) or replications (e.g., &quot;&lt;a href=&quot;https://www.curatescience.org/beta/#/query/pashler%20elderly%20priming&quot;&gt;Pashler elderly priming&lt;/a&gt;&quot;)."></span>
    </form>
  );
};

module.exports = Search;
