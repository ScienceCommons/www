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
    ]
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
    year: function() {
      var date = this.get("publication_date");
      if (date) {
        return (new Date(date)).getFullYear();
      }
    }
  }
});

module.exports = ArticleModel;