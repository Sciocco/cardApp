define("app/battle/battleGroup", [ "./effect", "./viewData" ], function(require, exports, module) {
    var effect = require("./effect");
    var fighterBgEffect = effect.fighterBgEffect;
    var viewData = require("./viewData");
    var fighterStatus = viewData.fighterStatus;
    var battleViewData = viewData.battleGroup;
    var BattleGroup = function(viewData) {
        this.initialize(viewData);
    };
    var p = BattleGroup.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;
    p.initialize = function(viewData) {
        this.Container_initialize();
        this.viewData = viewData;
        this.x = viewData.battleGroup.x;
        this.y = viewData.battleGroup.y;
        //准备组不添加到舞台中
        this.readyGroup = new createjs.Container();
        this.waitGroup = new createjs.Container().set(viewData["waitGroup"]);
        this.fightGroup = new createjs.Container().set(viewData["fightGroup"]);
        this.runeGroup = new createjs.Container().set(viewData["runeGroup"]);
        this.diedFighter = new createjs.Container().set(viewData["diedFighter"]);
        this.addChild(this.waitGroup, this.fightGroup, this.runeGroup, this.diedFighter);
    };
    p.entranceAnimation = function(fighter, x) {
        if (fighter.status == fighterStatus.FIGHT) {
            fighter.set({
                x: x
            });
        } else if (fighter.status === fighterStatus.WAIT) {
            createjs.Tween.get(fighter).to({
                x: x
            }, battleViewData.speed["fast"]);
        }
    };
    p.addFighter = function(fighter) {
        var _this = this;
        //增加点击事件
        fighter.addEventListener("click", this.proxy(this.fighterHandler));
        this.toggleWaitStatus(fighter);
        //检查是否等待时间为0,如果为0则添加特效
        this.waitGroup.children.forEach(function(fighter) {
            //添加特效
            if (fighter.model["currWaitTime"] === 0) {
                fighter.toggleStatus(fighterStatus.READY_BEFORE);
                _this.addReadyEffect(fighter);
            }
        });
    };
    p.addReadyEffect = function() {};
    p.addRole = function(role) {
        this.roleGroup = role;
        this.roleGroup.initViewData(this.viewData);
        this.addChild(this.roleGroup);
    };
    p.addRune = function(rune) {
        this.setRuneXY(rune);
        this.runeGroup.addChild(rune);
    };
    var fighterHandlerTime = 0;
    /**
	 * [点击事件,显示卡片信息]
	 * @return {[type]} [description]
	 */
    p.fighterHandler = function(event) {
        //安卓事件bug
        var fighter = event.target;
        if (fighter.status === fighterStatus.SHOW) {
            var stage = this.getStage();
            fighter.x = fighter.oldX;
            fighter.y = fighter.oldY;
            fighter.toggleStatus(fighter.oldStatus);
            fighter.oldParent.addChild(fighter);
            stage.removeChild(fighter);
            createjs.Ticker.setPaused(false);
        } else if (fighter.status === fighterStatus.READY_BEFORE) {
            //将状态切换到准备状态
            fighter.toggleStatus(fighterStatus.READY);
            //克隆一个战斗者存放在准备组并且添加到等待组
            var newFighter = fighter.clone(true);
            newFighter.addEventListener("click", this.proxy(this.fighterHandler));
            newFighter.originalFighter = fighter;
            newFighter.status = fighterStatus.READY;
            this.readyGroup.addChild(newFighter);
            this.waitGroup.addChild(newFighter);
            //切换战斗状态将战斗者放到战斗区
            this.toggleFightStatus(fighter);
        } else if (fighter.status === fighterStatus.READY) {
            if (!fighter.originalFighter) {
                return;
            }
            //移除战斗区的战斗者
            this.fightGroup.removeChild(fighter.originalFighter);
            //将战斗者放回等待区
            fighter.originalFighter.x = fighter.x;
            fighter.originalFighter.y = fighter.y;
            //切回等待状态和更改为准备前状态
            fighter.originalFighter.toggleStatus(fighterStatus.WAIT);
            fighter.originalFighter.toggleStatus(fighterStatus.READY_BEFORE);
            this.waitGroup.addChild(fighter.originalFighter);
            //移除clone的战斗者
            this.readyGroup.removeChild(fighter);
            this.waitGroup.removeChild(fighter);
        } else if (fighter.status !== fighterStatus.SHOW) {
            //如果施放技能的话,点击则会出现bug
            if (fighter.showSkill === true) {
                return;
            }
            var stage = this.getStage();
            fighter.oldParent = fighter.parent;
            fighter.oldStatus = fighter.status;
            fighter.oldX = fighter.x;
            fighter.oldY = fighter.y;
            fighter.toggleStatus(fighterStatus.SHOW);
            stage.addChild(fighter);
            createjs.Ticker.setPaused(true);
            stage.update();
        }
    };
    p.toggleFightStatus = function(fighter) {
        //检查战斗组是否有战斗者,确定fighter的x和y
        fighter.toggleStatus(fighterStatus.FIGHT);
        this.setFighterXY(this.fightGroup, fighter);
        this.fightGroup.addChild(fighter);
    };
    p.toggleWaitStatus = function(fighter) {
        //修改坐标
        fighter.toggleStatus(fighterStatus.WAIT);
        this.setFighterXY(this.waitGroup, fighter);
        //增加到等待组
        this.waitGroup.addChild(fighter);
    };
    p.actionsAttack = function(fighter, actions, callback) {
        var _this = this;
        var action = actions.shift();
        var targets = action.targets;
        var func;
        var target;
        fighterBgEffect.appendToFighter(fighter);
        //攻击动画
        createjs.Tween.get(fighter).to({
            y: fighter.y + 15
        }, 100).to({
            y: fighter.y
        }, 100).call(function() {
            fighterBgEffect.removeFromFighter(fighter);
            if (actions.length === 0) {
                func = function() {
                    callback();
                };
            } else {
                func = function() {
                    _this.actionsAttack(fighter, actions, callback);
                };
            }
            for (var i = targets.length - 1; i >= 0; i--) {
                target = _this.battleView.getActionTarget(targets[i], action.skill);
                //如果是最后一个则添加回调
                if (i === 0) {
                    target.hit(func);
                } else {
                    target.hit();
                }
            }
        });
    };
    p.fighterAttack = function(fighter, actions, callback) {
        var _this = this;
        var fight = function(callback) {
            _this.actionsAttack(fighter, actions, callback);
        };
        var showNums = battleViewData.showNums;
        var index = this.fightGroup.getChildIndex(fighter);
        if (index >= showNums && this.lastMoveIndex !== index) {
            callback = this.proxy(this.backFighter, fighter, callback);
            //step 是要移动的步数  1 是牌数
            var i = index - showNums, x;
            //这里的坐标有待更改
            this.fightGroup.getChildAt(i).visible = 0;
            x = _this.forwardFightGroupXY();
            createjs.Tween.get(this.fightGroup).to({
                x: x
            }, battleViewData.speed["fast"]).call(fight, [ callback ]);
            this.lastMoveIndex = index;
        } else {
            fight(callback);
        }
    };
    p.launchRune = function(fighter, targets, callback) {};
    p.backFighter = function(fighter, callback) {
        var showNums = battleViewData.showNums;
        var _this = this;
        var index = this.fightGroup.getChildIndex(fighter);
        //如果后面的不存在则 直接执行
        if (this.fightGroup.getChildAt(index + 1) === undefined && index >= showNums) {
            //step 是要移动的步数
            var step = index - showNums, x;
            var _moveFighter = function() {
                if (step < 0) {
                    return;
                }
                //这里的坐标有待更改
                _this.fightGroup.getChildAt(step).visible = 1;
                x = _this.backwardFightGroupXY();
                if (step < showNums) {
                    createjs.Tween.get(_this.fightGroup).to({
                        x: x
                    }, battleViewData.speed["fast"]).call(callback);
                } else {
                    createjs.Tween.get(_this.fightGroup).to({
                        x: x
                    }, battleViewData.speed["fast"]).call(_moveFighter);
                }
                step--;
            };
            _moveFighter();
        } else {
            callback();
        }
    };
    module.exports = BattleGroup;
});

define("app/battle/battleModel", [ "./viewData" ], function(require, exports, module) {
    var viewData = require("./viewData");
    var app = window.APP;
    var battleViewData = viewData.battleGroup;
    var Module = Spine.Module.sub(Spine.Events);
    var p = Module.prototype;
    p.currentFighter = null;
    //当前回合方
    p.turnIndex = 0;
    //当前回合数
    p.actionIndexInTurn = null;
    p.actionList = [];
    //动作列表
    p.roles = {};
    p.runes = {};
    p.waits = {};
    p.actions = {};
    p.error = null;
    //错误
    //EVENT
    p.EVENT_ERROR = "error";
    p.EVENT_TURN_READY = "turnReady";
    p.EVENT_FIGHTER_ACTION_START = "ighterActionStart";
    p.EVENT_TURN_FIGHT_DONE = "turnFightDone";
    p.roleHandle = function(data) {
        this.roles.player = data.p;
        this.roles.player["currentFighter"] = battleViewData.fighters.player;
        this.runes.player = data.p.runes;
        this.roles.enemy = data.e;
        this.roles.enemy["currentFighter"] = battleViewData.fighters.enemy;
        this.runes.enemy = data.e.runes;
    };
    p.waitsHandle = function(data) {
        this.waits.player = data.p;
        this.waits.enemy = data.e;
    };
    p.actionsHandle = function(data) {
        this.actions = data;
    };
    p._nextTurn = function() {
        this.turnIndex++;
        this.actionIndexInTurn = 0;
        this.actionList = [];
        this.trigger(this.EVENT_TURN_READY);
    };
    p.startFight = function(data) {
        var result = this.resultHandle(data.result);
        if (result === false) {
            return;
        }
        this.roleHandle(data.roles);
        this.waitsHandle(data.waits);
        this.actionsHandle(data.actionList);
        //每局开始前初始化
        this.turnIndex = 0;
        this._nextTurn();
    };
    p.roundFight = function(data) {
        this.resultHandle(data.result);
        if (result === false) {
            return;
        }
        this.waitsHandle(data.waits);
        this.actionsHandle(data.actionList);
        this._nextTurn();
    };
    p.resultHandle = function(data) {
        if (typeof data.noPhysical !== "undefined" && data.noPhysical === true) {
            this.error = "体力不足";
        }
        if (typeof data.fightEnd !== "undefined") {}
        if (typeof data.sente !== "undefined" && data.sente) {
            var k, fighters = battleViewData.fighters;
            for (k in fighters) {
                if (fighters[k] === data.sente) {
                    this.currentFighter = k;
                    this.sente = data.sente;
                }
            }
        }
        if (this.error !== null) {
            this.trigger(this.EVENT_ERROR);
            return false;
        }
        return true;
    };
    //一个回合的战斗完成
    p.fightActionDone = function() {
        //检查是否战斗结束,如果战斗结束,则销毁不需要的变量.
        if (this.actions.length > 0) {
            //更改下一回合当前者
            var k, fighters = battleViewData.fighters;
            for (k in fighters) {
                if (k !== this.currentFighter) {
                    this.currentFighter = k;
                    break;
                }
            }
            //开始下一个回合
            this._nextTurn();
        } else {
            console.log("战斗结束");
        }
    };
    /**
	 * [开始战斗请求]
	 * @return {[type]} [description]
	 */
    p.startFightReq = function(callback) {
        var _this = this;
        $.ajax({
            type: "GET",
            headers: {
                "If-Modified-Since": "0"
            },
            url: "http://192.168.1.88:88/cardApp/assets/testdata/fightStart.json",
            beforeSend: app.ajaxLoading,
            success: function(data) {
                app.ajaxLoadingEnd();
                _this.startFight(data);
                if (_this.error === null) {
                    callback();
                }
            },
            error: function(a, b, c) {
                app.ajaxLoadingEnd();
                _this.error = "数据加载失败";
                _this.trigger(_this.EVENT_ERROR);
            }
        });
    };
    /**
	 * [回合战斗请求]
	 * @return {[type]} [description]
	 */
    p.roundFightReq = function(callback) {
        var _this = this;
        $.ajax({
            type: "GET",
            url: "http://192.168.1.88:88/cardApp/assets/testdata/fightRound.json",
            beforeSend: app.ajaxLoading,
            success: function(data) {
                app.ajaxLoadingEnd();
                _this.roundFight(data);
                if (_this.error === null) {
                    callback();
                }
            },
            error: function() {
                app.ajaxLoadingEnd();
                _this.error = "数据加载失败";
                _this.trigger(_this.EVENT_ERROR);
            }
        });
    };
    /**
	 * [ description]
	 * @return {[type]} [description]
	 */
    p.fighterActionStart = function() {
        //如果动作索引 超过了动作列表长度则开始下一轮
        if (this.actionIndexInTurn === this.actionList.length || this.actionIndexInTurn === null) {
            this.trigger(this.EVENT_TURN_FIGHT_DONE);
            return;
        }
        //当前动作
        this.currentAction = this.actionList[this.actionIndexInTurn];
        this.trigger(this.EVENT_FIGHTER_ACTION_START);
    };
    var battleModel = new Module();
    module.exports = battleModel;
});

