/**
 * @jsx React.DOM
 */

"use strict";

var React = require("react/addons");
var _ = require("underscore");

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
            <tbody>
              <tr>
                <td>
                  <h3><ContentEditable editable={true} data={article.title} /></h3>
                  <h5>{_.pluck(article.authors_denormalized.val(), "last_name").join(", ")} <ContentEditable editable={true} data={article.publication_date} /></h5>
                  <h3>Research Abstract</h3>
                  <p><ContentEditable editable={true} data={article.abstract} /></p>
                </td>
                <td className="text_right">
                  <div className="btn_group">
                    <button className="btn bookmark_article"><span className="icon icon_bookmark"></span></button>
                    <button className="btn"><span className="icon icon_share"></span></button>
                  </div>
                  <div className="dim">Journal</div>
                  <div>Science</div>
                  <div className="dim">DOI</div>
                  <div><ContentEditable editable={true} data={article.doi} /></div>
                  <div className="dim">Keywords</div>
                  <div>
                    <TagEditor tags={article.tags} editable={true} />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="Replications">
            <h1>Replications</h1>
          </div>

          <table>
            <tbody>
              <tr>
                <td>
                  <div>
                    <h3>Community Summary</h3>
                    <div className="dim">June 21, 2014</div>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eros tellus, venenatis molestie ligula in, lobortis lobortis est. Nunc adipiscing erat sed libero volutpat dapibus ultrices feugiat elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent ac nisi luctus arcu tempus malesuada. Fusce lectus augue, ultrices id purus ac, viverra convallis ipsum. Mauris convallis urna ut magna laoreet, quis dapibus dolor aliquet. Nunc tristique pulvinar imperdiet. Fusce et lectus ac nunc porta eleifend imperdiet sed diam. Curabitur sollicitudin id enim a lacinia. Suspendisse ultricies laoreet turpis a tempor. Cras dapibus, dolor quis ultrices convallis, sapien lectus blandit turpis, in mollis purus elit ac magna.
                    </p>
                  </div>
                    <h3>Comments</h3>
                    <form>
                      <input type="text" placeholder="Add a comment" />
                      <button type="submit" className="btn">Post</button>
                    </form>
                  <div>
                  </div>
                </td>
                <td>
                  <div>
                    <h3>Peer Review</h3>
                    <div className="dim">Action Editor</div>
                    <div>Cathleen Moore</div>
                    <div className="dim">Reviewer 1</div>
                    <div>Unknown at this time</div>
                    <div className="dim">Reviewer 2</div>
                    <div>Unknown at this time</div>
                  </div>
                  <div>
                    <h3>External Resources</h3>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else {
      content = <h1>Article not found</h1>;
    }

    return (
      <DefaultLayout id="ArticlePage" user={this.props.user}>
        {content}
      </DefaultLayout>
    );
  }
  /*jshint ignore:end */
});

module.exports = ArticlePage;
