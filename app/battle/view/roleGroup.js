define(function(require, exports, module) {
	var viewData = require("viewData");
	var avatarRect = viewData.avatarSourceRect;
	var runeRect = viewData.runeSourceRect;

	var RoleGroup = function(model) {
		this.initialize(model);
	};

	var p = RoleGroup.prototype = new createjs.Container();

	p.Container_initialize = p.initialize;

	p.initialize = function(model) {
		this.Container_initialize();
		this.model = model;

		this.addAvatar();
		this.addHp();
		this.addRunes();

		this.addChild(this.avatar, this.hp, this.runes);
	};


	p.addAvatar = function() {

		this.name = new createjs.Text(this.model['name'], null, "#fff");
		this.level = new createjs.Text(this.model['level'], null, "#fff");

		this.appearance = new createjs.Text(this.model['appearance']);
		this.appearance.sourceRect = avatarRect[this.model['avatar']];

		this.avatar = new createjs.Container();
		this.avatar.addChild(this.roleImg, this.name, this.level);
	};

	p.addHp = function() {
		this.hp = new createjs.Container();
		this.hpText = new createjs.Text(this.model['hpText'], null, "#fff");
		this.hp.addChild(this.hpText);
	};

	p.addRunes = function() {
		var runes = this.models['runes'];
		this.runes = new createjs.Container();


		runes.forEach(function(rune) {
			var appearance = new createjs.Bitmap(rune['appearance']);
			appearance.sourceRect = runeRect(rune['id']);
			appearance.set({
				x: 10,
				y: 20
			});
			this.runes.addChild(appearance);
		});
	};


	module.exports = RoleGroup;

});