/** @jsx m */

"use strict";
require("./HelpPage.scss");

var _ = require("underscore");
var Layout = require("../layouts/FullLayout.js");
var OnUnload = require("../utils/OnUnload.js");

var HelpPage = {};

HelpPage.controller = function(options){
  OnUnload(this);
  options = _.extend({id: "HelpPage"}, options);
  this.controllers.layout = new Layout.controller(options);
};

HelpPage.view = function(ctrl) {
  var toggleAnswer = function(e){
    var sib = e.nextSibling;
    if (sib.style.display == 'block') {
      sib.style.display = 'none';
    } else {
      sib.style.display='block';
    }
  };

  var content = (
    <div class="main-container push">
      <header class="page-header"><h1>HELP</h1></header>
      <section class="section" id="section-1">
    <div class="container">
      <header class="page-header"><h3>How-To</h3></header>
      <div class="wrapper">

                <div class="faq-item">
          <div class="question" onclick={function(){return toggleAnswer(this);}}>
            Search for articles
          </div>
          <div class="answer" style="display: none;">
            Search and find articles by typing in the first few words of an article title and/or author last name(s) and pressing ENTER (e.g., <a href="https://www.curatescience.org/beta/#/query/bargh%20warmth">“Bargh warmth”</a> yields <a href="https://www.curatescience.org/beta/#/articles/49900">Bargh &amp; Shalev&#39;s (2012) article</a> as the first search result). (Search box autocomplete functionality coming soon.)
          </div>
        </div>

                <div class="faq-item">
          <div class="question" onclick={function(){return toggleAnswer(this);}}>
            Add an article
          </div>
          <div class="answer" style="display: none;">
            If you cannot find an article, add it by clicking on the <img src="images/alpha_images/add-article-button.png" /> button on the search results page (or alternatively from the Add replication window or via user drop-down menu [top-right of the screen] by clicking “Add an article”). Once on the “Add article” screen, you can quickly add an article by copy-and-pasting (or drag-and-dropping) an article’s DOI into the DOI text box, pressing ENTER, and then clicking Save. For unpublished articles (e.g., papers reporting replication studies) or articles without a DOI, one must manually add at least one author, article publication year, and an article title. (To add authors click on the “+” sign and start typing the author(s)’ first and last name; if the author is not yet in the system, click “Add a new author” and then click “Add author” on the “Add an author” window.)
          </div>
        </div>

                <div class="faq-item">
          <div class="question" onclick={function(){return toggleAnswer(this);}}>
            Add a study to an article
          </div>
          <div class="answer" style="display: none;">
            To add a study to an article, click the “Add study” button under “Studies and replications”. After entering study info (if any at all – see details below), click “Save” to save the study. To add additional studies, click the “Add study” button located to the right of an article’s last study.
          </div>
        </div>

                <div class="faq-item">
          <div class="question" onclick={function(){return toggleAnswer(this);}}>
            Add/link a replication study to an original study
          </div>
          <div class="answer" style="display: none;">
            To link a replication study to an original study, first add the replication study to an article (as described in the previous two points; this process will soon be substantially streamlined). Then, browse to the article and click the “add replication” icon (<img src="images/alpha_images/subway_add.png" />) above the original study to which you want to link a replication study. On the “Add replication” window, search for the article containing the replication study. Then, click on the relevant article and click the “Add replication” button (<img src="images/alpha_images/add-replication-button-general.png" />).

                        For example, to add LeBel &amp; Campbell’s (2013, Study 2) as a replication study of Vess’ (2012, Study 1), one would browse to the Vess article (e.g., by searching <a href="https://www.curatescience.org/beta/#/query/Vess%20warm%20thoughts">“Vess warm thoughts”</a>) and then click on the “add replication” icon (<img src="images/alpha_images/subway_add.png" />) above Vess’ (2012) Study 1 within the replication table. On the “Add replication” window, locate the LeBel &amp; Campbell (2013) article (by searching “LeBel warmth”), clicking on the article, and then toggling on the appropriate study (i.e., <img src="images/alpha_images/add-replication-button-example.png" />). The “Add replication” window can then be closed and you should see the replication study formally linked as a replication of the original study in the replication table.

          </div>
        </div>

                <div class="faq-item">
          <div class="question" onclick={function(){return toggleAnswer(this);}}>
            Add/edit key components to a study
          </div>
          <div class="answer" style="display: none;">
            To add links to publicly available data/syntax files, experimental materials, or pre-registration protocols (disclosure component coming soon) for a study, click on the appropriate component (e.g., <img src="images/alpha_images/materials-icon.png" /> for experimental materials) and click “Add a link”. Then, simply copy-and-paste (or drag-and-drop) the URL to the publicly available file into the “URL goes here” text box, add a label in the “Label goes here” text box (soon label will automatically be extracted from provided URL), and click “Done” (soon we’ll have OSF.io and Figshare.com integration which will dramatically simplify this process!). Repeat this process to link other files. Then, click the “Save” button above the study. To edit a link for a pre-existing linked file, click on the filename, click the edit pencil icon (<img src="images/alpha_images/edit-pencil-icon.png" />), make the changes, and then click “Done” (and again remember to subsequently click the “Save” button above the study).
          </div>
        </div>

                <div class="faq-item">
          <div class="question" onclick={function(){return toggleAnswer(this);}}>
            Add/edit key information to a study
          </div>
          <div class="answer" style="display: none;">
            To add key information to a study (i.e., Independent variables, dependent variables, N, Power, effect size), click on the appropriate cell and then click the edit pencil icon (<img src="images/alpha_images/edit-pencil-icon.png" />). Enter the information, click “Done”, and then click the “Save” button above the study within the replication table. For effect size, this should reflect a study’s primary finding, that is, the most theoretically important finding that carries the most weight in supporting the empirical claims or conclusions drawn from a study (soon we will allow inputting effect sizes for secondary findings/outcomes). To edit pre-existing study information, click on the appropriate cell, click the edit pencil, modify the info, and click “Done”.
          </div>
        </div>

                <div class="faq-item">
          <div class="question" onclick={function(){return toggleAnswer(this);}}>
            Post comments
          </div>
          <div class="answer" style="display: none;">
            Logged in users can post general comments at the bottom of any article by entering their comment in the “Leave a comment” text box and clicking “Post”. In addition, more specific comments can be posted for particular aspects of studies by clicking on the appropriate study cell within the replication table, entering the comment in the “Leave a comment” text box, and clicking “Post” (e.g., after inputting an a priori power level of 0.50 for a replication study, one could click on that cell and leave a comment stating that the unsuccessful replication study should be taken with a grain of salt). For junior and/or untenured researchers, logged in users also have the option of leaving anonymous comments by clicking the “Anonymous” checkbox before clicking “Post”.
          </div>
        </div>

                <div class="faq-item">
          <div class="question" onclick={function(){return toggleAnswer(this);}}>
            Verify and endorse reproducibility of a study’s results
          </div>
          <div class="answer" style="display: none;">
            If a study’s publicly posted data has been linked on Curate Science, a logged in user can verify the reproducibility of a study’s results by downloading the data, repeating the analyses executed by the original researchers, and verifying that the results match those reported in the published article. At that point, a user can then formally endorse the reproducibility of a study’s results by leaving a comment to such effect (e.g., for Donnellan et al.’s, 2015 replication study of <a href="https://www.curatescience.org/beta/#/articles/49900">Bargh &amp; Shalev’s, 2012, Study 1a</a>, Etienne P. LeBel left a comment stating that <i>“The following syntax successfully reproduces Donnellan et al.'s (2015) Study 1 reported correlation of r=-.06 (p>.37) from their publicly posted data. Hence, I endorse their result as reproducible.”</i>). NOTE: This workflow will soon be significantly improved by allowing in-browser R analyses, displaying the endorser’s user name (to give them credit!), and also activating the Reproducibility icon (i.e., <img src="alpha_images/data-reproducible-icon.jpg" /> indicates data publicly available and study’s results have been endorsed as reproducible whereas <img src="alpha_images/data-icon.jpg" /> indicates that data publicly available, but results have yet to be endorsed as reproducible).
          </div>
        </div>

                <div class="faq-item">
          <div class="question" onclick={function(){return toggleAnswer(this);}}>
            Profile page and user settings
          </div>
          <div class="answer" style="display: none;">
            Profile page and user settings are accessible via user drop-down menu [top-right] by clicking “Profile”. On this page, a user will see their authored articles, recent contributions (e.g., comments, endorsed reproducible study results, etc.), and reading and analyses history. Soon, the profile page will be where user’s can modify their notification settings and other customizations (see <a href="https://d3q8ns5gn4o3yg.cloudfront.net/images/alpha_images/4-profile-dashboard.png">mockup specs</a> for more details).
          </div>
        </div>

                <div class="faq-item">
          <div class="question" onclick={function(){return toggleAnswer(this);}}>
            Create a meta-analysis (coming soon)
          </div>
          <div class="answer" style="display: none;">
            In the near future, logged in users will be able to create their own meta-analyses by grouping related studies that test the same general hypothesis (e.g., studies testing the efficacy of prejudice-reduction interventions across different domains of prejudice and discrimination). Other logged in users will then be able to add studies to such meta-analyses, at which time the overall meta-analytic estimates will be automatically updated and graphed via forest plots (see <a href="https://d3q8ns5gn4o3yg.cloudfront.net/images/alpha_images/row-based-w-meta-analytic-estimate.jpg">here</a> for a rough mockup of what the forest plot part of this feature will look like).
          </div>
        </div>

                <div class="faq-item">
          <div class="question" onclick={function(){return toggleAnswer(this);}}>
            Provide feedback or report a bug/issue
          </div>
          <div class="answer" style="display: none;">
            Logged in users can give us general or specific feedback and/or report a bug or issue by clicking on the “Feedback” vertical tab found on the right-hand side of any page, entering their comments, and clicking “Submit”.
          </div>
        </div>
          </div>
        </div>
      </section>
      <section class="section" id="section-2">
        <div class="container">
          <header class="page-header"><h3>Frequently Asked Questions</h3></header>
          <div class="wrapper">
            <div class="faq-item">
              <div class="faq-item">
                <div class="question" onclick={function(){return toggleAnswer(this);}}>
                                How do I determine which of a study’s finding represents the key/primary effect size (for which to add and curate info)?
                </div>
                 <div class="answer" style="display: none;">
                                Determining which of a study’s finding represents the key/primary effect size will indeed sometimes be challenging. It’s important to emphasize, however, that the crowd-sourced and low-barrier-to-entry spirit of Curate Science means that a user can simply add as much or as little study information they have time and/or ability for. If a study reports a theoretically important finding, it *will* eventually be curated and/or corrected by other researchers in that field of study.
                </div>
              </div>
<div class="faq-item">
                          <div class="question" onclick={function(){return toggleAnswer(this);}}>
                                Are only “direct replications” considered replications on Curate Science? (And where can I add “conceptual replications”?)
                          </div>
                          <div class="answer" style="display: none;">
                                Given the aim of Curate Science is the independent verification of published scientific findings, the primary focus entails verifying original studies by linking replication studies that closely follow the procedures and methods of original studies (i.e., same paradigm, same experimental manipulation, and same measure for primary outcome). Of course, methodological closeness is a relative term that exists on a continuum from very close to very far and may sometimes be tricky to gauge. Curate Science’s element-specific and general comment features, however, should help in these regards, allowing the community of scientist to discuss the closeness of specific replications in nuanced ways and how this may influence the interpretation of replication results.
<br /><br />
                                “Conceptual replications”, on the other hand, seek to test whether a particular finding generalizes to contexts or domains different from that of an original study (e.g., do anchoring effects generalize to real-world contexts?). “Conceptual replications” – or “generalizability studies” as we prefer to call them – then, should not be considered replications and hence should not be linked within the main “Studies and replications” table. That being said, Curate Science will soon allow users to create their own meta-analyses that test the same general research hypothesis (see above); this is where “conceptual replications” should be organized and curated!

                          </div>
                        </div>

                        <div class="faq-item">
                          <div class="question" onclick={function(){return toggleAnswer(this);}}>
                                If any logged in user can add/edit information, how will quality control be ensured?
                          </div>
                          <div class="answer" style="display: none;">
                                Similar to Wikipedia, Curate Science includes revision history for all study information fields, which publicly displays which user added/changed what information on what date. Unlike Wikipedia, however, no anonymous additions/changes can be made, which means users are fully accountable for the accuracy of the information they add/change. Furthermore, users will eventually be able to flag specific users who have repeatedly added/changed information incorrectly; editors and admins will then be able to warn such users and also be able to suspend such user’s accounts for violating Curate Science’s terms of service (coming soon).
                          </div>
                        </div>

                        <div class="faq-item">
                          <div class="question" onclick={function(){return toggleAnswer(this);}}>
                                Given curation and independent verification is very difficult work, is it really feasible to do this at a large scale?
                          </div>
                          <div class="answer" style="display: none;">
                                The curation of study data and info required for independent verification *is* indeed a lot of work! However, several substantial improvements in our user interface will soon be made to make this process dramatically easier (e.g., integration with OSF, Figshare, and PLOS APIs, where users can simply select the key files to display for each study; keyboard shortcuts). It’s also important to remember that Curate Science’s goal is not to curate and independently verify all studies that have ever been published. Rather, of most interest to independently verify will typically be highly cited and/or controversial studies. That being said, authors are of course free – and encouraged – to curate their own studies, which will increase their research’s impact, see <a href="https://peerj.com/articles/175/">Piwowar &amp; Vision, 2013, “open data citation advantage”</a>).
                          </div>
                        </div>
                      </div>
              </div>
            </div>
      </section>
      <div class="lightbox fade" id="lightbox" style="display: none;">
       <div class="lightbox-content"></div>
      </div>
    </div>

  );

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = HelpPage;
