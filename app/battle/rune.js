define(function(require, exports, module) {

	var preload = window.APP.preload;
	var effect = require("./effect");
	var RuneAttackEffect = effect.RuneAttackEffect;
	var RuneFireEffect = effect.RuneFireEffect;


	var viewData = require("./viewData");
	var battleViewData = viewData.battleGroup;
	var fontNormal = battleViewData.font.normal;
	var fontLarge = battleViewData.font.large;

	var Rune = function(model) {
		this.initialize(model);
	};

	var p = Rune.prototype = new createjs.Container();

	p.currNums = 0;

	p.Container_initialize = p.initialize;

	p.initialize = function(model) {
		this.Container_initialize();
		this.model = model;

		this.rune = new createjs.Bitmap(preload.getResult("rune-" + model['entityId']));

		this.rune.scaleX = 0.5;
		this.rune.scaleY = 0.5;

		this.addEventListener("click", this.proxy(this.showHandler));
		this.addChild(this.rune);
	};

	p.fireStart = function() {
		var stage = this.getStage();

		var x = (battleViewData.stage.width - 475) / 2;
		var y = (battleViewData.stage.height - 185) / 2;

		var container = new createjs.Container().set({
			x: x,
			y: y
		});

		var fireEffect = new RuneFireEffect(this.model['nature']);

		fireEffect.addEventListener('animationend', function() {
			stage.removeChild(container);
		});

		var runeName = new createjs.Text(this.model["name"], fontNormal, "#fff");

		container.addChild(fireEffect, runeName);

		stage.addChild(container);

		fireEffect.gotoAndPlay('all');

		this.addAttackEffect();
	};
	//符文增加光环
	p.addAttackEffect = function() {
		this.attackEffect = new RuneAttackEffect().set({
			x: -7,
			y: -7
		});
		this.attackEffect.gotoAndPlay("all");
		this.addChild(this.attackEffect);
	};


	p.fireEnd = function() {
		this.removeChild(this.attackEffect);

		var greyScaleFilter = new createjs.ColorMatrixFilter([
			0.33, 0.33, 0.33, 0, 0, // red
			0.33, 0.33, 0.33, 0, 0, // green
			0.33, 0.33, 0.33, 0, 0, // blue
			0, 0, 0, 1, 0 // alpha
		]);

		var figureImg = preload.getResult("rune-" + this.model['entityId']);

		this.rune.filters = [greyScaleFilter];
		this.rune.cache(0, 0, figureImg.width, figureImg.height);
	};

	p.showRune = function() {


		if (!this.showRuneContainer) {

			this.showRuneContainer = new createjs.Container();
			this.showRuneContainer.rune = this;
			this.showRuneContainer.addEventListener('click', this.proxy(this.hideShowRune));

			//bg
			this.showBg = new createjs.Shape();
			this.showBg.graphics.beginFill("#000").drawRect(0, 0, battleViewData.stage.width, battleViewData.stage.height);

			//框框
			this.showFrame = new createjs.Bitmap(preload.getResult("runeFrame-" + this.model['nature']));

			//符文图片
			this.showRuneFigure = new createjs.Bitmap(preload.getResult("rune-" + this.model['entityId']));

			//名字
			this.name = new createjs.Text(this.model["name"], fontNormal, "#fff");

			//星星
			this.star = new createjs.Bitmap(preload.getResult("star-" + this.model['star'])).set({
				x: 70,
				y: 32
			});

			this.level = new createjs.Text(this.model["level"], fontNormal, "#fff");

			this.currentSkill = new createjs.Container();


			//技能
			this.fightskill = new createjs.Text(this.model["fightskill"], fontLarge, "#fff").set({
				x: 0,
				y: 560
			});

			this.showRuneContainer.addChild(this.showBg);
			this.showRuneContainer.addChild(this.showFrame);
			this.showRuneContainer.addChild(this.showRuneFigure);
			this.showRuneContainer.addChild(this.name);
			this.showRuneContainer.addChild(this.star);
			this.showRuneContainer.addChild(this.level);
			this.showRuneContainer.addChild(this.currentSkill);
			this.showRuneContainer.addChild(this.fightskill);
		}

		return this.showRuneContainer;
	};

	p.showHandler = function() {
		var stage = this.getStage();
		var container = this.showRune();
		stage.addChild(container);
		createjs.Ticker.setPaused(true);
		stage.update();
	};

	p.hideShowRune = function() {
		var stage = this.getStage();
		stage.removeChild(this.showRuneContainer);
		createjs.Ticker.setPaused(false);
	};


	module.exports = Rune;
});