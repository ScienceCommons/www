/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var Spinner = require("../components/Spinner.js");
var TagEditor = require("../components/TagEditor.js");

require("../../styles/views/ArticleView.scss");

var ArticleView = React.createClass({
  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function () {
    return {
      tags: ["Moral purity", "Physical cleansing", "Cleansing products"]
    };
  },
  /*jshint ignore:start */
  render: function () {
    var props = this.props;
    var article = props.article;
    var content;

    if (props.loading) {
      content = <Spinner />
    } else if (article) {
      content = (
        <div>
          <table>
            <tr>
              <td>
                <h3>{article.title.val()}</h3>
                <h5>Some authors {article.publication_date.val()}</h5>
              </td>
              <td>
                <table className="publication_doi">
                  <tr>
                    <td className="text_right dim">Publication</td>
                    <td>Science</td>
                  </tr>
                  <tr>
                    <td className="text_right dim">DOI</td>
                    <td>{article.doi.val()}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <h3>Abstract</h3>
                <p>{article.abstract.val()}</p>
              </td>
              <td>
                <h3>Tags</h3>
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
      <div className="ArticleView">
        {content}
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = ArticleView;
