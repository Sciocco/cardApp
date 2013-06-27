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