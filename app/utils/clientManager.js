define(function(require, exports, module) {
	//加载插件
	require("../plugin/zepto.extend");
	require("../plugin/popup");
	require("./manager");

	var loginPage = require("../pages/loginPage");
	var app = require("../app");

	var ClientManager = Spine.Stack.sub({
		"el": "#g-doc",
		controllers: {
			login: loginPage
		},
		routes: {
			"/page/login": 'login',
			"/page/load": 'load',
			"/page/game": "game"
		},
		'default': "load",
		init: function() {
			//初始化路由,兼容手机版本去除history
			Spine.Route.setup({
				trigger: true,
				history: false,
				shim: true,
				replace: false
			});

			this.loadResource();
		},
		loadResource: function() {
			var loadPage = require("../pages/loadPage");
			this.addController("load", loadPage);
			this.navigate("/page/load", true);
		},
		enterScene: function() {
			var scenesManager = require("./scenesManager");
			this.addController("game", scenesManager);
			this.navigate("/page/game", true);
		}
	});

	function init() {
		var clientManager = new ClientManager();

		return clientManager;
	}

	exports.init = init;
});