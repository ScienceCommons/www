/**
 * @jsx React.DOM
 */

"use strict";

require("./Dropdown.scss");

var React = require("react/addons");
var cx = React.addons.classSet;

var Dropdown = React.createClass({
  getInitialState: function() {
    return {
      open: false
    };
  },
  getDefaultProps: function() {
    return {
      className: ""
    };
  },
  toggle: function() {
    this.setState({open: !this.state.open});
  },
  outsideClick: function(e) {
    if (this.state.open) {
      var button = this.refs.button.getDOMNode();
      if (e.target != button && e.target.parentNode != button) {
        this.setState({open: false});
      }
    }
  },
  componentDidMount: function() {
    document.addEventListener("click", this.outsideClick);
  },
  componentWillUnmount: function() {
    document.removeEventListener("click", this.outsideClick);
  },
  /*jshint ignore:start */
  render: function() {
    if (this.state.open) {
      var content = <div className="content">{this.props.children}</div>;
    }

    return (
      <div className={"Dropdown " + this.props.className}>
        <button type="button" className="btn btn_subtle no_outline" onClick={this.toggle} ref="button">
          {this.props.label}
        </button>
        {content}
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = Dropdown;