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


  Module.Controller = Spine.Controller.sub({
    stack: null
  });



  Module.Stack = (function(_super) {

    __extends(Stack, _super);

    Stack.prototype.controllers = {};

    Stack.prototype.routes = {};

    Stack.prototype.className = 'stack';

    Stack.oldController = '';

    function Stack() {
      var key, _ref, _ref1;

      this.children = {};

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

    }

    Stack.prototype.addController = function(key, value) {
      var controller;

      if (this.children[key] !== undefined) {
        return;
      }
      if (typeof value === 'function') {
        controller = new value();
      } else {
        controller = value;
      }
      controller.stack = this;

      this.children[key] = controller;

      return this;
    };

    Stack.prototype.addRoute = function(key, value) {
      var _ref2, callback, _this = this;

      if (typeof value === 'function') {
        callback = value;
      } else {
        callback = function() {
          _ref2 = _this.children[value];
          _this.render(Stack.oldController, _ref2);
          Stack.oldController = _ref2;
        };
      }
      return _this.route(key, callback);
    };

    Stack.prototype.render = function(oldController, currController) {
      var oldDiv, currDiv, oldCallback, currCallback, transition;


      

      if (typeof currController.transition === 'function') {
        transition = currController.transition;
      } else {
        transition = '';
      }

      transition(oldDiv, currDiv, oldCallback, currCallback);
    }
    return Stack;
  })(Module.Controller);

  module.exports = Module;
});