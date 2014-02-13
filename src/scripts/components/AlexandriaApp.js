/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var Search = require('./Search.js');

// CSS
require('../../styles/reset.css');
require('../../styles/main.css');

var AlexandriaApp = React.createClass({
  /*jshint ignore:start */
  render: function() {
    return (
      <div className='main'>
        <h1 class="h1">Alexandria Search</h1>
        <Search />
      </div>
    );
  }
  /*jshint ignore:end */
});

React.renderComponent(<AlexandriaApp />, document.getElementById('content')); // jshint ignore:line

module.exports = AlexandriaApp;
