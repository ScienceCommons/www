/** @jsx m */

"use strict";
require("./StudiesTable.scss");

var _ = require("underscore");
var Study = require("../models/StudyModel.js");
var cx = require("../utils/ClassSet.js");
var Spinner = require("./Spinner.js");

var StudiesTable = {};

StudiesTable.controller = function(opts) {
  this.article = opts.article;
  this.active = m.prop({study_id: false, field: false, editing: false, dropdown: false});
  this.expanded = m.prop({}); // study_id's
  this.newStudy = m.prop(false);
  this.edits = m.prop({});

  var _this = this;
  this.addStudy = function() {
    if (_this.newStudy() !== false) {
      // warn that existing new study must be saved or removed
    } else {
      //_this.newStudy(new Study({
      //  article_id: _this.article.get("id")
      //}));
      _this.newStudy(new Study());
    }
  };

  this.saveNewStudy = function() {
    if (_this.newStudy() === false) {
      // error we shouldn't hit this
    } else {
      _this.article.get("studies").add(_this.newStudy(), {sync: true});
      _this.newStudy(false);
    }
  };

  this.discardNewStudy = function() {
    // deallocate?
    _this.newStudy(false);
  };

  this.saveStudy = function(study) {
    return function(e) {
      study.save();
    };
  };

  this.resetStudy = function(study) {
    return function(e) {
      study.set(study._serverState);
    };
  };

  this.deleteStudy = function(study) {
    return function(e) {
      var confirmation = confirm("This will permanently delete the study");
      if (confirmation) {
        _this.article.get("studies").remove(study, {sync: true});
      }
    };
  };

  this.toggleModal = function(study, field) {
    return function() {
      var active = _this.active();
      var id = study.get("id");
      if (field === "replication_path" || (active.study_id === id && active.field === field && !active.editing)) {
        active = {study_id: false, field: false, editing: false, dropdown: false};
      } else {
        if (active.study_id !== id || active.field !== field) {
          active.editing = false;
        }
        active.study_id = id;
        active.field = field;
      }
      _this.active(active);
    };
  };

  this.toggleExpanded = function(study) {
    return function(e) {
      e.preventDefault();
      var expanded = _this.expanded();
      var id = study.get("id");
      expanded[id] = !expanded[id];
      _this.expanded(expanded);
    };
  };

  this.handleEditClick = function() {
    var active = _this.active();
    active.editing = true;
    _this.active(active);
  };

  this.handleEditSubmit = function(study, field) {
    return function(e) {
      e.preventDefault();
      var active = _this.active();
      active.editing = false;
      _this.active(active);
      if (StudiesTable.modalEditors[field] && StudiesTable.modalEditors[field].onsubmit) {
        StudiesTable.modalEditors[field].onsubmit(_this, study);
      } else {
        var value = _this.getEdits(study, field, "value");
        if (!_.isUndefined(value)) {
          study.set(field, value);
        }
      }
      // if not isNew...
      // study.save...
    };
  };

  this.getEdits = function(study, field, attr) {
    var edits = _this.edits();
    var id = study.get("id");
    edits[id] = edits[id] || {};
    edits[id][field] = edits[id][field] || {};
    if (_.isUndefined(attr)) {
      return edits[id][field];
    } else {
      return edits[id][field][attr];
    }
  };

  this.updateEdits = function(study, field, attr) { // a field might have multiple editable fields
    return function(value) {
      var edits = _this.edits();
      var id = study.get("id");
      edits[id] = edits[id] || {};
      edits[id][field] = edits[id][field] || {};
      edits[id][field][attr] = value;
      _this.edits(edits);
    };
  };

  this.addComment = function(study, field) {
    return function(e) {
      e.preventDefault();

      var comment = {
        body: _this.getEdits(study, field, "comment")
      };

      if (!_.isEmpty(comment.body)) {
        study.getComments(field).add(comment, {sync: true});
        _this.updateEdits(study, field, "comment")("");
      } else {
        throw("Cannot submit an empty comment");
      }
    };
  };

  this.addReplication = function(study) {
    return function() {
      study.get("replications").add({});
      var expanded = _this.expanded();
      var id = study.get("id");
      expanded[id] = true;
      _this.expanded(expanded);
    };
  };
};

