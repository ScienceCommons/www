/** @jsx m */

"use strict";
require("./ArticlePage.scss");

var _ = require("underscore");
var m = require("mithril");

var Layout = require("../layouts/DefaultLayout.js");
var OnUnload = require("../utils/OnUnload.js");

var Spinner = require("../components/Spinner.js");
var PillList = require("../components/PillList.js");
var AuthorList = require("../components/AuthorList.js");
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
    this.article.get("studies").fetch({data: {replications: true}});
    this.article.get("comments").fetch();
    this.editing = m.prop(false);
  }
  this.saving = m.prop(false);
  window.article = this.article;

  options = _.extend({id: "ArticlePage"}, options);
  this.controllers.layout = new Layout.controller(options);
  this.controllers.commentBox = new CommentBox.controller({comments: this.article.get("comments"), user: this.user});
  this.controllers.studiesTable = new StudiesTable.controller({article: article, user: this.user});
  this.controllers.tagsList = new PillList.controller({
    editable: this.editing,
    model: this.article
  });

  this.controllers.authorsList = new AuthorList.controller({
    editable: this.editing,
    collection: this.article.get("authors")
  });

  this.editClick = function() {
    if (_this.user.canEdit()) {
      _this.editing(true);
    }
  };

  this.deleteClick = function() {
    var confirmation = confirm("This will permanently delete the article");
    if (confirmation) {
      _this.saving(true);
      _this.article.destroy().then(function() {
        _this.saving(false);
        m.route("/");
      }, function(err) {
        _this.saving(false);
      });
    }
  };

  this.saveClick = function() {
    _this.saving(true);
    var res = _this.article.save({include: ["authors"]});
    res.then(function() {
      _this.saving(false);
      _this.editing(false);
      m.redraw();
    }, function() {
      _this.saving(false);
      if (!_this.article.hasErrors()) {
        _this.editing(false);
      }
      m.redraw();
    });
    if (_this.article.isNew()) {
      res.then(function() {
        if (!_this.article.isNew()) {
          m.route("/articles/" + _this.article.get("id"));
        }
      });
    }
  };

  this.discardClick = function() {
    if (_this.article.isNew()) {
      m.route("/articles/new");
    } else {
      _this.article.reset({include: ["authors"]});
      _this.editing(false);
      _this.saving(false);
    }
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

    var tags = new PillList.view(ctrl.controllers.tagsList);
    if (!article.loading) {
      var authors = new AuthorList.view(ctrl.controllers.authorsList, { placeholder: "No authors" });
    }

    if (ctrl.user.canEdit()) {
      var editButtons;
      if (ctrl.editing()) {
        editButtons = [
          <button type="button" className="btn" key="save" onclick={ctrl.saveClick} disabled={ctrl.saving()}>{ctrl.saving() ? "Saving..." : "Save"}</button>,
          <button type="button" className="btn" key="discard" onclick={ctrl.discardClick} disabled={ctrl.saving()}>Discard</button>,
        ];
      } else {
        editButtons = [
          <button type="button" className="btn" key="edit" onclick={ctrl.editClick}>Edit</button>,
          <button type="button" className="btn" key="delete" onclick={ctrl.deleteClick}>Delete</button>,
        ];
      }
    }

    var studiesTable, commentsList;
    if (article.isNew()) {
      studiesTable = <h5>You must save this new article before you can add studies.</h5>;
      commentsList = <h5>You must save this new article before you can leave comments.</h5>;
    } else {
      studiesTable = new StudiesTable.view(ctrl.controllers.studiesTable);
      commentsList = new CommentBox.view(ctrl.controllers.commentBox);
    }

    if (article.hasErrors()) {
      var errors = _.map(article.errors(), function(error) {
        return <li>{error}</li>;
      });

      var errorMessage = <ul className="errors">
        {errors}
      </ul>;
    }

    content = (
      <div>
        {errorMessage}
        <div className="section articleHeader">
          <div className="col span_3_of_4 titleAndAbstract">
            <h2 className="articleTitle" placeholder="Title goes here" contenteditable={ctrl.editing()} oninput={m.withAttr("innerText", article.setter("title"))}>{article.get("title")}</h2>
            <div contenteditable={ctrl.editing()} oninput={m.withAttr("innerText", article.setter("publication_date"))}>{article.get("publication_date")}</div>
            <div className="authors">{authors}</div>

            <h3>Abstract</h3>
            <p className="abstract" placeholder="Abstract goes here" contenteditable={ctrl.editing()} oninput={m.withAttr("innerText", article.setter("abstract"))}>{article.get("abstract")}</p>
          </div>

          <div className="col span_1_of_4 text_right">
            <div className="btn_group">
              {editButtons}
              <button type="button" key="bookmark" title="Bookmark article" className={"btn bookmark " + (ctrl.user.hasBookmarked("Article", article.get("id")) ? "active" : "")} onclick={toggleBookmark(article, ctrl.user)}><span className="icon icon_bookmark"></span></button>
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
          <div className="col span_4_of_4">
            <div>
              <h3>Comments</h3>
              {commentsList}
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
    return user.get("bookmarks").add({bookmarkable_type: "Article", bookmarkable_id: article.get("id")}, {sync: true});
  };
};

module.exports = ArticlePage;
