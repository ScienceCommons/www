/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var Router = require("react-router-component");
var Locations = Router.Locations;
var Location = Router.Location;
var Cortex = require("cortexjs");
var NotFound = Router.NotFound


var Pages = require("./pages.js");

// CSS
require("../styles/reset.scss");
require("../styles/icons.css");
require("../styles/main.scss");


var App = React.createClass({
  /*jshint ignore:start */
  render: function() {
    return (
      <Locations>
        <Location path="/" handler={Pages.Home} />
        <Location path="/query/" handler={Pages.Search} />
        <Location path="/query/:query" handler={Pages.Search} />
        <Location path="/profile" handler={Pages.Profile} />
        <Location path="/articles/:articleId" handler={Pages.Article} />
        <Location path="/authors/:authorId" handler={Pages.Author} />
        <NotFound handler={Pages.NotFound} />
      </Locations>
    );
  }
  /*jshint ignore:end */
});

React.renderComponent(<App />, document.getElementById("page")); // jshint ignore:line

module.exports = App;
