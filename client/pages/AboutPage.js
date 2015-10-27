/** @jsx m */

"use strict";
require("./AboutPage.scss");

var _ = require("underscore");
var Layout = require("../layouts/FullLayout.js");
var OnUnload = require("../utils/OnUnload.js");

var AboutPage = {};

AboutPage.controller = function(options) {
  OnUnload(this);
  options = _.extend({id: "AboutPage"}, options);
  this.controllers.layout = new Layout.controller(options);
};

AboutPage.view = function(ctrl) {
  var content = (
    <div>
      <h1>About</h1>
      <p>
        Independent verification is what makes science the most successful approach to understanding how our world works. In academic science, however, independent verification of empirical results is difficult and not rewarded. <strong>Curate Science</strong> is a tool to make it easier for researchers to independently verify each other’s results and to award appropriate credit to individuals who engage in such activities.
      </p>
      <p>
        Independent verification is facilitated by enabling researchers to (1) link independent replications to original studies (& eventually linking conceptual replication studies meta-analytically), (2) curate available data/syntax to verify reproducibility of results within one’s web browser, and (3) evaluate the interpretation/validity of original and replication results in nuanced ways via in-line comments.
      </p>
      <p>
        Curate Science incentivizes independent verification by publicly recognizing user contributions on the homepage. Centralizing such activities further motivates independent verification because researchers get the satisfaction of knowing their contributions will benefit other researchers (e.g., once open data are curated, re-analyzing data from different theoretical perspectives is greatly facilitated).
        </p>
      <p>
        For more details about Curate Science, please click <a href="../">here</a>.
      </p>
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = AboutPage;
