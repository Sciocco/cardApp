define(function(require, exports, module) {
	var app = require("../app");

	var cityScene = require("../pages/cityScene");
	var Controller = Spine.Stack.sub({
		"el": "#gamePage",
		controllers: {
			city: cityScene
		},
		routes: {
			"/scene/city": 'city',
			"/scene/fight": 'fight'
		},
		'default': "city",
		init: function() {

		},
		contentLoad: function(oldController) {

		}
	});


	var controller = new Controller();
	module.exports = controller;

});