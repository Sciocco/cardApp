define(function(require, exports, module) {

	var SpineStack = require("../mvc/stack");

	var Controller = SpineStack.sub({
		"el": "#gamePage",
		"transition": 'down',
		routes: {
			"/panel/main": 'main',
			"/panel/dungeon": 'dungeon',
			"/panel/fight": 'fight'
		},
		init: function() {
			var _this = this;
			$("#navbar").delegate("a", "click", function() {
				var route = $(this).attr("href");
				switch (route) {
					case '#/panel/dungeon':
						var dungeonPanel = require("../panels/dungeonPanel");
						_this.addChild("dungeon", dungeonPanel);
						break;
					case '#/panel/fight':
						var fightPanel = require("../panels/fightPanel");
						_this.addChild("fight", fightPanel);
						break;
				}
				_this.navigate(route);
			});
			this.on('contentLoad', this.proxy(this.contentLoad));
		},
		contentLoad: function() {
			var mainPanel = require("../panels/mainPanel");
			this.addChild("main", mainPanel);
			this.navigate("/panel/main", true);
		}
	});


	var controller = new Controller();
	module.exports = controller;

});