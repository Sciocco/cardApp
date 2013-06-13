define(function(require, exports, module) {
	var app = window.APP;

	var battleModel = require('../battle/battleModel');
	var battleView = require('../battle/battleView');
	var utils = require("../utils/utils.js");

	var skch;
	var Controller = Spine.Controller.sub({
		"name": "battle",
		"el": "#battlePanel",
		init: function() {
			this.bind("contentLoad", this.contentLoad);

			battleModel.bind(battleModel.EVENT_START_ERROR, this.proxy(this.errorHandler));

			skch = utils.createSketchpad(640, 960, document.getElementById("battleContainer"));

			battleView.initialize(skch);
		},
		contentLoadBefore: function(callback, oldController) {
			battleModel.start(callback);
			this.oldController = oldController;
		},
		contentLoad: function() {
			
			

		},
		errorHandler: function() {
			alert(battleModel.error);
			this.parent.oldController = this.oldController;
		}

	});



	var controller = new Controller();
	module.exports = controller;
});