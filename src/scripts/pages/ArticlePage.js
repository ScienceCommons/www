/**
 * @jsx React.DOM
 */

'use strict';

var _ = require('underscore');
var React = require('react/addons');
var Articles = require("../data.js").Articles;
var Spinner = require('../components/Spinner.js');

var ArticlePage = React.createClass({
  getInitialState: function () {
    return {
      article: false,
      loading: true
    };
  },
  componentWillMount: function () {
    var _this = this;
    var article = _.findWhere(Articles, {id: this.props.articleId});

    setTimeout(function() {
      _this.setState({article: article, loading: false});
    }, 500);
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
          <h1 className="h1">{article.name}</h1>
          <p>{article.blurb}</p>
        </div>
      );
    } else {
      content = <h1>Article not found</h1>
    }

    return (
      <div>
        {content}
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = ArticlePage;