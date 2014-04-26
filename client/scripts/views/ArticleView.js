/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var Spinner = require("../components/Spinner.js");
var TagEditor = require("../components/TagEditor.js");

require("../../styles/views/ArticleView.scss");

var ArticleView = React.createClass({
  mixins: [
    React.addons.LinkedStateMixin,
    React.BackboneMixin("article")
  ],
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
      <div className="ArticleView">
        {content}
      </div>
    );
  }
  /*jshint ignore:end */
});

module.exports = ArticleView;
