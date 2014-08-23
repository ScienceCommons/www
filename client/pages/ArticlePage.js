/** @jsx m */

"use strict";
require("./ArticlePage.scss");

var _ = require("underscore");
var m = require("mithril");

var Layout = require("../layouts/DefaultLayout.js");
var OnUnload = require("../utils/OnUnload.js");

var Spinner = require("../components/Spinner.js");
var PillList = require("../components/PillList.js");
var StudiesTable = require("../components/StudiesTable.js");
var CommentBox = require("../components/CommentBox.js");

var ArticleModel = require("../models/ArticleModel.js");
var AuthorModel = require("../models/AuthorModel.js");

var ArticlePage = {};

ArticlePage.controller = function(options) {
  OnUnload(this);
  var _this = this;
  this.user = options.user;

  if (m.route.param("articleId") === "new" && this.user.canEdit()) {
    this.article = new ArticleModel({});
    this.editing = m.prop(true);
  } else {
    this.article = new ArticleModel({id: m.route.param("articleId")});
    this.article.fetch();
    this.article.get("studies").fetch();
    this.article.get("comments").fetch();
    this.editing = m.prop(false);
  }
  window.article = this.article;

  options = _.extend({id: "ArticlePage"}, options);
  this.controllers.layout = new Layout.controller(options);
  this.controllers.commentBox = new CommentBox.controller({comments: this.article.get("comments"), user: this.user});
  this.controllers.studiesTable = new StudiesTable.controller({article: article, user: this.user});
  this.controllers.tagsList = new PillList.controller({
    editable: this.editing,
    model: this.article
  });

  this.controllers.authorsList = new PillList.controller({
    editable: this.editing,
    collection: this.article.get("authors")
  });

  this.editClick = function() {
    if (_this.user.canEdit()) {
      _this.editing(true);
    }
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

  this.updateReviewerNum = function(num) {
    return function(val) {
      var reviewers = _this.article.get("reviewers");
      reviewers[num] = val;
      _this.article.set("reviewers", reviewers);
    };
  };
};

ArticlePage.view = function(ctrl) {
  var article = ctrl.article;
  var content;

  if (article) {
    document.title = _.compact([
      article.get("authors").etAl(1),
      article.get("journal"),
      article.get("year")
    ]).join(", ");

    var peerReviewers = _.map(article.get("reviewers").filter(function(reviewer) { return !_.isEmpty(reviewer); }).concat([""]), function(reviewer, i) {
      return <li key={"peerReviewer_"+i} placeholder="Add a reviewer" contenteditable={ctrl.editing()} oninput={m.withAttr("innerText", ctrl.updateReviewerNum(i))}>{reviewer}</li>;
    });

    var tags = new PillList.view(ctrl.controllers.tagsList);
    var authors = new PillList.view(ctrl.controllers.authorsList);

    if (ctrl.user.canEdit()) {
      var editButtons;
      if (ctrl.editing()) {
        editButtons = [
          <button type="button" className="btn" key="save" onclick={ctrl.saveClick}>Save</button>,
          <button type="button" className="btn" key="discard" onclick={ctrl.discardClick}>Discard</button>,
        ];
      } else {
        editButtons = <button type="button" className="btn" key="edit" onclick={ctrl.editClick}>Edit</button>;
      }
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
        <div className="section articleHeader">
          <div className="col span_3_of_4 titleAndAbstract">
            <h2 className="articleTitle" placeholder="Title goes here" contenteditable={ctrl.editing()} oninput={m.withAttr("innerText", article.setter("title"))}>{article.get("title")}</h2>
            <div>{article.get("year")}</div>
            <div className="authors">{authors}</div>

            <h3>Abstract</h3>
            <p className="abstract" placeholder="Abstract goes here" contenteditable={ctrl.editing()} oninput={m.withAttr("innerText", article.setter("abstract"))}>{article.get("abstract")}</p>
          </div>

          <div className="col span_1_of_4 text_right">
            <div className="btn_group">
              {editButtons}
              <button type="button" key="bookmark" title="Bookmark article" className={"btn bookmark " + (ctrl.user.hasArticleBookmarked(article) ? "active" : "")} onclick={toggleBookmark(article, ctrl.user)}><span className="icon icon_bookmark"></span></button>
            </div>

            <div className="journal">
              <h5>Journal</h5>
              <p className="field" placeholder="Journal goes here" contenteditable={ctrl.editing()} oninput={m.withAttr("innerText", article.setter("journal"))}>{article.get("journal")}</p>
            </div>

            <div className="doi">
              <h5>DOI</h5>
              <p className="field" placeholder="DOI goes here" contenteditable={ctrl.editing()} oninput={m.withAttr("innerText", article.setter("doi"))}>{article.get("doi")}</p>
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
                <p className="field" placeholder="Action editor goes here" contenteditable={ctrl.editing()} oninput={m.withAttr("innerText", article.setter("action_editor"))}>{article.get("action_editor")}</p>
              </div>
              <h5>Reviewers</h5>
              <ul className="reviewers">
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

// helpers
function toggleBookmark(article, user) {
  return function(e) {
    return user.toggleArticleBookmark(article);
  };
};

module.exports = ArticlePage;
