"use strict";

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
  urlRoot: "https://api.curatescience.org/articles"
});

module.exports = ArticleModel;