StudiesTable.view = function(ctrl) {
  var content;
  if (ctrl.article.get("studies").loading) {
    content = Spinner.view();
  } else {
    var studies = ctrl.article.get("studies").map(function(study) {
      if (ctrl.expanded()[study.get("id")]) {
        var replications = study.get("replications").map(function(replication) {
          return StudiesTable.studyView(ctrl, replication, {replication: true});
        });
      }
      return [StudiesTable.studyView(ctrl, study), replications];
    });

    if (ctrl.newStudy()) {
      studies.push(StudiesTable.studyView(ctrl, ctrl.newStudy(), {new: true}));
    } else {
      var addStudyButton = <button className="btn addStudy" onclick={ctrl.addStudy}>Add study</button>;
    }
    content = [<ul className="studies">{_.flatten(studies)}</ul>, addStudyButton];
  }

  // add study column

  return (
    <div className="StudiesTable">
      <header>
        <div className="cell replication_path">Replication path</div>
        <div className="cell authors">Authors</div>
        <div className="cell badges"></div>
        <div className="cell independent_variables">Independent Variables</div>
        <div className="cell dependent_variables">Dependent Variables</div>
        <div className="cell n">N <span className="icon icon_person"></span></div>
        <div className="cell power">Power</div>
        <div className="cell effect_size">Effect Size</div>
      </header>

      {content}
    </div>
  );
};

StudiesTable.studyView = function(ctrl, study, options) {
  var options = options || {};
  var cells = _.map(["replication_path", "authors", "badges", "independent_variables", "dependent_variables", "n", "power", "effect_size"], function(field) {
    return StudiesTable.studyCellView(ctrl, study, field, options);
  });

  if (options.new || study.hasChanges()) {
    var saveButtons = [
      <button type="button" className="btn saveStudy" onclick={options.new ? ctrl.saveNewStudy : ctrl.saveStudy(study)}>Save</button>,
      <button type="button" className="btn discardStudy" onclick={options.new ? ctrl.discardNewStudy : ctrl.resetStudy(study)}>Discard</button>
    ];
  } else if (!options.new) {
    var saveButtons = <button type="button" className="btn discardStudy" onclick={ctrl.deleteStudy(study)}>Delete</button>;
  }

  var classes = cx({
    "study": true,
    "new": options.new,
    "replication": options.replication
  });

  return (
    <li className={classes}>
      {cells}
      {saveButtons}
    </li>
  );
};


StudiesTable.studyCellView = function(ctrl, study, field, options) {
  var active = ctrl.active();
  if (active.study_id === study.get("id") && active.field === field) {
    var modal = StudiesTable.studyModalView(ctrl, study, field, options);
  }

  var contents;
  if (StudiesTable.cellViews[field]) {
    contents = StudiesTable.cellViews[field](ctrl, study, options);
  } else {
    contents = study.get(field);
  }

  // also include indicators
  return (
    <div className={"cell " + field}>
      <div className="cellContents" onclick={ctrl.toggleModal(study, field, options)}>
        {contents}
      </div>

      {modal}
    </div>
  );
};

StudiesTable.studyModalView = function(ctrl, study, field) {
  if (ctrl.active().editing) {
    var inputs;
    if (StudiesTable.modalEditors[field]) {
      inputs = StudiesTable.modalEditors[field].view(ctrl, study);
    } else {
      inputs = (
        <div className="inputs">
          <input type="text" value={_.isUndefined(ctrl.getEdits(study, field, "value")) ? study.get(field) : ctrl.getEdits(study, field, "value")} oninput={m.withAttr("value", ctrl.updateEdits(study, field, "value"))} />
        </div>
      );
    }
    return (
      <form className="studyModalView" onsubmit={ctrl.handleEditSubmit(study, field)}>
        <header>
          <button type="submit" className="btn">Done</button>
        </header>
        {inputs}
      </form>
    )
  } else {
    var comments = study.getComments(field).map(function(comment) {
      return (
        <li>{comment.get("body")}</li>
      );
    });

    return (
      <div className="studyModalView">
        <header>
          {field}
          <button className="btn" onclick={ctrl.handleEditClick}><span className="icon icon_edit"></span></button>
        </header>

        <ul className="history">
          {comments}
        </ul>

        <footer>
          <form onsubmit={ctrl.addComment(study, field)}>
            <textarea oninput={m.withAttr("value", ctrl.updateEdits(study, field, "comment"))}>{ctrl.getEdits(study, field, "comment") || ""}</textarea>
            <button type="submit" className="btn">Post</button>
          </form>
        </footer>
      </div>
    );
  }

  return (
    <div className={"studyModalView " + field}>
      {field}
    </div>
  );
};

StudiesTable.cellViews = {};

StudiesTable.cellViews.replication_path = function(ctrl, study, options) {
  if (!options.replication) {
    var addReplicationLink = <span class="add_replication" onclick={ctrl.addReplication(study)}></span>;
  }

  var count = study.get("replications").length;
  if (count > 0) {
    var replicationCountLink = <span className="icon icon_replication count" onclick={ctrl.toggleExpanded(study)}>{count}</span>;
  }

  return [addReplicationLink, replicationCountLink];
};

