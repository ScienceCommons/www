/** @jsx m */

"use strict";
require("./ReplicationsTable.scss");

var Badge = require("./Badge.js");

var ReplicationsTable = {};

ReplicationsTable.studyAddReplications = function(study) {
  return function(e) {
    e.preventDefault();
    study.initializeAssociations();
    study.get("replications").add({});
    study.set("closed", false);
  };
};

ReplicationsTable.toggleStudyReplications = function(study) {
  return function(e) {
    e.preventDefault();
    study.set("closed", !study.get("closed"));
  };
};

ReplicationsTable.studyView = function(study, isReplication) {
  if (study.get("replications") && study.get("closed") !== true) {
    var replications = study.get("replications").map(function(replication) {
      return ReplicationsTable.studyView(replication, true)
    });
  }

  if (!isReplication) {
    var addReplicationLink = <a href="#" onclick={ReplicationsTable.studyAddReplications(study)} class="add_replication"></a>;
  }

  if (study.get("replications") && study.get("replications").length > 0) {
    var count = study.get("replications").length;
    var replicationCountLink = <a href="#" onclick={ReplicationsTable.toggleStudyReplications(study)} class="replicationsCount closed"><div class="count">{count}</div></a>;
  }

  return (
    <div className="study">
      <div className="details">
        <div className="replicationPath cell">
          {addReplicationLink}
          {replicationCountLink}
        </div>
        <div className="authors cell">{study.get("authors")}</div>
        <div className="badges cell">
          {new Badge.view({badge: "data", active: true})}
          {new Badge.view({badge: "methods", active: true})}
          {new Badge.view({badge: "registration"})}
          {new Badge.view({badge: "disclosure"})}
        </div>
        <div className="independentVariables cell">{study.get("independentVariables")}</div>
        <div className="dependentVariables cell">{study.get("dependentVariables")}</div>
        <div className="n cell">{study.get("n")}</div>
        <div className="power cell">{study.get("power")}%</div>
        <div className="effectSize cell">d={study.get("effectSize")}</div>
      </div>

      <div className="replications">
        {replications}
      </div>
    </div>
  );
};

ReplicationsTable.view = function(ctrl) {
  var article = ctrl.article;
  var studies = article.get("studies").map(function(study) {
    return ReplicationsTable.studyView(study);
  });

  return (
    <div className="ReplicationsTable">
      <div className="legend">
        <div className="replicationPath cell">Replication path</div>
        <div className="authors cell">Authors</div>
        <div className="badges cell"></div>
        <div className="independentVariables cell">Independent Variables</div>
        <div className="dependentVariables cell">Dependent Variables</div>
        <div className="n cell">N <span className="icon icon_person"></span></div>
        <div className="power cell">Power</div>
        <div className="effectSize cell">Effect Size</div>
      </div>
      <div className="studies">
        {studies}
      </div>
    </div>
  );
};

module.exports = ReplicationsTable;