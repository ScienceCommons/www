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
    this.article.get("studies").fetch({data: {replications: true, comments: true, model_updates: true, replication_of: true}});
    this.article.get("comments").fetch();
    this.editing = m.prop(false);
  }
  this.saving = m.prop(false);
  this.finding = m.prop(false);
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
    collection: this.article.authors
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

  this.findClick = function() {
   _this.article.find_doi();
   document.getElementsByClassName('button_save')[0].focus();
  };


  this.discardClick = function() {
    if (_this.article.isNew()) {
      m.route("/articles/new");
    } else {
      _this.article.reset({include: ["authors"]});
      _this.editing(false);
      _this.saving(false);
      _this.finding(false);
    }
  };
  this.onEnterDoiFind = function(event) {
      var keyCode = event.keyCode;
      if(keyCode == '13'){
        _this.article.find_doi();
        event.preventDefault();
      }
  };
  
  this.onTabSendToAuthor = function(event) {
      var keyCode = event.keyCode;
      if(keyCode == '9'){
        if (typeof document.getElementsByClassName('icon_add')[0] !== 'undefined') {
          document.getElementsByClassName('icon_add')[0].click();
          event.preventDefault();
        }
      }
  };
  this.onTabSendToAbstract = function(event) {
      var keyCode = event.keyCode;
      if(keyCode == '9'){
        if (typeof document.getElementsByClassName('icon_add')[0] !== 'undefined') {
          document.getElementsByClassName('icon_add')[0].click();
          event.preventDefault();
        }
      }
  };
  
  this.focusDOI = function(el, isInitialized) {
    if (!isInitialized) {
      document.getElementsByClassName('form_field')[0].focus();
    }
  };
};