define("app/battle/battleView", [ "../mvc/createjs.extend", "../config/consts", "../utils/mobile", "./playerGroup", "./battleGroup", "./effect", "./viewData", "./enemyGroup", "./fighter", "../utils/utils", "./role", "./rune", "./skill", "../utils/dataApi", "./turnPointer" ], function(require, exports, module) {
    require("../mvc/createjs.extend");
    var pageSize = require("../config/consts").pageSize;
    var mobile = require("../utils/mobile");
    var playerGroup = require("./playerGroup");
    var enemyGroup = require("./enemyGroup");
    var Fighter = require("./fighter");
    var Role = require("./role");
    var Rune = require("./rune");
    var Skill = require("./skill");
    var viewData = require("./viewData");
    var turnPointer = require("./turnPointer");
    var battleViewData = viewData.battleGroup;
    var playerViewData = viewData.playerGroup;
    var enemyViewData = viewData.enemyGroup;
    var rectViewData = viewData.sourceRect;
    var utils = require("../utils/utils");
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
    p.EVENT_WAIT_FIGHTER = "waitFighter";
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
    p.handleTick = function() {
        this.stage.update();
    };
    p.pauseGame = function() {
        createjs.Ticker.setPaused(true);
        this.stage.update();
    };
    p.continueGame = function() {
        createjs.Ticker.addEventListener("tick", this.proxy(this.handleTick));
    };
    p.endGame = function() {
        createjs.Ticker.removeEventListener("tick");
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
        this.autoButton.addEventListener("click", autoFight);
        this.handButton = new createjs.Bitmap(preload.getResult("fightButton")).set({
            x: battleViewData.handButton.x,
            y: battleViewData.handButton.y,
            cursor: "pointer"
        });
        this.handButton.sourceRect = rectViewData.turnNormalRect;
        this.handButton.addEventListener("click", handFight);
        this.stage.addChild(this.autoButton, this.handButton);
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
    p.showTurn = function(pIndex, current) {
        turnPointer.setTurn(pIndex, current);
    };
    p.showWaitFighter = function(fighterModel, current) {
        var _this = this;
        var fighterTeam = this.currentFighterTeam = this[current + "Team"];
        var battleGroup = this.currentBattleGroup = this[current + "Group"];
        this.currentRunes = this[current + "Runes"];
        this.currentRole = this[current + "Role"];
        if (fighterModel !== undefined && !this.isFullWaitFighter(current)) {
            var callback = function() {
                var fighter = new Fighter(fighterModel);
                fighterTeam[fighterModel["id"]] = fighter;
                battleGroup.addFighter(fighter);
                _this.trigger(_this.EVENT_TURN_READY_DONE);
            };
            preload.loadCard(fighterModel["entityId"], callback);
        } else {
            this.trigger(this.EVENT_TURN_READY_DONE);
        }
    };
    p.isFullWaitFighter = function(current) {
        var battleGroup = this[current + "Group"];
        if (battleGroup.waitGroup.getNumChildren() > 4) {
            return true;
        }
        return false;
    };
    p.addAttackEffect = function() {};
    p.turnReadyDone = function(isAutoFight) {
        var k;
        if (isAutoFight === false) {} else if (isAutoFight === true) {
            //将所有等待时间为0的战斗者推入战斗组
            for (k in this.currentFighterTeam) {
                if (this.currentFighterTeam[k].model["currWaitTime"] === 0) {
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
        this.trigger(this.EVENT_TURN_FIGHT);
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
            _this.trigger(_this.EVENT_ACTION_DONE);
        };
        createjs.Tween.get(this.stage).wait(battleViewData.speed["normal"]).call(function() {
            if (action["type"] === 0) {
                fighter = _this.currentRunes[action["id"]];
                _this.currentBattleGroup.launchRune(fighter, actions, callback);
            } else if (action["type"] === 1) {
                fighter = _this.currentFighterTeam[action["id"]];
                _this.currentBattleGroup.fighterAttack(fighter, actions, callback);
            }
        });
    };
    var battleView = new Module();
    module.exports = battleView;
});

define("app/battle/effect", [], function(require, exports, module) {
    var preload = window.APP.preload;
    var fighterBgEffect = new createjs.Bitmap(preload.getResult("fighterBg"));
    fighterBgEffect.visible = false;
    fighterBgEffect.appendToFighter = function(fighter) {
        fighterBgEffect.set({
            x: -15,
            y: -15
        });
        fighterBgEffect.visible = true;
        fighter.addChildAt(fighterBgEffect);
    };
    fighterBgEffect.removeFromFighter = function(fighter) {
        fighter.removeChild(fighterBgEffect);
        fighterBgEffect.visible = false;
    };
    function FighterReadyEffect() {
        var fighterBgEffect = new createjs.Bitmap(preload.getResult("fighterBg"));
        return fighterBgEffect;
    }
    exports.fighterBgEffect = fighterBgEffect;
    exports.FighterReadyEffect = FighterReadyEffect;
});

define("app/battle/enemyGroup", [ "./battleGroup", "./effect", "./viewData" ], function(require, exports, module) {
    var BattleGroup = require("./battleGroup");
    var viewData = require("./viewData");
    var battleViewData = viewData.battleGroup;
    var groupViewData = viewData.enemyGroup;
    var battleGroup = new BattleGroup(groupViewData);
    /**
	 * [ description]
	 * @param  {[type]} group   [description]
	 * @param  {[type]} fighter [description]
	 * @return {[type]}         [description]
	 */
    battleGroup.setFighterXY = function(group, fighter) {
        var x = groupViewData.fighterXY.x, length = group.getNumChildren(), width = battleViewData.fighter.width;
        x = x - length * width - battleViewData.margin.f2f * length;
        fighter.set({
            x: x + width,
            y: groupViewData.fighterXY.y
        });
        battleGroup.entranceAnimation(fighter, x);
    };
    /**
	 * [ description]
	 * @param  {[type]} rune [description]
	 * @return {[type]}      [description]
	 */
    battleGroup.setRuneXY = function(rune) {
        var x = groupViewData.runeXY.x, length = this.runeGroup.getNumChildren(), width = battleViewData.rune.width;
        x = x - length * width - battleViewData.margin.r2r * length;
        rune.set({
            x: x,
            y: groupViewData.runeXY.y
        });
    };
    battleGroup.forwardFightGroupXY = function() {
        return this.fightGroup.x + battleViewData.fighter.width + battleViewData.margin.f2f;
    };
    battleGroup.backwardFightGroupXY = function() {
        return this.fightGroup.x - battleViewData.fighter.width - battleViewData.margin.f2f;
    };
    battleGroup.resetWaitFighter = function() {
        var x = groupViewData.fighterXY.x;
        this.waitGroup.children.forEach(function(fighter) {
            fighter.x = x;
            x = x - battleViewData.fighter.width - battleViewData.margin.f2f;
        });
    };
    module.exports = battleGroup;
});

define("app/battle/fighter", [ "../utils/utils", "./viewData" ], function(require, exports, module) {
    var utils = require("../utils/utils");
    var viewData = require("./viewData");
    var statusViewData = viewData.fighterStatus;
    var rectViewData = viewData.sourceRect;
    var battleViewData = viewData.battleGroup;
    var preload = window.APP.preload;
    var fontNormal = battleViewData.font.normal;
    var fontLarge = battleViewData.font.large;
    var Fighter = function(model, status) {
        this.initialize(model);
        if (typeof status !== "undefied") {
            this.toggleStatus(status);
        }
    };
    var p = Fighter.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;
    p.status = null;
    p.initialize = function(model) {
        this.Container_initialize();
        if (!model) {
            return;
        }
        this.model = model;
    };
    p.waitStatus = function() {
        this.removeAllChildren();
        if (!this.waitFighterContainer) {
            this.waitFighterContainer = new createjs.Container();
            var waitFigureImg = preload.getResult("card-small-" + this.model["entityId"]);
            this.waitFighterFigure = new createjs.Bitmap(waitFigureImg);
            this.waitFighterFigure.cache(0, 0, waitFigureImg.width, waitFigureImg.height);
            this.waitFrame = new createjs.Bitmap(preload.getResult("cardFrame-wait"));
            this.atk = new createjs.Text(this.model["atk"], fontNormal, "#fff");
            this.hp = new createjs.Text(this.model["hp"], fontNormal, "#fff");
            this.currWaitTime = new createjs.Text(this.model["currWaitTime"], fontNormal, "#fff");
            this.waitFighterContainer.scaleX = .98;
            this.waitFighterContainer.scaleY = .92;
            this.waitFighterContainer.addChild(this.waitFighterFigure);
            this.waitFighterContainer.addChild(this.waitFrame);
            this.waitFighterContainer.addChild(this.currWaitTime);
        }
        this.currWaitTime.set({
            x: 8,
            y: 84
        });
        this.atk.set({
            x: 40,
            y: 77
        });
        this.hp.set({
            x: 40,
            y: 97
        });
        this.waitFighterFigure.filters = [];
        this.waitFighterContainer.addChild(this.atk);
        this.waitFighterContainer.addChild(this.hp);
        this.addChild(this.waitFighterContainer);
    };
    p.fightStatus = function() {
        this.removeAllChildren();
        if (!this.fightFighterContainer) {
            this.fightFighterContainer = new createjs.Container();
            this.fightFighterFigure = new createjs.Bitmap(preload.getResult("card-normal-" + this.model["entityId"]));
            this.fightFrame = new createjs.Bitmap(preload.getResult("cardFrame-normal-" + this.model["country"]));
            this.currHp = new createjs.Text(this.model["currHp"], fontNormal, "#fff");
            this.currHp.addEventListener("tick", function(event) {
                event.target.text = Math.ceil(event.target.text);
            });
            this.currAtk = new createjs.Text(this.model["currAtk"], fontNormal, "#fff");
            if (!this.level) {
                this.level = new createjs.Text(this.model["level"], fontNormal, "#fff");
            }
            if (!this.name) {
                this.name = new createjs.Text(this.model["name"], fontNormal, "#fff");
            }
            this.fightFighterContainer.scaleX = .99;
            this.fightFighterContainer.scaleY = .95;
            this.fightFighterContainer.addChild(this.fightFighterFigure);
            this.fightFighterContainer.addChild(this.fightFrame);
            this.fightFighterContainer.addChild(this.currAtk);
            this.fightFighterContainer.addChild(this.currHp);
        }
        this.name.set({
            x: 50,
            y: 0,
            font: fontNormal
        });
        this.level.set({
            x: 65,
            y: 20
        });
        this.currAtk.set({
            x: 10,
            y: 127
        });
        this.currHp.set({
            x: 40,
            y: 152
        });
        this.fightFighterContainer.addChild(this.name);
        this.fightFighterContainer.addChild(this.level);
        this.addChild(this.fightFighterContainer);
    };
    /**
	 * []
	 * @return {[type]} [description]
	 */
    p.showStatus = function() {
        this.removeAllChildren();
        if (!this.showFighterContainer) {
            this.showFighterContainer = new createjs.Container();
            this.showBg = new createjs.Shape();
            this.showBg.graphics.beginFill("#000").drawRect(0, 0, battleViewData.stage.width, battleViewData.stage.height);
            this.showFighterFigure = new createjs.Bitmap(preload.getResult("card-large-" + this.model["entityId"]));
            this.showFrame = new createjs.Bitmap(preload.getResult("cardFrame-large-" + this.model["country"]));
            this.fightskill = new createjs.Text(this.model["fightskill"], fontLarge, "#fff").set({
                x: 0,
                y: 560
            });
            this.waitTime = new createjs.Text(this.model["waitTime"], fontNormal, "#fff");
            this.cost = new createjs.Text(this.model["cost"], fontLarge, "#fff").set({
                x: 250,
                y: 45
            });
            this.star = new createjs.Bitmap(preload.getResult("star-" + this.model["star"])).set({
                x: 70,
                y: 32
            });
            if (!this.level) {
                this.level = new createjs.Text(this.model["level"], fontNormal, "#fff");
            }
            if (!this.name) {
                this.name = new createjs.Text(this.model["name"], fontNormal, "#fff");
            }
            this.showFighterContainer.addChild(this.showBg);
            this.showFighterContainer.addChild(this.showFighterFigure);
            this.showFighterContainer.addChild(this.showFrame);
            this.showFighterContainer.addChild(this.fightskill);
            this.showFighterContainer.addChild(this.waitTime);
            this.showFighterContainer.addChild(this.cost);
            this.showFighterContainer.addChild(this.star);
        }
        this.set({
            x: 0,
            y: 0
        });
        this.name.set({
            x: 116,
            y: 0
        });
        this.name.font = fontLarge;
        this.waitTime.set({
            x: 13,
            y: 355
        });
        this.waitTime.font = fontLarge;
        this.level.set({
            x: 180,
            y: 8
        });
        this.atk.set({
            x: 58,
            y: 419
        });
        this.hp.set({
            x: 157,
            y: 419
        });
        this.showFighterContainer.addChild(this.name);
        this.showFighterContainer.addChild(this.level);
        this.showFighterContainer.addChild(this.atk);
        this.showFighterContainer.addChild(this.hp);
        this.addChild(this.showFighterContainer);
    };
    p.readyStatus = function() {
        this.setDiedFighterFighre();
    };
    p.diedStatus = function() {
        this.removeChild(this.fighterData);
        this.setDiedFighterFighre();
    };
    p.setDiedFighterFighre = function() {
        var greyScaleFilter = new createjs.ColorMatrixFilter([ .33, .33, .33, 0, 0, // red
        .33, .33, .33, 0, 0, // green
        .33, .33, .33, 0, 0, // blue
        0, 0, 0, 1, 0 ]);
        this.waitFighterFigure.filters = [ greyScaleFilter ];
    };
    p.hit = function(callback) {
        var data = this.hitData;
        var skill = data.skill;
        this.addChild(skill);
        var _this = this;
        //减少角色hp
        var currHp = data["hurt"] + this.model["currHp"];
        this.model["currHp"] = currHp <= 0 ? 0 : currHp;
        skill.addEventListener("animationend", function() {
            //不能放在技能放完的回调里否则.当点击技能会挂掉
            //如果技能类型不是攻击类型的则不用动
            //
            if (skill.type !== 4) {
                createjs.Tween.get(_this).to({
                    x: _this.x - 10
                }, battleViewData.speed["fast"]).to({
                    x: _this.x + 10
                }, battleViewData.speed["fast"]).to({
                    x: _this.x
                }, battleViewData.speed["fast"]);
            }
            createjs.Tween.get(_this.currHp).to({
                text: _this.model["currHp"]
            }, battleViewData.speed["fast"]);
            if (data.status === 0) {
                //触发死亡事件  ,里面还会根据技能触发死亡后事件
                _this.trigger(this.EVENT_DIED, _this);
            }
            if (callback !== undefined) {
                callback();
            }
            //目标有无防御技能
            //buffer
            //如果当前攻击者有buffer,则去掉buffer  然后掉血
            //
            setTimeout(function() {
                _this.removeChild(skill);
                _this.showSkill = false;
                _this.hitData = null;
            }, battleViewData.speed["slow"]);
        });
        this.showSkill = true;
        skill.gotoAndPlay("all");
    };
    p.toggleStatus = function(status) {
        switch (status) {
          case statusViewData.WAIT:
            this.waitStatus();
            break;

          case statusViewData.FIGHT:
            this.fightStatus();
            break;

          case statusViewData.READY:
            this.readyStatus();
            break;

          case statusViewData.DIED:
            this.diedStatus();
            break;

          case statusViewData.SHOW:
            this.showStatus();
            break;
        }
        this.status = status;
    };
    p.costWaitTime = function() {
        this.model["currWaitTime"] -= 1;
        this.currWaitTime.text = this.model["currWaitTime"];
    };
    module.exports = Fighter;
});

define("app/battle/playerGroup", [ "./battleGroup", "./effect", "./viewData" ], function(require, exports, module) {
    var BattleGroup = require("./battleGroup");
    var viewData = require("./viewData");
    var battleViewData = viewData.battleGroup;
    var groupViewData = viewData.playerGroup;
    var battleGroup = new BattleGroup(groupViewData);
    /**
	 * [ description]
	 * @param  {[type]} group   [description]
	 * @param  {[type]} fighter [description]
	 * @return {[type]}         [description]
	 */
    battleGroup.setFighterXY = function(group, fighter) {
        var x = groupViewData.fighterXY.x, length = group.getNumChildren(), width = battleViewData.fighter.width;
        x = x + length * width + battleViewData.margin.f2f * length;
        fighter.set({
            x: x - width,
            y: groupViewData.fighterXY.y
        });
        battleGroup.entranceAnimation(fighter, x);
    };
    /**
	 * [ description]
	 * @param  {[type]} rune [description]
	 * @return {[type]}      [description]
	 */
    battleGroup.setRuneXY = function(rune) {
        var x = groupViewData.runeXY.x, length = this.runeGroup.getNumChildren(), width = battleViewData.rune.width;
        x = x + length * width + battleViewData.margin.r2r * length;
        rune.set({
            x: x,
            y: groupViewData.runeXY.y
        });
    };
    battleGroup.forwardFightGroupXY = function() {
        return this.fightGroup.x - battleViewData.fighter.width - battleViewData.margin.f2f;
    };
    battleGroup.backwardFightGroupXY = function() {
        return this.fightGroup.x + battleViewData.fighter.width + battleViewData.margin.f2f;
    };
    battleGroup.resetWaitFighter = function() {
        var x = groupViewData.fighterXY.x;
        this.waitGroup.children.forEach(function(fighter) {
            fighter.x = x;
            x = x + battleViewData.fighter.width + battleViewData.margin.f2f;
        });
    };
    module.exports = battleGroup;
});

define("app/battle/role", [ "../utils/utils", "./viewData", "../config/consts" ], function(require, exports, module) {
    var utils = require("../utils/utils");
    var viewData = require("./viewData");
    var battleViewData = viewData.battleGroup;
    var rectViewData = viewData.sourceRect;
    var font = battleViewData.font.normal;
    var roleSex = require("../config/consts").roleSex;
    var preload = window.APP.preload;
    var Role = function(model) {
        this.initialize(model);
    };
    var p = Role.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;
    p.initialize = function(model) {
        this.Container_initialize();
        if (!model) {
            return;
        }
        this.model = model;
        this.model["currHp"] = this.model["hp"];
        this.hpTextShapeRadio = battleViewData.hpShape.width / this.model["hp"];
        this.addAvatar();
        this.name = new createjs.Text(this.model["name"], font, "#fff");
        this.addChild(this.name);
        this.addHp();
    };
    p.initViewData = function(viewData) {
        this.set({
            x: viewData.roleGroup.x,
            y: viewData.roleGroup.y
        });
        this.name.set({
            x: battleViewData.name.x,
            y: battleViewData.name.y
        });
        this.hpText.set({
            x: battleViewData.hpText.x,
            y: battleViewData.hpText.y
        });
        this.hpShape.set({
            x: battleViewData.hpShape.x,
            y: battleViewData.hpShape.y
        });
        if (viewData.hpShape.turn === true) {
            this.hpShape.regX = battleViewData.hpShape.width;
            this.hpShape.scaleX = -1;
        }
    };
    p.addAvatar = function() {
        var _this = this;
        if (this.model["currentFighter"] === battleViewData.fighters.player || this.model["avatar"]) {
            this.avatar = new createjs.Bitmap(preload.getResult("avatar")).set({
                x: battleViewData.avatar.x,
                y: battleViewData.avatar.y
            });
            if (this.model["avatar"] === roleSex.MAN) {
                this.avatar.sourceRect = rectViewData.manAvatarRect;
            } else if (this.model["avatar"] === roleSex.WOMAN) {
                this.avatar.sourceRect = rectViewData.womanAvatarRect;
            }
            this.avatar.scaleX = .92;
            this.avatar.scaleY = .9;
            this.addChildAt(this.avatar, 0);
        } else if (this.model["currentFighter"] === battleViewData.fighters.enemy) {
            var createFighterFigure = function(img) {
                _this.avatar = new createjs.Bitmap(img).set({
                    x: battleViewData.avatar.x,
                    y: battleViewData.avatar.y
                });
                _this.avatar.scaleX = .92;
                _this.avatar.scaleY = .9;
                _this.addChildAt(_this.avatar, 0);
            };
            var src = "images/card/small/fA" + this.model["entityId"] + ".png";
            utils.loadImage(src, createFighterFigure);
        }
    };
    p.addHp = function() {
        this.hpShape = new createjs.Shape();
        this.drawHpShape(battleViewData.hpShape.width);
        this.hpText = new createjs.Text(this.model["hp"] + "/" + this.model["hp"], font, "#fff");
        this.addChild(this.hpShape, this.hpText);
    };
    p.hit = function(callback) {
        var data = this.hitData;
        var skill = data.skill;
        skill.scaleX = .9;
        skill.scaleY = .6;
        this.addChild(skill);
        var _this = this;
        skill.addEventListener("animationend", function() {
            _this.removeChild(skill);
            if (callback !== undefined) {
                callback();
            }
        });
        skill.gotoAndPlay("all");
        //减少角色hp
        var currHp = data["hurt"] + this.model["currHp"];
        this.model["currHp"] = currHp <= 0 ? 0 : currHp;
        this.hpText.text = this.model["currHp"] + "/" + this.model["hp"];
        var width = this.hpTextShapeRadio * this.model["currHp"];
        this.drawHpShape(width);
    };
    p.drawHpShape = function(width) {
        this.hpShape.graphics.clear().beginFill("#990000").drawRect(0, 0, Math.floor(width), battleViewData.hpShape.height);
    };
    module.exports = Role;
});

define("app/battle/rune", [], function(require, exports, module) {
    var preload = window.APP.preload;
    var Rune = function(model) {
        this.initialize(model);
    };
    var p = Rune.prototype = new createjs.Container();
    p.Container_initialize = p.initialize;
    p.initialize = function(model) {
        this.Container_initialize();
        this.model = model;
        var rune = new createjs.Bitmap(preload.getResult("rune-" + model));
        rune.scaleX = .5;
        rune.scaleY = .5;
        this.addChild(rune);
    };
    module.exports = Rune;
});

define("app/battle/skill", [ "../utils/dataApi" ], function(require, exports, module) {
    var preload = window.APP.preload;
    var dataApi = require("../utils/dataApi");
    var Skill = function(id) {
        this.initialize(id);
    };
    var p = Skill.prototype = new createjs.BitmapAnimation();
    p.BitmapAnimation_initialize = p.initialize;
    p.initialize = function(id) {
        this.initData(id);
        var data = preload.getResult("skill-sprite-" + id);
        data.images = [ preload.getResult("skill-" + id) ];
        var spriteSheet = new createjs.SpriteSheet(data);
        this.BitmapAnimation_initialize(spriteSheet);
    };
    p.initData = function(id) {
        var data = dataApi.fightskill.findById(id);
        this.type = data.type;
    };
    module.exports = Skill;
});

define("app/battle/turnPointer", [ "./viewData" ], function(require, exports, module) {
    var viewData = require("./viewData");
    var battleViewData = viewData.battleGroup;
    var preload = window.APP.preload;
    var turnPointer = new createjs.Container().set({
        x: 571,
        y: 400
    });
    var pointerBg = new createjs.Bitmap(preload.getResult("turn-pointerBg")).set({
        x: 19,
        y: 0
    });
    var pointer = new createjs.Bitmap(preload.getResult("turn-pointer")).set({
        x: 69,
        y: 51,
        regX: 69,
        regY: 17
    });
    var pointerInfo = new createjs.Bitmap(preload.getResult("turn-pointerInfo")).set({
        x: 39,
        y: 14
    });
    var turnIndex = new createjs.Text("", "bold 26px Arial", "#fff").set({
        x: 50,
        y: 34
    });
    turnPointer.addChild(pointerBg, pointer, pointerInfo, turnIndex);
    turnPointer.setTurn = function(index, current) {
        turnIndex.text = index;
        if (battleViewData.fighters[current] === battleViewData.fighters.player) {
            createjs.Tween.get(pointer).to({
                rotation: -45
            }, battleViewData.speed.normal);
        } else if (battleViewData.fighters[current] === battleViewData.fighters.enemy) {
            createjs.Tween.get(pointer).to({
                rotation: 45
            }, battleViewData.speed.normal);
        }
    };
    module.exports = turnPointer;
});

define("app/battle/viewData", [], function(require, exports, module) {
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
            player: 0,
            enemy: 1
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
        showNums: 5
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
            x: 504,
            y: 274
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
            x: 0,
            y: 10
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
    exports.skillType = {};
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
        manAvatarRect: new createjs.Rectangle(121, 0, 116, 116)
    };
});

define("app/config/consts", [], function(require, exports, module) {
    module.exports = {
        entityType: {
            PLAYER: "player",
            FIGHTER: "fighter",
            EQUIPMENT: "equipment",
            ITEM: "item"
        },
        pageSize: {
            WIDTH: 640,
            HEIGHT: 960,
            DPR: 2
        },
        roleSex: {
            MAN: 1,
            WOMAN: 2
        }
    };
});

define("app/config/resource", [], function(require, exports, module) {
    module.exports = {
        sounds: [ {
            id: "bgSound",
            src: "sound/sound.ogg"
        } ]
    };
});

define("app/mvc/container", [ "./manager" ], function(require, exports, module) {
    var __hasProp = {}.hasOwnProperty, __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProContainer.prototype.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, Manager = require("./manager");
    Spine.Controller.include({
        visible: true,
        x: 0,
        y: 0,
        render: function(parent) {
            this.el.css({
                position: "absolute",
                left: x,
                top: y
            });
            this.appendTo(parent);
        }
    });
    var Module = function(_super) {
        __extends(Container, _super);
        Container.prototype.controllers = {};
        function Container() {
            var key, _ref;
            Container.__super__.constructor.apply(this, arguments);
            //分配控制器
            _ref = this.controllers;
            for (key in _ref) {
                this.addChild(_ref[key]);
            }
        }
        Container.prototype.render = function() {
            var list = this.children.slice(0);
            for (var i = 0, l = list.length; i < l; i++) {
                var child = list[i];
                if (!child.visible) {
                    continue;
                }
                child.render(this);
            }
            return true;
        };
        return Container;
    }(Manager);
    module.exports = Module;
});

define("app/mvc/createjs.extend", [], function(require, exports, module) {
    var stageMouseDownHandler = createjs.Stage.prototype._handlePointerDown;
    var stageMouseUpHandler = createjs.Stage.prototype._handlePointerUp;
    if (navigator.userAgent.indexOf("Android") > -1) {
        createjs.Stage.prototype._handlePointerDown = function(id, event, clear) {
            if (typeof event.x != "undefined") {
                event.screenX = event.x;
                event.screenY = event.y;
                stageMouseDownHandler.call(this, id, event, clear);
            }
        };
        createjs.Stage.prototype._handlePointerUp = function(id, event, clear) {
            if (typeof event.x != "undefined") {
                event.screenX = event.x;
                event.screenY = event.y;
                stageMouseUpHandler.call(this, id, event, clear);
            }
        };
    }
    createjs.DisplayObject.prototype.proxy = function(func) {
        var _this = this;
        var aArgs = Array.prototype.slice.call(arguments, 1);
        return function() {
            return func.apply(_this, Array.prototype.slice.call(arguments, 0).concat(aArgs));
        };
    };
});

define("app/mvc/manager", [], function(require, exports, module) {
    var __hasProp = {}.hasOwnProperty, __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };
    Spine.Controller.include({
        name: null,
        parent: null
    });
    var Module = function(_super) {
        __extends(Manager, _super);
        function Manager() {
            Manager.__super__.constructor.apply(this, arguments);
            this.children = {};
        }
        Manager.prototype.addChild = function(name, child) {
            if (child === null) {
                return child;
            } else if (typeof child === "function") {
                child = new child();
            }
            if (child.parent) {
                child.parent.removeChild(name);
            }
            child.name = name;
            child.parent = this;
            this.children[name] = child;
            return child;
        };
        Manager.prototype.removeChild = function(name) {
            var child = this.children[name];
            if (child) {
                child.parent = null;
            }
            this.children[name] = null;
            return true;
        };
        Manager.prototype.getChildAt = function(name) {
            return this.children[name];
        };
        Manager.prototype.getNumChildren = function() {
            return this.children.length;
        };
        return Manager;
    }(Spine.Controller);
    module.exports = Module;
});

define("app/mvc/route", [], function(require, exports, module) {
    var $, escapeRegExp, hashStrip, namedParam, splatParam, __hasProp = {}.hasOwnProperty, __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, __slice = [].slice;
    $ = Spine.$;
    hashStrip = /^#*/;
    namedParam = /:([\w\d]+)/g;
    splatParam = /\*([\w\d]+)/g;
    escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;
    Spine.Route = function(_super) {
        var _ref;
        __extends(Route, _super);
        Route.extend(Spine.Events);
        Route.historySupport = ((_ref = window.history) != null ? _ref.pushState : void 0) != null;
        Route.routes = [];
        Route.options = {
            trigger: true,
            history: false,
            shim: false,
            replace: false
        };
        Route.add = function(path, callback) {
            var key, value, _results;
            if (typeof path === "object" && !(path instanceof RegExp)) {
                _results = [];
                for (key in path) {
                    value = path[key];
                    _results.push(this.add(key, value));
                }
                return _results;
            } else {
                return this.routes.push(new this(path, callback));
            }
        };
        Route.setup = function(options) {
            if (options == null) {
                options = {};
            }
            this.options = $.extend({}, this.options, options);
            if (this.options.history) {
                this.history = this.historySupport && this.options.history;
            }
            if (this.options.shim) {
                return;
            }
            if (this.history) {
                $(window).bind("popstate", this.change);
            } else {
                $(window).bind("hashchange", this.change);
            }
            return this.change();
        };
        Route.unbind = function() {
            if (this.options.shim) {
                return;
            }
            if (this.history) {
                return $(window).unbind("popstate", this.change);
            } else {
                return $(window).unbind("hashchange", this.change);
            }
        };
        Route.navigate = function() {
            var args, lastArg, options, path;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            options = {};
            lastArg = args[args.length - 1];
            if (typeof lastArg === "object") {
                options = args.pop();
            } else if (typeof lastArg === "boolean") {
                options.trigger = args.pop();
            }
            options = $.extend({}, this.options, options);
            path = args.join("/").replace(hashStrip, "");
            if (this.path === path) {
                return;
            }
            this.path = path;
            this.trigger("navigate", this.path);
            if (options.trigger) {
                this.matchRoute(this.path, options);
            }
            if (options.shim) {
                return;
            }
            if (this.history && options.replace) {
                return history.replaceState({}, document.title, this.path);
            } else if (this.history) {
                return history.pushState({}, document.title, this.path);
            } else {
                return window.location.hash = this.path;
            }
        };
        Route.getPath = function() {
            var path;
            if (this.history) {
                path = window.location.pathname;
                if (path.substr(0, 1) !== "/") {
                    path = "/" + path;
                }
            } else {
                path = window.location.hash;
                path = path.replace(hashStrip, "");
            }
            return path;
        };
        Route.getHost = function() {
            return "" + window.location.protocol + "//" + window.location.host;
        };
        Route.change = function() {
            var path;
            path = this.getPath();
            if (path === this.path) {
                return;
            }
            this.path = path;
            return this.matchRoute(this.path);
        };
        Route.matchRoute = function(path, options) {
            var route, _i, _len, _ref1;
            _ref1 = this.routes;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                route = _ref1[_i];
                if (!route.match(path, options)) {
                    continue;
                }
                this.trigger("change", route, path);
                return route;
            }
        };
        function Route(path, callback) {
            var match;
            this.path = path;
            this.callback = callback;
            this.names = [];
            if (typeof path === "string") {
                namedParam.lastIndex = 0;
                while ((match = namedParam.exec(path)) !== null) {
                    this.names.push(match[1]);
                }
                splatParam.lastIndex = 0;
                while ((match = splatParam.exec(path)) !== null) {
                    this.names.push(match[1]);
                }
                path = path.replace(escapeRegExp, "\\$&").replace(namedParam, "([^/]*)").replace(splatParam, "(.*?)");
                this.route = new RegExp("^" + path + "$");
            } else {
                this.route = path;
            }
        }
        Route.prototype.match = function(path, options) {
            var i, match, param, params, _i, _len;
            if (options == null) {
                options = {};
            }
            match = this.route.exec(path);
            if (!match) {
                return false;
            }
            options.match = match;
            params = match.slice(1);
            if (this.names.length) {
                for (i = _i = 0, _len = params.length; _i < _len; i = ++_i) {
                    param = params[i];
                    options[this.names[i]] = param;
                }
            }
            return this.callback.call(null, options) !== false;
        };
        return Route;
    }(Spine.Module);
    Spine.Route.change = Spine.Route.proxy(Spine.Route.change);
    Spine.Controller.include({
        route: function(path, callback) {
            return Spine.Route.add(path, this.proxy(callback));
        },
        routes: function(routes) {
            var key, value, _results;
            _results = [];
            for (key in routes) {
                value = routes[key];
                _results.push(this.route(key, value));
            }
            return _results;
        },
        navigate: function() {
            return Spine.Route.navigate.apply(Spine.Route, arguments);
        }
    });
    if (typeof module !== "undefined" && module !== null) {
        module.exports = Spine.Route;
    }
});

