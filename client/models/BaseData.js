"use strict";

/*
 *  BaseData
 *  - similar to Backbone
 *  - supports computeds and associations
 */

var _ = require("underscore");
var m = require("mithril");

////////////// MODEL ////////////////

var BaseData = {
  redraw: _.throttle(m.redraw, 16, {leading: false})
};

BaseData.Model = function(data, options) {
  this.options = options || {};
  this._errors = {};
  _.bindAll(this, "set", "save");

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

  this._serverState = this.options.server ? _.extend({}, this.get()) : {}

  if (this.constructor._cache && this.id) {
    this.constructor._cache[this.id] = this;
  }

  this.initialize.apply(this, arguments);
};

BaseData.Model.prototype.initialize = function() {};

BaseData.Model.prototype.initCache = function(constructor) {
  constructor._cache = {};
  constructor.findOrCreate = function(data, opts) {
    if (!constructor._cache[data.id]) {
      constructor._cache[data.id] = new constructor(data, opts);
    }
    return constructor._cache[data.id];
  };
};

BaseData.Model.prototype.initialize = function() {};

BaseData.Model.prototype.computeds = {};
BaseData.Model.prototype.validations = {};

BaseData.Model.prototype.addError = function(attr, message) {
  if (_.isString(message)) {
    this._errors[attr] = [message];
  } else {
    delete this._errors[attr];
  }
};

BaseData.Model.prototype.errors = function(attr) {
  if (attr) {
    return this._errors[attr] || [];
  } else {
    return this._errors;
  }
};

BaseData.Model.prototype.hasErrors = function(attr) {
  return !_.isEmpty(this.errors(attr));
};

BaseData.Model.prototype.initializeAssociations = function() {
  if (_.isUndefined(this.associations)) {
    this.associations = _.extend({}, this.options.inverseOf);
  }

  var _this = this;
  _.each(this.relations, function(relation, key) {
    if (_.isUndefined(_this.associations[key])) {
      var inverseOf = {};
      if (relation.inverseOf) {
        inverseOf[relation.inverseOf] = _this;
      }

      if (relation.type === "many") {
        var relCollection = relationCollection(relation);
        _this.associations[key] = new relCollection([], {baseUrl: _.bind(_this.url, _this), urlAction: relation.urlAction, silent: true, inverseOf: inverseOf});
      } else {
        _this.associations[key] = new (relation.model || BaseData.Model)({}, {silent: true, inverseOf: inverseOf});
      }
    }
  });
};

BaseData.Model.prototype.get = function(attr, forceAttributes) {
  if (_.isUndefined(attr)) {
    return this.attributes;
  }

  if (forceAttributes) {
    return this.attributes[attr];
  }

  var res = this.computeds[attr];
  if (!_.isUndefined(res)) {
    if (_.isFunction(res)) {
      return res.call(this);
    } else {
      return res.get.call(this);
    }
  }

  if (this.associations) {
    res = this.associations[attr];
    if (!_.isUndefined(res)) {
      return res;
    }
  }

  return this.attributes[attr];
};

BaseData.Model.prototype.relations = {};

BaseData.Model.prototype.set = function(attr, val, options) {
  options = options || {};
  if (!options.silent) {
    this.attributes = _.extend({}, this.attributes);
  }
  var _this = this;
  if (_.isString(attr)) {
    var relation = this.relations[attr];
    if (!_.isUndefined(relation)) {
      if (!this.associations) {
        this.initializeAssociations();
      }
      if (relation.type === "many") {
        if (this.associations[attr]) {
          this.associations[attr].reset(val, {silent: true}); // its a Collection
        } else {
          var Collection = relationCollection(relation);
          this.associations[attr] = new Collection(val, {silent: true, inverseOf: relation.inverseOf});
        }
      } else {
        if (this.associations[attr]) {
          this.associations[attr].set(val, {silent: true});
        } else {
          this.associations[attr] = new relation.model(val, {silent: true, inverseOf: relation.inverseOf});
        }
      }
    } else if (this.computeds[attr] && this.computeds[attr].set ) {
      this.computeds[attr].set.call(this, val);
    } else {
      this.attributes[attr] = val;
      // check validations - stop after the first failure
      _.some(this.validations[attr], function(validation) {
        var message = validation.call(_this, val);
        _this.addError(attr, message);
        return message;
      });
      if (attr === "id") {
        this.id = val;
      }
    }
  } else { // its an object
    options = val || options;
    _.each(attr, function(obj_val, key) {
      _this.set(key, obj_val, {silent: true}); // let the outside set trigger the redraw
    });

    if (options.server) {
      this._serverState = _.extend({}, this._serverState, attr);
    }
  }

  if (!options.silent) {
    this.redraw();
  }
};

