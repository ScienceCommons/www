/** @jsx m */

"use strict";
require("./Popover.scss");

var _ = require("underscore");
var m = require("mithril");

var Popover = {};

Popover.controller = function() {
  this.options = {};
  this.open = m.prop(false);
  this.el = document.createElement("div");
};

Popover.view = function(ctrl, options) {
  options = options || {};
  if (ctrl.open()) {
    if (options.title) {
      var title = <header>{options.title}</header>;
    }
    return (
      <div className={"Popover " + (options.position ? options.position : "bottom" ) + " " + (ctrl.open() === "closing" ? "closing" : "")}>
        <div className="popoverArrow"></div>
        {title}
        <div className="popoverContent">{options.content}</div>
      </div>
    );
  }
};

Popover.configForView = function(options) {
  return function(el, isInitialized, context) {
    if (!isInitialized) {
      el.style.position = "relative";
      el._popover = new Popover.controller();
      el.appendChild(el._popover.el);

      var enterFn = onEnter(el);
      var leaveFn = onLeave(el);
      el.addEventListener("mouseenter", enterFn);
      el.addEventListener("mouseleave", leaveFn);

      context.onunload = function() {
        el.removeEventListener("mousedown", enterFn);
        el.removeEventListener("mouseleave", leaveFn);
      };

      // inspired by https://groups.google.com/forum/#!searchin/mithriljs/Saytam/mithriljs/lhADPdnr6L8/FrMci1oqq7oJ
      //m.module(el, {
      //  controller: function() { return el._popover; },
      //  view: Popover.view
      //});
    }
    el._popover.options = options;
    m.render(el._popover.el, Popover.view(el._popover, el._popover.options));
  };
};

module.exports = Popover;

// helpers

function onEnter(el) {
  return function(e) {
    if (el._popover.timeout) {
      clearTimeout(el._popover.timeout)
    }
    el._popover.open(true);
    m.render(el._popover.el, Popover.view(el._popover, el._popover.options));
  };
}

var delay = 300;
function onLeave(el) {
  return function(e) {
    el._popover.open("closing");
    el._popover.timeout = setTimeout(function() {
      el._popover.timeout = null;
      el._popover.open(false);
      m.render(el._popover.el, Popover.view(el._popover, el._popover.options));
    }, delay);
    m.render(el._popover.el, Popover.view(el._popover, el._popover.options));
  };
}
