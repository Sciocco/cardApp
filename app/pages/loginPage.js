define(function(require, exports, module) {
	var app = require("../app");
	var loading = false;
	var httpHost = location.href.replace(location.hash, '');

	var Controller = Spine.Controller.sub({
		"el": "#loginPage",
		init: function() {
			$('#loginBtn').on('click', this.proxy(this.login));
		},
		login: function() {
			if (loading) {
				return;
			}
			loading = true;
			var username = $('#loginUser').val().trim();
			var pwd = $('#loginPwd').val().trim();
			$('#loginPwd').val('');
			if (!username) {
				alert("Username is required!");
				loading = false;
				return;
			}

			if (!pwd) {
				alert("Password is required!");
				loading = false;
				return;
			}

			// $.post(httpHost + 'login', {
			// 	username: username,
			// 	password: pwd
			// }, function(data) {
			// 	if (data.code === 501) {
			// 		alert('Username or password is invalid!');
			// 		loading = false;
			// 		return;
			// 	}
			// 	if (data.code !== 200) {
			// 		alert('Username is not exists!');
			// 		loading = false;
			// 		return;
			// 	}

			//test data
			var data = {
				user: {
					id: 1
				},
				player: {
					areaId: "5"
				}
			};

			this.afterLogin(data);

			localStorage.setItem('username', username);
			// });
		},
		afterLogin: function(data) {
			var userData = data.user;
			var playerData = data.player;

			var areaId = playerData.areaId;

			if ( !! userData) {
				app.uid = userData.id;
			}
			app.playerId = playerData.id;
			app.areaId = areaId;
			app.player = playerData;
			//加载资源
			this.parent.loadResource();
		}

	});



	var controller = new Controller();

	module.exports = controller;

});