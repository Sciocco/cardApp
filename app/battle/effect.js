define(function(require, exports, module) {
	var preload = window.APP.preload;

	var fighterAttackEffect = new createjs.Bitmap(preload.getResult("fighterAttack"));
	fighterAttackEffect.visible = false;

	var FighterReadyEffect = function() {
		this.initialize();
	};

	var p = FighterReadyEffect.prototype = new createjs.BitmapAnimation();
	p.BitmapAnimation_initialize = p.initialize;

	p.initialize = function() {
		var data = preload.getResult("fighterReady-sprite");
		data.images = [preload.getResult("fighterReady")];
		var spriteSheet = new createjs.SpriteSheet(data);
		this.BitmapAnimation_initialize(spriteSheet);
	};

	exports.fighterAttackEffect = fighterAttackEffect;
	exports.FighterReadyEffect = FighterReadyEffect;
});