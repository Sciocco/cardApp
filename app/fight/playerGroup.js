define(function(require, exports, module) {

	var ELEMENT = require('../config/consts').ELEMENT;
	var AttackGroup = require('./attackGroup');


	var group = new createjs.Container().set({
		x: 0,
		y: ELEMENT.FIGHTGROUP.HEIGHT
	});

	var attackGroup = new AttackGroup().set({
		x: 10,
		y: 10
	});

	var roleGroup = new RoleGroup().set({
		x: 0,
		y: ELEMENT.ATTACK_CARD.HEIGHT + 10
	});

	var readyGroup = new ReadyGroup().set({
		x: 0,
		y: ELEMENT.FIGHTGROUP.HEIGHT - ELEMENT.READY_CARD.HEIGHT
	});

	var dieFighter = new Fighter().set({
		x: ELEMENT.FIGHTGROUP.WIDTH - ELEMENT.READY_CARD.WIDTH,
		y: ELEMENT.FIGHTGROUP.HEIGHT - ELEMENT.READY_CARD.HEIGHT
	});

	group.addChild(attackGroup, roleGroup, readyGroup, dieFighter);

	


	module.exports = group;


});