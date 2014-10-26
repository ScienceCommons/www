"use strict";

var GoogleAnalytics = {};

GoogleAnalytics.TrackNavigation = function() {
  ga("send", "pageview", "/beta" + m.route());
};

module.exports = GoogleAnalytics;
