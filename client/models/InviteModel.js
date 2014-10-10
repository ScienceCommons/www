/** @jsx m */

"use strict";

var CurateBaseModel = require("./CurateBaseModel.js");

var InviteModel = CurateBaseModel.extend({
  name: "Invite",
  defaults: {
    email: ""
  },
  urlRoot: "https://www.curatescience.org/invites"
});

module.exports = InviteModel;
