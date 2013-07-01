define(function(require, exports, module) {
	var preload = window.APP.preload;

	var Buffer = function(model) {
		this.initialize(model);
	};

	var p = Buffer.prototype = new createjs.BitmapAnimation();

	p.BitmapAnimation_initialize = p.initialize;

	p.currNums = 0;

	p.initialize = function(model) {
		this.set({
			x: -10,
			y: -10,
			scaleX: 0.92,
			scaleY: 0.95
		});

		this.model = model;

		var data = preload.getResult("buffer-sprite-" + model['id']);
		data.images = [preload.getResult("buffer-" + model['id'])];
		var spriteSheet = new createjs.SpriteSheet(data);
		this.BitmapAnimation_initialize(spriteSheet);
	};

	p.endBuffer = function(fighter) {
		fighter.fightFighterContainer.removeChild(this);
		fighter.hitHp(this.model['hurt']);
	};



	module.exports = Buffer;
});