/** @jsx m */

"use strict";
require("./ArticlePage.scss");

var _ = require("underscore");
var m = require("mithril");

var Layout = require("../layouts/DefaultLayout.js");
var OnUnload = require("../utils/OnUnload.js");

var Spinner = require("../components/Spinner.js");
var StudiesTable = require("../components/StudiesTable.js");
var Pill = require("../components/Pill.js");
var CommentBox = require("../components/CommentBox.js");

var ArticleModel = require("../models/ArticleModel.js");

var ArticlePage = {};

ArticlePage.controller = function(options) {
  OnUnload(this);

  if (m.route.param("articleId") === "new") {
    this.article = new ArticleModel({});
    this.article.initializeAssociations();
    this.editing = m.prop(true);
  } else {
    this.article = new ArticleModel({id: m.route.param("articleId")});
    this.article.initializeAssociations();
    this.article.fetch();
    this.article.get("studies").fetch();
    this.editing = m.prop(false);
  }
  window.article = this.article;

  options = _.extend({id: "ArticlePage"}, options);
  this.controllers.layout = new Layout.controller(options);
  this.controllers.commentBox = new CommentBox.controller({comments: this.article.get("comments"), user: options.user});
  this.controllers.studiesTable = new StudiesTable.controller({article: article});

  var _this = this;
  this.editClick = function() {
    _this.editing(true);
  };

  this.saveClick = function() {
    var res = _this.article.save();
    if (_this.article.isNew()) {
      res.then(function() {
        if (!_this.article.isNew()) {
          m.route("/articles/" + _this.article.get("id"));
        }
      });
    }
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

    if (!_.isEmpty(article.get("year"))) {
      var year = "(" + article.get("year") + ")";
    }

    var studiesTable, commentsList;
    if (article.isNew()) {
      studiesTable = <h5>You must save this new article before you can add studies.</h5>;
      commentsList = <h5>You must save this new article before you can leave comments.</h5>;
    } else {
      studiesTable = new StudiesTable.view(ctrl.controllers.studiesTable);
      commentsList = new CommentBox.view(ctrl.controllers.commentBox);
    }

    content = (
      <div>
        <div className="editButtons">
          {editButtons}
        </div>
        <div className="section articleHeader">
          <div className="col span_3_of_4 titleAndAbstract">
            <h2 className="articleTitle" placeholder="Title goes here" contenteditable={ctrl.editing()} oninput={m.withAttr("innerText", article.setter("title"))}>{article.get("title")}</h2>
            <p className="authors">{article.get("authorLastNames")} {year}</p>

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
          {studiesTable}
        </div>

        <div className="section">
          <div className="col span_3_of_4">
            <div>
              <h3>Comments</h3>
              {commentsList}
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

  return new Layout.view(ctrl.controllers.layout, content);
};

module.exports = ArticlePage;
