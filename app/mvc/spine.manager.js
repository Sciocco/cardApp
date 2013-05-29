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


	var Manager = (function(_super) {
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

	module.exports = Manager;
})