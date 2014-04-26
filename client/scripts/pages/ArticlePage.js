/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var DefaultLayout = require("../layouts/DefaultLayout.js");
var ArticleModel = require("../models/Article.js");
var ArticleView = require("../views/ArticleView.js");

require("../../styles/pages/ArticlePage.scss");

var ArticlePage = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function () {
    return {
      article: new ArticleModel({id: this.props.articleId}),
      loading: true
    };
  },
  componentWillMount: function () {
    if (this.props.articleId) {
      this.xhr = this.state.article.fetch().done(this.loadingDone);
    }
  },
  loadingDone: function() {
    this.xhr = null;
    this.setState({loading: false});
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
