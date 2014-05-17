/** @jsx m */

"use strict";
require("./Dropdown.scss");

var m = require("mithril");
var cx = require("../utils/ClassSet.js");

var Dropdown = {};

Dropdown.controller = function(options) {
  options = options || {};

  this.open = m.prop(false);
  this.className = options.className || "";
  this.label = options.label;

  var _this = this;
  this.toggle = function() {
    _this.open(!_this.open());
  };

  this.outsideClick = function(e) {
    if (_this.open()) {
      //var button = this.refs.button.getDOMNode();
      //if (e.target != button && e.target.parentNode != button) {
        _this.open(false);
      //}
    }
  }

  //document.addEventListener("click", this.outsideClick);
  //document.removeEventListener("click", this.outsideClick); on unload
};

Dropdown.view = function(ctrl, content, label) {
  if (ctrl.open()) {
    var dropdownContent = <div className="dropdownContent">{content}</div>;
  }

  return (
    <div className={"Dropdown " + ctrl.className}>
      <button type="button" className="btn btn_subtle no_outline" onclick={ctrl.toggle}>
        {label || ctrl.label}
      </button>
      {dropdownContent}
    </div>
  );
};

module.exports = Dropdown;