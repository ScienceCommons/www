/** @jsx m */

"use strict";
require("./ReplicationsTable.scss");

var Badge = require("./Badge.js");

var ReplicationsTable = {};

ReplicationsTable.studyView = function(study) {
  if (study.get("replications")) {
    var replications = study.get("replications").map(ReplicationsTable.studyView);
  }

  return (
    <div className="study">
      <div className="details">
        <div className="diagram cell"></div>
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
  var studies = article.get("studies").map(ReplicationsTable.studyView);
  return studies;
  return (
    <table className="Replications">
      <thead>
        <tr>
          <th>Replication path</th>
          <th colSpan="3" className="ReplicationPath">
            <div className="study"></div>
            <div className="replication open"></div>
            <div className="study"></div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Authors &amp; Study</td>
          <td>Zhong et al.</td>
          <td className="replication">Zhong et al.</td>
          <td>Zhong et al.</td>
        </tr>
        <tr>
          <td></td>
          <td className="badges">
            {new Badge.view({badge: "data", active: true})}
            {new Badge.view({badge: "methods", active: true})}
            {new Badge.view({badge: "registration"})}
            {new Badge.view({badge: "disclosure"})}
          </td>
          <td className="badges replication">
            {new Badge.view({badge: "data", active: true})}
            {new Badge.view({badge: "methods", active: true})}
            {new Badge.view({badge: "registration", active: true})}
            {new Badge.view({badge: "disclosure", active: true})}
          </td>
          <td className="badges">
            {new Badge.view({badge: "data"})}
            {new Badge.view({badge: "methods"})}
            {new Badge.view({badge: "registration"})}
            {new Badge.view({badge: "disclosure"})}
          </td>
        </tr>
        <tr>
          <td>Independent variables</td>
          <td>
            Transcribe unethical vs ethical deed
          </td>
          <td className="replication">
            Transcribe unethical vs ethical deed
          </td>
          <td>
            Transcribe unethical vs ethical deed
          </td>
        </tr>
        <tr>
          <td>Dependent variables</td>
          <td>
            Desirability of cleaning-related products
          </td>
          <td className="replication">
            Desirability of cleaning-related products
          </td>
          <td>
            Desirability of cleaning-related products
          </td>
        </tr>
        <tr>
          <td>N <span className="icon icon_person"></span></td>
          <td>27</td>
          <td className="replication">27</td>
          <td>27</td>
        </tr>
        <tr>
          <td>Power</td>
          <td>86%</td>
          <td className="replication">86%</td>
          <td>27</td>
        </tr>
        <tr>
          <td>Effect size</td>
          <td>d=1.08</td>
          <td className="replication">d=1.08</td>
          <td>d=1.08</td>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <td colSpan="4">
            <button className="btn">View Graph</button>
          </td>
        </tr>
      </tfoot>
    </table>
  );
};

module.exports = ReplicationsTable;