ArticlePage.view = function(ctrl) {
  var article = ctrl.article;
  var content;
  if (article && !article.not_found) {
    document.title = _.compact([
      article.authors().etAl(1),
      article.get("journal"),
      article.get("year")
    ]).join(", ");

    var tags = new PillList.view(ctrl.controllers.tagsList);
    if (!article.loading) {
      var authors = new AuthorList.view(ctrl.controllers.authorsList, { placeholder: "(Required, at least one)" });
    }

    if (ctrl.user.canEdit()) {
      var editButtons;
      var findDoiButton;
      var doiLabel;
      var authorLabel;
      var yearLabel;
      var titleLabel;
      var journalLabel;
      var abstractLabel;
      if (ctrl.editing()) {
        editButtons = [
          m("button", {type:"button", className:"btn button_save", key:"save", onclick:ctrl.saveClick, disabled:ctrl.saving()}, [ctrl.saving() ? "Saving..." : "Save"]),
          m("button", {type:"button", className:"btn", key:"discard", onclick:ctrl.discardClick, disabled:ctrl.saving()}, ["Discard"]),
        ];
        findDoiButton = m("button", {type:"button", className:"btn", key:"find", onclick:ctrl.findClick, disabled:ctrl.finding(), onkeydown:ctrl.onTabSendToAuthor}, [ctrl.finding() ? "Finding..." : "Retrieve article metadata"]); 
        doiLabel = (
          m("h3", {className:"label"}, ["DOI:"])
        );
        authorLabel = (
          m("h3", {className:"label"}, ["Author(s)*:"])
        );
        yearLabel = (
          m("h3", {className:"label"}, ["Publication Year*:"])
        );
        titleLabel = (
          m("h3", {className:"label"}, ["Article title*:"])
         );
        journalLabel = (
          m("h3", {className:"label"}, ["Journal name:"])
        );
        abstractLabel = (
          m("h3", {className:"label"}, ["Abstract:"])
        );
      } else {
        editButtons = [
          m("button", {type:"button", className:"btn", key:"edit", onclick:ctrl.editClick}, ["Edit"]),
          m("button", {type:"button", className:"btn", key:"delete", onclick:ctrl.deleteClick}, ["Delete"]),
        ];
      }
    }

    var studiesTable, commentsList;
    if (article.isNew()) {
      studiesTable = m("h5", ["You must save this new article before you can add studies."]);
      commentsList = m("h5", ["You must save this new article before you can leave comments."]);
    } else {
      studiesTable = new StudiesTable.view(ctrl.controllers.studiesTable);
      commentsList = new CommentBox.view(ctrl.controllers.commentBox);
    }

    if (article.hasErrors()) {
      var errors = _.map(article.errors(), function(error) {
        return m("li", [error]);
      });

      var errorMessage = m("ul", {className:"errors"}, [
        errors
      ]);
    }
      
    content = (
      m("div", [
        errorMessage,
        m("div", {className:"section articleHeader"}, [
          m("div", {className:"col span_3_of_4 titleAndAbstract"}, [
            m("div", {className:"doi"}, [
              doiLabel,
              m("p", {className:"field form_field", placeholder:"(Optional) Input DOI & hit Enter", config: ctrl.focusDOI, contenteditable:ctrl.editing(), oninput:m.withAttr("textContent", article.setter("doi")), onkeydown:ctrl.onEnterDoiFind}, [article.get("doi")]),
              m("p", {className:"btn_group button_find"}, [
                findDoiButton
              ]),
            ]),
            authorLabel,
            m("div", {className:"authors form_field"}, [authors]),
            m("div", {className:"year"}, [
            yearLabel,
            m("p", {className:"field form_field", placeholder:"(Required, YYYY format)", contenteditable:ctrl.editing(), oninput:m.withAttr("textContent", article.customSetter("publication_date",function(x){return x + "-01-01";}))}, [article.get("publication_date").substring(0,4)])
            ]),
            m("div", {className:"title"}, [
              titleLabel,
              m("p", {className:"form_field field", placeholder:"(Required)", contenteditable:ctrl.editing(), oninput:m.withAttr("textContent", article.setter("title"))}, [article.get("title")])
            ]),
            m("div", {className:"journal"}, [
              journalLabel,
              m("p", {className:"form_field field", placeholder:"(Optional) If unpublished, leave blank", contenteditable:ctrl.editing(), oninput:m.withAttr("textContent", article.setter("journal_title"))}, [article.get("journal_title")])
            ]),
            abstractLabel,
            m("p", {className:"abstract form_field", placeholder:"Optional", contenteditable:ctrl.editing(), oninput:m.withAttr("textContent", article.setter("abstract")), onkeydown:ctrl.onTabSendToAbstract}, [article.get("abstract")]),
            m("div", {className:"tags"}, [
              m("h3", {className:"label"}, ["Tags:"]),
              m("p", {className:"form_field add_tags"}, [tags])
            ]),
              editButtons,
              m("div", {className:"button_find"}, [
                m("button", {type:"button", key:"bookmark", title:"Bookmark article", className:"btn bookmark " + (ctrl.user.hasBookmarked("Article", article.get("id")) ? "active" : ""), onclick:ctrl.user.toggleBookmark("Article", article)}, [m("span", {className:"icon icon_bookmark"})])
              ]),  
              m("p",{className:"require_la"}, ["*=required field."])
             ]),
          ]),

        m("div", {className:"section"}, [
          m("h3", ["Studies and replications"]),
          studiesTable
        ]),

        m("div", {className:"section"}, [
          m("div", {className:"col span_4_of_4"}, [
            m("div", [
              m("h3", ["Comments"]),
              commentsList
            ])
          ])
        ])
      ])
    );

  } else {
    content = m("ul", {className:"errors"}, [m("li", ["Article not found"])]);
  }

  return new Layout.view(ctrl.controllers.layout, content);
};


// helpers
function toggleBookmark(article, user) {
  return function(e) {
    var bookmark = user.hasBookmarked("Article", article.get("id"));
    if (bookmark) {
      return user.get("bookmarks").remove(bookmark, {sync: true});
    } else {
      return user.get("bookmarks").add({bookmarkable_type: "Article", bookmarkable_id: article.get("id")}, {sync: true});
    }
  };
};


module.exports = ArticlePage;