define("app/mvc/stack", [ "./manager", "../ui/transitionManager", "../ui/noTransition", "../ui/jq.css3animate", "../ui/slideTransition", "../ui/slideDownTransition" ], function(require, exports, module) {
    var __hasProp = {}.hasOwnProperty, __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, __slice = [].slice, Manager = require("./manager"), transitionManager = require("../ui/transitionManager");
    var Module = function(_super) {
        __extends(Stack, _super);
        Stack.prototype.controllers = {};
        Stack.prototype.routes = {};
        function Stack() {
            var key, _ref, _ref1;
            this.oldController = null;
            Stack.__super__.constructor.apply(this, arguments);
            //分配控制器
            _ref = this.controllers;
            for (key in _ref) {
                this.addChild(key, _ref[key]);
            }
            //分配路由
            _ref1 = this.routes;
            for (key in _ref1) {
                this.addRoute(key, _ref1[key]);
            }
            this.trigger("defaultRoute");
            if (this["default"]) {
                this.navigate(this["default"], true);
            }
        }
        Stack.prototype.addRoute = function(key, value) {
            var _ref2, callback, oldController;
            var _this = this;
            if (typeof value === "function") {
                callback = value;
            } else {
                callback = function(params) {
                    oldController = _this.oldController;
                    _ref2 = _this.getChildAt(value);
                    if (_this.oldController === _ref2) {
                        return;
                    }
                    _ref2.params = params;
                    //在render设置oldController,避免回调失败再设置oldController
                    _this.oldController = _ref2;
                    _this.render(oldController, _ref2);
                };
            }
            return this.route(key, callback);
        };
        Stack.prototype.render = function(oldController, currController) {
            transitionManager.runTransition(oldController, currController);
        };
        Stack.prototype.setOldController = function(controller) {
            this.oldController = controller;
        };
        return Stack;
    }(Manager);
    module.exports = Module;
});

