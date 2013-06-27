define(function(require, exports, module) {

	var preload = window.APP.preload;

	var Rune = function(model) {
		this.initialize(model);
	};

	var p = Rune.prototype = new createjs.Container();

	p.Container_initialize = p.initialize;

	p.initialize = function(model) {
		this.Container_initialize();
		this.model = model;

		var rune = new createjs.Bitmap(preload.getResult("rune-" + model));

		rune.scaleX = 0.5;
		rune.scaleY = 0.5;
		this.addChild(rune);
	};

	module.exports = Rune;
});