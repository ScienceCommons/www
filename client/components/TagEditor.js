/** @jsx m */

"use strict";
require("./TagEditor.scss");

var _ = require("underscore");
var m = require("mithril");
var cx = require("../utils/ClassSet.js");

var TagEditor = {};

TagEditor.controller = function(options) {
  this.tags = options.tags;

  var _this = this;
  this.addPill = function() {
    var pills = _this.pills();
    var newPill = {
      text: "",
      controller: new TagEditor.pillController()
    };
    pills.push(newPill);
    _this.pills(pills);
  };
};

TagEditor.pillController = function(options) {
  options = options || {};

  this.editable = options.editable || false;
  this.editing = m.prop(options.editing || false);
  this.text = m.prop(options.text || "");

  var _this = this;
  this.handleEditClick = function() {
    _this.editing(true);
  };

  this.handleCheckMarkClick = function(e) {
    e.preventDefault();
    _this.editing(false);
  };

  this.handleRemoveClick = function() {
    _this.text("");
  };
};

TagEditor.pillView = function(pillCtrl) {
  var content = pillCtrl.text();

  if (pillCtrl.editable) {
    if (pillCtrl.editing()) {
      content = (
        <form onSubmit={pillCtrl.handleCheckMarkClick} >
          <input type="text" value={pillCtrl.text()} oninput={m.withAttr("value", pillCtrl.text)} />
          <button type="submit"><span className="icon icon_check_mark"></span></button>
          <button type="button" onClick={pillCtrl.handleRemoveClick}><span className="icon icon_close"></span></button>
        </form>
      );
    } else {
      var controls = <span className="icon icon_edit" onClick={pillCtrl.handleEditClick}></span>;
    }
  }

  return <div className="Pill">{content} {controls}</div>;
};

TagEditor.view = function(ctrl) {
  var pills = ctrl.tags.map(function(tag) {
    return new TagEditor.pillView(tag, ctrl.editable);
  });

  if (ctrl.editable) {
    var add = <span className="icon icon_add" onClick={ctrl.addPill}></span>;
  }
  
  return (
    <div className="TagEditor">
      {pills}
      {add}
    </div>
  );
};

module.exports = TagEditor;