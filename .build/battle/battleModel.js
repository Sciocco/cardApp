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