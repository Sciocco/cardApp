define(function(require, exports, module) {
	exports.playerGroup = {
		waitGroup: {
			x: 0,
			y: 0
		},
		roleGroup: {
			x: 0,
			y: 0
		},
		fighterGroup: {
			x: 0,
			y: 0
		},
		diedFighter: {
			x: 0,
			y: 0
		}
	};

	exports.enemyGroup = {
		waitGroup: {
			x: 0,
			y: 0
		},
		roleGroup: {
			x: 0,
			y: 0
		},
		fighterGroup: {
			x: 0,
			y: 0
		},
		diedFighter: {
			x: 0,
			y: 0
		}
	};

	exports.fighterStatus = {
		FIGHT: "fight",
		WAIT: "wait",
		READY: "ready",
		DIED: "died",
		SHOW: "show"
	};

	exports.fightSourceRect = {
		showRect: new createjs.Rectangle(0, 0, 120, 180),
		fightRect: new createjs.Rectangle(0, 0, 110, 180),
		waitRect: new createjs.Rectangle(120, 0, 110, 110),
		dieRect: new createjs.Rectangle(240, 0, 110, 110)
	};

	exports.avatarSourceRect = {
		showRect: new createjs.Rectangle(0, 0, 120, 180),
		fightRect: new createjs.Rectangle(0, 0, 110, 180),
		waitRect: new createjs.Rectangle(120, 0, 110, 110),
		dieRect: new createjs.Rectangle(240, 0, 110, 110)
	};

	exports.runeSourceRect = {
		showRect: new createjs.Rectangle(0, 0, 120, 180),
		fightRect: new createjs.Rectangle(0, 0, 110, 180),
		waitRect: new createjs.Rectangle(120, 0, 110, 110),
		dieRect: new createjs.Rectangle(240, 0, 110, 110)
	};


});