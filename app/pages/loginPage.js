define(function(require, exports, module) {

	var SpineStack = require("../mvc/stack");

	var Controller =  SpineStack.sub({
		"el": "#loginPage",
		routes: {
			"/panel/login": 'login',
			"/panel/server": 'server'
		},
		init: function() {
			this.on('contentLoad', this.proxy(this.contentLoad));
		},
		contentLoad: function() {
			var loginPanel = require("../panels/loginPanel");
			this.addChild("login", loginPanel);
			this.navigate("/panel/login", true);
		},
		enterServer: function() {
			var serverPanel = require("../panels/serverPanel");
			this.addChild("server", serverPanel);
			this.navigate("/panel/server", true);
		}
	});

	var controller = new Controller();

	module.exports = controller;

});