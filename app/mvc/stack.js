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
    Manager = require("./manager"),
    transitionManager = require("../ui/transitionManager");

  var Module = (function(_super) {

    __extends(Stack, _super);

    Stack.prototype.controllers = {};

    Stack.prototype.routes = {};

    function Stack() {
      var key, _ref, _ref1;

      this.oldController = null;

      Stack.__super__.constructor.apply(this, arguments);

      //分配控制器
      _ref = this.controllers;
      for (key in _ref) {
        this.addChild(key, _ref[key]);
      }

      //分配路由
      _ref1 = this.routes;
      for (key in _ref1) {
        this.addRoute(key, _ref1[key]);
      }

      this.trigger("defaultRoute");
      if (this["default"]) {
        this.navigate(this["default"], true);
      }
    }

    Stack.prototype.addRoute = function(key, value) {
      var _ref2, callback;
      if (typeof value === 'function') {
        callback = value;
      } else {
        callback = this.proxy(function() {
          _ref2 = this.getChildAt(value);
          if (this.oldController === _ref2) {
            return;
          }
          this.render(this.oldController, _ref2);
          this.oldController = _ref2;
        });
      }
      return this.route(key, callback);
    };

    Stack.prototype.render = function(oldController, currController) {
      transitionManager.runTransition(oldController, currController);
    };

    return Stack;
  })(Manager);

  module.exports = Module;
});