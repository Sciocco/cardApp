define(function(require, exports, module) {
	require('../mvc/route');
	var SpineStack = require("../mvc/stack");
	var loginPage = require("../pages/loginPage");
	var ClientManager = SpineStack.sub({
		"el": "#g-doc",
		controllers: {
			login: loginPage
		},
		routes: {
			"/page/login": 'login',
			"/page/game": "game",
			"/page/fight/:fb1/:fb2": "fight"
		},
		'default': "/page/login",
		init: function() {
			//初始化路由,兼容手机版本去除history
			Spine.Route.setup({
				trigger: true,
				history: false,
				shim: true,
				replace: false
			});
			this['default'] = '/page/game';
			this.bind('defaultRoute', this.proxy(this.enterGame));
		},
		enterGame: function() {
			var gamePage = require("../pages/gamePage");
			this.addChild("game", gamePage);
			this.navigate("/page/game", true);
		},
		enterFight: function(route) {
			var fightPage = require("../pages/fightPage");
			this.addChild("fight", fightPage);
			this.navigate(route, true);
		}
	});

	function run() {
		var clientManager = new ClientManager();
		return clientManager;
	}

	exports.run = run;
});