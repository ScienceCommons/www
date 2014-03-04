/**
 * @jsx React.DOM
 */

'use strict';

var React = require('react/addons');
var ReactTransitionGroup = React.addons.CSSTransitionGroup;
var Link = require('react-router-component').Link;
var Spinner = require('./Spinner.js');

var _ = require('underscore');
var SampleResults = require("../data.js").Articles;

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
  getInitialState: function() {
    return {
      results: [],
      loading: true
    };
  },
  componentWillMount: function() {
    this.fetchResults();
  },
  componentWillReceiveProps: function(newProps) {
    if (newProps.query !== this.props.query) {
      this.fetchResults();
    }
  },
  fetchResults: function() {
    // this will be an xhr to our search server
    var _this = this;
    var oReq = new XMLHttpRequest();

    oReq.onload = function() {
      var numResults = _.random(2, 8);
      _this.setState({
        loading: false,
        results: _.sample(SampleResults, numResults)
      });
    };

    oReq.open("get", "http://localhost:8000", true);
    oReq.send();

    this.setState({ loading: true });
  },
  /*jshint ignore:start */
  render: function() {
    var content;

    if (this.state.loading) {
      content = <li><Spinner /></li>;
    } else {
      content = this.state.results.map(function(result) {
        return <SearchResult data={result} />;
      });
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
