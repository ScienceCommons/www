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

var TagEditor = React.createClass({
  getDefaultProps: function() {
    return {
      editable: false
    };
  },
  add: function() {
    this.props.tags.push("");
  },
  /*jshint ignore:start */
  render: function() {
    var editable = this.props.editable;
    var _this = this;
    var pills = this.props.tags.map(function(tag) {
      return <Pill tag={tag} editable={editable} key={tag.val()}/>;
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
