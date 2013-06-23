define(function(require, exports, module) {

	exports.battleGroup = {
		stage: {
			width: 640,
			height: 960
		},
		speed: {
			fast: 100,
			normal: 300,
			slow: 500
		},
		font: {
			large: 100,
			normal: "18px Microsoft YaHei",
			small: 500
		},
		fighters: {
			player: 0,
			enemy: 1
		},

		fighter: {
			width: 116
		},
		avatar: {
			x: 0,
			y: 0
		},
		hpShape: {
			x: 0,
			y: 106,
			width: 116,
			height: 10
		},
		hpText: {
			x: 0,
			y: 96
		},
		name: {
			x: 50,
			y: 0
		},
		level: {
			x: 0,
			y: 76
		},
		rune: {
			width: 53
		},
		autoButton: {
			x: 136,
			y: 904
		},
		handButton: {
			x: 388,
			y: 904
		},
		turnIndex: {
			x: 304,
			y: 904
		},
		margin: {
			f2f: 10,
			r2r: 10
		}
	};

	exports.playerGroup = {
		battleGroup: {
			x: 0,
			y: 452
		},
		waitGroup: {
			x: 0,
			y: 316
		},
		roleGroup: {
			x: 10,
			y: 200
		},
		hpShape: {
			turn: false
		},
		runeGroup: {
			x: 136,
			y: 200
		},
		fightGroup: {
			x: 0,
			y: 0
		},
		diedFighter: {
			x: 514,
			y: 316
		},

		fighterXY: {
			x: 10,
			y: 10
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
			y: 136
		},
		hpShape: {
			turn: true
		},
		runeGroup: {
			x: 0,
			y: 200
		},
		fightGroup: {
			x: 0,
			y: 252
		},
		diedFighter: {
			x: 0,
			y: 10
		},
		fighterXY: {
			x: 514,
			y: 10
		},
		runeXY: {
			x: 451,
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

	exports.skillType = {

	};

	exports.sourceRect = {
		//按钮
		normalAutoRect: new createjs.Rectangle(0, 0, 68, 28),
		normalHandRect: new createjs.Rectangle(0, 33, 68, 28),
		cancelAutoRect: new createjs.Rectangle(0, 66, 68, 28),
		cancelHandRect: new createjs.Rectangle(0, 99, 68, 28),
		//男女头像
		womanAvatarRect: new createjs.Rectangle(0, 0, 116, 116),
		manAvatarRect: new createjs.Rectangle(121, 0, 116, 116),
		//战斗者状态
		dieRect: new createjs.Rectangle(0, 0, 116, 116),
		waitRect: new createjs.Rectangle(121, 0, 116, 116),
		fightRect: new createjs.Rectangle(242, 0, 116, 180),
		showRect: new createjs.Rectangle(363, 0, 225, 322)
	};

});