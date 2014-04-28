"use strict";

var GoogleAnalytics = {};

GoogleAnalytics.TrackNavigation = function() {
  ga('send', 'pageview', window.location.hash.slice(1));
};

module.exports = GoogleAnalytics;