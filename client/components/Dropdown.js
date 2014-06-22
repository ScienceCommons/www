/** @jsx m */

"use strict";
require("./Dropdown.scss");

var _ = require("underscore");
var m = require("mithril");
var cx = require("../utils/ClassSet.js");

var Dropdown = {};

Dropdown.instances = {};

Dropdown.controller = function(options) {
  options = options || {};

  this.open = m.prop(false);
  this.className = options.className || "";
  this.label = options.label;

  var _this = this;
  this.toggle = function(e) {
    _this.open(!_this.open());
  };

  this.close = function() {
    _this.open(false);
  };

  this.id = _.uniqueId();
  Dropdown.instances[this.id] = this;
  this.onunload = function() {
    delete Dropdown.instances[_this.id];
  };

  this.contentConfig = function(el, isInitialized) {
    _this.contentEl = el;
  };

  this.buttonConfig = function(el, isInitialized) {
    _this.buttonEl = el;
  };
};

Dropdown.view = function(ctrl, content, label) {
  if (ctrl.open()) {
    var dropdownContent = <div className="dropdownContent" config={ctrl.contentConfig}>{content}</div>;
  }

  return (
    <div className={"Dropdown " + ctrl.className}>
      <button type="button" className="btn btn_subtle no_outline" onmousedown={ctrl.toggle} config={ctrl.buttonConfig}>
        {label || ctrl.label}
      </button>
      {dropdownContent}
    </div>
  );
};

var oldMouseDown = document.click;
document.onmousedown = function(e) {
  if (_.isFunction(oldMouseDown)) {
    oldMouseDown(e);
  }
  var node = e.target;
  var parentNodes = [node];
  while (node.parentNode) {
    node = node.parentNode;
    parentNodes.push(node);
  }

  _.each(Dropdown.instances, function(dropdown) {
    if (dropdown.open() && !_.contains(parentNodes, dropdown.buttonEl) && !_.contains(parentNodes, dropdown.contentEl)) {
      dropdown.close();
    }
  });
  m.redraw();
};

module.exports = Dropdown;
