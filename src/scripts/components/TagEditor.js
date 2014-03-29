/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var _ = require("underscore");
var cx = React.addons.classSet;

require("../../styles/components/TagEditor.scss");

var Pill = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function() {
    return {
      editing: this.props.tag.length === 0,
      value: this.props.tag
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
    this.props.onChange(this.state.value);
  },
  handleRemoveClick: function() {
    this.props.onChange(null);
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

var TagEditor = React.createClass({
  getDefaultProps: function() {
    return {
      editable: false
    };
  },
  add: function() {
    var tags = this.props.valueLink;
    tags.requestChange(tags.value.concat([""]));
  },
  handleChange: function(tag) {
    var _this = this;
    return function(newTag) {
      if (newTag === null) {
        _this.remove(tag);
      } else {
        var tags = _this.props.valueLink;
        var index = tags.value.indexOf(tag);
        tags.value[index] = newTag;
        tags.requestChange(tags.value);
      }
    };
  },
  remove: function(tag) {
    var tags = this.props.valueLink;
    tags.requestChange(_.without(tags.value, tag));
  },
  /*jshint ignore:start */
  render: function() {
    var editable = this.props.editable;
    var tags = this.props.valueLink.value
    var _this = this;
    var pills = _.map(tags, function(tag) {
      if (tag) {
        var key = tag;
      }
      return <Pill tag={tag} onChange={_this.handleChange(tag)} editable={editable} key={key}/>;
    });

    if (editable) {
      var add = <span className="icon icon_add" onClick={this.add}></span>;
    }
    return (
      <div className="TagEditor">
        {pills}
        {add}
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = TagEditor;
