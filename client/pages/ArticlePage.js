/** @jsx m */

"use strict";
require("./ArticlePage.scss");

var _ = require("underscore");
var m = require("mithril");

var Layout = require("../layouts/DefaultLayout.js");
var Spinner = require("../components/Spinner.js");
var StudiesTable = require("../components/StudiesTable.js");
var Pill = require("../components/Pill.js");
var CommentBox = require("../components/CommentBox.js");

var ArticleModel = require("../models/ArticleModel.js");

var ArticlePage = {};

ArticlePage.controller = function(options) {
  this.article = new ArticleModel({id: m.route.param("articleId")});
  this.article.initializeAssociations();
  window.article = this.article;
  this.article.fetch();
  this.article.get("studies").fetch();
  this.editing = m.prop(false);

  options = _.extend({id: "ArticlePage"}, options);
  this.layoutController = new Layout.controller(options);
  this.commentBoxController = new CommentBox.controller({comments: this.article.get("comments"), user: options.user});
  this.studiesTableController = new StudiesTable.controller({article: article});

  var _this = this;
  this.editClick = function() {
    _this.editing(true);
  };

  this.saveClick = function() {
    _this.editing(false);
  };

  this.discardClick = function() {
    _this.article.set(_this.article._serverState);
    _this.editing(false);
  };
};

ArticlePage.view = function(ctrl) {
  var article = ctrl.article;
  var content;

  if (article) {
    var peerReviewers = _.map(article.get("reviewers"), function(reviewer) {
      return <li>{reviewer}</li>;
    });

    var tags = _.map(article.get("tags"), function(tag) {
      return new Pill.view({label: tag});
    });

    var editButtons;
    if (ctrl.editing()) {
      editButtons = [
        <button type="button" className="btn" onclick={ctrl.saveClick}>Save</button>,
        <button type="button" className="btn" onclick={ctrl.discardClick}>Discard</button>,
      ];
    } else {
      editButtons = <button type="button" className="btn" onclick={ctrl.editClick}>Edit</button>;
    }

    content = (
      <div>
        <div className="editButtons">
          {editButtons}
        </div>
        <div className="section articleHeader">
          <div className="col span_3_of_4 titleAndAbstract">
            <h2 className="articleTitle" placeholder="Title goes here" contenteditable={ctrl.editing()} oninput={m.withAttr("innerText", article.setter("title"))}>{article.get("title")}</h2>
            <p className="authors">{article.get("authorLastNames")} ({article.get("year")})</p>

            <h3>Abstract</h3>
            <p className="abstract" placeholder="Abstract goes here" contenteditable={ctrl.editing()} oninput={m.withAttr("innerText", article.setter("abstract"))}>{article.get("abstract")}</p>
          </div>

          <div className="col span_1_of_4 text_right">
            <div className="btn_group">
              <button className="btn bookmark_article" onclick={article.bookmark}><span className="icon icon_bookmark"></span></button>
              <button className="btn"><span className="icon icon_share"></span></button>
            </div>

            <div className="journal">
              <h5>Journal</h5>
              <p placeholder="Journal goes here" contenteditable={ctrl.editing()} oninput={m.withAttr("innerText", article.setter("journal"))}>{article.get("journal")}</p>
            </div>

            <div className="doi">
              <h5>DOI</h5>
              <p placeholder="DOI goes here" contenteditable={ctrl.editing()} oninput={m.withAttr("innerText", article.setter("doi"))}>{article.get("doi")}</p>
            </div>

            <div className="tags">
              <h5>Tags</h5>
              <p>{tags}</p>
            </div>
          </div>
        </div>

        <div className="section">
          <h3>Studies and replications</h3>
          {new StudiesTable.view(ctrl.studiesTableController)}
        </div>

        <div className="section">
          <div className="col span_3_of_4">
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
                <p contenteditable={ctrl.editing()} oninput={m.withAttr("innerText", article.setter("action_editor"))}>{article.get("action_editor")}</p>
              </div>
              <h5>Reviewers</h5>
              <ul className="reviewers" contenteditable={ctrl.editing()} oninput={m.withAttr("innerText", article.setter("reviewersStr"))}>
                {peerReviewers}
              </ul>
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
