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

  if (options.model) { // for arrays serialized on a model
    this.pills = function() {
      return _.map(options.model.get(options.attr || "tags"), function(pill) {
        return {label: pill, value: pill};
      });
    };
  } else if (options.collection) {
    this.pills = function() {
      return _.map(options.collection.get(), function(model) {
        return model.pill();
      });
    };
  } else {
    this.pills = options.currentState || m.prop([]);
  }

  var _this = this;
  this.addPill = function(newPill) {
    var pills = _this.pills();
    var values = _.pluck(pills, "value");
    if (!_.isEmpty(newPill.label) && !_.contains(values, newPill.value)) {
      values.push(newPill.value);
      if (options.model) {
        options.model.set((options.attr || "tags"), values);
      } else if (options.collection) {
        options.collection.add(newPill.value);
      } else {
        pills.push(newPill);
        _this.pills(pills);
      }
      _this.controllers.recommendationsTypeahead.clear();
      return true;
    }
    return false;
  };

  this.removePill = function(toRemove) {
    var pills = _this.pills();
    if (toRemove) {
      if (options.collection) {
        return options.collection.remove(toRemove.value);
      }

      pills = _.filter(pills, function(pill) {
        return pill.value !== toRemove.value;
      });
    } else {
      if (options.collection) {
        _this.controllers.recommendationsTypeahead.pill(options.collection.last().pill());
        return options.collection.remove(options.collection.last());
      }
      _this.controllers.recommendationsTypeahead.pill(pills.pop());
    }

    _this.pills(pills);
    if (options.model) {
      options.model.set((options.attr || "tags"), _.pluck(pills, "value"));
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
  };

  this.controllers.recommendationsTypeahead = new Typeahead.controller({
    getter: options.getter,
    submit: this.addPill,
    onkeydown: function(e) {
      if (e.keyCode === 188) { // comma
        e.preventDefault();
        _this.addPill(_this.controllers.recommendationsTypeahead.pill());
      } else if (e.keyCode === 8 && _.isEmpty(_this.controllers.recommendationsTypeahead.pill().label)) {  // backspace
        e.preventDefault();
        if (!_.isEmpty(_this.pills()) )  {
          _this.removePill();
        }
      } else if (e.keyCode === 27) { // escape
        e.preventDefault();
        _this.editing(false);
      }
    }
  });
};

PillList.view = function(ctrl, options) {
  options = options || {};
  var pills;
  if (ctrl.editable()) {
    if (ctrl.editing()) {
      pills = _.map(ctrl.pills(), function(pill) {
        return PillList.pillView(pill, {onRemoveClick: ctrl.onRemoveClick, attrs: options.pillAttrs, perPillAttrs:options.perPillAttrs});
      });
      return (
        <ul className="PillList editing" onclick={ctrl.handleDivClick}>
          {pills}
          <li className="pill" config={Typeahead.config}>{new Typeahead.view(ctrl.controllers.recommendationsTypeahead)}</li>
        </ul>
      );
    } else {
      pills = _.map(ctrl.pills(), function(pill) {
        return PillList.pillView(pill, {onRemoveClick: ctrl.onRemoveClick, attrs: options.pillAttrs, perPillAttrs: options.perPillAttrs});
      });
      return (
        <ul className="PillList">
          {pills}
          <li><span className="icon icon_add" onclick={ctrl.toggleEditMode}></span></li>
        </ul>
      );
    }
  } else {
    pills = _.map(ctrl.pills(), function(pill) {
      return PillList.pillView(pill, {attrs: options.pillAttrs, perPillAttrs: options.perPillAttrs});
    });
    return (
      <ul className="PillList">
        {pills}
      </ul>
    );
  }
};

PillList.pillView = function(pill, options) {
  options = options || {};
  var computed = {};

  if (options.onRemoveClick) {
    var removeIcon = <span className="icon icon_removed" onclick={options.onRemoveClick(pill)}></span>
  }
  if (options.perPillAttrs) {
    var computed = _.reduce(options.perPillAttrs, function(hash, fn, attr) {
      hash[attr] = fn(pill);
      return hash;
    }, {});
  }
  return m("li", _.extend({}, options.attrs, computed, {className: "pill"}), [pill.label, removeIcon]);
};

module.exports = PillList;
