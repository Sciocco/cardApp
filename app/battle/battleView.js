define(function(require, exports, module) {
	require('../mvc/createjs.extend');

	var pageSize = require('../config/consts').pageSize;
	var mobile = require('../utils/mobile');

	var playerGroup = require('./playerGroup');
	var enemyGroup = require('./enemyGroup');

	var Fighter = require('./fighter');
	var Role = require('./role');
	var Rune = require('./rune');
	var Skill = require("./skill");


	var viewData = require("./viewData");
	var turnPointer = require("./turnPointer");

	var battleViewData = viewData.battleGroup;
	var playerViewData = viewData.playerGroup;
	var enemyViewData = viewData.enemyGroup;
	var rectViewData = viewData.sourceRect;
	var statusViewData = viewData.fighterStatus;

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
	p.EVENT_FIGHTER_ACTION_DONE = "fighterActionDone";
	p.EVENT_AUTO_FIGHT = "autoFight";
	p.EVENT_HAND_FIGHT = "handFight";


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

	p.handleTick = function() {
		this.stage.update();
	};

	p.pauseGame = function() {
		createjs.Ticker.setPaused(true);
		this.stage.update();
	};

	p.continueGame = function() {
		createjs.Ticker.setPaused(false);
	};

	p.endGame = function() {
		createjs.Ticker.removeEventListener('tick');
	};


	p.initStage = function() {
		this.drawBackground();
		this.drawButton();

		this.playerGroup = playerGroup;
		this.enemyGroup = enemyGroup;
		this.playerGroup.battleView = this.enemyGroup.battleView = this;
		this.stage.addChild(this.playerGroup, this.enemyGroup);

		this.stage.addChild(turnPointer);
	};

	p.drawBackground = function() {
		var battleBg = new createjs.Bitmap(preload.getResult("battleBg"));
		this.stage.addChild(battleBg);
	};

	p.drawButton = function() {
		this.autoButton = new createjs.Bitmap(preload.getResult("fightButton")).set({
			x: battleViewData.autoButton.x,
			y: battleViewData.autoButton.y,
			cursor: "pointer"
		});
		this.autoButton.sourceRect = rectViewData.autoNormalRect;
		this.autoButton.addEventListener('click', createjs.proxy(this.autoFight, this));

		this.handButton = new createjs.Bitmap(preload.getResult("fightButton")).set({
			x: battleViewData.handButton.x,
			y: battleViewData.handButton.y,
			cursor: "pointer"
		});
		this.handButton.sourceRect = rectViewData.turnNormalRect;
		this.handButton.addEventListener('click', createjs.proxy(this.handFight, this));


		this.stage.addChild(this.autoButton, this.handButton);
	};

	p.autoFight = function() {
		this.trigger(this.EVENT_AUTO_FIGHT);
	};

	p.handFight = function() {
		this.trigger(this.EVENT_HAND_FIGHT);
	};

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

	p.showTurn = function(pIndex, current) {
		turnPointer.setTurn(pIndex, current);
	};

	p.showWaitFighter = function(fighterModel, current) {
		var _this = this;
		this.currentFighterTeam = this[current + 'Team'];
		this.currentBattleGroup = this[current + 'Group'];
		this.currentRunes = this[current + 'Runes'];
		this.currentRole = this[current + "Role"];

		if (fighterModel !== undefined && !this.isFullWaitFighter(current)) {

			var callback = function() {
				var fighter = new Fighter(fighterModel);
				_this.currentFighterTeam[fighterModel['id']] = fighter;
				_this.currentBattleGroup.addFighter(fighter);
				_this.trigger(_this.EVENT_TURN_READY_DONE);
			};
			preload.loadCard(fighterModel['entityId'], callback);
		} else {
			this.trigger(this.EVENT_TURN_READY_DONE);
		}

	};


	p.isFullWaitFighter = function(current) {
		var battleGroup = this[current + 'Group'];

		if (battleGroup.waitGroup.getNumChildren() >= battleViewData.showNums) {
			return true;
		}
		return false;
	};


	p.turnReadyDone = function(isAutoFight) {

		setTimeout(createjs.proxy(function() {
			var k;

			if (isAutoFight === false) {
				//移除所有己方等待组的卡牌和准备组的卡牌 
				var readyGroup = this.currentBattleGroup.readyGroup;
				var waitGroup = this.currentBattleGroup.waitGroup;

				readyGroup.forEach(function(v) {
					waitGroup.removeChild(v);
				});

				readyGroup = [];

			} else if (isAutoFight === true) {
				//将所有等待时间为0的战斗者推入战斗组
				for (k in this.currentFighterTeam) {
					if (this.currentFighterTeam[k].model['currWaitTime'] === 0 && (this.currentFighterTeam[k].status === statusViewData.WAIT || this.currentFighterTeam[k].status === statusViewData.READY_BEFORE)) {
						this.currentBattleGroup.toggleFightStatus(this.currentFighterTeam[k]);
					}
				}
			}

			for (k in this.playerTeam) {
				this.playerTeam[k].costWaitTime();
			}

			for (k in this.enemyTeam) {
				this.enemyTeam[k].costWaitTime();
			}

			this.currentBattleGroup.lastMoveIndex = null;

			this.trigger(this.EVENT_TURN_FIGHT);

		}, this), battleViewData.speed['normal']);

	};


	/**
	 * [ 动作的目标是 主公还是卡片]
	 * @return {[type]} [description]
	 */
	p.getActionTarget = function(data, skill) {
		var target;

		//判断是否是主公
		if (data.type === 0) {

			if (this.currentRole === this.playerRole) {
				target = this.enemyRole;
			} else if (this.currentRole === this.enemyRole) {
				target = this.playerRole;
			}

		} else if (data.type === 1) {

			if (data.id in this.enemyTeam) {
				target = this.enemyTeam[data.id];
			} else if (data.id in this.playerTeam) {
				target = this.playerTeam[data.id];
			}
		}

		data.skill = new Skill(skill);
		target.hitData = data;
		return target;
	};


	p.showActionStart = function(action) {
		var _this = this;
		var fighter;

		var actions = action.actions;

		/**
		 * [ 在最后一个攻击目标结束后,触发下一个动作]
		 * @return {[type]} [description]
		 */
		var callback = function() {
			//将等待区卡片移动向前
			_this.currentBattleGroup.resetWaitFighter();
			//触发回合完成事件
			_this.trigger(_this.EVENT_FIGHTER_ACTION_DONE);
		};

		setTimeout(function() {

			if (action['type'] === 0) {
				fighter = _this.currentRunes[action['id']];
				_this.currentBattleGroup.launchRune(fighter, actions, callback);

			} else if (action['type'] === 1) {

				fighter = _this.currentFighterTeam[action['id']];
				_this.currentBattleGroup.fighterAttack(fighter, actions, callback);
			}

		}, battleViewData.speed['normal']);

	};

	var battleView = new Module();
	module.exports = battleView;
});