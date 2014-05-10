/**
 * @jsx React.DOM
 */

"use strict";
require("./UserBar.scss");

var React = require("react/addons");
var Router = require("react-router-component");
var Link = Router.Link;
var Notifications = require("./Notifications.js");
var Dropdown = require("./Dropdown.js");

var UserBar = React.createClass({
  handleBookmarkClick: function() {
    console.log("bookmarking");
  },
  /*jshint ignore:start */
  render: function() {
    var user = this.props.user.cortex;
    var dropdown;
    if (user.loading.val()) {
      dropdown = <Dropdown />;
    } else {
      var image = <img src={this.props.user.imageUrl()} />;
      dropdown = (
        <Dropdown label={image} className="user">
          <ul>
            <li><Link href="/profile">Profile</Link></li>
            <li><Link href="/saved">Saved searches</Link></li>
            <li><Link href="/logout">Log out</Link></li>
          </ul>
        </Dropdown>
      );
    }

    return (
      <div className="UserBar">
        <Notifications />
        <span className="icon icon_bookmark" onClick={this.handleBookmarkClick}></span>
        <Link href="/history" className="history"><span className="icon icon_history"></span></Link>
        {dropdown}
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = UserBar;