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
        Independent verification is the cornerstone of science. In practice, however, independent verification of published findings is difficult and not rewarded, hence, gauging the reliability and validity of published scientific findings is typically very difficult (if not impossible). <b>Curate Science</b> is a web application that aims to help in these regards by facilitating and incentivizing the independent verification of published scientific findings.
      </p>
      <p>
        Independent verification is facilitated by enabling researchers to (1) link independent replications to original studies (& eventually linking conceptual replication studies meta-analytically), (2) curate available data/syntax to verify reproducibility of results within one’s web browser, and (3) critically evaluate the interpretation/validity of findings via in-line comments (i.e., post-publication peer review on steroids given evaluation done in the context of available data & replicability information).
      </p>
      <p>
        Curate Science incentivizes independent verification by giving credit and public recognition to researchers by prominently displaying user contributions on the homepage. Centralizing such activities further motivates independent verification because researchers get the satisfaction of knowing that their contributions will benefit other researchers (e.g., re-analyzing data from a different theoretical perspective is dramatically facilitated once raw data are curated).
      </p>
      <p>
        For more details about Curate Science, please click <a href="../">here</a>.
      </p>
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = AboutPage;
