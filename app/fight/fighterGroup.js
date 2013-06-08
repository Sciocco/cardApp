define(function(require, exports, module) {
	var AttackGroup = require('./attackGroup');
	var ReadyGroup = require('./readyGroup');
	var RoleGroup = require('./roleGroup');

	var FighterGroup = function() {
		this.initialize();
	};

	var p = fighterGroup.prototype = new createjs.Container();

	p.attackGroup = null;
	p.readyGroup = null;
	p.dieFighter = null;
	p.roleGroup = null;

	p.DisplayObject_initialize = p.initialize;

	p.initialize = function() {
		this.DisplayObject_initialize();
		this.attackGroup = new AttackGroup();
		this.readyGroup = new ReadyGroup();
		this.roleGroup = new RoleGroup();
		this.dieFighter = new createjs.Bitmap();
	};








});