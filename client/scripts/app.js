/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var _ = require("underscore");
var Router = require("react-router-component");
var Locations = Router.Locations;
var Location = Router.Location;
var NotFound = Router.NotFound;
var UserModel = require("./models/UserModel.js");

require("./vendor/react.backbone.js");

var Pages = require("./pages.js");
var GoogleAnalytics = require("./utils/GoogleAnalytics.js");

// CSS
require("../styles/reset.scss");
require("../styles/icons.css");
require("../styles/app.scss");


var App = React.createClass({
  mixins: [Router.NavigatableMixin],
  getInitialState: function() {
    var userData = _.extend({}, CS.user, {loading: _.isUndefined(CS.user)});
    return {
      user: new UserModel(userData)
    };
  },
  /*jshint ignore:start */
  render: function() {
    if (this.state.user.cortex.loading.val()) {
      return (
        <Locations onNavigation={GoogleAnalytics.TrackNavigation} hash>
          <NotFound handler={Pages.Login} />
        </Locations>
      );
    } else {
      var user = this.state.user;
      return (
        <Locations onNavigation={GoogleAnalytics.TrackNavigation} hash>
          <Location path="/" user={user} handler={Pages.Home} />
          <Location path="/query/" user={user} handler={Pages.Search} />
          <Location path="/query/:query" user={user} handler={Pages.Search} />
          <Location path="/profile" user={user} handler={Pages.Profile} />
          <Location path="/articles/:articleId" user={user} handler={Pages.Article} />
          <Location path="/authors/:authorId" user={user} handler={Pages.Author} />
          <Location path="/login" user={user} handler={Pages.Login} />
          <Location path="/about" user={user} handler={Pages.About} />          
          <Location path="/logout" user={user} handler={Pages.Logout} />
          <Location path="/signup" user={user} handler={Pages.Signup} />
          <NotFound handler={Pages.NotFound} />
        </Locations>
      );
    }
  }
  /*jshint ignore:end */
});

React.renderComponent(<App />, document.getElementById("page")); // jshint ignore:line

module.exports = App;
