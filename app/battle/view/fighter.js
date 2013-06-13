define(function(require, exports, module) {

	var viewData = require("viewData");
	var fighterStatus = viewData.fighterStatus;
	var sourceRect = viewData.fighterSourceRect;

	var Fighter = function(model, status) {
		this.initialize(model);

		if (typeof status !== "undefied") {
			this.toggleStatus(status);
		}
	};

	var p = Fighter.prototype = new createjs.Container();

	p.Container_initialize = p.initialize;

	p.initialize = function(model) {
		this.Container_initialize();
		this.model = model;

		this.addEventListener('press', showFighter);

		this.fighterImg = new createjs.Bitmap(this.model["fighterImg"]);
		this.fightData = new createjs.Container();
		this.addChild(this.FighterImg, this.fightData);

		this.level = new createjs.Text("LV:" + this.model["level"], null, "#fff");
		this.atk = new createjs.Text("AT:" + this.model['atk'], null, "#fff");
		this.hp = new createjs.Text("HP:" + this.model['hp'], null, "#fff");
		this.waitTime = new createjs.Text(this.model['waitTime'], null, "#fff");
	};

	p.isShow = 0;

	p.toggleStatus = function(status) {
		switch (status) {
			case fighterStatus.WAIT:
				this.waitStatus();
				break;
			case fighterStatus.FIGHT:
				this.fightStatus();
				break;
			case fighterStatus.DIED:
				this.diedStatus();
				break;
			case fighterStatus.SHOW:
				this.showStatus();
				break;
		}
	};

	p.waitStatus = function() {
		this.fightData.removeAllChild();
		this.fighterImg.sourceRect = sourceRect.waitRect;

		this.waitTime.set({
			x: 5,
			y: 40
		});
		this.atk.set({
			x: 20,
			y: 20
		});
		this.hp.set({
			x: 20,
			y: 40
		});
		this.fightData.addChild(this.waitTime);
		this.fightData.addChild(this.atk);
		this.fightData.addChild(this.hp);
	};

	p.fightStatus = function() {
		this.fightData.removeAllChild();
		this.fighterImg.sourceRect = sourceRect.fightRect;

		this.level.set({
			x: 5,
			y: 40
		});
		this.atk.set({
			x: 20,
			y: 20
		});
		this.hp.set({
			x: 20,
			y: 40
		});

		this.fightData.addChild(this.level);
		this.fightData.addChild(this.atk);
		this.fightData.addChild(this.hp);
	};

	p.diedStatus = function() {
		this.removeChild(this.fightData);
		this.fighterImg.sourceRect = sourceRect.diedStatus;
	};
	/**
	 * [因为具有所有数据所以,不用移除fighterData]
	 * @return {[type]} [description]
	 */
	p.showStatus = function() {
		this.fighterImg.sourceRect = sourceRect.showStatus;
		this.stage.addChild(this);

		this.set({
			x: 0,
			y: 0
		});

		this.waitTime.set({
			x: 5,
			y: 40
		});

		this.level.set({
			x: 5,
			y: 40
		});

		this.atk.set({
			x: 20,
			y: 20
		});

		this.hp.set({
			x: 20,
			y: 40
		});

		this.fightData.addChild(this.waitTime);
		this.fightData.addChild(this.level);
		this.fightData.addChild(this.atk);
		this.fightData.addChild(this.hp);
	};

	/**
	 * [点击事件,显示卡片信息]
	 * @return {[type]} [description]
	 */
	p.showFighter = function() {
		if (this.isShow === 0) {
			this.realParent = this.parent;
			this.stage.addChild(this);
			createjs.Ticker.setPaused(true);
			this.toggleStatus(fighterStatus.SHOW);
			this.isShow = 1;
		} else if (this.isShow === 1) {
			this.realParent.addChild(this);
			createjs.Ticker.setPaused(false);
			this.isShow = 0;
		}
	};

	module.exports = Fighter;
});