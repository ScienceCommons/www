/** @jsx m */

"use strict";
require("./AboutHelpBar.scss");
var OnUnload = require("../utils/OnUnload.js");
var Dropdown = require("./Dropdown.js");

var AboutHelpBar = {};

AboutHelpBar.controller = function(){
  OnUnload(this);
  this.controllers.dropdown = new Dropdown.controller({
    className:"help",
    label:"Help"
  });
};

AboutHelpBar.view = function(ctrl){

  var dropdownContent = (
    <ul>
      {routeLi("/help", "How-To / FAQ")}
      <li>
        <a href="mailto:contact@curatescience.org?Subject=Curate%20Science">Contact</a>
      </li>
    </ul>
  );

  return (
    <ul className="AboutHelpBar">
      <li>
        <div class="Dropdown help">
          <button class="btn btn_subtle" type="button" onclick={route("/about")}>
            About
          </button>
        </div>
      </li>
      <li>
        {new Dropdown.view(ctrl.controllers.dropdown, dropdownContent)}
      </li>
    </ul>
  );
};

function routeLi(path, name) {
  return (
      <li onclick={route(path)} className={m.route() === path ? "selected" : ""}>{name}</li>
  );
};

function route(path) {
  return function(e) {
    return m.route(path);
  };
};

module.exports = AboutHelpBar;
