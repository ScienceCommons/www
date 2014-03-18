/**
 * @jsx React.DOM
 */

"use strict";

var _ = require("underscore");
var React = require("react/addons");
var Articles = require("../data.js").Articles;
var Spinner = require("../components/Spinner.js");
var PageHeader = require("../components/PageHeader.js");

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
      <div className="page">
        <PageHeader />

        <div className="content article_content">
          {content}
        </div>
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = ArticlePage;
