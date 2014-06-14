/** @jsx m */

"use strict";

var BaseModel = require("./BaseData.js").Model;
var CommentModel = require("./CommentModel.js");

var UserModel = BaseModel.extend({
  relations: {
    "articles": {type: "many", model: require("./ArticleModel.js")},
    "comments": {type: "many", model: CommentModel},
    "notifications": {type: "many", model: require("./NotificationModel.js")},
  },
  defaults: {
    "email": "stephen@curatescience.org",
    "first_name": "Stephen",
    "middle_name": "",
    "last_name": "Demjanenko",
    "facebook": "sdemjanenko",
    "twitter": "sdemjanenko",
    "gravatar": "8c51e26145bc08bb6f43bead1b5ad07f.png", // me
    "notifications": [
      {title: "foo", body: "foo body", read: false},
      {title: "bar", body: "bar body", read: true}
    ],
    "areas_of_study": ["Astrophysics", "Cosmology"],
    "about": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec venenatis nulla in turpis luctus rutrum. Quisque adipiscing leo fringilla enim luctus ultricies. Fusce iaculis augue tincidunt eleifend condimentum. Vestibulum commodo massa ut vulputate aliquam. Etiam eu ante id est varius auctor. Sed fermentum at purus ac pellentesque. Duis nibh est, ornare ac tellus a, fermentum porta velit. In in risus et orci rhoncus egestas.\n\nNulla facilisi. Proin iaculis, nisl dictum consequat tincidunt, lectus arcu tincidunt magna, a placerat purus dui vitae dui. Maecenas fermentum luctus sodales. Cras vestibulum, erat in gravida tristique, augue ante scelerisque diam, non porta sem metus."
  },
  logout: function() {},
  computeds: {
    facebookUrl: function() {
      return "https://www.facebook.com/" + this.get("facebook");
    },
    fullName: function() {
      return [this.get("first_name"), this.get("middle_name"), this.get("last_name")].join(" ");
    },
    gravatarUrl: function() {
      return "//www.gravatar.com/avatar/" + this.get("gravatar");
    },
    twitterUrl: function() {
      return "https://www.twitter.com/" + this.get("twitter");
    },
    image: function() {
      if (this.get("gravatar")) {
        return <img src={this.get("gravatarUrl")} className="userImage"/>;
      } else {
        return <div className="userImage initials">{this.get("initials")}</div>
      }
    },
    initials: function() {
      return this.get("first_name")[0] + this.get("last_name")[0];
    }
  }
});

CommentModel.prototype.relations.author = {model: UserModel}; // if we define it in CommentModel we get a circular reference

module.exports = UserModel;
