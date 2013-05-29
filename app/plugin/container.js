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
    __slice = [].slice;

  var Module = {};

  Module.Controller = Spine.Controller.sub({
    name: null,
    parent: null,
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

  Spine.Container = (function(_super) {

    __extends(Container, _super);

    Container.include(Spine.Events);

    Container.prototype.controllers = {};

    function Container() {
      var key, _ref;

      this.children = [];

      //分配控制器
      _ref = this.controllers;
      for (key in _ref) {
        this.addChild(_ref[key]);
      }

      Container.__super__.constructor.apply(this, arguments);
    }

    Container.prototype.addChild = function(child) {
      if (child === null) {
        return child;
      }
      var l = arguments.length;
      if (l > 1) {
        for (var i = 0; i < l; i++) {
          this.addChild(arguments[i]);
        }
        return arguments[l - 1];
      }
      if (child.parent) {
        child.parent.removeChild(child);
      }
      child.parent = this;
      this.children.push(child);
      return child;
    };

    Container.prototype.addChildAt = function(child, index) {
      var l = arguments.length;
      var indx = arguments[l - 1]; // can't use the same name as the index param or it replaces arguments[1]
      if (indx < 0 || indx > this.children.length) {
        return arguments[l - 2];
      }
      if (l > 2) {
        for (var i = 0; i < l - 1; i++) {
          this.addChildAt(arguments[i], indx + i);
        }
        return arguments[l - 2];
      }
      if (child.parent) {
        child.parent.removeChild(child);
      }
      child.parent = this;
      this.children.splice(index, 0, child);
      return child;
    };

    Container.prototype.removeChild = function(child) {
      var l = arguments.length;
      if (l > 1) {
        var good = true;
        for (var i = 0; i < l; i++) {
          good = good && this.removeChild(arguments[i]);
        }
        return good;
      }
      return this.removeChildAt(this.children.indexOf(child));
    };

    Container.prototype.removeChildAt = function(index) {
      var l = arguments.length;
      if (l > 1) {
        var a = [];
        for (var i = 0; i < l; i++) {
          a[i] = arguments[i];
        }
        a.sort(function(a, b) {
          return b - a;
        });
        var good = true;
        for (var i = 0; i < l; i++) {
          good = good && this.removeChildAt(a[i]);
        }
        return good;
      }
      if (index < 0 || index > this.children.length - 1) {
        return false;
      }
      var child = this.children[index];
      if (child) {
        child.parent = null;
      }
      this.children.splice(index, 1);
      return true;
    };

    Container.prototype.removeAllChildren = function() {
      var kids = this.children;
      while (kids.length) {
        kids.pop().parent = null;
      }
    };

    Container.prototype.getChildAt = function(index) {
      return this.children[index];
    };

    Container.prototype.getChildByName = function(name) {
      var kids = this.children;
      for (var i = 0, l = kids.length; i < l; i++) {
        if (kids[i].name == name) {
          return kids[i];
        }
      }
      return null;
    };

    Container.prototype.sortChildren = function(sortFunction) {
      this.children.sort(sortFunction);
    };
    Container.prototype.getChildIndex = function(child) {
      return this.children.indexOf(child);
    };

    Container.prototype.getNumChildren = function() {
      return this.children.length;
    };

    Container.prototype.swapChildrenAt = function(index1, index2) {
      var kids = this.children;
      var o1 = kids[index1];
      var o2 = kids[index2];
      if (!o1 || !o2) {
        return;
      }
      kids[index1] = o2;
      kids[index2] = o1;
    };

    Container.prototype.swapChildren = function(child1, child2) {
      var kids = this.children;
      var index1, index2;
      for (var i = 0, l = kids.length; i < l; i++) {
        if (kids[i] == child1) {
          index1 = i;
        }
        if (kids[i] == child2) {
          index2 = i;
        }
        if (index1 != null && index2 != null) {
          break;
        }
      }
      if (i == l) {
        return;
      } // TODO: throw error?
      kids[index1] = child2;
      kids[index2] = child1;
    };

    Container.prototype.setChildIndex = function(child, index) {
      var kids = this.children,
        l = kids.length;
      if (child.parent != this || index < 0 || index >= l) {
        return;
      }
      for (var i = 0; i < l; i++) {
        if (kids[i] == child) {
          break;
        }
      }
      if (i == l || i == index) {
        return;
      }
      kids.splice(i, 1);
      if (index < i) {
        index--;
      }
      kids.splice(index, 0, child);
    };

    Container.prototype.contains = function(child) {
      while (child) {
        if (child == this) {
          return true;
        }
        child = child.parent;
      }
      return false;
    };

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

  })(Module.Controller);
  module.exports = Module;

});