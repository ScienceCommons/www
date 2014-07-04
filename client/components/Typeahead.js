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
  this.value = m.prop(this.userInput());
  this.submit = options.submit;

  if (!this.submit) {
    throw("Typeahead: options.submit is required");
  }

  var _this = this;
  this.handleSubmit = function(e) {
    e.preventDefault();
    _this.submit(_this.value());
  };

  this.handleBlur = function() {
    _this.submit(_this.value());
  };

  this.handleRecommendationClick = function(val) {
    return function() {
      _this.submit(val);
    };
  };

  this.clear = function() {
    _this.userInput("");
    _this.value("");
    _this.open(false);
  };

  this.handleInput = function(val) {
    _this.userInput(val);
    _this.value(val);
    _this.index(-1);
    if (_.isEmpty(val)) {
      _this.recommendations([]);
    } else {
      _this.recommendations(["apple", "pear"]);
    }
  };

  this.handleKeydown = function(e) {
    _this.open(true);
    var newIndex;
    if (e.keyCode === 40) { // down arrow
      var newIndex = _this.index() + 1;
      if (newIndex >= _this.recommendations().length) {
        newIndex = -1;
      }
      _this.index(newIndex);
      if (_this.index() === -1 || _.isEmpty(_this.userInput())) {
        _this.value(_this.userInput());
      } else {
        _this.value(_this.recommendations()[_this.index()]);
      }
    } else if (e.keyCode === 38) { // up arrow
      newIndex = _this.index()-1;
      if (newIndex < -1) {
        newIndex = _this.recommendations().length - 1;
      }
      _this.index(newIndex);
      if (_this.index() === -1 || _.isEmpty(_this.userInput())) {
        _this.value(_this.userInput());
      } else {
        _this.value(_this.recommendations()[_this.index()]);
      }
    } else if (e.keyCode === 27) { // escape
      _this.open(false);
    } else if (options.onkeydown) { // give other components access
      options.onkeydown(e);
    }
  };
};

Typeahead.view = function(ctrl) {
  var list;
  if (ctrl.open() && !_.isEmpty(ctrl.recommendations())) {
    var recommendations = _.map(ctrl.recommendations(), function(recommendation, i) {
      return <li className={i === ctrl.index() ? "selected" : ""} >{recommendation}</li>;
    });
    list = <ul className="recommendations">{recommendations}</ul>;
  }

  return <form className="Typeahead" onsubmit={ctrl.handleSubmit}>
    <input type="text" value={ctrl.value()} oninput={m.withAttr("value", ctrl.handleInput)} onkeydown={ctrl.handleKeydown}  onblur={ctrl.handleBlur} />
    {list}
  </form>
};

module.exports = Typeahead;
