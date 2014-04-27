/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var Cortex = require("cortexjs");

var DefaultLayout = require("../layouts/DefaultLayout.js");
var ArticleModel = require("../models/ArticleModel.js");
var ArticleView = require("../views/ArticleView.js");

require("../../styles/pages/ArticlePage.scss");

var ArticlePage = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function () {
    return {
      article: ArticleModel({}),
      loading: true,
      errors: null
    };
  },
  componentWillMount: function () {
    if (this.props.articleId) {
      var xhr = new XMLHttpRequest();
      var _this = this;
      xhr.onload = function() {
        _this.xhr = null;

        var data = JSON.parse(xhr.responseText);
        var article = ArticleModel(data, function() {
          _this.setState({article: article});
        });

        _this.setState({loading: false, article: article});
      };
      xhr.open("get", "http://api.papersearch.org/articles/"+this.props.articleId, true);
      xhr.send();

      this.xhr = xhr;
    }
  },
  componentWillUnmount: function() {
    if (this.xhr) {
      this.xhr.abort();
    }
  },
  /*jshint ignore:start */
  render: function () {
    return (
      <DefaultLayout id="ArticlePage">
        <ArticleView article={this.state.article} loading={this.state.loading} />
      </DefaultLayout>
    );
  }
  /*jshint ignore:end */
});

module.exports = ArticlePage;
