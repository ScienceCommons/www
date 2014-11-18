/** @jsx m */

"use strict";
require("./CommentForm.scss");

var m = require("mithril");

var DropdownSelect = require("./DropdownSelect.js");

var CommentForm = {};

CommentForm.controller = function(options) {
  this.body = m.prop("");
  this.anonymous = m.prop(false);
  this.user = options.user;
  this.comments = options.comments;
  this.field = options.field;

  this.dropdownSelectController = new DropdownSelect.controller({
    options: [
      {value: false, content: <img src={this.user.get("gravatarUrl")} className="userImage" />},
      {value: true, content: <div className="userImage"><span className="icon icon_person"></span></div>}
    ],
    value: this.anonymous,
    onchange: this.anonymous
  });

  var _this = this;

  this.handleSubmit = function(e) {
    e.preventDefault();
    var res = _this.comments.add({
      "owner_id": _this.user.get("id"),
      "comment": _this.body(),
      "anonymous": _this.anonymous(),
      "field": _this.field
    }, {sync: true});

    _this.body("");
    if (options.onAdd) {
      options.onAdd();
    }
  };

  this.handleInput = function() {
    _this.body(this.value);
    CommentForm.autosize(this);
  };
};

CommentForm.autosize = function(el) {
  el.style.height = "auto";
  el.style.height = el.scrollHeight+'px';
};

CommentForm.view = function(ctrl) {
  return (
    <form className="CommentForm" onsubmit={ctrl.handleSubmit}>
      <table>
        <tbody>
          <tr>
            <td className="commentUserSelect">{new DropdownSelect.view(ctrl.dropdownSelectController)}</td>
            <td className="commentBodyTextarea"><textarea value={ctrl.body()} oninput={ctrl.handleInput} placeholder="Leave a comment"/></td>
            <td className="commentSubmit"><button type="submit" className="btn post">Post</button></td>
          </tr>
        </tbody>
      </table>
    </form>
  );
};

module.exports = CommentForm;
