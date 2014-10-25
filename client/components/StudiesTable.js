/** @jsx m */

"use strict";
require("./StudiesTable.scss");

var _ = require("underscore");
var Study = require("../models/StudyModel.js");
var OnUnload = require("../utils/OnUnload.js");
var cx = require("../utils/ClassSet.js");
var Spinner = require("./Spinner.js");
var Modal = require("../components/Modal.js");
var Badge = require("../components/Badge.js");
var StudyFinder = require("../components/StudyFinder.js");
var CommentForm = require("../components/CommentForm.js");
var CommentList = require("../components/CommentList.js");
var ScrollIntoView = require("../utils/ScrollIntoView.js");

var StudiesTable = {};
StudiesTable.instances = {};

StudiesTable.controller = function(opts) {
  OnUnload(this, StudiesTable.instances);
  StudiesTable.instances[this.id] = this;

  this.article = opts.article;
  this.user = opts.user;
  this.active = m.prop({study_id: false, field: false, editing: false, dropdown: false});
  this.expanded = m.prop({}); // study_id's
  this.newStudy = m.prop(false);
  this.edits = m.prop({});
  this.studyFinderStudy = m.prop(false);

  var _this = this;
  this.addStudy = function() {
    if (_this.newStudy() !== false) {
      // warn that existing new study must be saved or removed
    } else {
      _this.newStudy(new Study({article_id: _this.article.get("id")}));
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
      if (active.study_id === id && active.field === field && !active.editing) {
        active = {study_id: false, field: false, editing: false, dropdown: false};
      } else {
        if (active.study_id !== id || active.field !== field) {
          active.editing = false;
        }
        active.study_id = id;
        active.field = field;
      }
      if (study.isNew()) {
        active.editing = true;
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

  this.handleFileEditSubmit = function(study, file) {
    return function(e) {
      e.preventDefault();
      var active = _this.active();
      active.editing = false;
      _this.active(active);
      var fileEdits = _this.getEdits(study, "files_"+file.get("id"))
      file.set(fileEdits);
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
        comment: _this.getEdits(study, field, "comment")
      };

      if (!_.isEmpty(comment.comment)) {
        study.getComments(field).add(comment, {sync: true});
        _this.updateEdits(study, field, "comment")("");
      } else {
        throw("Cannot submit an empty comment");
      }
    };
  };

  this.openStudyFinder = function(study) {
    return function() {
      _this.studyFinderStudy(study);
      _this.controllers.studyFinderModal.open(true);
    };
  };

  this.toggleReplication = function(replicationStudy) {
    var study = _this.studyFinderStudy();
    if (study) {
      if (study.get("article_id") === replicationStudy.get("article_id")) {
        alert("You are picking another study in this article to be a replication.  That is not allowed.");
      } else {
        if (study.get("replications").find(function(replication) { return replication.get("replicating_study_id") === replicationStudy.get("id"); })) {
          study.removeReplication(replicationStudy);
        } else {
          study.addReplication(replicationStudy);
          //_this.controllers.studyFinderModal.open(false);
          var expanded = _this.expanded();
          var id = study.get("id");
          expanded[id] = true;
          _this.expanded(expanded);
        }
      }
    }
  };

  this.controllers.studyFinderModal = new Modal.controller();
  this.controllers.studyCommentAndEditModal = new Modal.controller();
  this.controllers.studyFieldCommentForm = new CommentForm.controller({
    user: this.user
  });

  this.controllers.studyFinder = new StudyFinder.controller({
    selectStudy: this.toggleReplication,
    parentStudy: this.studyFinderStudy
  });

  this.studiesConfig = function(el, isInitialized) {
    _this.studiesEl = el;
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
          return StudiesTable.studyView(ctrl, replication.get("replicating_study"), {replication: true});
        });
        if (replications.length === 0) {
          ctrl.expanded({});
        }
      }
      return [StudiesTable.studyView(ctrl, study), replications];
    });

    if (ctrl.newStudy()) {
      studies.push(StudiesTable.studyView(ctrl, ctrl.newStudy(), {new: true}));
    } else {
      var addStudyButton = <button className="btn addStudy" onclick={ctrl.addStudy}>Add study</button>;
    }
    content = [<ul className="studies" config={ctrl.studiesConfig}>{_.flatten(studies)}</ul>, addStudyButton];
  }

  if (ctrl.studyFinderStudy()) {
    var studyFinderModal = Modal.view(ctrl.controllers.studyFinderModal, {
      label: "Add a replication",
      content: new StudyFinder.view(ctrl.controllers.studyFinder)
    });
  }

  // add study column
  if (ctrl.article.get("studies").length > 0 || ctrl.newStudy()) {
    var header = <header>
      <div className="cell replication_path">Replication path</div>
      <div className="cell number">Number</div>
      <div className="cell badges"></div>
      <div className="cell independent_variables">Independent Variables</div>
      <div className="cell dependent_variables">Dependent Variables</div>
      <div className="cell n">N <span className="icon icon_person"></span></div>
      <div className="cell power">Power</div>
      <div className="cell effect_size">Effect Size</div>
    </header>;
  }

  return (
    <div className="StudiesTable">
      {header}
      {content}
      {studyFinderModal}
    </div>
  );
};

