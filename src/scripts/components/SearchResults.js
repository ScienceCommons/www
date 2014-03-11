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
      var doi;
      if (data.doi) {
        doi = (
          <span>| doi: <a href={"http://www.plosone.org/article/info"+encodeURIComponent(":doi/"+data.doi)} target="_blank">{data.doi}</a>
          </span>
        );
      }

      return (
        <li className="search-result" key={data.id}>
          <ReactTransitionGroup transitionName="fade">
            <div>
              <Link className="h3 link" href={"/articles/"+data.id}>{data.title}</Link>
              <div className="h5">{data.publication_date} {doi}</div>
            </div>
            <p>{data.abstract}</p>
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
  componentWillUnmount: function() {
    if (this.state.xhr) {
      this.state.xhr.abort();
    }
  },
  fetchResults: function() {
    // this will be an xhr to our search server
    var _this = this;
    var query = _this.props.query;
    if (!query) {
      return
    } else {
      var xhr = new XMLHttpRequest();

      xhr.onload = function() {
        var res;
        try {
          res = JSON.parse(xhr.responseText) || {};
        } catch (e) {
          res = {};
        };

        _this.setState({
          loading: false,
          results: res.documents,
          total: res.total,
          from: res.from,
          xhr: null
        });
      };

      xhr.open("get", "http://api.papersearch.org/articles?q="+query, true);
      xhr.send();

      _this.setState({ loading: true, xhr: xhr });
    }
  },
  /*jshint ignore:start */
  render: function() {
    var content;

    if (this.state.loading) {
      content = <li><Spinner /></li>;
    } else if (this.state.results.length > 0 ) {
      content = this.state.results.map(function(result) {
        return <SearchResult data={result} />;
      });
    } else {
      content = (
        <li>
          <h3>Sorry, no results were found</h3>
        </li>
      );
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
