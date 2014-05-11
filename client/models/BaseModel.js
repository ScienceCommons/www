"use strict";

var _ = require("underscore");
var m = require("mithril");

var BaseModel = function(data, options) {
  this.options = options || {};
  resetAssociations(this);
  resetAttributes(this);

  this.set(data, {silent: this.options.silent});
  if (this.constructor._cache && this.id) {
    this.constructor._cache[this.id] = this;
  }
  this.errors = {};
};

BaseModel.extend = function(proto_opts) {
  var child = function(data, opts) {
    BaseModel.apply(this, [data, opts]);

    if (_.isFunction(this.initialize)) {
      this.initialize.apply(this, [data, opts]);
    }
  };

  _.extend(child.prototype, BaseModel.prototype, proto_opts);
  child.prototype.constructor = child;
  child._cache = {};
  child.findOrCreate = function(data, opts) {
    if (!child._cache[data.id]) {
      child._cache[data.id] = new child(data, opts);
    }
    return child._cache[data.id];
  };
  return child;
};

BaseModel.prototype.defaults = {};

BaseModel.prototype.get = function(attr) {
  var res = this.attributes[attr];
  if (!_.isUndefined(res)) {
    return res;
  }

  if (this.computeds) {
    res = this.computeds[attr];
    if (!_.isUndefined(res)) {
      return res.call(this);
    }
  }

  if (this.associations) {
    res = this.associations[attr];
    if (!_.isUndefined(res)) {
      return res();
    }
  }
};

BaseModel.prototype.set = function(attr, val, options) {
  options = options || {};

  if (_.isString(attr)) {
    this.attributes[attr] = val;
    if (attr === "id") {
      this.id = val;
    }
  } else { // its an object
    var _this = this;
    _.each(attr, function(obj_val, key) {
      _this.set(key, obj_val, {silent: true}); // let the outside set trigger the endComputation
    });
    options = val || {};
  }

  if (!options.silent) {
    m.redraw();
  }
};

BaseModel.prototype.setter = function(attr) {
  var _this = this;
  return function(val) {
    if (_.isString(attr)) {
      _this.set(attr, val);
    } else {
      _this.set(val);
    }
  };
};

BaseModel.prototype.error = function() {
  console.log("model error", arguments);
};

BaseModel.prototype.fetch = function(association, options) {
  options = _.isString(association) ? (options || {}) : (association || {});

  var t0 = _.now();
  if (association) {
    var options = this.relations[association];
    return m.request({method: "GET", url: this.url(options.url), type: (options.model || BaseModel), background: true, data: options.data}).then(this.setter(association));
  } else {
    return m.request({method: "GET", url: this.url(), background: true, data: options.data}).then(this.setter(), this.error);
  }
  //ga('send', 'timing', 'Model', 'Fetch', t1-t0, this.get("id"));
};

BaseModel.prototype.create = function() {
  return m.request({method: "POST", url: this.url(), data: this.attributes, background: true}).then(this.setter, this.error);
};

BaseModel.prototype.update = function() {
  return m.request({method: "PUT", url: this.url(), data: this.attributes, background: true}).then(this.setter, this.error);
};

BaseModel.prototype.destroy = function() {
  return m.request({method: "DELETE", url: this.url(), background: true}).then(null, this.error);
};

BaseModel.prototype.url = function(suffix) {
  var base = this.urlRoot+"/"+this.get("id");
  if (suffix) {
    return base + "/" + suffix;
  } else {
    return base;
  }
};

BaseModel.prototype.toJSON = function() {
  return this.attributes;
};

// Private methods

function resetAttributes(model) {
  model.attributes = {};
  model.set(model.defaults || {}, {silent: model.options.silent});
}

function resetAssociations(model) {
  model.associations = {};
  _.each(model.relations, function(options, key) {
    model.associations[key] = m.prop(options.type === "many" ? [] : {});
  });
}

module.exports = BaseModel;