define(function(require, exports, module) {
	var BattleGroup = require('./battleGroup');
	var viewData = require("./viewData");

	var battleViewData = viewData.battleGroup;
	var groupViewData = viewData.playerGroup;

	var battleGroup = new BattleGroup(groupViewData);


	/**
	 * [ description]
	 * @param  {[type]} group   [description]
	 * @param  {[type]} fighter [description]
	 * @return {[type]}         [description]
	 */
	battleGroup.setFighterXY = function(group, fighter) {

		var x = groupViewData.fighterXY.x,
			length = group.getNumChildren(),
			width = battleViewData.fighter.width;

		x = x + length * width + battleViewData.margin.f2f * length;

		fighter.set({
			x: x - width,
			y: groupViewData.fighterXY.y
		});

		battleGroup.entranceAnimation(fighter, x);
	};

	/**
	 * [ description]
	 * @param  {[type]} rune [description]
	 * @return {[type]}      [description]
	 */
	battleGroup.setRuneXY = function(rune) {

		var x = groupViewData.runeXY.x,
			length = this.runeGroup.getNumChildren(),
			width = battleViewData.rune.width;

		x = x + length * width + battleViewData.margin.r2r * length;

		rune.set({
			x: x,
			y: groupViewData.runeXY.y
		});

	};


	battleGroup.forwardFightGroupXY = function() {
		return this.fightGroup.x - battleViewData.fighter.width - battleViewData.margin.f2f;
	};

	battleGroup.backwardFightGroupXY = function() {
		return this.fightGroup.x + battleViewData.fighter.width + battleViewData.margin.f2f;
	};

	battleGroup.resetWaitFighter = function() {
		var x = groupViewData.fighterXY.x;
		this.waitGroup.children.forEach(function(fighter) {
			fighter.x = x;
			x = x + battleViewData.fighter.width + battleViewData.margin.f2f;
		});
	};


	battleGroup.resetFightFighter = function() {
		var x = groupViewData.fighterXY.x;

		this.fightGroup.children.forEach(function(fighter) {
			fighter.x = x;
			x = x + battleViewData.fighter.width + battleViewData.margin.f2f;
		});
	};

	battleGroup.resetFightGroup = function() {
		this.fightGroup.x = groupViewData.fightGroup.x;
		this.fightGroup.y = groupViewData.fightGroup.y;
		this.fightGroup.children.forEach(function(fighter) {
			fighter.visible = 1;
		});
	};


	module.exports = battleGroup;

});