StudiesTable.cellViews.badges = function(ctrl, study) {
  var openDropdown = ctrl.active().dropdown;
  if (openDropdown) {
    var dropdown = openDropdown;
  }

  var badges = <li>Badges</li>;

  return [<ul>{badges}</ul>, dropdown];
};

StudiesTable.cellViews.effect_size = function(ctrl, study) {
  return study.get("displayEffectSize");
};

StudiesTable.modalEditors = {};
StudiesTable.modalEditors.effect_size = {};

StudiesTable.modalEditors.effect_size.view = function(ctrl, study) {
  var measure = _.isUndefined(ctrl.getEdits(study, "effect_size", "measure")) ? study.get("effectSizeMeasure") : ctrl.getEdits(study, "effect_size", "measure");
  var val = _.isUndefined(ctrl.getEdits(study, "effect_size", "value")) ? study.get("effectSizeValue") : ctrl.getEdits(study, "effect_size", "value");

  return (
    <div className="inputs">
      <select value={measure} onchange={m.withAttr("value", ctrl.updateEdits(study, "effect_size", "measure"))}>
        <option value="d">d</option>
        <option value="eta">η</option>
        <option value="r">r</option>
        <option value="phi">φ</option>
        <option value="eta_sqr">η²</option>
        <option value="partial_eta_sqr">partial η²</option>
      </select>
      <input type="text" value={val} oninput={m.withAttr("value", ctrl.updateEdits(study, "effect_size", "value"))} />
    </div>
  );
};

StudiesTable.modalEditors.effect_size.onsubmit = function(ctrl, study) {
  if (ctrl.getEdits(study, "effect_size", "measure")) {
    study.set("effectSizeMeasure", ctrl.getEdits(study, "effect_size", "measure"));
  } else if (_.isEmpty(study.get("effectSizeMeasure"))) {
    study.set("effectSizeMeasure", "d"); // d is the default
  }
  if (ctrl.getEdits(study, "effect_size", "value")) {
    study.set("effectSizeValue", ctrl.getEdits(study, "effect_size", "value"));
  }
};

StudiesTable.cellViews.independent_variables = _.partial(arrayFieldCellView, "independent_variables");
StudiesTable.modalEditors.independent_variables = {};
StudiesTable.modalEditors.independent_variables.view = _.partial(arrayFieldEditView, "independent_variables");
StudiesTable.modalEditors.independent_variables.onsubmit = _.partial(arrayFieldSubmit, "independent_variables");

StudiesTable.cellViews.dependent_variables = _.partial(arrayFieldCellView, "dependent_variables");
StudiesTable.modalEditors.dependent_variables = {};
StudiesTable.modalEditors.dependent_variables.view = _.partial(arrayFieldEditView, "dependent_variables");
StudiesTable.modalEditors.dependent_variables.onsubmit = _.partial(arrayFieldSubmit, "dependent_variables");

StudiesTable.cellViews.authors = _.partial(arrayFieldCellView, "authors");
StudiesTable.modalEditors.authors = {};
StudiesTable.modalEditors.authors.view = _.partial(arrayFieldEditView, "authors");
StudiesTable.modalEditors.authors.onsubmit = _.partial(arrayFieldSubmit, "authors");

function arrayFieldCellView(field, ctrl, study) {
  var items = _.map(study.get(field), function(variable) {
    return <li>{variable}</li>;
  });

  return <ul>{items}</ul>;
};

function arrayFieldEditView(field, ctrl, study) {
  var variables = arrayFieldCurrentState(field, ctrl, study);
  if (_.last(variables) !== "") {
    variables.push("");
  }

  var inputs = _.map(variables, function(variable, i) {
    return <li><input type="text" placeholder="Add another independent variable" value={variable} oninput={m.withAttr("value", ctrl.updateEdits(study, field, i))} /></li>;
  });

  return (
    <ul className="inputs">
      {inputs}
    </ul>
  );
};

function arrayFieldSubmit(field, ctrl, study) {
  study.set(field, _.compact(arrayFieldCurrentState(field, ctrl, study)));
};

function arrayFieldCurrentState(field, ctrl, study) {
  var variables = _.map(study.get(field), function(variable, i) {
    var cached = ctrl.getEdits(study, field, i)
    return _.isUndefined(cached) ? variable : cached;
  });
  variables = variables.concat(_.filter(ctrl.getEdits(study, field), function(variable, i) {
    return i >= variables.length;
  }));
  return variables;
};

module.exports = StudiesTable;
