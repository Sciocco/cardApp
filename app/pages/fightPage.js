define(function(require, exports, module) {
	var app = window.APP;
	var SpineStack = require("../mvc/stack");
	var utils = require("../utils/utils.js");
	var area = require("../fight/area");
	var skch;

	var Controller = SpineStack.sub({
		"el": "#fightPage",
		init: function() {
			this.bind("contentLoad", this.contentLoad);
		},
		contentLoad: function() {
			skch = utils.createSketchpad(this.el.width, this.el.height, document.getElementById("fightPage"));
			var data = this.getFightData();

			area.bind(area.EVENT_READY, function() {
				area.run();
			});

			area.init(data, skch);
		},
		getFightData: function() {
			return {
				
			};
		}

	});

	var controller = new Controller();
	module.exports = controller;
});