define(function(require, exports, module) {

	var SpineManager = require("../plugin/manager");

	var Controller = SpineManager.Controller.sub({
		"el": "#mainPanel",
		init: function() {

		}
	});

	var controller = new Controller();
	module.exports = controller;
});