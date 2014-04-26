"use strict";

var GoogleAnalytics = {};

GoogleAnalytics.TrackNavigation = function() {
  ga('send', 'pageview');
};

module.exports = GoogleAnalytics;