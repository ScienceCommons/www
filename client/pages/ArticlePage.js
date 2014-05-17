/** @jsx m */

"use strict";
require("./ArticlePage.scss");

var _ = require("underscore");

var Layout = require("../layouts/DefaultLayout.js");
var Spinner = require("../components/Spinner.js");
var ReplicationsTable = require("../components/ReplicationsTable.js");
var Pill = require("../components/Pill.js");
var CommentBox = require("../components/CommentBox.js");

var ArticleModel = require("../models/ArticleModel.js");

var ArticlePage = {};

ArticlePage.controller = function(options) {
  this.article = new ArticleModel({id: m.route.param("articleId")});
  this.article.initializeAssociations();
  window.article = this.article;
  this.article.fetch();

  options = _.extend({id: "ArticlePage"}, options);
  this.layoutController = new Layout.controller(options);
  this.commentBoxController = new CommentBox.controller({comments: this.article.get("comments"), user: options.user});
};

ArticlePage.view = function(ctrl) {
  var article = ctrl.article;
  var content;

  if (article) {
    var peerReviewers = _.map(article.get("reviewers"), function(reviewer, i) {
      return (
        <div className="reviewer">
          <h5>Reviewer {i+1}</h5>
          <p>{reviewer}</p>
        </div>
      );
    });

    var tags = _.map(article.get("tags"), function(tag) {
      return new Pill.view({label: tag});
    });

    content = (
      <div>
        <div className="section articleHeader">
          <div className="col span_3_of_4 titleAndAbstract">
            <h2 className="articleTitle">{article.get("title")}</h2>
            <p className="authors">{_.compact([article.get("authorLastNames"), article.get("year")]).join(", ")}</p>

            <h3>Abstract</h3>
            <p className="abstract">{article.get("abstract")}</p>
          </div>

          <div className="col span_1_of_4 text_right">
            <div className="btn_group">
              <button className="btn bookmark_article"><span className="icon icon_bookmark"></span></button>
              <button className="btn"><span className="icon icon_share"></span></button>
            </div>

            <div className="journal">
              <h5>Journal</h5>
              <p>{article.get("journal")}</p>
            </div>

            <div className="doi">
              <h5>DOI</h5>
              <p>{article.get("doi")}</p>
            </div>

            <div className="tags">
              <h5>Tags</h5>
              <p>{tags}</p>
            </div>
          </div>
        </div>

        <div className="section">
          {new ReplicationsTable.view({article: article})}
        </div>

        <div className="section">
          <div className="col span_3_of_4">
            <div>
              <h3>Community Summary</h3>
              <p className="dim">{article.get("community_summary_date")}</p>
              <p>{article.get("community_summary")}</p>
            </div>

            <div>
              <h3>Comments</h3>
              {new CommentBox.view(ctrl.commentBoxController)}
            </div>
          </div>
          <div className="col span_1_of_4">
            <div className="peerReview">
              <h3>Peer Review</h3>
              <div className="actionEditor">
                <h5>Action Editor</h5>
                <p>{article.get("action_editor")}</p>
              </div>
              {peerReviewers}
            </div>
            <div>
              <h3>External Resources</h3>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    content = <h1>Article not found</h1>;
  }

  return new Layout.view(ctrl.layoutController, content);
};

module.exports = ArticlePage;
