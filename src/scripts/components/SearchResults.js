/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.CSSTransitionGroup;
var Link = require('react-router-component').Link;

var SearchResult = React.createClass({
  /*jshint ignore:start */
  render: function() {
    var data = this.props.data;

    if (data) {
      return (
        <li className="search-result">
          <ReactTransitionGroup transitionName="fade">
            <div><span className="h3">{data.name}</span><span className="h5"> by <Link href="/profile">{data.author}</Link></span></div>
            <p>{data.blurb}</p>
          </ReactTransitionGroup>
        </li>
      );
    } else {
      return (<li />)
    }
  }
  /*jshint ignore:end */
});

var SearchResults = React.createClass({
  getDefaultProps: function() {
    return {
      results: []
    };
  },
  /*jshint ignore:start */
  render: function() {
    var results = this.props.results
      , i = 0
      , len = results.length
      , content = [];

    for (i = 0; i < len; i++) {
      content.push(<SearchResult data={results[i]} />);
    }
    return (
      <ul>
        {content}
      </ul>
    );
  }
  /*jshint ignore:end */
});

module.exports = SearchResults;
