/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Router = require('react-router-component');
var Locations = Router.Locations;
var Location = Router.Location;


var Pages = require('./pages.js');

// CSS
require('../styles/reset.css');
require('topcoat/css/topcoat-desktop-light.css');
require('../styles/main.css');


var App = React.createClass({
  /*jshint ignore:start */
  render: function() {
    return (
      <Locations>
        <Location path="/" handler={Pages.Search} />
        <Location path="/query/" handler={Pages.Search} />
        <Location path="/query/:query" handler={Pages.Search} />
        <Location path="/profile" handler={Pages.Profile} />
        <Location path="/articles/:articleId" handler={Pages.Article} />
        <Location path="/authors/:authorId" handler={Pages.Author} />
      </Locations>
    );
  }
  /*jshint ignore:end */
});

React.renderComponent(<App />, document.getElementById('content')); // jshint ignore:line

module.exports = App;
