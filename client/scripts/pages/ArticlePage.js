/**
 * @jsx React.DOM
 */

"use strict";

var _ = require("underscore");
var React = require("react/addons");
var DefaultLayout = require("../layouts/DefaultLayout.js");
var Spinner = require("../components/Spinner.js");
var TagEditor = require("../components/TagEditor.js");
var ArticleModel = require("../models/Article.js");

require("../../styles/pages/ArticlePage.scss");

var ArticlePage = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function () {
    return {
      article: false,
      loading: true,
      tags: ["Moral purity", "Physical cleansing", "Cleansing products"]
    };
  },
  componentWillMount: function () {
    if (this.props.articleId) {
      var article = new ArticleModel({id: this.props.articleId});
      this.xhr = article.fetch().done(this.loadingDone);
      this.setState({article: article});
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
    var state = this.state;
    var article = state.article;
    var content;

    if (state.loading) {
      content = <Spinner />
    } else if (article) {
      content = (
        <div>
          <table>
            <tr>
              <td>
                <h3>{article.get("title")}</h3>
                <h5>Some authors {article.get("publication_date")}</h5>
              </td>
              <td>
                <table className="publication_doi">
                  <tr>
                    <td className="text_right dim">Publication</td>
                    <td>Science</td>
                  </tr>
                  <tr>
                    <td className="text_right dim">DOI</td>
                    <td>{article.get("doi")}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <h3>Abstract</h3>
                <p>{article.get("abstract")}</p>
              </td>
              <td>
                <h3>Tags</h3>
                <TagEditor valueLink={this.linkState("tags")} editable={true}/>
                <h3>Tags</h3>
                <TagEditor valueLink={this.linkState("tags")}/>
              </td>
            </tr>
          </table>
        </div>
      );
    } else {
      content = <h1>Article not found</h1>
    }

    return (
      <DefaultLayout id="ArticlePage">
        {content}
      </DefaultLayout>
    );
  }
  /*jshint ignore:end */
});

module.exports = ArticlePage;
