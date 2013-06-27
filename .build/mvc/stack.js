define("app/mvc/stack", [ "./manager", "../ui/transitionManager", "../ui/noTransition", "../ui/jq.css3animate", "../ui/slideTransition", "../ui/slideDownTransition" ], function(require, exports, module) {
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
    }, __slice = [].slice, Manager = require("./manager"), transitionManager = require("../ui/transitionManager");
    var Module = function(_super) {
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
            var _ref2, callback, oldController;
            var _this = this;
            if (typeof value === "function") {
                callback = value;
            } else {
                callback = function(params) {
                    oldController = _this.oldController;
                    _ref2 = _this.getChildAt(value);
                    if (_this.oldController === _ref2) {
                        return;
                    }
                    _ref2.params = params;
                    //在render设置oldController,避免回调失败再设置oldController
                    _this.oldController = _ref2;
                    _this.render(oldController, _ref2);
                };
            }
            return this.route(key, callback);
        };
        Stack.prototype.render = function(oldController, currController) {
            transitionManager.runTransition(oldController, currController);
        };
        Stack.prototype.setOldController = function(controller) {
            this.oldController = controller;
        };
        return Stack;
    }(Manager);
    module.exports = Module;
});