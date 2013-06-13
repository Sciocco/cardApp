define(function(require, exports, module) {

	var BattleGroup = require('./view/battleGroup');
	var viewData = require("./viewData");

	var preload = window.APP.preload;

	var Module = Spine.Module.sub(Spine.Events);

	var stage;
	var enemyGroup, playerGroup;


	var p = Module.prototype;


	p.initialize = function(pCanvas) {
		stage = new createjs.Stage(pCanvas);
		createjs.Ticker.setFPS(40);
		createjs.Ticker.addEventListener("tick", handleTick);

		initStage();
	};


	function handleTick() {
		stage.update();
	}

	function initStage() {
		drawBackground();
		playerGroup = new BattleGroup(viewData.playerGroup);
		enemyGroup = new BattleGroup(viewData.enemyGroup);
	}

	function drawBackground() {
		var battleBg = new createjs.Bitmap(preload.getResult("battleBg"));
		stage.addChild(battleBg);
	}

	p.initRoles = function(pRole, eRole) {
		playerGroup.roleGroup.setRole(pRole);
		enemyGroup.roleGroup.setRole(eRole);
	};


	p.showBattle = function() {

	};

	var battleView = new Module();

	module.exports = battleView;
});