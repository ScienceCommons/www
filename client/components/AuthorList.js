/** @jsx m */

"use strict";
require("./AuthorList.scss");

var _ = require("underscore");
var m = require("mithril");

var AuthorModel = require("../models/AuthorModel.js");
var AuthorCollection = require("../collections/AuthorCollection.js");

var Typeahead = require("./Typeahead.js");
var PillList = require("./PillList.js");
var Popover = require("../components/Popover.js");
var Spinner = require("../components/Spinner.js");
var Modal = require("../components/Modal.js");

var AuthorList = {};

AuthorList.controller = function(options) {
  this.searchResults = new AuthorCollection();
  this.collection = options.collection;

  var _this = this;
  this.controllers = {};
  this.controllers.Typeahead = new Typeahead.controller({
    collection: this.searchResults,
    submit: this.collection.add, // need to add create options
    extras: [{
      label: "Add a new author",
      handleClick: function(val) {
        return function() {
          _this.newAuthor = new AuthorModel();
          _this.newAuthor.set("fullName", val);
          _this.controllers.CreateAuthorModal.open(true);
        };
      }
    }],
    recommendationView: function(author) {
      return (
        <div>
          <h4>{author.get("fullName")}</h4>
          <h6>{author.get("job_title")}</h6>
        </div>
      );
    }
  });

  this.controllers.CreateAuthorModal = new Modal.controller({
    className: "newAuthorModal"
  });

  this.controllers.PillList = new PillList.controller({
    typeahead: this.controllers.Typeahead,
    collection: this.collection, // authors
    editable: options.editable
  });

  this.handleNewAuthorSubmit = function(e) {
    e.preventDefault();
    _this.newAuthor.save().then(function() {
      _this.controllers.Typeahead.clear();
      _this.collection.add(_this.newAuthor);
      _this.newAuthor = null;
    }, function() {
      // error
    })
  };
};

AuthorList.view = function(ctrl, options) {
  var author = ctrl.newAuthor;
  if (author) {
    if (author.hasErrors()) {
      var errors = _.map(author.errors(), function(error) {
        return <li>{error}</li>;
      });

      var errorMessage = <ul class="errors">
        {errors}
      </ul>;
    }

    var createAuthorModal = Modal.view(ctrl.controllers.CreateAuthorModal, {
      label: "Add an author",
      content: <form onsubmit={ctrl.handleNewAuthorSubmit}>
        {errorMessage}
        <h3>
          <span placeholder="First name here" contenteditable="true" oninput={m.withAttr("innerText", author.setter("first_name"))}>{author.get("first_name")}</span>
          <span placeholder="Middle name here" contenteditable="true" oninput={m.withAttr("innerText", author.setter("middle_name"))}>{author.get("middle_name")}</span>
          <span placeholder="Last name here" contenteditable="true" oninput={m.withAttr("innerText", author.setter("last_name"))}>{author.get("last_name")}</span>
        </h3>
        <h5 className="h5" placeholder="Job title here" contenteditable="true" oninput={m.withAttr("innerText", author.setter("job_title"))}>{author.get("job_title")}</h5>
        <button type="submit" className="btn">Add author</button>
      </form>
    });
  }

  return <div className="AuthorList">
    {PillList.view(ctrl.controllers.PillList, _.extend({pillView: pillView}, options))}
    {createAuthorModal}
  </div>;
};

module.exports = AuthorList;

// helpers

function pillView(pill, options) {
  options = options || {};

  if (options.onRemoveClick) {
    var removeIcon = <span className="icon icon_removed" onclick={options.onRemoveClick(pill)}></span>
  }

  var author = pill.value;
  var popoverTitle = <a href={"/authors/"+author.get("id")} config={m.route}>{author.get("fullName")}</a>
  var affiliations = _.map(author.get("affiliations"), function(affiliation) {
    return <li>{affiliation}</li>;
  });
  
  var popoverContent = (
    <div>
      <h6>{author.get("job_title")}</h6>
      <ul className="affiliations">
        {affiliations}
      </ul>
    </div>
  );
  return <li className="pill" config={Popover.configForView({title: popoverTitle, content: popoverContent})}>{pill.label} {removeIcon}</li>
}
