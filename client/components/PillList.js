/** @jsx m */

"use strict";
require("./PillList.scss");

var _ = require("underscore");
var Typeahead = require("./Typeahead.js");

var PillList = {};

PillList.controller = function(options) {
  this.controllers = {};

  this.editable = options.editable;
  this.editing = m.prop(false);

  if (options.model) {
    this.pills = function() {
      return options.model.get(options.attr || "tags");
    };
  } else {
    this.pills = options.currentState || m.prop([]);
  }

  var _this = this;
  this.addPill = function(newPill) {
    var pills = _this.pills();
    if (!_.isEmpty(newPill) && !_.contains(pills, newPill)) {
      pills.push(newPill);
      if (options.model) {
        options.model.set((options.attr || "tags"), pills);
      } else {
        _this.pills(pills);
      }
      _this.controllers.recommendationsTypeahead.clear();
      return true;
    }
    return false;
  };

  this.removePill = function(pill) {
    var pills = _this.pills();
    if (pill) {
      pills = _.without(pills, pill);
    } else {
      _this.controllers.recommendationsTypeahead.value(pills.pop());
    }

    _this.pills(pills);
    if (options.model) {
      options.model.set((options.attr || "tags"), pills);
    }
  };

  this.onRemoveClick = function(pill) {
    return function() {
      _this.removePill(pill);
    };
  };

  this.handleDivClick = function() {
    // "this" references the DOM node
    this.getElementsByTagName("input")[0].focus();
  };

  this.toggleEditMode = function() {
    _this.editing(!_this.editing());
  }

  this.controllers.recommendationsTypeahead = new Typeahead.controller({
    getter: options.getRecommendations,
    submit: this.addPill,
    onkeydown: function(e) {
      if (e.keyCode === 188 || e.keyCode === 32) { // comma, space
        e.preventDefault();
        _this.addPill(_this.controllers.recommendationsTypeahead.value());
      } else if (e.keyCode === 8 && _.isEmpty(_this.controllers.recommendationsTypeahead.value())) {  // backspace
        e.preventDefault();
        if (!_.isEmpty(_this.pills()) )  {
          _this.removePill();
        }
      }
    }
  });
};

PillList.view = function(ctrl) {
  if (ctrl.editable()) {
    if (ctrl.editing()) {
      var pills = _.map(ctrl.pills(), function(pill) {
        return PillList.pillView(pill, {onRemoveClick: ctrl.onRemoveClick});
      });
      return (
        <ul className="PillList editing" onclick={ctrl.handleDivClick}>
          {pills}
          <li className="pill">{new Typeahead.view(ctrl.controllers.recommendationsTypeahead)}</li>
        </ul>
      );
    } else {
      var pills = _.map(ctrl.pills(), function(pill) {
        return PillList.pillView(pill, {onRemoveClick: ctrl.onRemoveClick});
      });
      return (
        <ul className="PillList">
          {pills}
          <li><span className="icon icon_add" onclick={ctrl.toggleEditMode}></span></li>
        </ul>
      );
    }
  } else {
    var pills = _.map(ctrl.pills(), PillList.pillView);
    return (
      <ul className="PillList">
        {pills}
      </ul>
    );
  }
};

PillList.pillView = function(pill, options) {
  options = options || {};
  if (options.onRemoveClick) {
    var removeIcon = <span className="icon icon_removed" onclick={options.onRemoveClick(pill)}></span>
  }

  return <li className="pill">{pill} {removeIcon}</li>;
};

module.exports = PillList;
