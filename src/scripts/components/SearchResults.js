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
      var len = data.authors.length;
      var authorLinks = data.authors.map(function(author, i) {
        var prefix;
        if (i > 0) {
          if (i === len-1) {
            prefix = " & ";
          } else {
            prefix = ", ";
          }
        }
        return <span key={author.id}>{prefix}<Link href={"/authors/"+author.id}>{author.name}</Link></span>;
      });

      return (
        <li className="search-result" key={data.id}>
          <ReactTransitionGroup transitionName="fade">
            <div>
              <Link className="h3" href={"/articles/"+data.id}>{data.name}</Link>
              <span className="h5"> by {authorLinks}</span>
            </div>
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
