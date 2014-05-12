/** @jsx m */

"use strict";
require("./app.scss");

var UserModel = require("./models/UserModel.js");
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

App.showPage = function(pageName) {
  var Page = {};

  Page.controller = function() {
    if (!CS.user && App.user) {
      delete App.user;
    } else if (CS.user && !App.user) {
      App.user = new UserModel(CS.user);
    }

    if (!App.user && pageName !== "Login") {
      this.currentPage = App.pages["Login"];
      this.pageController = new this.currentPage.controller({user: App.user});
      m.route("/login");
    } else {
      this.currentPage = App.pages[pageName];
      this.pageController = new this.currentPage.controller({user: App.user});
      GoogleAnalytics.TrackNavigation();  
    }
  };

  Page.view = function(ctrl) {
    return new ctrl.currentPage.view(ctrl.pageController);
  };

  return Page;
};

m.route.mode = "pathname";
m.route(document.getElementById("page"), "/not_found", {
  "/": App.showPage("Home"),
  "/query": App.showPage("Search"),
  "/query/": App.showPage("Search"),
  "/query/:query": App.showPage("Search"),
  "/profile": App.showPage("Profile"),
  "/articles/:articleId": App.showPage("Article"),
  "/authors/:authorId": App.showPage("Author"),
  "/login": App.showPage("Login"),
  "/about": App.showPage("About"),  
  "/logout": App.showPage("Logout"),
  "/signup": App.showPage("Signup"),
  "/not_found": App.showPage("NotFound")
});

module.exports = App;
