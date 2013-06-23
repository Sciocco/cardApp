define(function(require, exports, module) {
	require('../mvc/createjs.extend');

	var pageSize = require('../config/consts').pageSize;
	var mobile = require('../utils/mobile');


	var playerGroup = require('./playerGroup');
	var enemyGroup = require('./enemyGroup');


	var Fighter = require('./fighter');
	var Role = require('./role');
	var Rune = require('./rune');


	var viewData = require("./viewData");

	var battleViewData = viewData.battleGroup;
	var playerViewData = viewData.playerGroup;
	var enemyViewData = viewData.enemyGroup;
	var rectViewData = viewData.sourceRect;

	var utils = require('../utils/utils');
	var preload = window.APP.preload;

	var Module = Spine.Module.sub(Spine.Events);

	var p = Module.prototype;
	p.stage = null;
	p.playerTeam = {};
	p.enemyTeam = {};
	p.playerRole = {};
	p.enemyRole = {};
	p.playerRunes = {};
	p.enemyRunes = {};



	p.EVENT_WAIT_FIGHTER = 'waitFighter';
	p.EVENT_TURN_READY_DONE = "turnReadyDone";
	p.EVENT_TURN_FIGHT = "turnFight";
	p.EVENT_ACTION_DONE = "actionDone";
	p.EVENT_TURN_FIGHT_DONE = "turnFightDone";


	p.initialize = function(pCanvas) {
		//stage设置
		this.stage = new createjs.Stage(pCanvas);
		//事件初始化
		if (createjs.Touch.isSupported()) {
			createjs.Touch.enable(this.stage, true, false);
		}
		this.stage.mouseMoveOutside = true;
		this.stage.enableMouseOver(10);


		//缩放stage
		this.stage.scaleX = mobile.canvasRadio.width * pageSize.WIDTH / battleViewData.stage.width;
		this.stage.scaleY = mobile.canvasRadio.height * pageSize.HEIGHT / battleViewData.stage.height;

		//ticker 设置
		createjs.Ticker.setFPS(20);
		createjs.Ticker.useRAF = true;
		createjs.Ticker.addEventListener("tick", this.proxy(this.handleTick));

		this.initStage();
	};

	p.handleTick = function(event) {
		if (event.paused) {
			return;
		}
		this.stage.update(event);
	};

	p.pauseGame = function() {
		createjs.Ticker.setPaused(true);
		this.stage.update();
	};

	p.continueGame = function() {
		createjs.Ticker.addEventListener("tick", this.proxy(this.handleTick));
	};

	p.endGame = function() {
		createjs.Ticker.removeEventListener('tick');
	};


	p.initStage = function() {
		this.drawBackground();
		this.drawTurn();
		this.drawButton();

		this.playerGroup = playerGroup;
		this.enemyGroup = enemyGroup;
		this.stage.addChild(this.playerGroup, this.enemyGroup);
	};

	p.drawBackground = function() {
		var battleBg = new createjs.Bitmap(preload.getResult("battleBg"));
		this.stage.addChild(battleBg);
	};

	p.drawButton = function() {
		var autoButton = new createjs.Bitmap(preload.getResult("fightButton")).set({
			x: battleViewData.autoButton.x,
			y: battleViewData.autoButton.y,
			cursor: "pointer"
		});

		autoButton.sourceRect = rectViewData.normalAutoRect;
		autoButton.addEventListener('click', autoFight);

		var handButton = new createjs.Bitmap(preload.getResult("fightButton")).set({
			x: battleViewData.handButton.x,
			y: battleViewData.handButton.y,
			cursor: "pointer"
		});
		handButton.sourceRect = rectViewData.normalHandRect;
		handButton.addEventListener('click', handFight);

		this.stage.addChild(autoButton, handButton);
	};

	p.drawTurn = function() {
		this.turnIndex = new createjs.Text('', "bold 20px Arial", "#000").set({
			x: battleViewData.turnIndex.x,
			y: battleViewData.turnIndex.y
		});

		this.stage.addChild(this.turnIndex);
	};


	function autoFight() {
		alert("自动战斗");
	}

	function handFight() {
		//发送数据
		alert("开始战斗");
	}

	p.initRole = function(modelData) {
		this.playerRole = new Role(modelData.player);
		this.enemyRole = new Role(modelData.enemy);

		this.playerGroup.addRole(this.playerRole);
		this.enemyGroup.addRole(this.enemyRole);
	};

	p.initRune = function(modelData) {
		var rune;
		var _this = this;

		modelData.player.forEach(function(v) {
			rune = new Rune(v);
			_this.playerGroup.addRune(rune);
			_this.playerRunes[v] = rune;
		});

		modelData.enemy.forEach(function(v) {
			rune = new Rune(v);
			_this.enemyGroup.addRune(rune);
			_this.enemyRunes[v] = rune;
		});
	};

	p.showTurn = function(pIndex) {
		this.turnIndex.text = pIndex;
		this.trigger(this.EVENT_WAIT_FIGHTER);
	};

	p.showWaitFighter = function(fighterModel, current) {

		var fighterTeam = this.currentFighterTeam = this[current + 'Team'];
		var battleGroup = this.currentBattleGroup = this[current + 'Group'];
		this.currentRunes = this[current + 'Runes'];
		this.currentRole = this[current + "Role"];

		if (fighterModel !== undefined || !this.isFullWaitFighter(current)) {
			var fighter = new Fighter(fighterModel);

			fighterTeam[fighterModel['id']] = fighter;

			battleGroup.addFighter(fighter);
		}

		this.trigger(this.EVENT_TURN_READY_DONE);
	};


	p.isFullWaitFighter = function(current) {
		var battleGroup = this[current + 'Group'];

		if (battleGroup.waitGroup.getNumChildren() > 4) {
			return true;
		}
		return false;
	};


	p.fighterDie = function() {
		//从fighterteam 中移除


		//有无技能发动


		//添加到死亡组

	};


	p.addAttackEffect = function() {

	};


	p.turnReadyDone = function(isAutoFight) {

		createjs.Tween.get(this.stage).wait(battleViewData.speed['normal']).call(createjs.proxy(function() {

			var k;

			if (isAutoFight === false) {
				//移除所有己方等待特效

				//移除所有己方等待组的卡牌和准备组的卡牌 

			} else if (isAutoFight === true) {
				//将所有等待时间为0的战斗者推入战斗组
				for (k in this.currentFighterTeam) {

					if (this.currentFighterTeam[k].model['waitTime'] === 0) {

						this.currentBattleGroup.toggleFightStatus(this.currentFighterTeam[k]);
					}
				}
			}

			//所有fighter的等待时间减去1
			var fighters = utils.concatObject(this.playerTeam, this.enemyTeam);

			for (k in fighters) {
				fighters[k].costWaitTime();
			}

			this.trigger(this.EVENT_TURN_FIGHT);

		}, this));
	};


	/**
	 * [ 动作的目标是 主公还是卡片]
	 * @return {[type]} [description]
	 */
	p.getActionTarget = function(id, type) {
		var target;
		//判断是否是主公
		if (type === 0) {
			target = this.currentRole;
		} else if (type === 1) {
			target = this.currentFighterTeam[id];
		}
		return target;
	};

	p.showActionStart = function(action, skill) {

		var _this = this;
		var fighter;

		var targets = [];

		action.target.forEach(function(v) {
			targets.push(_this.getActionTarget(v));
		});

		/**
		 * [ 在最后一个攻击目标结束后,触发下一个动作]
		 * @return {[type]} [description]
		 */
		var callback = function() {
			//触发回合完成事件
			if (action['turnDone'] === true) {

				_this.trigger(_this.EVENT_TURN_FIGHT_DONE);

			} else {
				_this.trigger(_this.EVENT_ACTION_DONE);
			}
		};

		createjs.Tween.get(this.stage).wait(battleViewData.speed['normal']).call(function() {

			if (action['type'] === 0) {

				fighter = _this.currentRunes[action['id']];
				_this.currentBattleGroup.launchRune(fighter, targets, callback);

			} else if (action['type'] === 1) {

				fighter = _this.currentFighterTeam[action['id']];
				_this.currentBattleGroup.fighterAttack(fighter, targets, skill, callback);

			}

		});

	};



	var battleView = new Module();
	module.exports = battleView;
});