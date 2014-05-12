/** @jsx m */

"use strict";
require("./Pill.scss");

var Pill = {};

Pill.controller = function() {};

Pill.view = function(ctrl) {
  return <div className="Pill">{ctrl.label}</div>;
};

module.exports = Pill;