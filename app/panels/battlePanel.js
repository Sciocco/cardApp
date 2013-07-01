define(function(require, exports, module) {
	var app = window.APP;

	var pageSize = require('../config/consts').pageSize;
	var mobile = require('../utils/mobile');
	var battleModel = require('../battle/battleModel');
	var battleView = require('../battle/battleView');
	var utils = require("../utils/utils.js");

	var dataApi = require("../utils/dataApi");
	var viewData = require('../battle/viewData');
	var battleViewData = viewData.battleGroup;
	var statusViewData = viewData.fighterStatus;
	var rectViewData = viewData.sourceRect;

	var FightResult = require('../battle/fightResult');

	var Controller = Spine.Controller.sub({
		"el": "#battlePanel",
		init: function() {
			var canvas;
			//页面加载后
			this.bind("contentLoad", battleStart);

			//模型事件
			battleModel.bind(battleModel.EVENT_ERROR, this.proxy(this.modelErrorHandler));
			battleModel.bind(battleModel.EVENT_TURN_READY, onTurnReady);
			battleModel.bind(battleModel.EVENT_FIGHTER_ACTION_START, onFighterActionStart);
			battleModel.bind(battleModel.EVENT_TURN_FIGHT_DONE, onTurnFightDone);
			battleModel.bind(battleModel.EVENT_FIGHT_DONE, onFightDone);

			//视图事件
			battleView.bind(battleView.EVENT_TURN_READY_DONE, onTurnReadyDone);
			battleView.bind(battleView.EVENT_TURN_FIGHT, onTurnFight);
			battleView.bind(battleView.EVENT_FIGHTER_ACTION_DONE, onFighterActionDone);
			battleView.bind(battleView.EVENT_AUTO_FIGHT, onAutoFight);
			battleView.bind(battleView.EVENT_HAND_FIGHT, onHandFight);

			//初始化canvas
			canvas = utils.createSketchpad(pageSize.WIDTH * mobile.canvasRadio.width, pageSize.HEIGHT * mobile.canvasRadio.height, document.getElementById("battleContainer"));

			//初始化视图
			battleView.initialize(canvas);
		},
		contentLoadBefore: function(callback, oldController) {
			battleModel.startFightReq(callback);
			this.oldController = oldController;
		},
		modelErrorHandler: function() {
			alert(battleModel.error);
			this.parent.oldController = this.oldController;
		}
	});

	function battleStart() {
		battleView.initRoles(battleModel.roles);
		battleView.initRunes(battleModel.runes);
	}

	function onTurnReady() {

		var current = battleModel.currentFighter;

		battleView.showTurn(battleModel.turnIndex, current);

		var fighter = battleModel.waits[current].shift();

		fighter = initFighter(fighter, current);

		battleView.showWaitFighter(fighter, current);

	}

	function initFighter(fighter, current) {

		if (!fighter) {
			return;
		}

		var entity = dataApi.character.findById(fighter['entityId']);

		var fightskill = dataApi.fightskill;
		var level = fighter['level'];

		fighter['currentFighter'] = battleViewData.fighters[current];
		fighter['cost'] = entity['cost'];
		fighter['star'] = entity['star'];
		fighter['name'] = entity['name'];
		fighter['atk'] = entity['attack'] * level;
		fighter['hp'] = entity['hp'] * level;
		fighter['waitTime'] = entity['wait'];
		fighter["country"] = entity["country"];
		fighter['currHp'] = fighter['hp'];
		fighter['currAtk'] = entity['attack'];
		fighter['currWaitTime'] = fighter['waitTime'];

		var skill, v, k, name;
		var skills = entity['skill'];

		fighter['enableskill'] = [];
		fighter['fightskill'] = '';

		for (k in skills) {
			v = skills[k];
			skill = fightskill.findById(k);

			name = skill.name + v.level;
			if (level < v.enableLevel) {
				name = name + "(强化" + v.enableLevel + "级时解锁)";
			} else {
				fighter['enableskill'].push({
					"name": name,
					"type": skill.type
				});
			}
			fighter['fightskill'] = fighter['fightskill'] + name + "\n" + skill.desc + "\n\n";
		}

		return fighter;
	}
	/**
	 * [ 是否自动战斗]
	 * @return {[type]} [description]
	 */

	function onTurnReadyDone() {
		var isAuto = isAutoFight();

		if (!isAuto) {
			battleView.handButton.sourceRect = rectViewData.turnNormalRect;
			this.gameStatus = "pause";
			return;
		}

		battleView.turnReadyDone(isAuto);
	}


	function isAutoFight() {

		var current = battleModel.currentFighter;
		//如果是敌人 和自动战斗 则返回true
		if (battleViewData.fighters[current] === battleViewData.fighters.enemy || battleModel.isAutoFight === true) {

			return true;

		} else if (battleViewData.fighters[current] === battleViewData.fighters.player) { //当敌方先手己方没有等待时间为0的牌时  && battleModel.sente === battleViewData.fighters.enemy

			var result = true,
				fighters = battleView.currentFighterTeam,
				waitNums = 0;

			for (var id in fighters) {

				if (fighters[id].status === statusViewData.WAIT) {

					if (fighters[id].model['currWaitTime'] === 0) {

						fighters[id].toggleStatus(statusViewData.READY_BEFORE);

						result = false;
					}
					waitNums++;
				}
			}

			if (result === false) {
				return false;
			} else if (waitNums === 0) {
				return false;
			} else {
				return true;
			}
		}

		return false;
	}


	/**
	 * [onTurnFight 开始攻击]
	 * @return {[type]} [description]
	 */

	function onTurnFight() {

		var canFight = false;

		var actions = battleModel.getCurrentActions();

		if (actions && actions.length > 0) {
			canFight = true;
			battleModel.actionList = actions;
		}

		console.log(battleModel.actionList);

		// if (battleView.currentBattleGroup.fightGroup.children.length !== 0 && length > 0) {

		// 	var currentActions =  actions.shift();

		// 	for (i = 0; i < length; i++) {
		// 		action = actions.shift();
		// 		console.log(actions);
		// 		if ("turnDone" in action && action['turnDone']) {
		// 			break;
		// 		} else {
		// 			id = action['id'];
		// 			console.log(fighters);
		// 			console.log(id);
		// 			console.log(fighters[id].status);
		// 			if (id in fighters && fighters[id].status === statusViewData.FIGHT) {
		// 				canFight = true;
		// 			}

		// 			battleModel.actionList.push(action);
		// 		}
		// 	}
		// }

		//如果可以战斗则战斗,不可以则触发此轮战斗结束
		if (canFight === true) {
			battleModel.fighterActionStart();
		} else {
			battleModel.trigger(battleModel.EVENT_TURN_FIGHT_DONE);
		}
	}


	/**
	 * [onFighterActionStart 动作开始]
	 * @return {[type]} [description]
	 */

	function onFighterActionStart() {
		console.log(battleModel.turnIndex, battleModel.currentAction);


		battleView.showActionStart(battleModel.currentAction);
	}

	/**
	 * [onTurnFightDone 一个回合的攻击动作完成]
	 * @return {[type]} [description]
	 */

	function onTurnFightDone() {
		console.log(battleModel.turnIndex, "onTurnFightDone");
		battleModel.fightActionDone();
	}

	/**
	 * [onActionDone 一个攻击动作完成]
	 * @return {[type]} [description]
	 */

	function onFighterActionDone() {
		console.log(battleModel.turnIndex, "onFighterActionDone", battleModel.actionIndexInTurn);

		battleModel.actionIndexInTurn++;
		battleModel.fighterActionStart();
	}

	function onFightDone() {
		var fightResult = new FightResult(battleModel.fightEnd);
		battleView.stage.addChild(fightResult);
		battleView.pauseGame();
		fightResult.showResult();
	}

	function onAutoFight() {

		if (battleView.autoButton.sourceRect === rectViewData.autoCancelRect) {
			return;
		}

		var _this = this;
		var callback = function() {
			battleView.continueGame();

			if (_this.gameStatus === "pause") {
				_this.gameStatus = "container";
				battleModel.setCurrentActions();
				battleView.turnReadyDone(true);
			}
			battleView.handButton.sourceRect = rectViewData.turnCanelRect;
			battleView.autoButton.sourceRect = rectViewData.autoCancelRect;
		};

		battleView.pauseGame();

		battleModel.roundFightReq(true, callback);
	}

	function onHandFight() {

		if (battleView.autoButton.sourceRect === rectViewData.autoCancelRect || battleView.handButton.sourceRect === rectViewData.turnCanelRect|| battleModel.startFightTurn > battleModel.turnIndex) {
			return;
		}

		var _this = this;
		var callback = function() {

			//如果手牌没有,而且等待区的牌没有则设置为自动模式
			if (_this.gameStatus === "pause") {
				_this.gameStatus = "container";
				battleModel.setCurrentActions();
				battleView.turnReadyDone(false);
				battleView.handButton.sourceRect = rectViewData.turnCanelRect;
			}
		};
		console.log(battleView.currentBattleGroup);
		battleView.currentBattleGroup.resetFightGroup();

		battleModel.roundFightReq(false, callback);
	}

	var controller = new Controller();
	module.exports = controller;
});