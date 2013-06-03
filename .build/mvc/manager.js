define("app/mvc/manager", [], function(require, exports, module) {
    var __hasProp = {}.hasOwnProperty, __extends = function(child, parent) {
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
    };
    Spine.Controller.include({
        name: null,
        parent: null
    });
    var Module = function(_super) {
        __extends(Manager, _super);
        function Manager() {
            Manager.__super__.constructor.apply(this, arguments);
            this.children = {};
        }
        Manager.prototype.addChild = function(name, child) {
            if (child === null) {
                return child;
            } else if (typeof child === "function") {
                child = new child();
            }
            if (child.parent) {
                child.parent.removeChild(name);
            }
            child.name = name;
            child.parent = this;
            this.children[name] = child;
            return child;
        };
        Manager.prototype.removeChild = function(name) {
            var child = this.children[name];
            if (child) {
                child.parent = null;
            }
            this.children[name] = null;
            return true;
        };
        Manager.prototype.getChildAt = function(name) {
            return this.children[name];
        };
        Manager.prototype.getNumChildren = function() {
            return this.children.length;
        };
        return Manager;
    }(Spine.Controller);
    module.exports = Module;
});