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

          <div>
            <h1>Replications</h1>
            <table className="Replications">
              <thead>
                <tr>
                  <th>Replication path</th>
                  <th colSpan="3" className="ReplicationPath">
                    <div className="study"></div>
                    <div className="replication open"></div>
                    <div className="study"></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Authors &amp; Study</td>
                  <td>Zhong et al.</td>
                  <td className="replication">Zhong et al.</td>
                  <td>Zhong et al.</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="badges">
                    <i className="badge blue icon icon_bkgr_squircle">
                      <i className="icon icon_sml_data"></i>
                    </i>
                    <i className="badge blue icon icon_bkgr_squircle">
                      <i className="icon icon_sml_methods"></i>
                    </i>
                    <i className="badge icon icon_bkgr_squircle">
                      <i className="icon icon_sml_registration"></i>
                    </i>
                    <i className="badge icon icon_bkgr_squircle">
                      <i className="icon icon_sml_disclosure"></i>
                    </i>
                  </td>
                  <td className="badges replication">
                    <i className="badge blue icon icon_bkgr_squircle">
                      <i className="icon icon_sml_data"></i>
                    </i>
                    <i className="badge blue icon icon_bkgr_squircle">
                      <i className="icon icon_sml_methods"></i>
                    </i>
                    <i className="badge icon icon_bkgr_squircle">
                      <i className="icon icon_sml_registration"></i>
                    </i>
                    <i className="badge icon icon_bkgr_squircle">
                      <i className="icon icon_sml_disclosure"></i>
                    </i>
                  </td>
                  <td className="badges">
                    <i className="badge blue icon icon_bkgr_squircle">
                      <i className="icon icon_sml_data"></i>
                    </i>
                    <i className="badge blue icon icon_bkgr_squircle">
                      <i className="icon icon_sml_methods"></i>
                    </i>
                    <i className="badge icon icon_bkgr_squircle">
                      <i className="icon icon_sml_registration"></i>
                    </i>
                    <i className="badge icon icon_bkgr_squircle">
                      <i className="icon icon_sml_disclosure"></i>
                    </i>
                  </td>
                </tr>
                <tr>
                  <td>Independent variables</td>
                  <td>
                    Transcribe unethical vs ethical deed
                  </td>
                  <td className="replication">
                    Transcribe unethical vs ethical deed
                  </td>
                  <td>
                    Transcribe unethical vs ethical deed
                  </td>
                </tr>
                <tr>
                  <td>Dependent variables</td>
                  <td>
                    Desirability of cleaning-related products
                  </td>
                  <td className="replication">
                    Desirability of cleaning-related products
                  </td>
                  <td>
                    Desirability of cleaning-related products
                  </td>
                </tr>
                <tr>
                  <td>N <span className="icon icon_person"></span></td>
                  <td>27</td>
                  <td className="replication">27</td>
                  <td>27</td>
                </tr>
                <tr>
                  <td>Power</td>
                  <td>86%</td>
                  <td className="replication">86%</td>
                  <td>27</td>
                </tr>
                <tr>
                  <td>Effect size</td>
                  <td>d=1.08</td>
                  <td className="replication">d=1.08</td>
                  <td>d=1.08</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4">
                    <button className="btn">View Graph</button>
                  </td>
                </tr>
              </tfoot>
            </table>
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
                  <div>
                    <h3>Comments</h3>
                    <form>
                      <input type="text" placeholder="Add a comment" />
                      <button type="submit" className="btn">Post</button>
                    </form>
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
