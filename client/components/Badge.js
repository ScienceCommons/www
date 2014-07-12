/** @jsx m */

"use strict";
require("./Badge.scss");

var cx = require("../utils/ClassSet.js");

var Badge = {};

Badge.icons = {
  data: require("./icons/DataIcon.js"),
  disclosure: require("./icons/DisclosureIcon.js"),
  methods: require("./icons/MethodsIcon.js"),
  registration: require("./icons/RegistrationIcon.js"),
  reproducible: require("./icons/ReproducibleIcon.js")
};

Badge.view = function(ctrl) {
  var classes = cx({
    Badge: true,
    active: ctrl.active
  });

  var viewBox = "0 0 32 32";
  if (ctrl.borderWidth) {
    viewBox = [
      -ctrl.borderWidth,
      -ctrl.borderWidth,
      32+2*ctrl.borderWidth,
      32+2*ctrl.borderWidth
    ].join(" ");
  }

  return (
    <svg x="0px" y="0px" viewBox={viewBox} className={classes}>
      <path d="M16,32C5.532813,32,0,26.467188,0,16S5.532813,0,16,0s16,5.532813,16,16S26.467188,32,16,32z"/>
      {new Badge.icons[ctrl.badge].view(ctrl)}
    </svg>
  );
};

module.exports = Badge;
