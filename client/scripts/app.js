/** @jsx m */

"use strict";
require("../styles/normalize.scss");
require("../styles/icons.css");
require("../styles/app.scss");

var _ = require("underscore");

var UserModel = require("./models/UserModel.js");
var Pages = require("./pages.js");
var GoogleAnalytics = require("./utils/GoogleAnalytics.js");


var App = {};

App.pages = {
  NotFound: require("./pages/NotFoundPage.js"),
  About: require("./pages/AboutPage.js"),  
  Article: require("./pages/ArticlePage.js"),
  Author: require("./pages/AuthorPage.js"),
  Home: require("./pages/HomePage.js"),
  Login: require("./pages/LoginPage.js"),
  Logout: require("./pages/LogoutPage.js"),
  Profile: require("./pages/ProfilePage.js"),
  Search: require("./pages/SearchPage.js"),
  Signup: require("./pages/SignupPage.js")
};

App.controller = function() {
  this.page = m.props("Home");
};

App.view = function(ctrl) {

};

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

var appController = new App.controller();

m.route(document.getElementById("page"), "/", {
  "/": appController.page("Home"),
  "/query/": appController.page("Search"),
  "/query/:query": appController.page("Search"),
  "/profile": appController.page("Profile"),
  "/articles/:articleId": appController.page("Article"),
  "/authors/:authorId": appController.page("AuthorPage"),
  "/login": appController.page("Login"),
  "/about": appController.page("About"),
  "/logout": appController.page("Logout"),
  "/signup": appController.page("Signup")
});

module.exports = App;
