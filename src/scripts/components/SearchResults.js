/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var ReactTransitionGroup = React.addons.CSSTransitionGroup;
var Link = require("react-router-component").Link;
var Spinner = require("./Spinner.js");

require("../../styles/components/SearchResults.scss");

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
        <li className="SearchResult" key={data.id}>
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
      total: 0,
      from: 0,
      resultsPerPage: 20,
      loading: true
    };
  },
  componentWillMount: function() {
    this.fetchResults(this.props.query);
  },
  componentWillUnmount: function() {
    if (this.state.xhr) {
      this.state.xhr.abort();
    }
  },
  componentWillReceiveProps: function(newProps) {
    if (newProps.query !== this.props.query) {
      if (this.state.xhr) {
        // abort
        this.state.xhr = null;
      }
      this.fetchResults(newProps.query);
    }
  },
  fetchResults: function(query) {
    // this will be an xhr to our search server
    var _this = this;
    if (!query) {
      return
    } else {
      if (this.state.xhr) {
        this.state.xhr.abort();
      }

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

      xhr.open("get", "http://api.papersearch.org/articles?q="+query+"&from="+this.state.from, true);
      xhr.send();

      _this.setState({ loading: true, xhr: xhr });
    }
  },
  previousPage: function() {
    this.state.from = Math.max(this.state.from-this.state.resultsPerPage, 0);
    this.fetchResults(this.props.query);
  },
  nextPage: function() {
    this.state.from = this.state.from+this.state.resultsPerPage;
    this.fetchResults(this.props.query);
  },
  renderNav: function() {
    var count;
    var pageNav;
    var next;
    var previous;

    if (this.state.total > 0) {
      if (this.state.from + this.state.resultsPerPage < this.state.total) {
        next = <span className="link" onClick={this.nextPage}>next page</span>;
      }
      if (this.state.from > 0) {
        previous = <span className="link" onClick={this.previousPage}>previous page</span>;
      }

      if (next && previous) {
        pageNav = <span>{next} | {previous}</span>;
      } else {
        pageNav = next || previous
      }

      count = <li>Showing {this.state.from+1} to {Math.min(this.state.total, this.state.from+this.state.resultsPerPage)} of {this.state.total} results {pageNav}</li>
    }

    return count;
  },
  /*jshint ignore:start */
  render: function() {
    var content;
    var nav;

    if (this.state.loading) {
      content = <li><Spinner /></li>;
    } else if (this.state.total > 0) {
      content = this.state.results.map(function(result) {
        return <SearchResult data={result} />;
      });
      nav = this.renderNav();
    } else {
      content = (
        <li>
          <h3>Sorry, no results were found</h3>
        </li>
      );
    }

    return (
      <ul className="SearchResults">
        {nav}
        {content}
      </ul>
    );
  }
  /*jshint ignore:end */
});

module.exports = SearchResults;