StudiesTable.studyView = function(ctrl, study, options) {
  var options = options || {};
  var cells = _.map(["number", "badges", "independent_variables", "dependent_variables", "n", "power", "effect_size"], function(field) {
    return StudiesTable.studyCellView(ctrl, study, field, options);
  });

  if (!options.replication) {
    if (options.new || study.hasChanges()) {
      var saveButtons = [
        <button type="button" className="btn saveStudy" onclick={options.new ? ctrl.saveNewStudy : ctrl.saveStudy(study)}>Save</button>,
        <button type="button" className="btn discardStudy" onclick={options.new ? ctrl.discardNewStudy : ctrl.resetStudy(study)}>Discard</button>
      ];
    } else if (!options.new) {
      var saveButtons = <button type="button" className="btn deleteStudy" onclick={ctrl.deleteStudy(study)}>Delete</button>;
    }
  }

  var classes = cx({
    "study": true,
    "new": options.new,
    "replication": options.replication,
    "expanded": ctrl.expanded()[study.get("id")],
    "active": ctrl.active().study_id === study.get("id")
  });

  return (
    <li className={classes}>
      {StudiesTable.studyCellView(ctrl, study, "replication_path", options)}
      <div className="cellGroup">
        {cells}
      </div>
      {saveButtons}
    </li>
  );
};


StudiesTable.studyCellView = function(ctrl, study, field, options) {
  var active = ctrl.active();
  if (field !== "badges" && active.study_id === study.get("id") && active.field === field) {
    var modal = StudiesTable.studyModalView(ctrl, study, field, options);
  }

  var contents;
  if (StudiesTable.cellViews[field]) {
    contents = StudiesTable.cellViews[field](ctrl, study, options);
  } else {
    contents = study.get(field);
  }

  if (study.getComments(field)) {
    var numComments = study.getComments(field).length;
    if (numComments > 0) {
      var commentMarker = <span className="icon icon_comment" title={numComments + (numComments === 1 ? " comment" : " comments")}></span>;
    }
  }

  // also include indicators
  var cellContents = <div className="cellContents">
    {contents}
    {commentMarker}
  </div>

  if (field !== "badges" && field !== "replication_path") {
    cellContents.attrs.onclick = ctrl.toggleModal(study, field, options)
  }


  return (
    <div className={"cell " + field + (modal ? " active" : "")}>
      {cellContents}
      {modal}
    </div>
  );
};

