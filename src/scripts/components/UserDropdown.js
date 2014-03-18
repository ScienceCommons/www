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
  /*jshint ignore:start */
  render: function() {
    var classes = cx({
      hide: !this.state.open,
      dropdown_menu: true
    });

    return (
      <div className="btn_group user_dropdown inline_block dropdown">
        <button type="button" className="btn btn_subtle no_outline" onClick={this.toggle}>
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
