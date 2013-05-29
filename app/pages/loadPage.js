define(function(require, exports, module) {
	var app = require("../app");
	var resourceLoader = require("../utils/resourceLoader");
	var soundManager = require("../utils/soundManager");


	var Controller = Spine.Controller.sub({
		"el": "#loadPage",
		init: function() {

		},
		contentLoad: function(oldController) {
			var _this = this;

			//test data
			var data = {
				soundName: "sound",
				mapName: "black",
				npcs: [305, 306]
			};

			var $percent = $('#id_loadPercent').html(0);

			//修改dom元素
			resourceLoader.addEventListener("progress", this.proxy(function(event) {
				var n = parseInt(resourceLoader.progress * 100, 10);
				$percent.html(n);
			}));


			//当加载完声音,则播放
			resourceLoader.addEventListener("fileload", this.proxy(function(event) {
				var item = event.item;
				if (item.type === createjs.LoadQueue.SOUND) {
					soundManager.addSound(item.id, createjs.Sound.createInstance(item.id));
					if (item.id === soundManager.BG_SOUND) {
						soundManager.playBgSound();
					}
				}
			}));


			//进入场景页面
			resourceLoader.addEventListener("complete", function(event) {
				setTimeout(function() {
					_this.stack.enterScene();
				}, 115500);
			});

			resourceLoader.loadAreaResource(data);
		}
	});


	var controller = new Controller();
	module.exports = controller;

});