StudiesTable.studyModalView = function(ctrl, study, field, options) {
  ctrl.controllers.studyCommentAndEditModal.open(true);

  if (ctrl.active().editing && !options.replication) {
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

    return Modal.view(ctrl.controllers.studyCommentAndEditModal, {
      label: <button type="submit" className="btn">Done</button>,
      buttons: false,
      content: inputs,
      wrapper: <form onsubmit={ctrl.handleEditSubmit(study, field)} />
    });
  } else {
    if (study.commentable(field)) {
      ctrl.controllers.studyFieldCommentForm.comments = study.getComments(field);
      var comments = study.getComments(field).map(function(comment) {
        return (
          <li>{comment.get("comment")}</li>
        );
      });
      var modalContent = new CommentList.view({comments: study.getComments(field), user: ctrl.user});
      var modalFooter = CommentForm.view(ctrl.controllers.studyFieldCommentForm);
    }

    var editButton;
    if (App.user.canEdit() && !options.replication) {
      if (ctrl.article.get("id") === study.get("article_id")) {
        editButton = <button type="button" className="btn edit" onclick={ctrl.handleEditClick}><span className="icon icon_edit"></span></button>;
      }
    }

    return Modal.view(ctrl.controllers.studyCommentAndEditModal, {
      label: ModalLabels[field] || field,
      buttons: editButton || false,
      content: modalContent,
      footer: modalFooter
    });
  }
};

var ModalLabels = {
  number: "Number",
  independent_variables: "Independent Variables",
  dependent_variables: "Dependent Variables",
  n: "Sample Size",
  power: "Power",
  effect_size: "Effect Size"
};

StudiesTable.cellViews = {};

StudiesTable.cellViews.replication_path = function(ctrl, study, options) {
  if (!options.replication) {
    var addReplicationLink = <span class="add_replication" onclick={ctrl.openStudyFinder(study)} title="Add replication"></span>;
  }

  var count = study.get("replications").length;
  if (count > 0) {
    var replicationCountLink = <span className="icon icon_replication count" onclick={ctrl.toggleExpanded(study)}>{count}</span>;
  }

  return [addReplicationLink, replicationCountLink];
};

var BadgeHeaders = {
  "data": "Data & Syntax",
  "materials": "Materials",
  "registration": "Registration",
  "disclosure": "Disclosure"
};

StudiesTable.cellViews.badges = function(ctrl, study, options) {
  var active = ctrl.active();
  if (active.study_id === study.get("id") && active.field === "badges") {
    var activeBadge = active.badge;
    var dropdown = BadgeDropdowns[activeBadge](ctrl, study, options);
  }

  var badges = _.map(["data", "materials", "registration", "disclosure"], function(badge) {

    return <li onclick={StudiesTable.cellViews.handleBadgeClick(ctrl, study, badge)} className={activeBadge === badge ?  "active" : ""} title={BadgeHeaders[badge]}>
      {Badge.view({badge: badge, active: study.hasBadge(badge)})}
    </li>;
  });

  return [
    <ul className={"badges " + (activeBadge ? "active" : "")}>{badges}</ul>,
    dropdown
  ]
};

StudiesTable.cellViews.handleBadgeClick = function(ctrl, study, badge) {
  return function(e) {
    var active = ctrl.active();
    if (active.study_id === study.get("id") && active.field === "badges" && active.badge === badge) {
      ctrl.active({});
    } else {
      ctrl.active({
        study_id: study.get("id"),
        field: "badges",
        badge: badge
      });
    }
  };
};

var BadgeDropdowns = {};
BadgeDropdowns.data = function(ctrl, study, options) {
  return fileDropdown(ctrl, study, "data", options);
};

BadgeDropdowns.materials = function(ctrl, study, options) {
  return fileDropdown(ctrl, study, "materials", options);
};

BadgeDropdowns.registration = function(ctrl, study, options) {
  return fileDropdown(ctrl, study, "registration", options);
};

BadgeDropdowns.disclosure = function(ctrl, study, options) {
  return fileDropdown(ctrl, study, "disclosure", options);
};

function removeFileFromStudy(study, file) {
  return function(e) {
    study.get("files").remove(file);
  };
};

function addFile(ctrl, study, type) {
  return function(e) {
    var newFile = study.get("files").add({type: type});
    var active = ctrl.active();
    active.editing = true;
    active.file = newFile;
    ctrl.active(active);
  };
};

