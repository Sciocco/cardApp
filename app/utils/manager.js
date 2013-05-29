define(function(require, exports, module) {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProp.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    },
    __slice = [].slice;

  var Module = {};

  Spine.Manager = (function(_super) {
    __extends(Manager, _super);

    Manager.include(Spine.Events);

    function Manager() {
      this.controllers = [];
      this.bind('change', this.change);
      this.add.apply(this, arguments);
    }

    Manager.prototype.add = function() {
      var cont, controllers, _i, _len, _results;

      controllers = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = controllers.length; _i < _len; _i++) {
        cont = controllers[_i];
        _results.push(this.addOne(cont));
      }
      return _results;
    };

    Manager.prototype.addOne = function(controller) {
      var _this = this;

      controller.bind('active', function() {
        var args;

        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return _this.trigger.apply(_this, ['change', controller].concat(__slice.call(args)));
      });
      controller.bind('release', function() {
        return _this.controllers.splice(_this.controllers.indexOf(controller), 1);
      });
      return this.controllers.push(controller);
    };

    Manager.prototype.deactivate = function() {
      return this.trigger.apply(this, ['change', false].concat(__slice.call(arguments)));
    };

    Manager.prototype.change = function() {
      var args, cont, current, _i, _len, _ref, _results;

      current = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      _ref = this.controllers;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        cont = _ref[_i];
        if (cont === current) {
          _results.push(cont.activate.apply(cont, args));
        } else {
          _results.push(cont.deactivate.apply(cont, args));
        }
      }
      return _results;
    };

    return Manager;

  })(Spine.Module);

  Spine.Controller.include({
    active: function() {
      var args;

      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (typeof args[0] === 'function') {
        this.bind('active', args[0]);
      }
      args.unshift('active');
      this.trigger.apply(this, args);
      return this;
    },
    isActive: function() {
      return this.el.hasClass('show');
    },
    activate: function() {
      this.el.addClass('show');
      return this;
    },
    deactivate: function() {
      this.el.removeClass('show');
      return this;
    },
    contentLoad: function(oldController) {
      return this;
    }
  });

  Spine.Stack = (function(_super) {

    __extends(Stack, _super);

    Stack.prototype.controllers = {};

    Stack.prototype.routes = {};

    Stack.prototype.className = 'stack';

    Stack.oldController = '';

    function Stack() {
      var key, _ref, _ref1;


      this.manager = new Spine.Manager();

      //分配控制器
      _ref = this.controllers;
      for (key in _ref) {
        this.addController(key, _ref[key]);
      }

      //分配路由
      _ref1 = this.routes;
      for (key in _ref1) {
        this.addRoute(key, _ref1[key]);
      }

      Stack.__super__.constructor.apply(this, arguments);

      //激活默认控制器
      if (this["default"]) {
        this[this["default"]].active();
      }

    }

    Stack.prototype.addController = function(key, value) {
      var controller;

      if (this[key] !== undefined) {
        throw Error("'@" + key + "' already assigned - choose a different name");
      }
      if (typeof value === 'function') {
        controller = new value();
      } else {
        controller = value;
      }
      controller.stack = this;
      controller.bind("contentLoad", controller.contentLoad);
      this[key] = controller;
      this.manager.add(controller);
      // return this.append(controller);
      return this;
    };

    Stack.prototype.addRoute = function(key, value) {
      var callback, _this = this;

      if (typeof value === 'function') {
        callback = value;
      } else {
        callback = function() {
          var _ref2 = _this[value];
          _ref2.trigger("contentLoad", Stack.oldController);
          Stack.oldController = _ref2;
          return _ref2.active.apply(_ref2, arguments);
        };
      }
      return _this.route(key, callback);
    };

    return Stack;
  })(Spine.Controller);

});