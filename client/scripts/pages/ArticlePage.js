/**
 * @jsx React.DOM
 */

"use strict";

var _ = require("underscore");
var React = require("react/addons");
var DefaultLayout = require("../layouts/DefaultLayout.js");
var Spinner = require("../components/Spinner.js");
var TagEditor = require("../components/TagEditor.js");

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
    var _this = this;
    if (_this.props.articleId) {
      var xhr = new XMLHttpRequest();
      xhr.onload = function() {
        _this.setState({
          loading: false,
          article: JSON.parse(xhr.responseText),
          xhr: null
        });
      };

      xhr.open("get", "http://api.papersearch.org/articles/"+_this.props.articleId, true);
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
          <table>
            <tr>
              <td>
                <h3>{article.title}</h3>
                <h5>Some authors {article.publication_date}</h5>
              </td>
              <td>
                <table className="publication_doi">
                  <tr>
                    <td className="text_right dim">Publication</td>
                    <td>Science</td>
                  </tr>
                  <tr>
                    <td className="text_right dim">DOI</td>
                    <td>{article.doi}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <h3>Abstract</h3>
                <p>{article.abstract}</p>
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
