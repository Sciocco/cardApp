define(function(require, exports, module) {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) {
      for (var key in parent) {
        if (__hasProContainer.prototype.call(parent, key)) child[key] = parent[key];
      }

      function ctor() {
        this.constructor = child;
      }
      ctor.prototype = parent.prototype;
      child.prototype = new ctor();
      child.__super__ = parent.prototype;
      return child;
    },
    Manager = require("./manager");

  Spine.Controller.include({
    visible: true,
    x: 0,
    y: 0,
    render: function(parent) {
      this.el.css({
        position: "absolute",
        left: x,
        top: y
      });
      this.appendTo(parent);
    }
  });

  var Module = (function(_super) {

    __extends(Container, _super);

    Container.prototype.controllers = {};

    function Container() {
      var key, _ref;

      Container.__super__.constructor.apply(this, arguments);
      
      //分配控制器
      _ref = this.controllers;
      for (key in _ref) {
        this.addChild(_ref[key]);
      }
    }

    Container.prototype.render = function() {
      var list = this.children.slice(0);
      for (var i = 0, l = list.length; i < l; i++) {
        var child = list[i];
        if (!child.visible) {
          continue;
        }
        child.render(this);
      }
      return true;
    };

    return Container;

  })(Manager);

  module.exports = Module;

});