define(function(require, exports, module) {

	var Controller = Spine.Controller.sub({
		"el": "#mainPanel",
		"transition": 'down',
		init: function() {
			this.bind("contentLoad", this.contentLoad);
		},
		contentLoad: function() {
			var size = $(".slideLeft li").size() - 1;
			var time = 500;

			$(".slideLeft li").each(function(i) {
				$(this).attr("style", "-webkit-animation-delay:" + i * 500 + "ms");
				if (i == size) {
					$(".slideLeft").addClass("play");
				}
			});

			$(".slideRight li").each(function(i) {
				$(this).attr("style", "-webkit-animation-delay:" + i * 500 + "ms");
				if (i == size) {
					$(".slideRight").addClass("play");
				}
			});

			setTimeout(function() {
				$(".slideLeft").attr('data-liffect', 'slideLeftBack');
				$(".slideRight").attr('data-liffect', 'slideRightBack');
				$(".slideLeft").removeClass('play');
				$(".slideRight").removeClass('play');

			}, size * time + time);
		},
		contentUnload: function(callback) {

			var size = $(".slideLeft li").size() - 1;
			var time = 500;



			$(".slideLeft li").each(function(i) {
				$(this).attr("style", "-webkit-animation-delay:" + (size - i) * time + "ms");
				if (i == size) {
					$(".slideLeft").addClass("play");
				}
			});

			$(".slideRight li").each(function(i) {
				$(this).attr("style", "-webkit-animation-delay:" + (size - i) * time + "ms");
				if (i == size) {
					$(".slideRight").addClass("play");
				}
			});

			setTimeout(function() {
				$(".slideLeft").attr('data-liffect', 'slideLeft');
				$(".slideRight").attr('data-liffect', 'slideRight');
				$(".slideLeft").removeClass('play');
				$(".slideRight").removeClass('play');
				callback();
			}, size * time + time);
		}
	});

	var controller = new Controller();
	module.exports = controller;
});