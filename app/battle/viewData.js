define(function(require, exports, module) {

	exports.battleGroup = {
		stage: {
			width: 640,
			height: 960
		},
		speed: {
			fast: 80,
			normal: 150,
			slow: 300
		},
		font: {
			large: "20px Microsoft YaHei",
			normal: "14px Microsoft YaHei",
			small: "12px Microsoft YaHei"
		},
		fighters: {
			player: 'player',
			enemy: 'enemy'
		},
		fighter: {
			width: 118
		},
		avatar: {
			x: 0,
			y: 0
		},
		hpShape: {
			x: 0,
			y: 94,
			width: 110,
			height: 12
		},
		hpText: {
			x: 20,
			y: 89
		},
		name: {
			x: 45,
			y: -10
		},
		rune: {
			width: 55
		},
		autoButton: {
			x: 449,
			y: 649
		},
		handButton: {
			x: 257,
			y: 649
		},
		turnButton: {
			x: 257,
			y: 649
		},
		margin: {
			f2f: 8,
			r2r: 15
		},
		showNums: 2

	};

	exports.playerGroup = {
		battleGroup: {
			x: 0,
			y: 457
		},
		waitGroup: {
			x: 0,
			y: 391
		},
		roleGroup: {
			x: 18,
			y: 277
		},
		hpShape: {
			turn: false
		},
		runeGroup: {
			x: 140,
			y: 321
		},
		fightGroup: {
			x: 0,
			y: 0
		},
		diedFighter: {
			x: 500,
			y: 258
		},
		fighterXY: {
			x: 9,
			y: 0
		},
		runeXY: {
			x: 0,
			y: 0
		}
	};

	exports.enemyGroup = {
		battleGroup: {
			x: 0,
			y: 0
		},
		waitGroup: {
			x: 0,
			y: 0
		},
		roleGroup: {
			x: 514,
			y: 122
		},
		hpShape: {
			turn: true
		},
		runeGroup: {
			x: 0,
			y: 125
		},
		fightGroup: {
			x: 0,
			y: 270
		},
		diedFighter: {
			x: 8,
			y: 125
		},
		fighterXY: {
			x: 513,
			y: 0
		},
		runeXY: {
			x: 445,
			y: 0
		}
	};

	exports.fighterStatus = {
		FIGHT: "fight",
		WAIT: "wait",
		READY_BEFORE: "readyBefore",
		READY: "ready",
		DIED: "died",
		SHOW: "show"
	};

	exports.skillTypes = {
		"1": "defense",
		"2": "auxiliary",
		"3": "attack",
		"4": "reply",
		"5": "magic"
	};

	exports.sourceRect = {
		//按钮
		handNormalRect: new createjs.Rectangle(0, 0, 183, 56),
		handCanelRect: new createjs.Rectangle(188, 0, 183, 56),
		autoNormalRect: new createjs.Rectangle(0, 61, 183, 56),
		autoCancelRect: new createjs.Rectangle(188, 61, 182, 56),
		turnNormalRect: new createjs.Rectangle(0, 122, 182, 56),
		turnCanelRect: new createjs.Rectangle(187, 122, 182, 56),
		//男女头像
		womanAvatarRect: new createjs.Rectangle(0, 0, 116, 116),
		manAvatarRect: new createjs.Rectangle(121, 0, 116, 116),
		//技能类型
		defenseSkillRect: new createjs.Rectangle(0, 0, 110, 34),
		auxiliarySkillRect: new createjs.Rectangle(0, 39, 110, 34),
		attackSkillRect: new createjs.Rectangle(0, 78, 110, 34),
		replySkillRect: new createjs.Rectangle(0, 117, 110, 34),
		magicSkillRect: new createjs.Rectangle(0, 156, 110, 34)
	};

});