/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");

var ArticleModel = require("../models/ArticleModel.js");

var DefaultLayout = require("../layouts/DefaultLayout.js");
var Spinner = require("../components/Spinner.js");
var TagEditor = require("../components/TagEditor.js");
var ContentEditable = require("../components/ContentEditable.js");

require("../../styles/pages/ArticlePage.scss");

var ArticlePage = React.createClass({
  getInitialState: function () {
    return {
      article: new ArticleModel({id: this.props.articleId}, {callback: this.handleArticleUpdate, loading: true})
    };
  },
  componentWillMount: function () {
    this.state.article.fetch();
  },
  handleArticleUpdate: function() {
    this.setState({article: this.state.article});
  },
  componentWillUnmount: function() {
    this.state.article.unmount();
  },
  /*jshint ignore:start */
  render: function () {
    var loading = this.state.article.loading;
    var article = this.state.article.cortex;
    var content;

    if (loading) {
      content = <Spinner />
    } else if (article) {
      content = (
        <div>
          <table>
            <tr>
              <td>
                <h3><ContentEditable editable={true} data={article.title} /></h3>
                <h5>{article.authors.val().join(", ")} (<ContentEditable editable={true} data={article.publication_date} />)</h5>
              </td>
              <td>
                <table className="publication_doi">
                  <tr>
                    <td className="text_right dim">Publication</td>
                    <td><ContentEditable editable={true} data={article.publication} /></td>
                  </tr>
                  <tr>
                    <td className="text_right dim">DOI</td>
                    <td><ContentEditable editable={true} data={article.doi} /></td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <h3>Abstract</h3>
                <p><ContentEditable editable={true} data={article.abstract} /></p>
              </td>
              <td>
                <h3>Editable Tags</h3>
                <TagEditor tags={article.tags} editable={true} />
                <h3>Tags</h3>
                <TagEditor tags={article.tags} />
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