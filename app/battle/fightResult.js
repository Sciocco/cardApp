define(function(require, exports, module) {

	var preload = window.APP.preload;

	var viewData = require("./viewData");
	var battleViewData = viewData.battleGroup;
	var fontNormal = battleViewData.font.normal;
	var fontLarge = battleViewData.font.large;

	var FightResult = function(model) {
		this.initialize(model);
	};

	var p = FightResult.prototype = new createjs.Container();


	p.Container_initialize = p.initialize;

	p.initialize = function(model) {

		this.model = model;

		this.gold = new createjs.Text(this.model['gold'], fontNormal, "#fff").set({
			x: 380,
			y: 260
		});
		this.exp = new createjs.Text(this.model['exp'], fontNormal, "#fff").set({
			x: 380,
			y: 360
		});

	};


	p.showResult = function() {

		var stage = this.getStage();
		var img;

		var _this = this;
		if (this.model['isWin']) {
			img = preload.getResult("fightResultWin");
		} else {
			img = preload.getResult("fightResultLose");
		}

		this.resultContainer = new createjs.Container();

		var resultBg = new createjs.Bitmap(img);

		this.resultContainer.addEventListener('click', function() {
			stage.removeChild(_this.resultContainer);
			_this.showItems();
		});


		this.resultContainer.addChild(resultBg);
		this.resultContainer.addChild(this.gold);
		this.resultContainer.addChild(this.exp);

		stage.addChild(this.resultContainer);
	};

	p.showItems = function() {

	};

	module.exports = FightResult;
});