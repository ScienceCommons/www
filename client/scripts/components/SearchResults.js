/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var _ = require("underscore");

var Link = require("react-router-component").Link;
var Spinner = require("./Spinner.js");
var SearchFilter = require("./SearchFilter.js");

require("../../styles/components/SearchResults.scss");

var SearchResult = React.createClass({
  /*jshint ignore:start */
  render: function() {
    var data = this.props.data;

    if (data) {
      if (data.publication_date) {
        var pub_date = <span>| {data.publication_date}</span>;
      }
      if (data.doi) {
        var doi = (
          <span>| doi: <a href={"http://www.plosone.org/article/info"+encodeURIComponent(":doi/"+data.doi)} target="_blank">{data.doi}</a>
          </span>
        );
      }

      return (
        <li className="SearchResult" key={data.id}>
          <div>
            <Link className="h3 link" href={"/articles/"+data.id}>{data.title}</Link>
            <div className="h5">{_.pluck(data.authors_denormalized, "last_name").join(", ")} {pub_date} {doi}</div>
          </div>
          <p>{data.abstract}</p>
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
      var _this = this;
      _this.replaceState(_this.getInitialState(), function() {
        _this.fetchResults(newProps.query);
      });
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

      xhr.open("get", "http://api.curatescience.org/articles?q="+query+"&from="+this.state.from, true);
      xhr.send();

      _this.setState({ loading: true, xhr: xhr });
    }
  },
  previousPage: function() {
    var _this = this;
    _this.setState({from: Math.max(this.state.from-this.state.resultsPerPage, 0) }, function() {
      _this.fetchResults(_this.props.query);
    });
  },
  nextPage: function() {
    var _this = this;
    _this.setState({from: this.state.from + this.state.resultsPerPage }, function() {
      _this.fetchResults(_this.props.query);
    });
  },
  renderNav: function() {
    var nav;
    var next;
    var previous;

    if (this.state.total > 0) {
      if (this.state.from > 0) {
        previous = <button className="btn btn_subtle" onClick={this.previousPage}><span className="icon icon_left_arrow" /></button>;
      }
      if (this.state.from + this.state.resultsPerPage < this.state.total) {
        next = <button className="btn btn_subtle" onClick={this.nextPage}><span className="icon icon_right_arrow" /></button>;
      }

      nav = (<li className="search_nav">
        Showing {this.state.from+1} to {Math.min(this.state.total, this.state.from+this.state.resultsPerPage)} of {this.state.total} results
        <span>{previous}{next}</span>
      </li>);
    }

    return nav;
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
    } else {
      content = (
        <li>
          <h3>Sorry, no results were found</h3>
        </li>
      );
    }

    if (this.state.total > 0) {
      nav = this.renderNav();
    }

    return (
      <ul className="SearchResults">
        {nav}
        <table>
          <tbody>
            <tr>
              <td><SearchFilter /></td>
              <td>{content}</td>
            </tr>
          </tbody>
        </table>
      </ul>
    );
  }
  /*jshint ignore:end */
});

module.exports = SearchResults;
