/**
 * @jsx React.DOM
 */

"use strict";

var _ = require("underscore");
var React = require("react/addons");
var Spinner = require("../components/Spinner.js");
var DefaultLayout = require("../layouts/DefaultLayout.js");
var UserModel = require("../models/UserModel.js");

var AuthorPage = React.createClass({
  getInitialState: function () {
    return {
      loading: true,
      author: new UserModel({id: this.props.authorId}, {callback: this.handleAuthorUpdate, loading: true})
    };
  },
  handleAuthorUpdate: function() {
    this.setState({author: this.state.author});
  },
  /*jshint ignore:start */
  render: function () {
    var loading = this.state.author.loading;
    var author = this.state.author.cortex;

    if (loading) {
      content = <Spinner />
    } else if (author) {
      content = (
        <div>
          <h1 className="h1">{author.name.val()}</h1>
        </div>
      );
    } else {
      content = <h1>Author not found</h1>
    }

    return (
      <DefaultLayout id="AuthorPage" user={this.props.user}>
        {content}
      </DefaultLayout>
    );
  }
  /*jshint ignore:end */
});

module.exports = AuthorPage;
