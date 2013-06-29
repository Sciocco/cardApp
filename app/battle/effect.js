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


	var RuneAttackEffect = function() {
		this.initialize();
	};

	var p1 = RuneAttackEffect.prototype = new createjs.BitmapAnimation();
	p1.BitmapAnimation_initialize = p1.initialize;

	p1.initialize = function() {
		var data = preload.getResult("runeAttack-sprite");
		data.images = [preload.getResult("runeAttack")];
		var spriteSheet = new createjs.SpriteSheet(data);
		this.BitmapAnimation_initialize(spriteSheet);
	};



	var RuneFireEffect = function(id) {
		this.initialize(id);
	};

	var p2 = RuneFireEffect.prototype = new createjs.BitmapAnimation();
	p2.BitmapAnimation_initialize = p2.initialize;

	p2.initialize = function(id) {
		var data = preload.getResult("runeFire-sprite-" + id);
		data.images = [preload.getResult("runeFire-" + id)];

		var spriteSheet = new createjs.SpriteSheet(data);
		this.BitmapAnimation_initialize(spriteSheet);
	};


	exports.fighterAttackEffect = fighterAttackEffect;
	exports.FighterReadyEffect = FighterReadyEffect;
	exports.RuneAttackEffect = RuneAttackEffect;
	exports.RuneFireEffect = RuneFireEffect;
});