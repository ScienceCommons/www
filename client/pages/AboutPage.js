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
        Replicability is a cornerstone of science, but evidence of independent replications
        is currently disorganized, making it difficult to gauge the reliability of empirical
        findings. Independent verification of data and analyses is another hallmark of science,
        yet is currently challenging in practice because data/syntax are difficult to track down.
      </p>
      <p>
        Curate Science aims to solve both of these problems by providing an online platform that
        substantially facilitates these two crucial processes of science. Independent replication
        information and available data/syntax files will automatically be aggregated from pre-existing
        sources (e.g., from PsychFileDrawer.org, Figshare.com). Registered users will be able to add,
        modify, and update such information, including in-line commenting directed at specific elements
        of an article and in-browser analyses for articles with available R syntax files.
      </p>
      <p>
        Our vision is that building such a platform will accelerate the growth of cumulative knowledge
        and innovation by facilitating and incentivizing independent replications and verification,
        but also by facilitating the post-publication critique, evaluation, extension, re-analysis,
        and interpretation of findings (see Features, for a flowchart of our core features).
      </p>
    </div>
  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = AboutPage;