function fileDropdown(ctrl, study, type, options) {
  var files = study.filesByType(type);
  var active = ctrl.active();
  var body = <table className="files"><tbody><tr className="noFiles"><td>No files</td></tr></tbody></table>;
  var modal;

  if (files.length > 0) {
    var rows = _.map(files, function(file) {
      var fileIsActive = active.file === file;
      if (fileIsActive) {
        ctrl.controllers.studyCommentAndEditModal.open(true);
        if (active.editing) {
          var edits = ctrl.getEdits(study, "files_"+file.get("id"));

          modal = Modal.view(ctrl.controllers.studyCommentAndEditModal, {
            label: <button type="submit" className="btn">Done</button>,
            buttons: <button type="button" className="btn" onclick={removeFileFromStudy(study, file)}><span className="icon icon_delete"></span></button>,
            content: <div>
              <input type="text" value={_.isUndefined(edits.name) ? file.get("name") : edits.name} oninput={m.withAttr("value", ctrl.updateEdits(study, "files_"+file.get("id"), "name"))}/>
              <input type="text" value={_.isUndefined(edits.url) ? file.get("url") : edits.url} oninput={m.withAttr("value", ctrl.updateEdits(study, "files_"+file.get("id"), "url"))}/>
            </div>,
            wrapper: <form onsubmit={ctrl.handleFileEditSubmit(study, file)} />
          });
        } else {
          ctrl.controllers.studyFieldCommentForm.comments = file.get("comments");
          var comments = file.get("comments").map(function(comment) {
            return (
              <li>{comment.get("comment")}</li>
            );
          });

          if (App.user.canEdit()) {
            var modalEditButton = <button type="button" className="btn edit" onclick={ctrl.handleEditClick}><span className="icon icon_edit"></span></button>;
          }

          modal = Modal.view(ctrl.controllers.studyCommentAndEditModal, {
            label: file.get("name"),
            buttons: modalEditButton || false,
            content: new CommentList.view({comments: file.get("comments"), user: ctrl.user}),
            footer: CommentForm.view(ctrl.controllers.studyFieldCommentForm)
          });
        }
      }

      var numComments = file.get("comments").length;
      if (numComments > 0) {
        var commentMarker = <span className="icon icon_comment" title={numComments + (numComments === 1 ? " comment" : " comments")}></span>;
      }
      return <tr onclick={handleBadgeDropdownFileClick(ctrl, study, file)} className={fileIsActive ? "active" : ""}>
        <td className="fileName">{file.get("name")}</td>
        <td className="buttons">
          {commentMarker}
          <button type="button" className="btn" title="Download"><span className="icon icon_download"></span></button>
        </td>
      </tr>;
    });

    body = <table className="files"><tbody>
      {rows}
    </tbody></table>;
  };

  if (App.user.canEdit() && !options.replication) {
    var filesFooter = <footer>
      <button type="button" className="btn" onclick={addFile(ctrl, study, type)}>Add a file</button>
    </footer>;
  }

  return <div className="dropdown" config={fileDropdownConfig}>
    <header>{BadgeHeaders[type]}</header>
    <div className="body">
      {body}
    </div>
    {filesFooter}
    {modal}
  </div>;
};

function fileDropdownConfig(el, isInitialized, context) {
  if (!isInitialized) {
    ScrollIntoView(el);
  }
};

function handleBadgeDropdownFileClick(ctrl, study, file) {
  return function(e) {
    e.preventDefault();
    var active = ctrl.active();
    active.file = file;
    active.editing = false;
    ctrl.active(active);
  };
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

function arrayFieldCellView(field, ctrl, study) {
  if (field !== "number" || ctrl.article.get("id") !== study.get("article_id")) {
    var items = _.map(study.get(field), function(variable) {
      return <li>{variable}</li>;
    });

    return <ul>{items}</ul>;
  }
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

document.addEventListener("mousedown", closeActiveOnMousedown);
document.addEventListener("touchstart", closeActiveOnMousedown);

module.exports = StudiesTable;

//helpers

function closeActiveOnMousedown(e) {
  _.each(StudiesTable.instances, function(instance) {
    if (instance.studiesEl && !instance.studiesEl.contains(e.target)) {
      instance.active({});
    }
  });
  m.redraw();
};
