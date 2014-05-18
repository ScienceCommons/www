/** @jsx m */

"use strict";
require("./ReplicationsTable.scss");

var _ = require("underscore");

var BadgeCell = require("./BadgeCell.js");

var ReplicationsTable = {};

ReplicationsTable.controller = function(options) {
  this.modalState = m.prop({id: null, field: null, editing: false});
  this.studies = options.studies;

  var _this = this;
  this.studyColumnControllers = this.studies.map(function(study) {
    return new StudyColumn.controller({study: study, modalState: _this.modalState});
  });

  this.hasOpenModal = function() {
    return _this.modalState().id !== null;
  };
};

ReplicationsTable.view = function(ctrl) {
  var studies = _.map(ctrl.studyColumnControllers, function(studyColumnController) {
    return new StudyColumn.view(studyColumnController);
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

      <div className={"studies " + (ctrl.hasOpenModal() ? "hasOpenModal" : "")}>
        {studies}
      </div>
    </div>
  );
};

var StudyColumn = {};

StudyColumn.controller = function(options) {
  this.modalState = options.modalState; // {id: study_id, field: field, editing: false}
  this.study = options.study;
  this.expanded = m.prop(false);
  this.newReplication = m.prop(false);

  var _this = this;
  this.replicationColumnControllers = this.study.get("replications").map(function(replication) {
    return new StudyColumn.controller({study: replication, modalState: _this.modalState});
  });

  this.fieldControllers = {};
  _.each(["authors", "independentVariables", "dependentVariables", "n", "power", "effectSize", "badges"], function(field) {
    _this.fieldControllers[field] = new StudyColumn.fieldController(field, _this);
  });

  this.hasOpenModal = function(field) {
    var state = _this.modalState();
    var matchesStudy = state.id === _this.study.get("id");
    if (field) {
      return matchesStudy && state.field === field
    } else {
      return matchesStudy;
    }
  };

  this.toggleReplications = function(e) {
    e.preventDefault();
    _this.expanded(!_this.expanded());
  };

  this.addReplication = function(e) {
    e.preventDefault();
    var newReplication = new Study({article_id: 123});
    _this.replicationColumnControllers.push(new StudyColumn.controller({study: newReplication, modalState: _this.modalState}));
    _this.newReplication(newReplication);
  };
};

StudyColumn.view = function(ctrl, isReplication) {
  var study = ctrl.study;

  if (ctrl.expanded()) {
    var replications = _.map(ctrl.replicationColumnControllers, function(replicationCtrl) {
      return new StudyColumn.view(replicationCtrl, true);
    });
  }

  if (!isReplication) {
    var addReplicationLink = <a href="#" onclick={ctrl.addReplication} class="add_replication"></a>;
  }

  if (study.get("replications").length > 0) {
    var count = study.get("replications").length;
    var replicationCountLink = (
      <a href="#" onclick={ctrl.toggleReplications} class={"replicationsCount " + (ctrl.expanded() ? "" : "closed")}>
        <div class="count"><span className="icon icon_replication"></span> {count}</div>
      </a>
    );
  }

  var fields = _.map(["authors", "independentVariables", "dependentVariables", "n", "power", "effectSize"], function(field) {
    return new StudyColumn.fieldView(ctrl.fieldControllers[field]);
  });

  return (
    <div className={"study " + (ctrl.hasOpenModal() ? "hasOpenModal" : "")}>
      <div className="details">
        <div className="replicationPath cell">
          {addReplicationLink}
          {replicationCountLink}
        </div>
        {fields}
      </div>

      <div className="replications">
        {replications}
      </div>
    </div>
  );
};

StudyColumn.fieldController = function(field, ctrl) {
  this.field = field;
  this.comment = m.prop("");
  this.study = ctrl.study;

  // initialize any necessary field controllers
  var column = StudyColumn.fields[field];
  if (column.controller) {
    column.controller(this);
  }
  if (_.isFunction(column.modalEditController)) {
    column.modalEditController(this);
  }

  var _this = this;
  this.open = function() {
    var open = ctrl.modalState();
    return open.id === _this.study.get("id") && open.field === field;
  };

  this.editing = function() {
    return _this.open() && ctrl.modalState().editing;
  };

  this.handleEditClick = function() {
    ctrl.modalState({id: _this.study.get("id"), field: field, editing: true});
  };

  this.handleEditSubmit = function(e) {
    e.preventDefault();
    _this.saveEdits();
    ctrl.modalState({id: _this.study.get("id"), field: field, editing: false});
  };

  this.handleCommentSubmit = function(e) {
    e.preventDefault();
    _this.study.addComment(field, {body: _this.comment()});
    _this.comment("");
  };

  this.handleClick = function(e) {
    if (_this.open()) {
      ctrl.modalState({id: _this.study.get("id"), field: field, editing: ctrl.modalState().editing});
    } else {
      ctrl.modalState({id: _this.study.get("id"), field: field, editing: false});
    }
  };
};

StudyColumn.fieldView = function(ctrl) {
  if (StudyColumn.fields[ctrl.field].cellView) { // make it easy to have a custom cell renderer
    return (
      <div className={"cell " + field} onclick={ctrl.handleClick} >
        {new StudyColumn.fields[ctrl.field].cellView(ctrl)}
      </div>
    )
  } else {
    var study = ctrl.study;
    var field = ctrl.field;

    if (study.hasPendingEdits(field)) {
      var pendingEditsIndicator = <span className="icon icon_alert"></span>;
    }

    if (study.hasComments(field)) {
      var commentsIndicator = <span className="icon icon_comment"></span>;
    }

    if (pendingEditsIndicator || commentsIndicator) {
      var indicators = (
        <div className="indicators">
          {pendingEditsIndicator}
          {commentsIndicator}
        </div>
      );
    }

    var modal;
    if (ctrl.editing()) {
      modal = new StudyColumn.fieldModalEditView(ctrl);
    } else if (ctrl.open()) {
      modal = (
        <div className="fieldModal" config={StudyColumn.modalConfig}>
          {new StudyColumn.fieldModalView(ctrl)}
        </div>
      );
    }

    return (
      <div className={"cell " + field + (modal ? " hasOpenModal" : "")}>
        <div onclick={ctrl.handleClick} className="cellContents">
          {study.get(field)}
          {indicators}
        </div>
        {modal}
      </div>
    );
  }
};

var scrollIntoViewIfOutOfView = require("../../utils/ScrollIntoView.js");

StudyColumn.modalConfig = function(element, isInitialized) {
  if (isInitialized) return;
  scrollIntoViewIfOutOfView(element);
};

StudyColumn.fieldModalView = function(ctrl) {
  var comments = ctrl.study.getComments(ctrl.field).map(function(comment) {
    return (
      <li className="fieldComment">
        <div className="commentAuthor">{comment.get("authorName")}</div>
        <div className="commentDate">{comment.get("timeAgo")}</div>
        {comment.get("body")}
      </li>
    );
  });

  var valueChanges = <li className="valueChange">Value set to: {ctrl.study.get(ctrl.field)}</li>;

  return (
    <div>
      <header>
        <div className="fieldTop">
          <div className="fieldTitle">{StudyColumn.fields[ctrl.field].modalHeader(ctrl)}</div>
          <button className="btn" onclick={ctrl.handleEditClick}><span className="icon icon_edit"></span></button>
        </div>
        <div className="fieldUpdatedDate">June 15, 2014</div>
      </header>

      <ul className="flow">
        {valueChanges}
        {comments}
      </ul>

      <footer>
        <form className="addComment" onsubmit={ctrl.handleCommentSubmit}>
          <textarea placeholder="Add a comment" oninput={m.withAttr("value", ctrl.comment)}>{ctrl.comment()}</textarea>
          <button type="submit" className="btn">Post</button>
        </form>
      </footer>
    </div>
  );
};

StudyColumn.fieldModalEditView = function(ctrl) {
  var EditView = StudyColumn.fields[ctrl.field].modalEditView;

  return (
    <form onsubmit={ctrl.handleEditSubmit} className="fieldModal" config={StudyColumn.modalConfig}>
      <header>
        <button type="submit" className="btn">Done</button>
      </header>

      <div className="editView">
        {new EditView(ctrl)}
      </div>
    </form>
  );
};

StudyColumn.fields = {};

StudyColumn.fields.replicationPath = {};
StudyColumn.fields.replicationPath.modalHeader = function(ctrl) {};
StudyColumn.fields.replicationPath.modalEditController = function(ctrl) {};
StudyColumn.fields.replicationPath.modalEditView = function(ctrl) {};

StudyColumn.fields.authors = {};
StudyColumn.fields.authors.modalHeader = function(ctrl) {
  return "Authors";
};

StudyColumn.fields.authors.modalEditController = function(ctrl) {
  ctrl.authors = m.prop(ctrl.study.get("authors"));

  ctrl.saveEdits = function() {
    ctrl.study.set("authors", ctrl.authors());
    ctrl.authors(ctrl.study.get("authors"));
  };
};
StudyColumn.fields.authors.modalEditView = function(ctrl) {
  return (
    <div>
      <input type="text" value={ctrl.authors()} oninput={m.withAttr("value", ctrl.authors)} />
    </div>
  );
};

StudyColumn.fields.badges = {}; // this uses dropdowns not modals
StudyColumn.fields.badges.controller = BadgeCell.controller;
StudyColumn.fields.badges.cellView = BadgeCell.view;

StudyColumn.fields.independentVariables = {};
StudyColumn.fields.independentVariables.modalHeader = function(ctrl) {
  return "Independent variables";
};

StudyColumn.fields.independentVariables.modalEditController = function(ctrl) {
  ctrl.independentVariables = m.prop(ctrl.study.get("independentVariables"));

  ctrl.saveEdits = function() {
    ctrl.study.set("independentVariables", ctrl.independentVariables());
    ctrl.independentVariables(ctrl.study.get("independentVariables"));
  };
};

StudyColumn.fields.independentVariables.modalEditView = function(ctrl) {
  return (
    <div>
      <input type="text" value={ctrl.independentVariables()} oninput={m.withAttr("value", ctrl.independentVariables)} />
    </div>
  );
};

StudyColumn.fields.dependentVariables = {};
StudyColumn.fields.dependentVariables.modalHeader = function(ctrl) {
  return "Dependent variables";
};
StudyColumn.fields.dependentVariables.modalEditController = function(ctrl) {
  ctrl.dependentVariables = m.prop(ctrl.study.get("dependentVariables"));

  ctrl.saveEdits = function() {
    ctrl.study.set("dependentVariables", ctrl.dependentVariables());
    ctrl.dependentVariables(ctrl.study.get("dependentVariables"));
  };
};

StudyColumn.fields.dependentVariables.modalEditView = function(ctrl) {
  return (
    <div>
      <input type="text" value={ctrl.dependentVariables()} oninput={m.withAttr("value", ctrl.dependentVariables)} />
    </div>
  );
};

StudyColumn.fields.n = {};
StudyColumn.fields.n.modalHeader = function(ctrl) {
  return "Sample size";
};

StudyColumn.fields.n.modalEditController = function(ctrl) {
  ctrl.n = m.prop(ctrl.study.get("n"));

  ctrl.saveEdits = function() {
    ctrl.study.set("n", ctrl.n());
    ctrl.n(ctrl.study.get("n"));
  };
};

StudyColumn.fields.n.modalEditView = function(ctrl) {
  return (
    <div>
      <input type="text" value={ctrl.n()} oninput={m.withAttr("value", ctrl.n)} />
    </div>
  );
};

StudyColumn.fields.power = {};
StudyColumn.fields.power.modalHeader = function(ctrl) {
  return "Power " + ctrl.study.get("power") + "%";
};

StudyColumn.fields.power.modalEditController = function(ctrl) {
  ctrl.power = m.prop(ctrl.study.get("power"));

  ctrl.saveEdits = function() {
    ctrl.study.set("power", ctrl.power());
    ctrl.power(ctrl.study.get("power"));
  };
};

StudyColumn.fields.power.modalEditView = function(ctrl) {
  return (
    <div>
      <input type="text" value={ctrl.power()} oninput={m.withAttr("value", ctrl.power)} />
    </div>
  )
};

StudyColumn.fields.effectSize = {};
StudyColumn.fields.effectSize.modalHeader = function(ctrl) {
  return "Effect size";
};

StudyColumn.fields.effectSize.modalEditController = function(ctrl) {
  ctrl.effectSize = m.prop(ctrl.study.get("effectSize"));

  ctrl.saveEdits = function() {
    ctrl.study.set("effectSize", ctrl.effectSize());
    ctrl.effectSize(ctrl.study.get("effectSize"));
  };
};

StudyColumn.fields.effectSize.modalEditView = function(ctrl) {
  return (
    <div>
      <input type="text" value={ctrl.effectSize()} oninput={m.withAttr("value", ctrl.effectSize)} />
    </div>
  )
};

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

ReplicationsTable.cellView = function(study, field) {
  return (
    <div className={"cell " + field + " " + (study.hasComments(field) ? "icon icon_comment" : "")}>
      {study.get(field)}
    </div>
  );
}

ReplicationsTable.studyView = function(study, isReplication) {
  if (study.get("replications") && study.get("closed") !== true) {
    var replications = _.map(study.get("replications"), function(replication) {
      return ReplicationsTable.studyView(replication, true)
    });
  }

  if (!isReplication) {
    var addReplicationLink = <a href="#" onclick={ReplicationsTable.studyAddReplications(study)} class="add_replication"></a>;
  }

  if (study.get("replications") && study.get("replications").length > 0) {
    var count = study.get("replications").length;
    var replicationCountLink = (
      <a href="#" onclick={ReplicationsTable.toggleStudyReplications(study)} class={"replicationsCount " + (study.get("closed") ? "closed" : "")}>
        <div class="count"><span className="icon icon_replication"></span> {count}</div>
      </a>
    );
  }

  return (
    <div className="study">
      <div className="details">
        <div className="replicationPath cell">
          {addReplicationLink}
          {replicationCountLink}
        </div>
        <div className="authors cell">{study.get("authors")}</div>
        {BadgeCell.view({study: study})}
        {ReplicationsTable.cellView(study, "independentVariables")}
        {ReplicationsTable.cellView(study, "dependentVariables")}
        {ReplicationsTable.cellView(study, "n")}
        {ReplicationsTable.cellView(study, "power")}
        {ReplicationsTable.cellView(study, "effectSize")}
      </div>

      <div className="replications">
        {replications}
      </div>
    </div>
  );
};

module.exports = ReplicationsTable;
