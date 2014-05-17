"use strict";

/*
 *  BaseCollection
 *  - similar to Backbone
 *  - supports computeds and associations
 */

var _ = require("underscore");
var m = require("mithril");
var BaseModel = require("./BaseModel.js");

var BaseCollection = function(data, options) {
  this.options = options || {};
  this.models = [];
  this.length = 0;
  this._byId = {};

  _.bindAll(this, "reset", "add", "remove", "get", "indexOf");
  this.reset(data||[]);
};

BaseCollection.extend = function(proto_opts) {
  var child = function(data, opts) {
    BaseCollection.apply(this, [data, opts]);

    if (_.isFunction(this.initialize)) {
      this.initialize.apply(this, [data, opts]);
    }
  };

  _.extend(child.prototype, BaseCollection.prototype, proto_opts);
  child.prototype.constructor = child;
  return child;
};

BaseCollection.prototype.reset = function(data) {
/*
  _.each(this.models, function(model) {
    if (_.isFunction(model.destroy)) {
      model.destroy();
    }
  });
*/
  data = data || [];

  this.models = [];
  this.length = data.length;
  this.models.length = this.length;
  this._byId = {};

  for (var i = 0; i < this.length; i++) {
    var newModel = new this.model(data[i], {initializeAssociations: false, silent: true});
    this.models[i] = newModel;
    this._byId[newModel.get("id")] = newModel;
  }
  this.redraw();
};

BaseCollection.prototype.add = function(data) {
  if (!data.id || _.isUndefined(this._byId[data.id])) { // don't allow duplicate id's
    var newModel = new this.model(data, {initializeAssociations: false});
    this.models.push(newModel);
    this.length++;
    this._byId[newModel.get("id")] = newModel; // I might need event listeners for change:id to update this field
  }
  // merge otherwise?
};

BaseCollection.prototype.remove = function(model) {
  var index = this.indexOf(model);
  this.models.splice(index, 1);
  this.length--;
};

BaseCollection.prototype.at = function(index) {
  return this.models[index];
};

BaseCollection.prototype.get = function(id) {
  if (_.isUndefined(id)) {
    return this.models;
  } else {
    return this._byId[id];
  }
};

BaseCollection.prototype.sort = function() {
  this.models = _.sortBy(this.models, this.comparator);
  this.redraw();
};

BaseCollection.prototype.comparator = function(model) {
  return this.get("id") || 0;
};

BaseCollection.prototype.model = BaseModel;

BaseCollection.prototype.error = function() {};

BaseCollection.prototype.fetch = function(options) {
  return m.request({method: "GET", url: this.url(), background: true, data: options}).then(this.reset, this.error);
};

BaseCollection.prototype.toJSON = function() {
  return _.map(this.models, function(model) {
    return model.toJSON();
  });
};

BaseCollection.prototype.url = function() {
  return _.result(this.options, "baseUrl") + "/" + this.urlAction;
};

BaseCollection.prototype.redraw = _.throttle(m.redraw, 16, {leading: false});

// Underscore methods that we want to implement on the Collection.
// Taken from Backbone
// indexOf is not optimized for sort
var slice = [].slice;
var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
  'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
  'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
  'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
  'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
  'lastIndexOf', 'isEmpty', 'chain', 'sample'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    BaseCollection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    BaseCollection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });


module.exports = BaseCollection;