BaseData.Model.prototype.redraw = BaseData.redraw;

BaseData.Model.prototype.setter = function(attr) {
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

BaseData.Model.prototype.error = function() {};

BaseData.Model.prototype.serverDestroy = function() {
  return m.request({method: "DELETE", url: this.url(), background: true, deserialize: maybeJSON}).then(null, this.error);
};

// call this to clean up a model on the client
BaseData.Model.prototype.deallocate = function() {
  _.each(this.associations, function(association) {
    association.deallocate();
  });
};

BaseData.Model.prototype.url = function() {
  return this.urlRoot+"/"+this.get("id");
};

BaseData.Model.prototype.toJSON = function(options) {
  options = options || {};
  if (options.only) {
    return _.pick(this.attributes, options.only);
  } else {
    return this.attributes;
  }
};

// Map from CRUD to HTTP
var methodMap = {
  "create": "POST",
  "update": "PUT",
  "patch":  "PATCH",
  "delete": "DELETE",
  "read":   "GET"
};

BaseData.sync = function(method, model, options) {
  options = options || {};
  var params = {
    method: methodMap[method],
    background: true,
    deserialize: maybeJSON
  };

  // Ensure that we have a URL.
  if (!options.url) {
    params.url = _.result(model, "url");
    if (!params.url) {
      throw("Url is required");
    }
  }

  // Ensure that we have the appropriate request data.
  if (options.data == null && model && (method === "create" || method === "update" || method === "patch")) {
    params.data = model.toJSON();
    if (model.serialize) {
      params.data = _.pick(params.data, model.serialize);
    }
  }

  var req = m.request(_.extend(params, options));
  // set loading
  return req;
};

BaseData.Model.prototype.sync = BaseData.sync;

BaseData.Model.prototype.fetch = function(options) {
  this.loading = true;
  var res = this.sync("read", this, options);
  var _this = this;
  res.then(function() {
    _this.loading = false;
    _this.loaded = true;
  });
  res.then(function(data) {
    _this.set(data, {server: true});
  }, this.error);
  return res;
};

BaseData.Model.prototype.save = function(options) {
  options = options || {};
  this.saving = true;
  var action = this.isNew() ? "create" : "update";
  if (action === "create") {
    options.url = options.url || this.urlRoot;
  }
  var res = this.sync(action, this, options);
  var _this = this;
  res.then(function() {
    _this.saving = false;
    _this.loaded = true;
  });
  res.then(function(data) {
    _this.set(data, {server: true});
  }, this.error);
  return res;
};

BaseData.Model.prototype.destroy = function(options) {
  var res = this.sync("delete", this, options);
  var _this = this;
  res.then(function(data) {
    _this.set(data, {server: true});
  }, this.error);
  return res;
};

BaseData.Model.prototype.hasChanges = function(options) {
  var clientState = this.get();
  return _.any(this._serverState, function(val, attr) {
    return clientState[attr] !== val;
  });
};

BaseData.Model.prototype.isNew = function() {
  return _.isUndefined(this.get("id"));
};

BaseData.Model.prototype.reset = function() {
  this.set(this._serverState);
};

//////// COLLECTION /////////


BaseData.Collection = function(data, options) {
  options = options || {};
  if (options.url) {
    this.url = options.url;
  }
  this.options = options;
  this.models = [];
  this.length = 0;
  this._byId = {};

  this.modelOptions = {
    initializeAssociations: false,
    inverseOf: options.inverseOf,
    silent: true
  };

  _.bindAll(this, "reset", "_resetFromServer", "add", "remove", "get", "indexOf");
  this.reset(data, options);
  this.initialize.apply(this, arguments);
};

BaseData.Collection.prototype.initialize = function() {};

BaseData.Collection.prototype.initCache = function() {};

BaseData.Collection.prototype.typeAttr = "type";

BaseData.Collection.prototype.reset = function(data, options) {
  data = data || [];
  options = options || {};

  var models = [];
  var len = data.length;
  models.length = len;
  var _byId = {};

  var newModel;
  var existingModel;

  for (var i = 0; i < len; i++) {
    if (data[i].id && this.get(data[i].id)) {
      existingModel = this.get(data[i].id);
      existingModel.set(data[i], {silent: true, server: options.server});
      models[i] = existingModel;
      _byId[existingModel.get("id")] = existingModel;
    } else {
      newModel = this.initializeModelType(data[i], _.extend({}, this.modelOptions, {server: options.server}));
      models[i] = newModel;
      _byId[newModel.get("id")] = newModel;
    }
  }

  this.models = models;
  this.length = models.length;
  this._byId = _byId;

  if (!options.silent) {
    this.redraw();
  }
};

BaseData.Collection.prototype._resetFromServer = function(data) {
  this.reset(data, {server: true});
};

BaseData.Collection.prototype.initializeModelType = function(data, options) {
  options = options || {};
  if (this.types && data[this.typeAttr] && this.types[data[this.typeAttr]]) {
    return new this.types[data[this.typeAttr]](data, options);
  } else {
    return new this.model(data, options);
  }
};

BaseData.Collection.prototype.add = function(data, options) {
  options = options || {};
  if (!data.id || _.isUndefined(this._byId[data.id])) { // don't allow duplicate id's
    var newModel;
    if (data instanceof BaseData.Model) {
      newModel = data;
    } else {
      newModel = this.initializeModelType(data, _.extend({}, this.modelOptions, options));
    }
    this.models = this.models.concat([newModel]);
    this.length++;
    this._byId[newModel.get("id")] = newModel; // I might need event listeners for change:id to update this field

    if (options.sync) {
      var sync = this.sync("create", newModel, {url: this.url()})
      sync.then(newModel.set);
      sync.then(function(data) {
        newModel._serverState = _.extend({}, data);
      });
    }
  }
  // merge otherwise?
  return newModel;
};

BaseData.Collection.prototype.remove = function(model, options) {
  options = options || {};
  this.models = _.without(this.models, model);
  this.length = this.models.length;
  delete this._byId[model.get("id")];

  if (options.sync && !model.isNew()) {
    var sync = this.sync("delete", model, {url: this.url() + "/" + model.get("id")})
    var _this = this;
    sync.then(function() {}, function(err) {
      console.log("Failed to delete", err);
      _this.add(model);
    });
  }
  this.redraw();
};

BaseData.Collection.prototype.at = function(index) {
  return this.models[index];
};

BaseData.Collection.prototype.get = function(id) {
  if (_.isUndefined(id)) {
    return this.models;
  } else {
    return this._byId[id];
  }
};

BaseData.Collection.prototype.sort = function() {
  this.models = _.sortBy(this.models, this.comparator);
  this.redraw();
};

BaseData.Collection.prototype.comparator = function(model) {
  return this.get("id") || 0;
};

BaseData.Collection.prototype.model = BaseData.Model;

BaseData.Collection.prototype.error = function() {};

BaseData.Collection.prototype.fetch = function(options) {
  this.loading = true;

  var res =  m.request({method: "GET", url: _.result(this, "url"), background: true, data: options, deserialize: maybeJSON});
  var _this = this;
  res.then(function() {
    _this.loading = false;
  });
  res.then(this._resetFromServer, this.error);
  this.redraw();
  return res;
};

BaseData.Collection.prototype.toJSON = function() {
  return _.map(this.models, function(model) {
    return model.toJSON();
  });
};

BaseData.Collection.prototype.url = function() {
  return _.result(this.options, "baseUrl") + "/" + _.result(this.options, "urlAction");
};

BaseData.Collection.prototype.deallocate = function() {
  this.each(function(model) {
    model.deallocate();
  });
};

BaseData.Collection.prototype.redraw = BaseData.redraw;

BaseData.Collection.prototype.sync = BaseData.sync;

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
    BaseData.Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    BaseData.Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

// helpers

function relationCollection(relation) {
  relation.collection = relation.collection || BaseData.Collection.extend({model: (relation.model || BaseData.Model)});
  return relation.collection;
}

// taken from https://github.com/lhorie/mithril.js/issues/86
function maybeJSON(data) {
  try {
    return JSON.parse(data);
  } catch (e) { //handle runtime error
    throw new Error("Server error"); //throw app-space error
  }
}

var extend = function(protoProps, staticProps) {
  var parent = this;
  var child;

  // The constructor function for the new subclass is either defined by you
  // (the "constructor" property in your `extend` definition), or defaulted
  // by us to simply call the parent's constructor.
  if (protoProps && _.has(protoProps, 'constructor')) {
    child = protoProps.constructor;
  } else {
    child = function(){ return parent.apply(this, arguments); };
  }

  // Add static properties to the constructor function, if supplied.
  _.extend(child, parent, staticProps);

  // Set the prototype chain to inherit from `parent`, without calling
  // `parent`'s constructor function.
  var Surrogate = function(){ this.constructor = child; };
  Surrogate.prototype = parent.prototype;
  child.prototype = new Surrogate;

  // Add prototype properties (instance properties) to the subclass,
  // if supplied.
  if (protoProps) _.extend(child.prototype, protoProps);

  // Set a convenience property in case the parent's prototype is needed
  // later.
  child.__super__ = parent.prototype;
  child.prototype.initCache(child);

  return child;
};

BaseData.Model.extend = BaseData.Collection.extend = extend;

module.exports = BaseData;

