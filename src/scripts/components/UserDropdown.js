/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var cx = React.addons.classSet;
var Link = require("react-router-component").Link;

require("../../styles/components/UserDropdown.scss");

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
      <div className="UserDropdown inline_block">
        <div className="btn_group dropdown">
          <button type="button" className="btn btn_subtle no_outline" onClick={this.toggle} ref="button">
            <span className="user email">user@curatescience.com</span> <span className="icon icon_down_caret" />
          </button>
          <ul className={classes}>
            <li><Link href="/profile">Profile</Link></li>
            <li><Link href="/saved">Saved searches</Link></li>
            <li><Link href="/signout">Sign out</Link></li>
          </ul>
        </div>
      </div>
    );
  }
  /*jshint ignore:end */
});
module.exports = UserDropdown;
