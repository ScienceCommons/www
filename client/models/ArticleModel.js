"use strict";

var _ = require("underscore");
var BaseModel = require("./BaseData.js").Model;

var ArticleModel = BaseModel.extend({
  relations: {
    "comments": {type: "many", model: require("./CommentModel.js")},
    "studies": {type: "many", model: require("./StudyModel.js"), urlAction: "studies"}
  },
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
        "anonymous": true,
        "date": "4-1-2014",
        "body": "Blah",
        "replies": [
          {
            "author": {first_name: "Stephen", last_name: "Demjanenko"},
            "date": "4-1-2014",
            "body": "Try to leave useful comments.  Thanks!"
          }
        ]
      },
      {
        "author": {first_name: "Stephen", last_name: "Demjanenko"},
        "date": "4-1-2014",
        "body": "Im gonna see if I can replicate it"
      }
    ],
    /*"studies": [
      {
        "id": "1",
        "authors": "Zhong et al.",
        "badges": ["data", "methods", "registration", "disclosure"],
        "closed": true, // for testing the replication graph
        "replications": [
          {"id": "2", "authors": "Feng et al."},
          {"id": "3", "authors": "Wong et al."}
        ],
        "independentVariablesComments": [
          {
            "anonymous": true,
            "date": "4-1-2014",
            "body": "Blah",
            "replies": [
              {
                "author": {first_name: "Stephen", last_name: "Demjanenko"},
                "date": "4-1-2014",
                "body": "Try to leave useful comments.  Thanks!"
              }
            ]
          },
          {
            "author": {first_name: "Stephen", last_name: "Demjanenko"},
            "date": "4-1-2014",
            "body": "Im gonna see if I can replicate it"
          }
        ]
      }, {
        "id": "4",
        "authors": "Zhong et al.",
        closed: true,
        "replications": [
          {
            "id": "5",
            "authors": "Schwarmer et al.",
            "dependentVariablesComments": [
              {
                "anonymous": true,
                "date": "4-1-2014",
                "body": "Blah",
                "replies": [
                  {
                    "author": {first_name: "Stephen", last_name: "Demjanenko"},
                    "date": "4-1-2014",
                    "body": "Try to leave useful comments.  Thanks!"
                  }
                ]
              },
              {
                "id": "6",
                "author": {first_name: "Stephen", last_name: "Demjanenko"},
                "date": "4-1-2014",
                "body": "Im gonna see if I can replicate it"
              }
            ]
          }
        ]
      }, {
        "id": "7",
        "authors": "Zhong et al."
      }
    ],*/
    "action_editor": "Cathleen Moore",
    "reviewers": ["Bob Bland", "Crystal Cali"],
    "community_summary": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eros tellus, venenatis molestie ligula in, lobortis lobortis est. Nunc adipiscing erat sed libero volutpat dapibus ultrices feugiat elit. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent ac nisi luctus arcu tempus malesuada. Fusce lectus augue, ultrices id purus ac, viverra convallis ipsum. Mauris convallis urna ut magna laoreet, quis dapibus dolor aliquet. Nunc tristique pulvinar imperdiet. Fusce et lectus ac nunc porta eleifend imperdiet sed diam. Curabitur sollicitudin id enim a lacinia. Suspendisse ultricies laoreet turpis a tempor. Cras dapibus, dolor quis ultrices convallis, sapien lectus blandit turpis, in mollis purus elit ac magna.",
    "community_summary_date": "June 21, 2014"
  },
  initialize: function(data, options) {
    _.bindAll(this, "bookmark");
  },
  urlRoot: "https://api.curatescience.org/articles",
  computeds: {
    authorsEtAl: function() {
      var authors = this.get("authors_denormalized");
      if (!_.isEmpty(authors)) {
        var lastName = _.first(authors).last_name;
        return lastName + (authors.length > 1 ? " et al.": "");
      }
    },
    authorLastNames: function() {
      var authors = this.get("authors_denormalized");
      var lastNames = _.pluck(authors, "last_name");
      if (lastNames.length > 1) {
        return _.first(lastNames, lastNames.length-1).join(", ") + " & " + _.last(lastNames);
      } else if (lastNames.length == 1) {
        return _.first(lastNames);
      }
    },
    year: function() {
      var date = this.get("publication_date");
      if (date) {
        return (new Date(date)).getFullYear();
      }
    }
  },
  bookmark: function(remove) {
    this.sync(remove ? "delete" : "create", this, {
      data: {id: this.get("id")},
      url: this.url() + "/bookmark"
    });
  }
});

module.exports = ArticleModel;
