/** @jsx m */

"use strict";

var _ = require("underscore");
var m = require("mithril");

var CurateBaseModel = require("./CurateBaseModel.js");
var CommentModel = require("./CommentModel.js");

var UserModel = CurateBaseModel.extend({
  name: "User",
  relations: {
    "articles": {type: "many", model: require("./ArticleModel.js")},
    "comments": {type: "many", model: CommentModel},
    "notifications": {type: "many", model: require("./NotificationModel.js")},
    "bookmarks": {type: "many", model: CurateBaseModel}
  },
  defaults: {
    "email": "",
    "name": "",
    "invite_count": 0,
    "password": "f662c13e-0a4d-11e4-a0d0-b2227cce2b54", // placeholder password
    "first_name": "",
    "middle_name": "",
    "last_name": "",
    "facebook": "",
    "twitter": "",
    "gravatar": "8c51e26145bc08bb6f43bead1b5ad07f.png", // me
    "areas_of_study": ["Astrophysics", "Cosmology"],
    "about": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec venenatis nulla in turpis luctus rutrum. Quisque adipiscing leo fringilla enim luctus ultricies. Fusce iaculis augue tincidunt eleifend condimentum. Vestibulum commodo massa ut vulputate aliquam. Etiam eu ante id est varius auctor. Sed fermentum at purus ac pellentesque. Duis nibh est, ornare ac tellus a, fermentum porta velit. In in risus et orci rhoncus egestas.\n\nNulla facilisi. Proin iaculis, nisl dictum consequat tincidunt, lectus arcu tincidunt magna, a placerat purus dui vitae dui. Maecenas fermentum luctus sodales. Cras vestibulum, erat in gravida tristique, augue ante scelerisque diam, non porta sem metus.",
    //"bookmarks": [{bookmarkable_type: "Article", bookmarkable_id: "52529"}, {bookmarkable_type: "Article", bookmarkable_id: "51037"}] // article ids
  },
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
  },
  canEdit: function() {
    return true;
  },
  canInvite: function() {
    return true;
  },
  hasBookmarked: function(type, id) {
    return this.get("bookmarks").findWhere({bookmarkable_type: type, bookmarkable_id: id});
  },
  toggleArticleBookmark: function(article) {
    if (this.hasArticleBookmarked(article)) {
      this.set("bookmarks", _.without(this.get("bookmarks"), article.get("id")));
    } else {
      this.set("bookmarks", this.get("bookmarks").concat([article.get("id")]));
    }
  },
  urlRoot: "https://www.curatescience.org/users",
  toggleAdmin: function() {
    var _this = this;
    var req = this.sync("create", {}, {url: this.url() + "/toggle_admin", data: {state: !this.get("admin")}});
    req.then(function(data) { _this.set(data); }, this.error);
    return req;
  },
  logout: function() {
    return this.sync("read", {}, {url: "https://www.curatescience.org/log_out"});
  }
});

CommentModel.prototype.relations.author = {model: UserModel}; // if we define it in CommentModel we get a circular reference

module.exports = UserModel;
