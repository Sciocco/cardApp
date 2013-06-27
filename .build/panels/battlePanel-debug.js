define("app/panels/battlePanel-debug", [ "../config/consts-debug", "../utils/mobile-debug", "../battle/battleModel-debug", "../battle/viewData-debug", "../battle/battleView-debug", "../mvc/createjs.extend-debug", "../battle/playerGroup-debug", "../battle/battleGroup-debug", "../battle/effect-debug", "../battle/enemyGroup-debug", "../battle/fighter-debug", "../utils/utils-debug", "../battle/role-debug", "../battle/rune-debug", "../battle/skill-debug", "../utils/dataApi-debug", "../battle/turnPointer-debug", "../utils/utils-debug.js" ], function(require, exports, module) {
    var app = window.APP;
    var pageSize = require("../config/consts-debug").pageSize;
    var mobile = require("../utils/mobile-debug");
    var battleModel = require("../battle/battleModel-debug");
    var battleView = require("../battle/battleView-debug");
    var utils = require("../utils/utils-debug");
    var dataApi = require("../utils/dataApi-debug");
    var viewData = require("../battle/viewData-debug");
    var battleViewData = viewData.battleGroup;
    var statusViewData = viewData.fighterStatus;
    var Controller = Spine.Controller.sub({
        el: "#battlePanel",
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
        var entity = dataApi.character.findById(fighter["entityId"]);
        var fightskill = dataApi.fightskill;
        var level = fighter["level"];
        fighter["currentFighter"] = battleViewData.fighters[current];
        fighter["cost"] = entity["cost"];
        fighter["star"] = entity["star"];
        fighter["name"] = entity["name"];
        fighter["atk"] = entity["attack"] * level;
        fighter["hp"] = entity["hp"] * level;
        fighter["waitTime"] = entity["wait"];
        fighter["country"] = entity["country"];
        fighter["currHp"] = fighter["hp"];
        fighter["currAtk"] = entity["attack"];
        fighter["currWaitTime"] = fighter["waitTime"];
        var skill, v, k, name;
        var skills = entity["skill"];
        fighter["enableskill"] = [];
        fighter["fightskill"] = "";
        for (k in skills) {
            v = skills[k];
            skill = fightskill.findById(k);
            name = skill.name + v.level;
            if (level < v.enableLevel) {
                name = name + "(强化" + v.enableLevel + "级时解锁)";
            } else {
                fighter["enableskill"].push(name);
            }
            fighter["fightskill"] = fighter["fightskill"] + name + "\n" + skill.desc + "\n\n";
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
        //如果是敌人 和自动战斗 则返回true
        if (battleViewData.fighters[current] === battleViewData.fighters.enemy || battleModel.isAutoFight === true) {
            return true;
        } else if (battleViewData.fighters[current] === battleViewData.fighters.player) {
            //当敌方先手己方没有等待时间为0的牌时  && battleModel.sente === battleViewData.fighters.enemy
            var result = true, fighters = battleView.currentFighterTeam;
            for (var id in fighters) {
                if (fighters[id].model["currWaitTime"] === 0) {
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
        var fighters = battleView.currentFighterTeam;
        var actions = battleModel.actions;
        var i, action, id, length = actions.length;
        if (battleView.currentBattleGroup.fightGroup.children.length !== 0 && length > 0) {
            for (i = 0; i < length; i++) {
                action = actions.shift();
                if ("turnDone" in action && action["turnDone"]) {
                    break;
                } else {
                    id = action["id"];
                    if (id in fighters && fighters[id].status === statusViewData.FIGHT) {
                        canFight = true;
                    }
                    battleModel.actionList.push(action);
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
        battleView.showActionStart(battleModel.currentAction);
    }
    /**
	 * [onTurnFightDone 一个回合的攻击动作完成]
	 * @return {[type]} [description]
	 */
    function onTurnFightDone() {
        battleView.currentBattleGroup.lastMoveIndex = null;
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