"use strict";

var _ = require("underscore");
var BaseModel = require("./BaseModel.js");

var ArticleModel = BaseModel.extend({
  defaults: {
    "title": "",
    "abstract": "",
    "tags": ["Moral purity", "Physical cleansing", "Cleansing products"],
    "doi": "",
    "publication_date": "",
    "authors_denormalized": [],
    "journal": "Science",
    "comments": [
      {
        "author": "Anonymous",
        "date": "4-1-2014",
        "title": "Foo",
        "body": "Blah",
        "replies": [
          {
            "author": "Stephen Demjanenko",
            "date": "4-1-2014",
            "title": "This is not useful",
            "body": "Try to leave useful comments.  Thanks!"
          }
        ]
      },
      {
        "author": "Stephen Demjanenko",
        "date": "4-1-2014",
        "title": "This is really usefuly",
        "body": "Im gonna see if I can replicate it"
      }
    ],
    "action_editor": "Cathleen Moore",
    "reviewers": ["Bob Bland", "Crystal Cali"],
    "community_summary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eros tellus, venenatis molestie ligula in, lobortis lobortis est. Nunc adipiscing erat sed libero volutpat dapibus ultrices feugiat elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent ac nisi luctus arcu tempus malesuada. Fusce lectus augue, ultrices id purus ac, viverra convallis ipsum. Mauris convallis urna ut magna laoreet, quis dapibus dolor aliquet. Nunc tristique pulvinar imperdiet. Fusce et lectus ac nunc porta eleifend imperdiet sed diam. Curabitur sollicitudin id enim a lacinia. Suspendisse ultricies laoreet turpis a tempor. Cras dapibus, dolor quis ultrices convallis, sapien lectus blandit turpis, in mollis purus elit ac magna.",
    "community_summary_date": "June 21, 2014"
  },
  urlRoot: "https://api.curatescience.org/articles",
  computeds: {
    authorsEtAl: function() {
      var authors = this.get("authors_denormalized");
      if (!_.isEmpty(authors)) {
        var lastName = authors[0].lastName;
        return lastName + (authors.length > 1 ? " et al.": "");
      }
    },
    authorLastNames: function() {
      var authors = this.get("authors_denormalized");
      var lastNames = _.pluck(authors, "last_name");
      return _.first(lastNames, lastNames.length-1).join(", ") + " & " + _.last(lastNames);
    },
    year: function() {
      var date = this.get("publication_date");
      if (date) {
        return (new Date(date)).getFullYear();
      }
    }
  }
});

module.exports = ArticleModel;