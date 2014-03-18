/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var cx = React.addons.classSet;

var UserDropdown = React.createClass({
  getInitialState: function() {
    return {
      open: false
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
    var classes = cx({
      hide: !this.state.open,
      dropdown_menu: true
    });

    return (
      <div className="btn_group user_dropdown inline_block dropdown">
        <button type="button" className="btn btn_subtle no_outline" onClick={this.toggle} ref="button">
          <span className="user email">user@curatescience.com</span> <span className="icon icon_down_caret" />
        </button>
        <ul className={classes}>
          <li>Profile</li>
          <li>Saved searches</li>
          <li>Sign out</li>
        </ul>
      </div>
    );
  }
  /*jshint ignore:end */
});
module.exports = UserDropdown;