define("app/pages/gamePage", [ "../mvc/stack", "../mvc/manager", "../ui/transitionManager", "../ui/noTransition", "../ui/jq.css3animate", "../ui/slideTransition", "../ui/slideDownTransition", "../panels/dungeonPanel", "../panels/fightPanel", "../panels/mainPanel", "../panels/battlePanel", "../config/consts", "../utils/mobile", "../battle/battleModel", "../battle/viewData", "../battle/battleView", "../mvc/createjs.extend", "../battle/playerGroup", "../battle/battleGroup", "../battle/effect", "../battle/enemyGroup", "../battle/fighter", "../utils/utils", "../battle/role", "../battle/rune", "../battle/skill", "../utils/dataApi", "../battle/turnPointer", "../utils/utils.js" ], function(require, exports, module) {
    var SpineStack = require("../mvc/stack");
    var Controller = SpineStack.sub({
        el: "#gamePage",
        transition: "down",
        routes: {
            "/panel/main": "main",
            "/panel/dungeon": "dungeon",
            "/panel/battle/:fb1/:fb2": "battle"
        },
        init: function() {
            var _this = this;
            $("#navbar").delegate("a", "click", function() {
                var route = $(this).attr("href");
                switch (route) {
                  case "#/panel/dungeon":
                    var dungeonPanel = require("../panels/dungeonPanel");
                    _this.addChild("dungeon", dungeonPanel);
                    break;

                  case "#/panel/fight":
                    var fightPanel = require("../panels/fightPanel");
                    _this.addChild("fight", fightPanel);
                    break;
                }
                _this.navigate(route);
            });
            this.bind("contentLoad", this.proxy(this.enterBattle));
        },
        contentLoad: function() {
            var mainPanel = require("../panels/mainPanel");
            this.addChild("main", mainPanel);
            this.navigate("/panel/main", true);
        },
        enterBattle: function(route) {
            var route = "/panel/battle/1/2";
            var battlePanel = require("../panels/battlePanel");
            this.addChild("battle", battlePanel);
            this.navigate(route, true);
        }
    });
    var controller = new Controller();
    module.exports = controller;
});

define("app/pages/loginPage", [ "../mvc/stack", "../mvc/manager", "../ui/transitionManager", "../ui/noTransition", "../ui/jq.css3animate", "../ui/slideTransition", "../ui/slideDownTransition", "../panels/loginPanel", "../panels/serverPanel" ], function(require, exports, module) {
    var SpineStack = require("../mvc/stack");
    var Controller = SpineStack.sub({
        el: "#loginPage",
        routes: {
            "/panel/login": "login",
            "/panel/server": "server"
        },
        init: function() {
            this.on("contentLoad", this.proxy(this.contentLoad));
        },
        contentLoad: function() {
            var loginPanel = require("../panels/loginPanel");
            this.addChild("login", loginPanel);
            this.navigate("/panel/login", true);
        },
        enterServer: function() {
            var serverPanel = require("../panels/serverPanel");
            this.addChild("server", serverPanel);
            this.navigate("/panel/server", true);
        }
    });
    var controller = new Controller();
    module.exports = controller;
});

