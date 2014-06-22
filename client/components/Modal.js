/** @jsx m */

"use strict";
require("./Modal.scss");

var _ = require("underscore");
var m = require("mithril");
var cx = require("../utils/ClassSet.js");

var Modal = {};

Modal.instances = {};

Modal.controller = function(options) {
  options = options || {};

  this.open = m.prop(false);
  this.className = options.className || "";

  var _this = this;
  this.toggle = function(e) {
    _this.open(!_this.open());
  };

  this.close = function() {
    _this.open(false);
  };

  this.id = _.uniqueId();
  Modal.instances[this.id] = this;
  this.onunload = function() {
    delete Modal.instances[_this.id];
  };

  this.config = function(el, isInitialized) {
    _this.el = el;
  };
};

Modal.view = function(ctrl, content, label) {
  if (ctrl.open()) {
    return (
      <div className={"Modal " + ctrl.className} config={ctrl.config}>
        {content}
      </div>
    );
  }
};

var oldMouseDown = document.click;
document.onmousedown = function(e) {
  var node = e.target;
  var parentNodes = [node];
  while (node.parentNode) {
    node = node.parentNode;
    parentNodes.push(node);
  }

  _.each(Modal.instances, function(modal) {
    if (modal.open() && !_.contains(parentNodes, modal.el)) {
      modal.close();
    }
  });
  if (_.isFunction(oldMouseDown)) {
    oldMouseDown(e);
  }
  m.redraw();
};

module.exports = Modal;
