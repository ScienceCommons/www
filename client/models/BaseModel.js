"use strict";

/*
 *  BaseModel
 *  - similar to Backbone
 *  - supports computeds and associations
 */

var _ = require("underscore");
var m = require("mithril");
var BaseCollection = require("./BaseCollection.js");

var BaseModel = function(data, options) {
  this.options = options || {};

  if (this.options.initializeAssociations !== false) {
    // might need to init given the data
    this.initializeAssociations();
  }

  this.attributes = {};
  if (this.defaults) {
    this.set(_.extend({}, this.defaults, data), this.options); // pass options so that it can be silently initialized
  } else {
    this.set(data, this.options);
  }

  if (this.constructor._cache && this.id) {
    this.constructor._cache[this.id] = this;
  }
  this.errors = {};
  this.initialize.apply(this, arguments);
};

BaseModel.extend = function(protoProps, staticProps) {
  var parent = this;
  var child;

  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ return parent.apply(this, arguments); };
  }

   _.extend(child, parent, staticProps);

   var Surrogate = function(){ this.constructor = child; };
   Surrogate.prototype = parent.prototype;
   child.prototype = new Surrogate();

   if (protoProps) {
     _.extend(child.prototype, protoProps);
   }

  child._cache = {};
  child.findOrCreate = function(data, opts) {
    if (!child._cache[data.id]) {
      child._cache[data.id] = new child(data, opts);
    }
    return child._cache[data.id];
  };
  return child;
};

BaseModel.prototype.initialize = function(){};

BaseModel.prototype.computeds = {};

BaseModel.prototype.initializeAssociations = function() {
  this.associations = this.associations || {};
  
  var _this = this;
  _.each(this.relations, function(relation, key) {
    if (_.isUndefined(_this.associations[key])) {
      if (relation.type === "many") {
        var Collection = relationCollection(relation);
        _this.associations[key] = new Collection([], {baseUrl: _.bind(_this.url, _this)});
      } else {
        _this.associations[key] = new (relation.model || BaseModel)();
      }
    }
  });
};

BaseModel.prototype.get = function(attr, forceAttributes) {
  if (_.isUndefined(attr)) {
    return this.attributes;
  }

  if (forceAttributes) {
    return this.attributes[attr];
  }

  var res = this.computeds[attr];
  if (!_.isUndefined(res)) {
    return res.call(this);
  }

  if (this.associations) {
    res = this.associations[attr];
    if (!_.isUndefined(res)) {
      return res;
    }
  }

  return this.attributes[attr];
};

BaseModel.prototype.relations = {};

BaseModel.prototype.set = function(attr, val, options) {
  options = options || {};

  if (_.isString(attr)) {
    var relation = this.relations[attr];
    if (!_.isUndefined(relation)) {
      if (!this.associations) {
        this.initializeAssociations();
      }
      if (relation.type === "many") {
        if (this.associations[attr]) {
          this.associations[attr].reset(val); // its a BaseCollection
        } else {
          var Collection = relationCollection(relation);
          this.associations[attr] = new Collection(val);
        }
      } else {
        if (this.associations[attr]) {
          this.associations[attr].set(val);
        } else {
          this.associations[attr] = new relation.model(val);
        }
      }
    } else {
      this.attributes[attr] = val;
      if (attr === "id") {
        this.id = val;
      }
    }
  } else { // its an object
    var _this = this;
    _.each(attr, function(obj_val, key) {
      _this.set(key, obj_val, {silent: true}); // let the outside set trigger the endComputation
    });
  }

  if (!options.silent) {
    this.redraw();
  }
};

BaseModel.prototype.redraw = _.throttle(m.redraw, 16, {leading: false});

BaseModel.prototype.setter = function(attr) {
  var _this = this;
  if (_.isString(attr)) {
    return function(val) {
      _this.set(attr, val);
    };
  } else {
    return function(val) {
      _this.set(val);
    };
  }
};

BaseModel.prototype.error = function() {};

BaseModel.prototype.fetch = function(options) {
  return m.request({method: "GET", url: this.url(), background: true, data: options}).then(this.setter(), this.error);
};

BaseModel.prototype.create = function() {
  return m.request({method: "POST", url: this.url(), data: this.attributes, background: true}).then(this.setter, this.error);
};

BaseModel.prototype.update = function() {
  return m.request({method: "PUT", url: this.url(), data: this.attributes, background: true}).then(this.setter, this.error);
};

BaseModel.prototype.serverDestroy = function() {
  return m.request({method: "DELETE", url: this.url(), background: true}).then(null, this.error);
};

// call this to clean up a model on the server
BaseModel.prototype.cleanup = function() {
  _.each(this.associations, function(association) {
    association.cleanup();
  });
};

BaseModel.prototype.url = function() {
  return this.urlRoot+"/"+this.get("id");
};

BaseModel.prototype.toJSON = function() {
  return this.attributes;
};

// helpers

function relationCollection(relation) {
  relation.collection = relation.collection || BaseCollection.extend({model: (relation.model || BaseModel), urlAction: relation.urlAction});
  return relation.collection;
};

module.exports = BaseModel;
