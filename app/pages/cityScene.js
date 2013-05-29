define(function(require, exports, module) {


	var soundManager = require("../utils/soundManager");

	var Controller = Spine.Controller.sub({
		"el": "#mainScene",
		init: function() {
			
		},
		contentLoad: function(oldController) {
			this.render();
		}
	});


	var controller = new Controller();
	module.exports = controller;

});