/** @jsx m */

"use strict";
require("./Typeahead.scss");

var _ = require("underscore");
var m = require("mithril");

var Typeahead = {};

Typeahead.controller = function(options) {
  this.open = m.prop(false);
  this.recommendations = m.prop([]); // cached recommendations
  this.index = m.prop(-1); // used for selecting a recommendation
  this.userInput = m.prop(options.value || "");
  this.pill = m.prop({label: this.userInput(), value: this.userInput()})
  this.submit = options.submit;
  this.getter = options.getter || function() { return []; };

  if (!this.submit) {
    throw("Typeahead: options.submit is required");
  }

  var _this = this;
  this.handleSubmit = function(e) {
    e.preventDefault();
    if (_this.submit(_this.pill())) { // allow the submit function to cancel
      _this.clear();
    }
  };

  this.handleBlur = function() {
    _this.open(false);
    _this.index(-1);
  };

  this.handleRecommendationClick = function(val) {
    return function() {
      _this.submit(val);
    };
  };

  this.clear = function() {
    _this.userInput("");
    _this.pill({label: "", value: ""});
    _this.open(false);
    _this.index(-1);
  };

  this.handleInput = function(val) {
    _this.userInput(val);
    _this.pill({label: val, value: val});
    _this.index(-1);
    if (_.isEmpty(val)) {
      _this.recommendations([]);
    } else {
      _this.recommendations(_this.getter(val));
    }
  };

  this.handleKeydown = function(e) {
    var newIndex;
    if (e.keyCode === 40) { // down arrow
      e.preventDefault();
      _this.open(_this.userInput().length > 0);
      var newIndex = _this.index() + 1;
      if (newIndex >= _this.recommendations().length) {
        newIndex = -1;
      }
      _this.index(newIndex);
      if (_this.index() === -1 || _.isEmpty(_this.userInput())) {
        _this.pill({label: _this.userInput(), value: _this.userInput()});
      } else {
        _this.pill(_this.recommendations()[_this.index()]);
      }
    } else if (e.keyCode === 38) { // up arrow
      e.preventDefault();
      _this.open(_this.userInput().length > 0);
      newIndex = _this.index()-1;
      if (newIndex < -1) {
        newIndex = _this.recommendations().length - 1;
      }
      _this.index(newIndex);
      if (_this.index() === -1 || _.isEmpty(_this.userInput())) {
        _this.pill({label: _this.userInput(), value: _this.userInput()});
      } else {
        _this.pill(_this.recommendations()[_this.index()]);
      }
    } else if (e.keyCode === 27) { // escape
      if (_this.open()) {
        _this.open(false);
      } else {
        options.onkeydown(e);
      }
    } else if (options.onkeydown) { // give other components access
      _this.open(true);
      options.onkeydown(e);
    }
  };
};

Typeahead.view = function(ctrl) {
  var list;
  if (ctrl.open() && !_.isEmpty(ctrl.recommendations())) {
    var recommendations = _.map(ctrl.recommendations(), function(recommendation, i) {
      return <li className={i === ctrl.index() ? "selected" : ""} onclick={ctrl.handleRecommendationClick(recommendation)}>{recommendation.label}</li>;
    });
    list = <ul className="recommendations">{recommendations}</ul>;
  }

  return <form className="Typeahead" onsubmit={ctrl.handleSubmit}>
    <input type="text" value={ctrl.pill().label} oninput={m.withAttr("value", ctrl.handleInput)} onkeydown={ctrl.handleKeydown} />
    {list}
  </form>
};

Typeahead.config = function(el, isInitialized) {
  if (!isInitialized) {
    el.getElementsByTagName("input")[0].focus();
  }
};

module.exports = Typeahead;
