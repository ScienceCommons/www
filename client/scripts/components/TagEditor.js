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
      value: "",
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
  var pills = _.map(ctrl.tags(), function(tag) {
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

var Pill = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    var val = this.props.tag.val();
    return {
      editing: val.length === 0,
      value: val
    };
  },
  getDefaultState: function() {
    return {
      editable: false
    };
  },
  handleEditClick: function() {
    this.setState({editing: true});
  },
  handleCheckMarkClick: function(e) {
    e.preventDefault();
    this.setState({editing: false});
    this.props.tag.set(this.state.value);
  },
  handleRemoveClick: function() {
    this.props.tag.remove();
  },
  /*jshint ignore:start */
  render: function() {
    var content = this.state.value;

    if (this.props.editable) {
      if (this.state.editing) {
        content = (
          <form onSubmit={this.handleCheckMarkClick} >
            <input type="text" valueLink={this.linkState("value")} />
            <button type="submit">
              <span className="icon icon_check_mark"></span>
            </button>
            <button type="button" onClick={this.handleRemoveClick}>
              <span className="icon icon_close"></span>
            </button>
          </form>
        );
      } else {
        var controls = <span className="icon icon_edit" onClick={this.handleEditClick}></span>;
      }
    }

    return <div className="Pill">{content} {controls}</div>;
  }
  /*jshint ignore:end */
});

module.exports = TagEditor;