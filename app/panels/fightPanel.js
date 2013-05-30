define(function(require, exports, module) {

	var Controller = Spine.Controller.sub({
		"el": "#fightPanel",
		"transition":'down',
		init: function() {

		}
	});

	var controller = new Controller();
	module.exports = controller;
});