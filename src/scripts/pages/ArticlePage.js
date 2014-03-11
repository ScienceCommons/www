/**
 * @jsx React.DOM
 */

'use strict';

var _ = require('underscore');
var React = require('react/addons');
var Articles = require("../data.js").Articles;
var Spinner = require('../components/Spinner.js');
var Constants = require("../constants.js");
var Link = require('react-router-component').Link;
var Search = require('../components/Search.js');

var ArticlePage = React.createClass({
  getInitialState: function () {
    return {
      article: false,
      loading: true
    };
  },
  componentWillMount: function () {
    var _this = this;
    if (this.props.articleId) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        _this.setState({
          loading: false,
          article: JSON.parse(xhr.responseText),
          xhr: null
        });
      };

      xhr.open("get", "http://api.papersearch.org/articles/"+this.props.articleId, true);
      xhr.send();

      _this.setState({ xhr: xhr });
    }
  },
  componentWillUnmount: function() {
    if (this.state.xhr) {
      this.state.xhr.abort();
    }
  },
  /*jshint ignore:start */
  render: function () {
    var state = this.state;
    var article = state.article;
    var content;

    if (state.loading) {
      content = <Spinner />
    } else if (article) {
      content = (
        <div>
          <h3>{article.title}</h3>
          <h5>{article.publication_date} | doi: {article.doi}</h5>
          <p>{article.abstract}</p>
        </div>
      );
    } else {
      content = <h1>Article not found</h1>
    }

    return (
      <div className="article-page container-fluid">
        <div className="header row">
          <Link className="h1 inline-block" href={"/"}>{Constants.COMPANY_NAME}</Link>
          <Search query={this.props.query} className="inline-block"/>

          <button type="button" className="pull-right">user@curatescience.com</button>
        </div>
        <div className="row">
          {content}
        </div>
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = ArticlePage;