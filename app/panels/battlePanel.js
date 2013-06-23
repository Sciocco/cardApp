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

			//视图事件
			battleView.bind(battleView.EVENT_WAIT_FIGHTER, onWaitFighter);
			battleView.bind(battleView.EVENT_TURN_READY_DONE, onTurnReadyDone);
			battleView.bind(battleView.EVENT_TURN_FIGHT, onTurnFight);
			battleView.bind(battleView.EVENT_ACTION_DONE, onActionDone);
			battleView.bind(battleView.EVENT_TURN_FIGHT_DONE, onTurnFightDone);

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
		battleView.initRole(battleModel.roles);
		battleView.initRune(battleModel.runes);
	}

	function onTurnReady() {
		battleView.showTurn(battleModel.turnIndex);
	}


	function onWaitFighter() {
		var current = battleModel.currentFighter;

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
		fighter['atk'] = entity['attack'] * level;
		fighter['hp'] = entity['hp'] * level;
		fighter['waitTime'] = entity['wait'];

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
				fighter['enableskill'].push(name);
			}
			fighter['fightskill'] = fighter['fightskill'] + name + "\n" + skill.desc + "\n\n";
		}
		return fighter;
	}

	/**
	 * [onAutoFight 是否自动战斗]
	 * @return {[type]} [description]
	 */

	function onTurnReadyDone() {
		var isAuto = isAutoFight();

		if (!isAuto) {
			return;
		}

		battleView.turnReadyDone(isAuto);
	}


	function isAutoFight() {

		var current = battleModel.currentFighter;
		if (battleViewData.fighters[current] === battleViewData.fighters.enemy || battleModel.isAutoFight === true) {

			return true;

		} else if (battleViewData.fighters[current] === battleViewData.fighters.player) { //当敌方先手己方没有等待时间为0的牌时  && battleModel.sente === battleViewData.fighters.enemy

			var result = true,
				fighters = battleView.currentFighterTeam;

			for (var id in fighters) {
				if (fighters[id].model['waitTime'] === 0) {
					result = false;
					break;
				}
			}
			return result;
		}

		return false;
	}



	/**
	 * [onTurnFight 开始攻击]
	 * @return {[type]} [description]
	 */

	function onTurnFight() {

		var canFight = false;
		var current = battleModel.currentFighter;
		var fighterTeam = this.currentFighterTeam;
		battleModel.actionList = battleModel.actions[current];

		var id, length = battleModel.actionList.length;

		//检查当前方 动作列表是否有战斗动作 
		//检查战斗列表中的战斗者是否是战斗状态
		if (length > 0) {
			for (var i = length - 1; i >= 0; i--) {
				id = battleModel.actionList[i]['id'];
				if (id in fighterTeam && fighterTeam[id].status === statusViewData.FIGHT) {
					canFight = true;
					break;
				}
			}
		}

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
		//获取技能类型
		var action = battleModel.currentAction;
		var skill = dataApi.fightskill.findById(action['skill']);

		battleView.showActionStart(battleModel.currentAction, skill);
	}

	/**
	 * [onTurnFightDone 一个回合的攻击动作完成]
	 * @return {[type]} [description]
	 */

	function onTurnFightDone() {
		battleModel.fightActionDone();
	}

	/**
	 * [onActionDone 一个攻击动作完成]
	 * @return {[type]} [description]
	 */

	function onActionDone() {
		battleModel.actionIndexInTurn++;
		battleModel.fighterActionStart();
	}

	var controller = new Controller();
	module.exports = controller;
});