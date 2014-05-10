/** @jsx m */

"use strict";
require("./SearchResults.scss");

var _ = require("underscore");
var m = require("mithril");

var Spinner = require("./Spinner.js");
var SearchFilter = require("./SearchFilter.js");

var SearchResults = {};

SearchResults.controller = function() {
  this.results = m.prop([]);
  this.total = m.prop(0);
  this.from = m.prop(0);
  this.resultsPerPage = m.prop(20);
  this.loading = m.prop(true);

  var _this = this;
  this.previousPage = function() {
    _this.from(Math.max(_this.from()-_this.resultsPerPage(), 0));
    _this.fetchResults();
  };

  this.nextPage = function() {
    _this.from(_this.from() + _this.resultsPerPage());
    _this.fetchResults();
  };

  this.fetchResults = function() {
    _this.loading(true);

    var query = m.route.param("query");
    var t0 = _.now();
    m.request({method: "GET", url: "https://api.curatescience.org/articles?q="+query+"&from="+_this.from(), background: true}).then(function(res) {
      var t1 = _.now();

      _this.results(res.documents);
      _this.loading(false);
      _this.total(res.total);
      _this.from(res.from);
      m.redraw();

      // log timing
      ga('send', 'timing', 'SearchResults', 'Fetch', t1-t0, "/articles?q="+query+"&from="+res.from);
    });
  };

  this.fetchResults();
};

SearchResults.itemView = function(data) {
  if (data) {
    if (data.publication_date) {
      var pub_date = <span>| {data.publication_date}</span>;
    }
    if (data.doi) {
      var doi = (
        <span>| doi: <a href={"http://www.plosone.org/article/info"+encodeURIComponent(":doi/"+data.doi)} target="_blank">{data.doi}</a>
        </span>
      );
    }

    return (
      <li>
        <div>
          <a href={"/articles/"+data.id} config={m.route}>{data.title}</a>
          <div className="h5">{_.pluck(data.authors_denormalized, "last_name").join(", ")} {pub_date} {doi}</div>
        </div>
        <p>{data.abstract}</p>
      </li>
    );
  } else {
    return <li />;
  }
};

SearchResults.navView = function(ctrl) {
  if (ctrl.total() > 0) {
    if (ctrl.from() > 0) {
      var previous = <button className="btn btn_subtle" onClick={ctrl.previousPage}><span className="icon icon_left_arrow" /></button>;
    }
    if (ctrl.from() + ctrl.resultsPerPage() < ctrl.total()) {
      var next = <button className="btn btn_subtle" onClick={ctrl.nextPage}><span className="icon icon_right_arrow" /></button>;
    }

    var nav = (
      <div className="search_nav">
        Showing {ctrl.from()+1} to {Math.min(ctrl.total(), ctrl.from()+ctrl.resultsPerPage())} of {ctrl.total()} results
        <span>{previous}{next}</span>
      </div>
    );
  }

  return nav;
};

SearchResults.view = function(ctrl) {
  var content;

  if (ctrl.loading()) {
    content = <li>{new Spinner.view()}</li>;
  } else if (ctrl.total() > 0) {
    content = _.map(ctrl.results(), function(result) {
      return new SearchResults.itemView(result);
    });
  } else {
    content = (
      <li>
        <h3>Sorry, no results were found</h3>
      </li>
    );
  }

  if (ctrl.total() > 0) {
    if (ctrl.from() > 0) {
      var previous = <button className="btn btn_subtle" onClick={ctrl.previousPage}><span className="icon icon_left_arrow" /></button>;
    }
    if (ctrl.from() + ctrl.resultsPerPage() < ctrl.total()) {
      var next = <button className="btn btn_subtle" onClick={ctrl.nextPage}><span className="icon icon_right_arrow" /></button>;
    }

    var nav = (
      <div className="search_nav">
        Showing {ctrl.from()+1} to {Math.min(ctrl.total(), ctrl.from()+ctrl.resultsPerPage())} of {ctrl.total()} results
        <span>{previous}{next}</span>
      </div>
    );
  }

  return (
    <div className="SearchResults">
      {nav}

      <table>
        <tbody>
          <tr>
            <td>{new SearchFilter.view()}</td>
            <td>{content}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

module.exports = SearchResults;