define("app/panels/battlePanel", [ "../config/consts", "../utils/mobile", "../battle/battleModel", "../battle/viewData", "../battle/battleView", "../mvc/createjs.extend", "../battle/playerGroup", "../battle/battleGroup", "../battle/effect", "../battle/enemyGroup", "../battle/fighter", "../utils/utils", "../battle/role", "../battle/rune", "../battle/skill", "../utils/dataApi", "../battle/turnPointer", "../utils/utils.js" ], function(require, exports, module) {
    var app = window.APP;
    var pageSize = require("../config/consts").pageSize;
    var mobile = require("../utils/mobile");
    var battleModel = require("../battle/battleModel");
    var battleView = require("../battle/battleView");
    var utils = require("../utils/utils");
    var dataApi = require("../utils/dataApi");
    var viewData = require("../battle/viewData");
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

define("app/panels/dungeonPanel", [], function(require, exports, module) {
    var Controller = Spine.Controller.sub({
        el: "#dungeonPanel",
        transition: "slide",
        init: function() {
            var _this = this;
            $("#enterFight").delegate("a", "click", function() {
                var route = $(this).attr("href");
                _this.parent.enterBattle(route);
            });
        }
    });
    var controller = new Controller();
    module.exports = controller;
});

define("app/panels/fightPanel", [], function(require, exports, module) {
    var Controller = Spine.Controller.sub({
        el: "#fightPanel",
        transition: "down",
        init: function() {}
    });
    var controller = new Controller();
    module.exports = controller;
});

define("app/panels/loginPanel", [], function(require, exports, module) {
    var logining = false;
    var Controller = Spine.Controller.sub({
        el: "#loginPanel",
        init: function() {
            showLogin();
            $("#loginButton").click(function() {
                showLogin();
            });
            $("#registerButton").click(function() {
                showRegister();
            });
        }
    });
    var controller = new Controller();
    function showLogin() {
        $("#g-doc").popup({
            title: "登录",
            message: "用户名: <input type='text' id='loginUser'><br>密码: <input type='text' id='loginPwd' style='webkit-text-security:disc'>",
            cancelCallback: function() {},
            doneText: "登录",
            doneCallback: login,
            cancelOnly: false
        });
    }
    function showRegister() {
        $("#g-doc").popup({
            title: "注册",
            message: "用户名: <input type='text' id='regUser'><br>密码: <input type='text' id='regPwd' style='webkit-text-security:disc'><br>重复密码: <input type='text' id='regPwd2' style='webkit-text-security:disc'>",
            cancelCallback: function() {},
            doneText: "注册",
            doneCallback: register,
            cancelOnly: false
        });
    }
    function login() {
        if (logining) {
            return;
        }
        logining = true;
        var username = $("#loginUser").val().trim();
        var pwd = $("#loginPwd").val().trim();
        $("#loginPwd").val("");
        if (!username) {
            alert("用户名不能为空!");
            logining = false;
            return;
        }
        if (!pwd) {
            alert("密码不能为空!");
            logining = false;
            return;
        }
        // $.post(httpHost + 'login', {
        // 	username: username,
        // 	password: pwd
        // }, function(data) {
        // 	if (data.code === 501) {
        // 		alert('Username or password is invalid!');
        // 		logining = false;
        // 		return;
        // 	}
        // 	if (data.code !== 200) {
        // 		alert('Username is not exists!');
        // 		logining = false;
        // 		return;
        // 	}
        //test data
        var data = {
            user: {
                id: 1
            },
            player: {
                areaId: "5"
            }
        };
        afterLogin(data);
    }
    function afterLogin(data) {
        var app = window.APP;
        var userData = data.user;
        var playerData = data.player;
        var areaId = playerData.areaId;
        if (!!userData) {
            app.uid = userData.id;
        }
        app.playerId = playerData.id;
        app.areaId = areaId;
        app.player = playerData;
        //加载资源
        controller.parent.enterServer();
    }
    function register() {
        var username = $("#regUser").val().trim();
        var pwd = $("#regPwd").val().trim();
        var pwd2 = $("#regPwd2").val().trim();
        $("#loginPwd").val("");
        if (!username) {
            alert("用户名不能为空!");
            logining = false;
            return;
        }
        if (!pwd) {
            alert("密码不能为空!");
            logining = false;
            return;
        }
        if (pwd !== pwd2) {
            alert("两次输入的密码不同!");
            logining = false;
            return;
        }
    }
    module.exports = controller;
});

define("app/panels/mainPanel", [], function(require, exports, module) {
    var Controller = Spine.Controller.sub({
        el: "#mainPanel",
        transition: "down",
        init: function() {
            this.bind("contentLoad", this.contentLoad);
        },
        contentLoad: function() {
            $(".slideLeft").listEffect({
                effect: "slideInLeft"
            });
            $(".slideRight").listEffect({
                effect: "slideInRight"
            });
        },
        contentUnload: function(callback) {
            $(".slideLeft").listEffect({
                effect: "slideOutLeft",
                reverse: true,
                out: true
            });
            $(".slideRight").listEffect({
                effect: "slideOutRight",
                reverse: true,
                out: true
            }, callback);
        }
    });
    var controller = new Controller();
    module.exports = controller;
});

define("app/panels/serverPanel", [], function(require, exports, module) {
    var Controller = Spine.Controller.sub({
        el: "#serverPanel",
        init: function() {
            $.selectBox.getOldSelects("selectServer");
            $("#enterGameButton").click(function() {
                enterGame();
            });
        }
    });
    var controller = new Controller();
    function enterGame() {
        controller.parent.parent.enterGame();
    }
    module.exports = controller;
});

define("app/ui/jq.css3animate", [], function(require, exports, module) {
    var cache = [];
    var objId = function(obj) {
        if (!obj.jqmCSS3AnimateId) obj.jqmCSS3AnimateId = $.uuid();
        return obj.jqmCSS3AnimateId;
    };
    var getEl = function(elID) {
        if (typeof elID == "string" || elID instanceof String) {
            return document.getElementById(elID);
        } else {
            return elID;
        }
    };
    var getCSS3Animate = function(obj, options) {
        var tmp, id, el = getEl(obj);
        //first one
        id = objId(el);
        if (cache[id]) {
            cache[id].animate(options);
            tmp = cache[id];
        } else {
            tmp = css3Animate(el, options);
            cache[id] = tmp;
        }
        return tmp;
    };
    $.fn["css3Animate"] = function(opts) {
        //keep old callback system - backwards compatibility - should be deprecated in future versions
        if (!opts.complete && opts.callback) opts.complete = opts.callback;
        //first on
        var tmp = getCSS3Animate(this[0], opts);
        opts.complete = null;
        opts.sucess = null;
        opts.failure = null;
        for (var i = 1; i < this.length; i++) {
            tmp.link(this[i], opts);
        }
        return tmp;
    };
    $["css3AnimateQueue"] = function() {
        return new css3Animate.queue();
    };
    //if (!window.WebKitCSSMatrix) return;
    var translateOpen = $.feat.cssTransformStart;
    var translateClose = $.feat.cssTransformEnd;
    var transitionEnd = $.feat.cssPrefix.replace(/-/g, "") + "TransitionEnd";
    transitionEnd = $.os.fennec || $.feat.cssPrefix == "" || $.os.ie ? "transitionend" : transitionEnd;
    transitionEnd = transitionEnd.replace(transitionEnd.charAt(0), transitionEnd.charAt(0).toLowerCase());
    var css3Animate = function() {
        var css3Animate = function(elID, options) {
            if (!(this instanceof css3Animate)) return new css3Animate(elID, options);
            //start doing stuff
            this.callbacksStack = [];
            this.activeEvent = null;
            this.countStack = 0;
            this.isActive = false;
            this.el = elID;
            this.linkFinishedProxy_ = $.proxy(this.linkFinished, this);
            if (!this.el) return;
            this.animate(options);
            var that = this;
            $(this.el).bind("destroy", function() {
                var id = that.el.jqmCSS3AnimateId;
                that.callbacksStack = [];
                if (cache[id]) delete cache[id];
            });
        };
        css3Animate.prototype = {
            animate: function(options) {
                //cancel current active animation on this object
                if (this.isActive) this.cancel();
                this.isActive = true;
                if (!options) {
                    alert("Please provide configuration options for animation of " + this.el.id);
                    return;
                }
                var classMode = !!options["addClass"];
                if (classMode) {
                    //class defines properties being changed
                    if (options["removeClass"]) {
                        $(this.el).replaceClass(options["removeClass"], options["addClass"]);
                    } else {
                        $(this.el).addClass(options["addClass"]);
                    }
                } else {
                    //property by property
                    var timeNum = numOnly(options["time"]);
                    if (timeNum == 0) options["time"] = 0;
                    if (!options["y"]) options["y"] = 0;
                    if (!options["x"]) options["x"] = 0;
                    if (options["previous"]) {
                        var cssMatrix = new $.getCssMatrix(this.el);
                        options.y += numOnly(cssMatrix.f);
                        options.x += numOnly(cssMatrix.e);
                    }
                    if (!options["origin"]) options.origin = "0% 0%";
                    if (!options["scale"]) options.scale = "1";
                    if (!options["rotateY"]) options.rotateY = "0";
                    if (!options["rotateX"]) options.rotateX = "0";
                    if (!options["skewY"]) options.skewY = "0";
                    if (!options["skewX"]) options.skewX = "0";
                    if (!options["timingFunction"]) options["timingFunction"] = "linear";
                    //check for percent or numbers
                    if (typeof options.x == "number" || options.x.indexOf("%") == -1 && options.x.toLowerCase().indexOf("px") == -1 && options.x.toLowerCase().indexOf("deg") == -1) options.x = parseInt(options.x) + "px";
                    if (typeof options.y == "number" || options.y.indexOf("%") == -1 && options.y.toLowerCase().indexOf("px") == -1 && options.y.toLowerCase().indexOf("deg") == -1) options.y = parseInt(options.y) + "px";
                    var trans = "translate" + translateOpen + options.x + "," + options.y + translateClose + " scale(" + parseFloat(options.scale) + ") rotate(" + options.rotateX + ")";
                    if (!$.os.opera) trans += " rotateY(" + options.rotateY + ")";
                    trans += " skew(" + options.skewX + "," + options.skewY + ")";
                    this.el.style[$.feat.cssPrefix + "Transform"] = trans;
                    this.el.style[$.feat.cssPrefix + "BackfaceVisibility"] = "hidden";
                    var properties = $.feat.cssPrefix + "Transform";
                    if (options["opacity"] !== undefined) {
                        this.el.style.opacity = options["opacity"];
                        properties += ", opacity";
                    }
                    if (options["width"]) {
                        this.el.style.width = options["width"];
                        properties = "all";
                    }
                    if (options["height"]) {
                        this.el.style.height = options["height"];
                        properties = "all";
                    }
                    this.el.style[$.feat.cssPrefix + "TransitionProperty"] = "all";
                    if (("" + options["time"]).indexOf("s") === -1) {
                        var scale = "ms";
                        var time = options["time"] + scale;
                    } else if (options["time"].indexOf("ms") !== -1) {
                        var scale = "ms";
                        var time = options["time"];
                    } else {
                        var scale = "s";
                        var time = options["time"] + scale;
                    }
                    this.el.style[$.feat.cssPrefix + "TransitionDuration"] = time;
                    this.el.style[$.feat.cssPrefix + "TransitionTimingFunction"] = options["timingFunction"];
                    this.el.style[$.feat.cssPrefix + "TransformOrigin"] = options.origin;
                }
                //add callback to the stack
                this.callbacksStack.push({
                    complete: options["complete"],
                    success: options["success"],
                    failure: options["failure"]
                });
                this.countStack++;
                var that = this;
                var style = window.getComputedStyle(this.el);
                if (classMode) {
                    //get the duration
                    var duration = style[$.feat.cssPrefix + "TransitionDuration"];
                    var timeNum = numOnly(duration);
                    options["time"] = timeNum;
                    if (duration.indexOf("ms") !== -1) {
                        scale = "ms";
                    } else {
                        options["time"] *= 1e3;
                        scale = "s";
                    }
                }
                //finish asap
                if (timeNum == 0 || scale == "ms" && timeNum < 5 || style.display == "none") {
                    //the duration is nearly 0 or the element is not displayed, finish immediatly
                    $.asap($.proxy(this.finishAnimation, this, [ false ]));
                } else {
                    //setup the event normally
                    var that = this;
                    this.activeEvent = function(event) {
                        clearTimeout(that.timeout);
                        that.finishAnimation(event);
                        that.el.removeEventListener(transitionEnd, that.activeEvent, false);
                    };
                    that.timeout = setTimeout(this.activeEvent, numOnly(options["time"]) + 50);
                    this.el.addEventListener(transitionEnd, this.activeEvent, false);
                }
            },
            addCallbackHook: function(callback) {
                if (callback) this.callbacksStack.push(callback);
                this.countStack++;
                return this.linkFinishedProxy_;
            },
            linkFinished: function(canceled) {
                if (canceled) this.cancel(); else this.finishAnimation();
            },
            finishAnimation: function(event) {
                if (event) event.preventDefault();
                if (!this.isActive) return;
                this.countStack--;
                if (this.countStack == 0) this.fireCallbacks(false);
            },
            fireCallbacks: function(canceled) {
                this.clearEvents();
                //keep callbacks after cleanup
                // (if any of the callbacks overrides this object, callbacks will keep on fire as expected)
                var callbacks = this.callbacksStack;
                //cleanup
                this.cleanup();
                //fire all callbacks
                for (var i = 0; i < callbacks.length; i++) {
                    var complete = callbacks[i]["complete"];
                    var success = callbacks[i]["success"];
                    var failure = callbacks[i]["failure"];
                    //fire callbacks
                    if (complete && typeof complete == "function") complete(canceled);
                    //success/failure
                    if (canceled && failure && typeof failure == "function") failure(); else if (success && typeof success == "function") success();
                }
            },
            cancel: function() {
                if (!this.isActive) return;
                this.fireCallbacks(true);
            },
            cleanup: function() {
                this.callbacksStack = [];
                this.isActive = false;
                this.countStack = 0;
            },
            clearEvents: function() {
                if (this.activeEvent) {
                    this.el.removeEventListener(transitionEnd, this.activeEvent, false);
                }
                this.activeEvent = null;
            },
            link: function(elID, opts) {
                var callbacks = {
                    complete: opts.complete,
                    success: opts.success,
                    failure: opts.failure
                };
                opts.complete = this.addCallbackHook(callbacks);
                opts.success = null;
                opts.failure = null;
                //run the animation with the replaced callbacks
                getCSS3Animate(elID, opts);
                //set the old callback back in the obj to avoid strange stuff
                opts.complete = callbacks.complete;
                opts.success = callbacks.success;
                opts.failure = callbacks.failure;
                return this;
            }
        };
        return css3Animate;
    }();
    css3Animate.queue = function() {
        return {
            elements: [],
            push: function(el) {
                this.elements.push(el);
            },
            pop: function() {
                return this.elements.pop();
            },
            run: function() {
                var that = this;
                if (this.elements.length == 0) return;
                if (typeof this.elements[0] == "function") {
                    var func = this.shift();
                    func();
                }
                if (this.elements.length == 0) return;
                var params = this.shift();
                if (this.elements.length > 0) params.complete = function(canceled) {
                    if (!canceled) that.run();
                };
                css3Animate(document.getElementById(params.id), params);
            },
            shift: function() {
                return this.elements.shift();
            }
        };
    };
});

define("app/ui/jq.popup", [], function(require, exports, module) {
    $.fn.popup = function(opts) {
        return new popup(this[0], opts);
    };
    var queue = [];
    var popup = function() {
        var popup = function(containerEl, opts) {
            if (typeof containerEl === "string" || containerEl instanceof String) {
                this.container = document.getElementById(containerEl);
            } else {
                this.container = containerEl;
            }
            if (!this.container) {
                alert("Error finding container for popup " + containerEl);
                return;
            }
            try {
                if (typeof opts === "string" || typeof opts === "number") opts = {
                    message: opts,
                    cancelOnly: "true",
                    cancelText: "OK"
                };
                this.id = id = opts.id = opts.id || $.uuid();
                //opts is passed by reference
                var self = this;
                this.title = opts.suppressTitle ? "" : opts.title || "提示";
                this.message = opts.message || "";
                this.cancelText = opts.cancelText || "取消";
                this.cancelCallback = opts.cancelCallback || function() {};
                this.cancelClass = opts.cancelClass || "button";
                this.doneText = opts.doneText || "确定";
                this.doneCallback = opts.doneCallback || function(self) {};
                this.doneClass = opts.doneClass || "button";
                this.cancelOnly = opts.cancelOnly || false;
                this.onShow = opts.onShow || function() {};
                this.autoCloseDone = opts.autoCloseDone !== undefined ? opts.autoCloseDone : true;
                queue.push(this);
                if (queue.length == 1) this.show();
            } catch (e) {
                console.log("error adding popup " + e);
            }
        };
        popup.prototype = {
            id: null,
            title: null,
            message: null,
            cancelText: null,
            cancelCallback: null,
            cancelClass: null,
            doneText: null,
            doneCallback: null,
            doneClass: null,
            cancelOnly: false,
            onShow: null,
            autoCloseDone: true,
            supressTitle: false,
            show: function() {
                var self = this;
                var markup = '<div id="' + this.id + '" class="jqPopup hidden">        				<header>' + this.title + '</header>        				<div><div style="width:1px;height:1px;-webkit-transform:translate3d(0,0,0);float:right"></div>' + this.message + '</div>        				<footer style="clear:both;">        					<a href="javascript:;" class="' + this.cancelClass + '" id="cancel">' + this.cancelText + '</a>        					<a href="javascript:;" class="' + this.doneClass + '" id="action">' + this.doneText + "</a>        				</footer>        			</div></div>";
                $(this.container).append($(markup));
                var $el = $("#" + this.id);
                $el.bind("close", function() {
                    self.hide();
                });
                if (this.cancelOnly) {
                    $el.find("a#action").hide();
                    $el.find("a#cancel").addClass("center");
                }
                $el.find("a").each(function() {
                    var button = $(this);
                    button.bind("click", function(e) {
                        if (button.attr("id") == "cancel") {
                            self.cancelCallback.call(self.cancelCallback, self);
                            self.hide();
                        } else {
                            self.doneCallback.call(self.doneCallback, self);
                            if (self.autoCloseDone) self.hide();
                        }
                        e.preventDefault();
                    });
                });
                self.positionPopup();
                $.blockUI(.5);
                $el.removeClass("hidden");
                $el.bind("orientationchange", function() {
                    self.positionPopup();
                });
                //force header/footer showing to fix CSS style bugs
                $el.find("header").show();
                $el.find("footer").show();
                this.onShow(this);
            },
            hide: function() {
                var self = this;
                $("#" + self.id).addClass("hidden");
                $.unblockUI();
                setTimeout(function() {
                    self.remove();
                }, 250);
            },
            remove: function() {
                var self = this;
                var $el = $("#" + self.id);
                $el.unbind("close");
                $el.find("button#action").unbind("click");
                $el.find("button#cancel").unbind("click");
                $el.unbind("orientationchange").remove();
                queue.splice(0, 1);
                if (queue.length > 0) queue[0].show();
            },
            positionPopup: function() {
                var popup = $("#" + this.id);
                popup.css("top", window.innerHeight / 2.5 + window.pageYOffset - popup[0].clientHeight / 2 + "px");
                popup.css("left", window.innerWidth / 2 - popup[0].clientWidth / 2 + "px");
            }
        };
        return popup;
    }();
    var uiBlocked = false;
    $.blockUI = function(opacity) {
        if (uiBlocked) return;
        opacity = opacity ? " style='opacity:" + opacity + ";'" : "";
        $("body").prepend($("<div id='mask'" + opacity + "></div>"));
        $("body div#mask").bind("touchstart", function(e) {
            e.preventDefault();
        });
        $("body div#mask").bind("touchmove", function(e) {
            e.preventDefault();
        });
        uiBlocked = true;
    };
    $.unblockUI = function() {
        uiBlocked = false;
        $("body div#mask").unbind("touchstart");
        $("body div#mask").unbind("touchmove");
        $("body div#mask").remove();
    };
    /**
     * Here we override the window.alert function due to iOS eating touch events on native alerts
     */
    window.alert = function(text) {
        if (text === null || text === undefined) text = "null";
        $(document.body).popup({
            suppressTitle: true,
            message: text.toString(),
            cancelOnly: "true",
            cancelText: "OK"
        });
    };
});

define("app/ui/jq.selectBox", [], function(require, exports, module) {
    $["selectBox"] = {
        scroller: null,
        getOldSelects: function(elID) {
            if (!$.os.android || $.os.androidICS) return;
            if (!$.fn["scroller"]) {
                alert("This library requires jq.web.Scroller");
                return;
            }
            var container = elID && document.getElementById(elID) ? document.getElementById(elID) : document;
            if (!container) {
                alert("Could not find container element for jq.web.selectBox " + elID);
                return;
            }
            var sels = container.getElementsByTagName("select");
            var that = this;
            for (var i = 0; i < sels.length; i++) {
                if (sels[i].hasSelectBoxFix) continue;
                (function(theSel) {
                    var fakeInput = document.createElement("div");
                    var theSelStyle = window.getComputedStyle(theSel);
                    var width = theSelStyle.width == "intrinsic" ? "100%" : theSelStyle.width;
                    var selWidth = parseInt(width) > 0 ? width : "100px";
                    var selHeight = parseInt(theSel.style.height) > 0 ? theSel.style.height : parseInt(theSelStyle.height) ? theSelStyle.height : "20px";
                    fakeInput.style.width = selWidth;
                    fakeInput.style.height = selHeight;
                    fakeInput.style.margin = theSelStyle.margin;
                    fakeInput.style.position = theSelStyle.position;
                    fakeInput.style.left = theSelStyle.left;
                    fakeInput.style.top = theSelStyle.top;
                    fakeInput.style.lineHeight = theSelStyle.lineHeight;
                    //fakeInput.style.position = "absolute";
                    //fakeInput.style.left = "0px";
                    //fakeInput.style.top = "0px";
                    fakeInput.style.zIndex = "1";
                    if (theSel.value) fakeInput.innerHTML = theSel.options[theSel.selectedIndex].text;
                    fakeInput.style.background = "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABEAAAAeCAIAAABFWWJ4AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyBpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBXaW5kb3dzIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkM1NjQxRUQxNUFEODExRTA5OUE3QjE3NjI3MzczNDAzIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkM1NjQxRUQyNUFEODExRTA5OUE3QjE3NjI3MzczNDAzIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6QzU2NDFFQ0Y1QUQ4MTFFMDk5QTdCMTc2MjczNzM0MDMiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6QzU2NDFFRDA1QUQ4MTFFMDk5QTdCMTc2MjczNzM0MDMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6YWbdCAAAAlklEQVR42mIsKChgIBGwAHFPTw/xGkpKSlggrG/fvhGjgYuLC0gyMZAOoPb8//9/0Or59+8f8XrICQN66SEnDOgcp3AgKiqKqej169dY9Hz69AnCuHv3rrKyMrIKoAhcVlBQELt/gIqwstHD4B8quH37NlAQSKKJEwg3iLbBED8kpeshoGcwh5uuri5peoBFMEluAwgwAK+5aXfuRb4gAAAAAElFTkSuQmCC') right top no-repeat";
                    fakeInput.style.backgroundColor = "white";
                    fakeInput.style.lineHeight = selHeight;
                    fakeInput.style.backgroundSize = "contain";
                    fakeInput.className = "jqmobiSelect_fakeInput " + theSel.className;
                    fakeInput.id = theSel.id + "_jqmobiSelect";
                    fakeInput.style.border = "1px solid gray";
                    fakeInput.style.color = "black";
                    fakeInput.linkId = theSel.id;
                    fakeInput.onclick = function(e) {
                        that.initDropDown(this.linkId);
                    };
                    $(fakeInput).insertBefore($(theSel));
                    //theSel.parentNode.style.position = "relative";
                    theSel.style.display = "none";
                    theSel.style.webkitAppearance = "none";
                    // Create listeners to watch when the select value has changed.
                    // This is needed so the users can continue to interact as normal,
                    // via jquery or other frameworks
                    for (var j = 0; j < theSel.options.length; j++) {
                        if (theSel.options[j].selected) {
                            fakeInput.value = theSel.options[j].text;
                        }
                        theSel.options[j].watch("selected", function(prop, oldValue, newValue) {
                            if (newValue == true) {
                                if (!theSel.getAttribute("multiple")) that.updateMaskValue(this.parentNode.id, this.text, this.value);
                                this.parentNode.value = this.value;
                            }
                            return newValue;
                        });
                    }
                    theSel.watch("selectedIndex", function(prop, oldValue, newValue) {
                        if (this.options[newValue]) {
                            if (!theSel.getAttribute("multiple")) that.updateMaskValue(this.id, this.options[newValue].text, this.options[newValue].value);
                            this.value = this.options[newValue].value;
                        }
                        return newValue;
                    });
                    fakeInput = null;
                    imageMask = null;
                    sels[i].hasSelectBoxFix = true;
                })(sels[i]);
            }
            that.createHtml();
        },
        updateDropdown: function(id) {
            var el = document.getElementById(id);
            if (!el) return;
            for (var j = 0; j < el.options.length; j++) {
                if (el.options[j].selected) fakeInput.value = el.options[j].text;
                el.options[j].watch("selected", function(prop, oldValue, newValue) {
                    if (newValue == true) {
                        that.updateMaskValue(this.parentNode.id, this.text, this.value);
                        this.parentNode.value = this.value;
                    }
                    return newValue;
                });
            }
            el = null;
        },
        initDropDown: function(elID) {
            var that = this, el = document.getElementById(elID);
            if (el.disabled) return;
            if (!el || !el.options || el.options.length == 0) return;
            var defaultHeaderText = elID, headerText = "", foundInd = 0;
            headerText = el.attributes.title || el.name;
            if (typeof headerText === "object") headerText = headerText.value;
            document.getElementById("jqmobiSelectBoxScroll").innerHTML = "";
            document.getElementById("jqmobiSelectBoxHeaderTitle").innerHTML = headerText.length > 0 ? headerText : defaultHeaderText;
            for (var j = 0; j < el.options.length; j++) {
                el.options[j].watch("selected", function(prop, oldValue, newValue) {
                    if (newValue == true) {
                        that.updateMaskValue(this.parentNode.id, this.text, this.value);
                        this.parentNode.value = this.value;
                    }
                    return newValue;
                });
                var checked = el.options[j].selected ? true : false, div = document.createElement("div"), anchor = document.createElement("a"), span = document.createElement("span"), rad = document.createElement("button");
                div.className = "jqmobiSelectRow";
                div.style.cssText = "line-height:40px;font-size:14px;padding-left:10px;height:40px;width:100%;position:relative;width:100%;border-bottom:1px solid black;background:white;";
                div.tmpValue = j;
                div.onclick = function(e) {
                    that.setDropDownValue(elID, this.tmpValue, this);
                };
                anchor.style.cssText = "text-decoration:none;color:black;";
                anchor.innerHTML = el.options[j].text;
                anchor.className = "jqmobiSelectRowText";
                span.style.cssText = "float:right;margin-right:20px;margin-top:-2px";
                if (checked) {
                    rad.style.cssText = "background: #000;padding: 0px 0px;border-radius:15px;border:3px solid black;";
                    rad.className = "jqmobiSelectRowButtonFound";
                } else {
                    rad.style.cssText = "background: #ffffff;padding: 0px 0px;border-radius:15px;border:3px solid black;";
                    rad.className = "jqmobiSelectRowButton";
                }
                rad.style.width = "20px";
                rad.style.height = "20px";
                rad.checked = checked;
                span.appendChild(rad);
                div.appendChild(anchor);
                div.appendChild(span);
                document.getElementById("jqmobiSelectBoxScroll").appendChild(div);
                span = null;
                rad = null;
                anchor = null;
            }
            try {
                document.getElementById("jqmobiSelectModal").style.display = "block";
            } catch (e) {
                console.log("Error showing div " + e);
            }
            try {
                if (div) {
                    var scrollThreshold = numOnly(div.style.height);
                    var offset = numOnly(document.getElementById("jqmobiSelectBoxHeader").style.height);
                    if (foundInd * scrollThreshold + offset >= numOnly(document.getElementById("jqmobiSelectBoxFix").clientHeight) - offset) var scrollToPos = foundInd * -scrollThreshold + offset; else scrollToPos = 0;
                    this.scroller.scrollTo({
                        x: 0,
                        y: scrollToPos
                    });
                }
            } catch (e) {
                console.log("error init dropdown" + e);
            }
            div = null;
            el = null;
        },
        updateMaskValue: function(elID, value, val2) {
            var el = document.getElementById(elID + "_jqmobiSelect");
            var el2 = document.getElementById(elID);
            if (el) el.innerHTML = value;
            if (typeof el2.onchange == "function") el2.onchange(val2);
            el = null;
            el2 = null;
        },
        setDropDownValue: function(elID, value, div) {
            var el = document.getElementById(elID);
            if (!el) return;
            if (!el.getAttribute("multiple")) {
                el.selectedIndex = value;
                $(el).find("option").forEach(function(obj) {
                    obj.selected = false;
                });
                $(el).find("option:nth-child(" + (value + 1) + ")").get(0).selected = true;
                this.scroller.scrollTo({
                    x: 0,
                    y: 0
                });
                this.hideDropDown();
            } else {
                //multi select
                var myEl = $(el).find("option:nth-child(" + (value + 1) + ")").get(0);
                if (myEl.selected) {
                    myEl.selected = false;
                    $(div).find("button").css("background", "#fff");
                } else {
                    myEl.selected = true;
                    $(div).find("button").css("background", "#000");
                }
            }
            $(el).trigger("change");
            el = null;
        },
        hideDropDown: function() {
            document.getElementById("jqmobiSelectModal").style.display = "none";
            document.getElementById("jqmobiSelectBoxScroll").innerHTML = "";
        },
        createHtml: function() {
            var that = this;
            if (document.getElementById("jqmobiSelectBoxContainer")) {
                return;
            }
            var modalDiv = document.createElement("div");
            modalDiv.style.cssText = "position:absolute;top:0px;bottom:0px;left:0px;right:0px;background:rgba(0,0,0,.7);z-index:200000;display:none;";
            modalDiv.id = "jqmobiSelectModal";
            var myDiv = document.createElement("div");
            myDiv.id = "jqmobiSelectBoxContainer";
            myDiv.style.cssText = "position:absolute;top:8%;bottom:10%;display:block;width:90%;margin:auto;margin-left:5%;height:90%px;background:white;color:black;border:1px solid black;border-radius:6px;";
            myDiv.innerHTML = '<div id="jqmobiSelectBoxHeader" style="display:block;font-family:\'Eurostile-Bold\', Eurostile, Helvetica, Arial, sans-serif;color:#fff;font-weight:bold;font-size:18px;line-height:34px;height:34px; text-transform:uppercase; text-align:left; text-shadow:rgba(0,0,0,.9) 0px -1px 1px; padding: 0px 8px 0px 8px; border-top-left-radius:5px; border-top-right-radius:5px; -webkit-border-top-left-radius:5px; -webkit-border-top-right-radius:5px; background:#39424b; margin:1px;">' + '<div style="float:left;" id="jqmobiSelectBoxHeaderTitle"></div>' + '<div style="float:right;width:60px;margin-top:-5px">' + '<div id="jqmobiSelectClose" class="button" style="width:60px;height:32px;line-height:32px;">Close</div></div></div>' + '<div id="jqmobiSelectBoxFix" style="position:relative;height:90%;background:white;overflow:hidden;width:100%;"><div id="jqmobiSelectBoxScroll"></div></div>';
            var that = this;
            modalDiv.appendChild(myDiv);
            $(document).ready(function() {
                if (jq("#jQUi")) jq("#jQUi").append(modalDiv); else document.body.appendChild(modalDiv);
                var close = $("#jqmobiSelectClose").get();
                close.onclick = function() {
                    that.hideDropDown();
                };
                var styleSheet = $("<style>.jqselectscrollBarV{opacity:1 !important;}</style>").get();
                document.body.appendChild(styleSheet);
                try {
                    that.scroller = $("#jqmobiSelectBoxScroll").scroller({
                        scroller: false,
                        verticalScroll: true,
                        vScrollCSS: "jqselectscrollBarV"
                    });
                } catch (e) {
                    console.log("Error creating select html " + e);
                }
                modalDiv = null;
                myDiv = null;
                styleSheet = null;
            });
        }
    };
    //The following is based off Eli Grey's shim
    //https://gist.github.com/384583
    //We use HTMLElement to not cause problems with other objects
    if (!HTMLElement.prototype.watch) {
        HTMLElement.prototype.watch = function(prop, handler) {
            var oldval = this[prop], newval = oldval, getter = function() {
                return newval;
            }, setter = function(val) {
                oldval = newval;
                return newval = handler.call(this, prop, oldval, val);
            };
            if (delete this[prop]) {
                // can't watch constants
                if (HTMLElement.defineProperty) {
                    // ECMAScript 5
                    HTMLElement.defineProperty(this, prop, {
                        get: getter,
                        set: setter,
                        enumerable: false,
                        configurable: true
                    });
                } else if (HTMLElement.prototype.__defineGetter__ && HTMLElement.prototype.__defineSetter__) {
                    // legacy
                    HTMLElement.prototype.__defineGetter__.call(this, prop, getter);
                    HTMLElement.prototype.__defineSetter__.call(this, prop, setter);
                }
            }
        };
    }
    if (!HTMLElement.prototype.unwatch) {
        HTMLElement.prototype.unwatch = function(prop) {
            var val = this[prop];
            delete this[prop];
            // remove accessors
            this[prop] = val;
        };
    }
});

define("app/ui/loadUi", [], function(require, exports, module) {
    require("./zepto.extend");
    require("./jq.popup");
    require("./jq.selectBox");
    require("./zepto.liffect");
});

define("app/ui/noTransition", [], function(require, exports, module) {
    var css3animate = require("./jq.css3animate");
    noTransition = {
        finishCallback: null,
        css3animate: function(el, opts) {
            el = $(el);
            return el.css3Animate(opts);
        },
        /**
         * This is the default transition.  It simply shows the new panel and hides the old
         */
        transition: function(oldDiv, currDiv, back) {
            currDiv.style.display = "block";
            oldDiv.style.display = "block";
            var that = this;
            that.clearAnimations(currDiv);
            that.css3animate(oldDiv, {
                x: "0%",
                y: 0
            });
            that.finishTransition(oldDiv);
            currDiv.style.zIndex = 2;
            oldDiv.style.zIndex = 1;
        },
        /**
         * This must be called at the end of every transition to hide the old div and reset the doingTransition variable
         *
         * @param {Object} Div that transitioned out
         * @title $.ui.finishTransition(oldDiv)
         */
        finishTransition: function(oldDiv, currDiv) {
            oldDiv.style.display = "none";
            if (currDiv) this.clearAnimations(currDiv);
            if (oldDiv) this.clearAnimations(oldDiv);
            if (this.finishCallback !== null) {
                this.finishCallback();
            }
        },
        /**
         * This must be called at the end of every transition to remove all transforms and transitions attached to the inView object (performance + native scroll)
         *
         * @param {Object} Div that transitioned out
         * @title $.ui.finishTransition(oldDiv)
         */
        clearAnimations: function(inViewDiv) {
            inViewDiv.style[$.feat.cssPrefix + "Transform"] = "none";
            inViewDiv.style[$.feat.cssPrefix + "Transition"] = "none";
        }
    };
    module.exports = noTransition;
});

define("app/ui/slideDownTransition", [], function(require, exports, module) {
    function slideDownTransition(oldDiv, currDiv, back) {
        oldDiv.style.display = "block";
        currDiv.style.display = "block";
        var that = this;
        if (back) {
            currDiv.style.zIndex = 1;
            oldDiv.style.zIndex = 2;
            that.clearAnimations(currDiv);
            that.css3animate(oldDiv, {
                y: "-100%",
                x: "0%",
                time: "150ms",
                complete: function(canceled) {
                    if (canceled) {
                        that.finishTransition(oldDiv, currDiv);
                        return;
                    }
                    that.css3animate(oldDiv, {
                        x: "-100%",
                        y: 0,
                        complete: function() {
                            that.finishTransition(oldDiv);
                        }
                    });
                    currDiv.style.zIndex = 2;
                    oldDiv.style.zIndex = 1;
                }
            });
        } else {
            oldDiv.style.zIndex = 1;
            currDiv.style.zIndex = 2;
            that.css3animate(currDiv, {
                y: "-100%",
                x: "0%",
                complete: function() {
                    that.css3animate(currDiv, {
                        y: "0%",
                        x: "0%",
                        time: "150ms",
                        complete: function(canceled) {
                            if (canceled) {
                                that.finishTransition(oldDiv, currDiv);
                                return;
                            }
                            that.clearAnimations(currDiv);
                            that.css3animate(oldDiv, {
                                x: "-100%",
                                y: 0,
                                complete: function() {
                                    that.finishTransition(oldDiv);
                                }
                            });
                        }
                    });
                }
            });
        }
    }
    module.exports = slideDownTransition;
});

define("app/ui/slideTransition", [], function(require, exports, module) {
    function slideTransition(oldDiv, currDiv, back) {
        oldDiv.style.display = "block";
        currDiv.style.display = "block";
        var that = this;
        if (back) {
            currDiv.style.zIndex = 2;
            oldDiv.style.zIndex = 1;
            that.css3animate(oldDiv, {
                x: "0%",
                y: "0%",
                complete: function() {
                    that.css3animate(oldDiv, {
                        x: "100%",
                        time: "150ms",
                        complete: function() {
                            that.finishTransition(oldDiv, currDiv);
                        }
                    }).link(currDiv, {
                        x: "0%",
                        time: "150ms"
                    });
                }
            }).link(currDiv, {
                x: "-100%",
                y: "0%"
            });
        } else {
            currDiv.style.zIndex = 2;
            oldDiv.style.zIndex = 1;
            that.css3animate(oldDiv, {
                x: "0%",
                y: "0%",
                complete: function() {
                    that.css3animate(oldDiv, {
                        x: "-100%",
                        time: "150ms",
                        complete: function() {
                            that.finishTransition(oldDiv, currDiv);
                        }
                    }).link(currDiv, {
                        x: "0%",
                        time: "150ms"
                    });
                }
            }).link(currDiv, {
                x: "100%",
                y: "0%"
            });
        }
    }
    module.exports = slideTransition;
});

define("app/ui/transitionManager", [ "./noTransition", "./slideTransition", "./slideDownTransition" ], function(require, exports, module) {
    var noTransition = require("./noTransition");
    var TransitionManager = function() {
        this.availableTransitions = {};
        this.availableTransitions["default"] = this.availableTransitions["none"] = noTransition.transition;
    };
    TransitionManager.prototype.runTransition = function(oldController, currController, back) {
        var oldDiv, currDiv, oldCallback, transition, contentLoadBefore;
        var _this = this;
        contentLoadBefore = oldCallback = function(callback) {
            callback();
        };
        if (oldController !== null) {
            oldDiv = oldController.el[0];
            if (typeof oldController.contentUnload === "function") {
                oldCallback = oldController.contentUnload;
            }
        } else {
            oldDiv = document.createElement("div");
        }
        noTransition.finishCallback = null;
        if (currController !== undefined) {
            currDiv = currController.el[0];
            noTransition.finishCallback = function() {
                oldDiv.style.display = "none";
                currController.trigger("contentLoad");
            };
            if (typeof currController.contentLoadBefore === "function") {
                contentLoadBefore = currController.contentLoadBefore;
            }
        } else {
            console.log("新控制器不能为空!");
            return;
        }
        transition = currController["transition"];
        if (!this.availableTransitions[transition]) {
            switch (transition) {
              case "slide":
                this.availableTransitions["slide"] = require("./slideTransition");
                break;

              case "down":
                this.availableTransitions["down"] = require("./slideDownTransition");
                break;

              default:
                transition = "default";
            }
        }
        oldCallback.call(oldController, function() {
            contentLoadBefore.call(currController, function() {
                _this.availableTransitions[transition].call(noTransition, oldDiv, currDiv, back);
            }, oldController);
        }, currController);
    };
    transitionManager = new TransitionManager();
    module.exports = transitionManager;
});

define("app/ui/zepto.extend", [], function(require, exports, module) {
    /**
	 * Helper function to parse the user agent.  Sets the following
	 * .os.webkit
	 * .os.android
	 * .os.ipad
	 * .os.iphone
	 * .os.webos
	 * .os.touchpad
	 * .os.blackberry
	 * .os.opera
	 * .os.fennec
	 * .os.ie
	 * .os.ieTouch
	 * .os.supportsTouch
	 * .os.playbook
	 * .feat.nativetouchScroll
	 * @api private
	 */
    function detectUA($, userAgent) {
        $.os = {};
        $.os.webkit = userAgent.match(/WebKit\/([\d.]+)/) ? true : false;
        $.os.android = userAgent.match(/(Android)\s+([\d.]+)/) || userAgent.match(/Silk-Accelerated/) ? true : false;
        $.os.androidICS = $.os.android && userAgent.match(/(Android)\s4/) ? true : false;
        $.os.ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false;
        $.os.iphone = !$.os.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false;
        $.os.webos = userAgent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/) ? true : false;
        $.os.touchpad = $.os.webos && userAgent.match(/TouchPad/) ? true : false;
        $.os.ios = $.os.ipad || $.os.iphone;
        $.os.playbook = userAgent.match(/PlayBook/) ? true : false;
        $.os.blackberry = $.os.playbook || userAgent.match(/BlackBerry/) ? true : false;
        $.os.blackberry10 = $.os.blackberry && userAgent.match(/Safari\/536/) ? true : false;
        $.os.chrome = userAgent.match(/Chrome/) ? true : false;
        $.os.opera = userAgent.match(/Opera/) ? true : false;
        $.os.fennec = userAgent.match(/fennec/i) ? true : userAgent.match(/Firefox/) ? true : false;
        $.os.ie = userAgent.match(/MSIE 10.0/i) ? true : false;
        $.os.ieTouch = $.os.ie && userAgent.toLowerCase().match(/touch/i) ? true : false;
        $.os.supportsTouch = window.DocumentTouch && document instanceof window.DocumentTouch || "ontouchstart" in window;
        //features
        $.feat = {};
        var head = document.documentElement.getElementsByTagName("head")[0];
        $.feat.nativeTouchScroll = typeof head.style["-webkit-overflow-scrolling"] !== "undefined" && $.os.ios;
        $.feat.cssPrefix = $.os.webkit ? "Webkit" : $.os.fennec ? "Moz" : $.os.ie ? "ms" : $.os.opera ? "O" : "";
        $.feat.cssTransformStart = !$.os.opera ? "3d(" : "(";
        $.feat.cssTransformEnd = !$.os.opera ? ",0)" : ")";
        if ($.os.android && !$.os.webkit) $.os.android = false;
    }
    detectUA($, navigator.userAgent);
    $.__detectUA = detectUA;
    //needed for unit tests
    $.uuid = function() {
        var S4 = function() {
            return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
        };
        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    };
    // Like setTimeout(fn, 0); but much faster
    var timeouts = [];
    var contexts = [];
    var params = [];
    /**
         * This adds a command to execute in the JS stack, but is faster then setTimeout
           ```
           $.asap(function,context,args)
           ```
         * @param {Function} function
         * @param {Object} context
         * @param {Array} arguments
         */
    $.asap = function(fn, context, args) {
        if (!$.isFunction(fn)) throw "$.asap - argument is not a valid function";
        timeouts.push(fn);
        contexts.push(context ? context : {});
        params.push(args ? args : []);
        //post a message to ourselves so we know we have to execute a function from the stack 
        window.postMessage("jqm-asap", "*");
    };
    window.addEventListener("message", function(event) {
        if (event.source == window && event.data == "jqm-asap") {
            event.stopPropagation();
            if (timeouts.length > 0) {
                //just in case...
                timeouts.shift().apply(contexts.shift(), params.shift());
            }
        }
    }, true);
    if (!window.numOnly) {
        window.numOnly = function numOnly(val) {
            if (val === undefined || val === "") return 0;
            if (isNaN(parseFloat(val))) {
                if (val.replace) {
                    val = val.replace(/[^0-9.-]/, "");
                } else return 0;
            }
            return parseFloat(val);
        };
    }
});

define("app/ui/zepto.liffect", [], function(require, exports, module) {
    $.fn.listEffect = function(opts, callback) {
        opts = opts || {};
        if (typeof opts.effect === "undefined") {
            return false;
        }
        this.attr("data-liffect", opts.effect);
        return new listEffect(this, opts, callback);
    };
    var listEffect = function(container, opts, callback) {
        var attributes = {};
        attributes.id = opts.id || $.uuid();
        attributes.container = container;
        attributes.childElName = opts.childElName || "li";
        attributes.childs = attributes.container.find(attributes.childElName);
        attributes.size = opts.size || attributes.childs.size() - 1;
        attributes.time = opts.time || "500";
        attributes.reverse = opts.reverse || false;
        attributes.out = opts.out || false;
        attributes.doneCallback = function() {
            attributes.container.removeClass("play");
            if (attributes.out) {
                attributes.container.attr("data-liffect", "");
            }
            if (typeof callback === "function") {
                callback();
            }
        };
        attributes.donetotalTime = (attributes.size + 1) * attributes.time;
        if (attributes.reverse) {
            this.reverseShow(attributes);
        } else {
            this.show(attributes);
        }
    };
    listEffect.prototype = {
        show: function(attributes) {
            attributes.childs.each(function(i) {
                $(this).attr("style", "-webkit-animation-delay:" + i * attributes.time + "ms");
                if (i == attributes.size) {
                    attributes.container.addClass("play");
                }
            });
            setTimeout(function() {
                attributes.doneCallback();
            }, attributes.donetotalTime);
        },
        reverseShow: function(attributes) {
            attributes.childs.each(function(i) {
                $(this).attr("style", "-webkit-animation-delay:" + (attributes.size - i) * attributes.time + "ms");
                if (i == attributes.size) {
                    attributes.container.addClass("play");
                }
            });
            setTimeout(function() {
                attributes.doneCallback();
            }, attributes.donetotalTime);
        }
    };
});

define("app/utils/clientManager", [ "../mvc/route", "../mvc/stack", "../mvc/manager", "../ui/transitionManager", "../ui/noTransition", "../ui/jq.css3animate", "../ui/slideTransition", "../ui/slideDownTransition", "../pages/loginPage", "../panels/loginPanel", "../panels/serverPanel", "../pages/gamePage", "../panels/dungeonPanel", "../panels/fightPanel", "../panels/mainPanel", "../panels/battlePanel", "../config/consts", "./mobile", "../battle/battleModel", "../battle/viewData", "../battle/battleView", "../mvc/createjs.extend", "../battle/playerGroup", "../battle/battleGroup", "../battle/effect", "../battle/enemyGroup", "../battle/fighter", "./utils", "../battle/role", "../battle/rune", "../battle/skill", "./dataApi", "../battle/turnPointer", "./utils.js" ], function(require, exports, module) {
    require("../mvc/route");
    var SpineStack = require("../mvc/stack");
    var loginPage = require("../pages/loginPage");
    var ClientManager = SpineStack.sub({
        el: "#g-doc",
        controllers: {
            login: loginPage
        },
        routes: {
            "/page/login": "login",
            "/page/game": "game"
        },
        "default": "/page/login",
        init: function() {
            //初始化路由,兼容手机版本去除history
            Spine.Route.setup({
                trigger: true,
                history: false,
                shim: true,
                replace: false
            });
            this["default"] = "/page/game";
            this.bind("defaultRoute", this.proxy(this.enterGame));
        },
        enterGame: function() {
            var gamePage = require("../pages/gamePage");
            this.addChild("game", gamePage);
            this.navigate("/page/game", true);
        }
    });
    function run() {
        var clientManager = new ClientManager();
        return clientManager;
    }
    exports.run = run;
});

define("app/utils/dataApi", [], function(require, exports, module) {
    var preload = window.APP.preload;
    function Data(key) {
        this.key = key;
        this.data = null;
    }
    Data.prototype.set = function(data) {
        this.data = data;
        var self = this;
        setTimeout(function() {
            localStorage.setItem(self.key, JSON.stringify(data));
        }, 300);
    };
    Data.prototype.findById = function(id) {
        var data = this.all();
        return data[id];
    };
    Data.prototype.all = function() {
        if (!this.data) {
            this.data = JSON.parse(localStorage.getItem(this.key)) || {};
        }
        return this.data;
    };
    var character = new Data("character");
    character.set(preload.getResult("characterData"));
    var fightskill = new Data("fightskill");
    fightskill.set(preload.getResult("fightskillData"));
    exports.character = character;
    exports.fightskill = fightskill;
});

define("app/utils/mobile", [ "../config/consts" ], function(require, exports, module) {
    //更多参加 zepto.extend.js
    var pageSize = require("../config/consts").pageSize;
    var canvasRadio = {};
    /**
	 * [getWidth 获取屏幕宽度]
	 * @return {[type]} [description]
	 */
    function getPageWidth() {
        var xWidth = null;
        if (window.innerWidth !== null) {
            xWidth = window.innerWidth;
        } else {
            xWidth = document.body.clientWidth;
        }
        return xWidth;
    }
    function getPageHeight() {
        var xHeight = null;
        if (window.innerHeight !== null) {
            xHeight = window.innerHeight;
        } else {
            xHeight = document.body.clientHeight;
        }
        return xHeight;
    }
    function init() {
        //当前密度的缩放比例
        var width = getPageWidth();
        var height = getPageHeight();
        canvasRadio.width = canvasRadio.height = width / pageSize.WIDTH;
    }
    init();
    exports.canvasRadio = canvasRadio;
});

define("app/utils/panelManager", [ "../mvc/stack", "../mvc/manager", "../ui/transitionManager", "../ui/noTransition", "../ui/jq.css3animate", "../ui/slideTransition", "../ui/slideDownTransition", "../panels/dungeonPanel", "../panels/fightPanel", "../panels/mainPanel" ], function(require, exports, module) {
    var SpineStack = require("../mvc/stack");
    var Controller = SpineStack.sub({
        el: "#gamePage",
        transition: "down",
        routes: {
            "/panel/main": "main",
            "/panel/dungeon": "dungeon",
            "/panel/fight": "fight"
        },
        init: function() {
            var _this = this;
            $("#navbar").delegate("a", "click", function() {
                var route = $(this).attr("href").substr(1);
                switch (route) {
                  case "/panel/dungeon":
                    var dungeonPanel = require("../panels/dungeonPanel");
                    _this.addChild("dungeon", dungeonPanel);
                    break;

                  case "/panel/fight":
                    var fightPanel = require("../panels/fightPanel");
                    _this.addChild("fight", fightPanel);
                    break;
                }
                _this.navigate(route);
            });
            this.on("contentLoad", this.proxy(this.contentLoad));
        },
        contentLoad: function() {
            var mainPanel = require("../panels/mainPanel");
            this.addChild("main", mainPanel);
            this.navigate("/panel/main", true);
        }
    });
    var controller = new Controller();
    module.exports = controller;
});

define("app/utils/utils", [], function(require, exports, module) {
    var app = window.APP;
    function createSketchpad(width, height, parent) {
        if (arguments.length == 1) {
            parent = width;
            width = undefined;
        }
        var cv = document.createElement("canvas");
        if (parent === undefined) {
            document.body.appendChild(cv);
        } else {
            parent.appendChild(cv);
        }
        if (width !== undefined) cv.width = width;
        if (height !== undefined) cv.height = height;
        return cv;
    }
    function createHiddenSketchpad(width, height) {
        var cv = document.createElement("canvas");
        if (width !== undefined) cv.width = width;
        if (height !== undefined) cv.height = height;
        return cv;
    }
    function loadImage(src, callback) {
        var img = new Image();
        img.src = app.config.ASSET_URL + src;
        //FIXME: type?
        img.loaded = false;
        img.onload = function() {
            img.loaded = true;
            if (callback) callback(img);
        };
        return img;
    }
    function createAudio() {
        return document.createElement("audio");
    }
    exports.createSketchpad = createSketchpad;
    exports.loadImage = loadImage;
    exports.createAudio = createAudio;
    exports.createHiddenSketchpad = createHiddenSketchpad;
});
