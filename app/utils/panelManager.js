define(function(require, exports, module) {
	var app = require("../app");

	var mainPanel = require("../panels/mainPanel");

	var SpineManager = require("../plugin/manager");

	var Controller = SpineManager.Stack.sub({
		"el": "#gamePage",
		controllers: {
			main: mainPanel
		},
		routes: {
			"/panel/main": 'main',
			"/panel/dungeon": 'dungeon',
			"/panel/fight": 'fight'
		},
		'default': "main",
		init: function() {
			var _this = this;
			$("#navbar").delegate("a", "click", function() {
				var route = $(this).attr("href").substr(1);
				switch (route) {
					case '/panel/dungeon':
						var dungeonPanel = require("../panels/dungeonPanel");
						_this.addController("dungeon", dungeonPanel);
						break;
					case '/panel/fight':
						var fightPanel = require("../panels/fightPanel");
						_this.addController("fight", fightPanel);
						break;
				}
				_this.navigate(route);
			});
		},
		contentLoad: function(oldController) {

		}
	});


	var controller = new Controller();
	module.exports = controller;

});