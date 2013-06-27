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