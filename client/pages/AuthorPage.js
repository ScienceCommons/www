/** @jsx m */

"use strict";

var _ = require("underscore");
var m = require("mithril");

var OnUnload = require("../utils/OnUnload.js");
var Layout = require("../layouts/DefaultLayout.js");
var Spinner = require("../components/Spinner.js");
var ListEditor = require("../components/ListEditor.js");
var AuthorModel = require("../models/AuthorModel.js");

var AuthorPage = {};

AuthorPage.controller = function(options) {
  options = _.extend({id: "AuthorPage"}, options);
  OnUnload(this);
  this.user = options.user;
  this.editing = m.prop(false);
  this.saving = m.prop(false);

  if (m.route.param("authorId") === "new" && this.user.canEdit()) {
    this.author = new AuthorModel({});
    this.editing(true);
  } else {
    this.author = new AuthorModel({id: m.route.param("authorId")});
    this.author.fetch();
    this.author.get("articles").fetch();
  }
  window.author = this.author;

  var _this = this;
  this.controllers.layout = new Layout.controller(options);
  this.controllers.affiliationList = new ListEditor.controller({
    editing: _this.editing,
    items: function(val) {
      if (_.isUndefined(val)) {
        return _this.author.get("affiliations") || [];
      } else {
        _this.author.set("affiliations", val);
      }
    }
  })

  this.editClick = function() {
    if (_this.user.canEdit()) {
      _this.editing(true);
    }
  };

  this.saveClick = function() {
    _this.saving(true);
    var res = _this.author.save();
    res.then(function() {
      _this.saving(false);
      _this.editing(false);
      m.redraw();
    }, function() {
      _this.saving(false);
      if (!_this.author.hasErrors()) {
        _this.editing(false);
      }
      m.redraw();
    });
    if (_this.author.isNew()) {
      res.then(function() {
        if (!_this.author.isNew()) {
          m.route("/authors/" + _this.author.get("id"));
        }
      });
    }
  };

  this.discardClick = function() {
    if (_this.author.isNew()) {
      m.route("/authors/new");
    } else {
      _this.author.set(_this.author._serverState);
      _this.editing(false);
      _this.saving(false);
    }
  };
};

AuthorPage.view = function(ctrl) {
  var author = ctrl.author;
  var content;

  if (author.loading) {
    content = Spinner.view();
  } else {
    var articles = author.get("articles");
    var articlesContent;
    if (articles.loading) {
      articlesContent = Spinner.view();
    } else if (articles.length > 0) {
      articlesContent = (
        <div>
          <h3>{articles.length} Article{articles.length > 1 ? "s" : ""}</h3>
          <ul>
            {articles.map(AuthorPage.articleView)}
          </ul>
        </div>
      );
    }

    if (ctrl.user.canEdit()) {
      var editButtons;
      if (ctrl.editing()) {
        editButtons = [
          <button type="button" className="btn" key="save" onclick={ctrl.saveClick} disabled={ctrl.saving()}>{ctrl.saving() ? "Saving..." : "Save"}</button>,
          <button type="button" className="btn" key="discard" onclick={ctrl.discardClick} disabled={ctrl.saving()}>Discard</button>,
        ];
      } else {
        editButtons = <button type="button" className="btn" key="edit" onclick={ctrl.editClick}>Edit</button>;
      }
    }

    if (author.hasErrors()) {
      var errors = _.map(author.errors(), function(error) {
        return <li>{error}</li>;
      });

      var errorMessage = <ul class="errors">
        {errors}
      </ul>;
    }

    var name;
    if (ctrl.editing()) {
      name = [
        <span placeholder="First name here" contenteditable="true" oninput={m.withAttr("innerText", author.setter("first_name"))}>{author.get("first_name")}</span>,
        <span placeholder="Middle name here" contenteditable="true" oninput={m.withAttr("innerText", author.setter("middle_name"))}>{author.get("middle_name")}</span>,
        <span placeholder="Last name here" contenteditable="true" oninput={m.withAttr("innerText", author.setter("last_name"))}>{author.get("last_name")}</span>,
      ];
    } else {
      name = author.get("fullName");
    }

    content = (
      <div>
        {errorMessage}
        <div className="section articleHeader">
          <div className="col span_3_of_4">
            <h2 className="h2">{name}</h2>
            <h5 className="h5" placeholder="Job title here" contenteditable={ctrl.editing()} oninput={m.withAttr("innerText", author.setter("job_title"))}>{author.get("job_title")}</h5>
            <div className="affiliations">
              <h4>Affiliations</h4>
              {ListEditor.view(ctrl.controllers.affiliationList, {placeholder: "Add an affiliation"})}
            </div>
          </div>
          <div className="col span_1_of_4 text_right">
            <div className="btn_group">
              {editButtons}
            </div>
          </div>
        </div>
        <div className="section">
          {articlesContent}
        </div>
      </div>
    );
  }

  return new Layout.view(ctrl.controllers.layout, content);
};

AuthorPage.articleView = function(article) {
  return <h5><a href={"/articles/"+article.get("id")} config={m.route}>{article.get("title")}</a></h5>;
};

module.exports = AuthorPage;
