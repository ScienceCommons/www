/** @jsx m */

"use strict";
require("./ArticlePage.scss");

var _ = require("underscore");

var Layout = require("../layouts/DefaultLayout.js");
var Spinner = require("../components/Spinner.js");
var TagEditor = require("../components/TagEditor.js");
//var ContentEditable = require("../components/ContentEditable.js");
var Badge = require("../components/Badge.js");
var CommentBox = require("../components/CommentBox.js");

var ArticleModel = require("../models/ArticleModel.js");

var ArticlePage = {};


ArticlePage.controller = function(options) {
  options = _.extend({id: "ArticlePage"}, options);
  this.layoutController = new Layout.controller(options);
  this.article = new ArticleModel({id: m.route.params("articleId")}, {callback: m.redraw, loading: true})
  this.tagEditorController = new TagEditor.controller({tags: article.tags});
  this.commentBoxController = new CommentBox.controller({comments: article.comments});
  this.article.fetch();
};

ArticlePage.view = function(ctrl) {
  var loading = ctrl.article.loading;
  var article = ctrl.article.cortex;
  var content;

  if (loading) {
    content = new Spinner.view();
  } else if (article) {
    content = (
      <div>
        <table>
          <tbody>
            <tr>
              <td>
                <h3>{article.title.val()}</h3>
                <h5>{_.pluck(article.authors_denormalized.val(), "last_name").join(", ")} {article.publication_date.val()}</h5>
                <h3>Research Abstract</h3>
                <p><{article.abstract.val()}</p>
              </td>
              <td className="text_right">
                <div className="btn_group">
                  <button className="btn bookmark_article"><span className="icon icon_bookmark"></span></button>
                  <button className="btn"><span className="icon icon_share"></span></button>
                </div>
                <div className="dim">Journal</div>
                <div>Science</div>
                <div className="dim">DOI</div>
                <div>{article.doi.val()}</div>
                <div className="dim">Keywords</div>
                <div>
                  {new TagEditor.view(ctrl.tagEditorController)}
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
                  {new Badge.view({badge: "data", active: true})}
                  {new Badge.view({badge: "methods", active: true})}
                  {new Badge.view({badge: "registration"})}
                  {new Badge.view({badge: "disclosure"})}
                </td>
                <td className="badges replication">
                  {new Badge.view({badge: "data", active: true})}
                  {new Badge.view({badge: "methods", active: true})}
                  {new Badge.view({badge: "registration", active: true})}
                  {new Badge.view({badge: "disclosure", active: true})}
                </td>
                <td className="badges">
                  {new Badge.view({badge: "data"})}
                  {new Badge.view({badge: "methods"})}
                  {new Badge.view({badge: "registration"})}
                  {new Badge.view({badge: "disclosure"})}
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
                  {new CommentBox.view(ctrl.commentBoxController)}
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

  return new Layout.view(ctrl.layoutController, content);
};

module.exports = ArticlePage;
