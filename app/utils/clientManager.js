define(function(require, exports, module) {

	var SpineStack = require("../mvc/stack");
	var loginPage = require("../pages/loginPage");

	var ClientManager = SpineStack.sub({
		"el": "#g-doc",
		controllers: {
			login: loginPage
		},
		routes: {
			"/page/login": 'login',
			"/page/load": 'load',
			"/page/game": "game",
			"/page/fight": "fight"
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
			
			this['default'] = '/page/load';
			this.on('defaultRoute', this.proxy(this.loadResource));
		},
		loadResource: function() {
			var loadPage = require("../pages/loadPage");
			this.addChild("load", loadPage);
			this.navigate("/page/load", true);
		},
		enterScene: function() {
			var panelManager = require("./panelManager");
			this.addChild("game", panelManager);
			this.navigate("/page/game", true);
		}
	});

	function init() {
		var clientManager = new ClientManager();
		return clientManager;
	}

	exports.init = init;
});