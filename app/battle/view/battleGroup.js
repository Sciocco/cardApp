define(function(require, exports, module) {

	var FighterGroup = require("./fighterGroup");
	var WaitGroup = require("./waitGroup");
	var RoleGroup = require('./roleGroup');


	var BattleGroup = function(groupData) {
		this.initialize(groupData);
	};

	var p = BattleGroup.prototype = new createjs.Container();

	p.Container_initialize = p.initialize;

	p.initialize = function(groupData) {
		this.Container_initialize();
		this.groupData = groupData;

		this.waitGroup = new createjs.Container().set(this.groupData['waitGroup']);
		this.roleGroup = new RoleGroup().set(this.groupData['roleGroup']);
		this.fighterGroup = new createjs.Container().set(this.groupData['fighterGroup']);
		this.diedFighter = new createjs.Container().set(this.groupData['diedFighter']);
	};


	p.addWaitFighter = function(fighter) {
		this.waitGroup.addChild(fighter);
	};



	module.exports = BattleGroup;

});