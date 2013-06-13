define(function(require, exports, module) {

	var app = window.APP;
	var viewData = require('./viewData');

	var Module = Spine.Module.sub(Spine.Events);

	var p = Module.prototype;

	p.currentRound = null; //当前回合方
	p.turnIndex = 0; //当前回合数
	p.currentAction = null; //当前动作
	p.actionList = null; //动作列表
	p.actionIndexInTurn = null; //当前动作索引

	p.error = null; //错误数

	//EVENT
	p.EVENT_START_ERROR = "startError";
	p.EVENT_START = "start";

	p.initialize = function(data) {

		this.resultHandle(data.result);

		if (this.error !== null) {
			this.trigger(this.EVENT_START_ERROR);
			return;
		}

		this.roleHandle(data.roles);
		this.waitsHandle(data.waits);
		this.actionsHandle(data.actionList);
	};

	p.roleHandle = function(data) {
		this.playerRole = data.p;
		this.enemyRole = data.e;
	};

	p.runeHandle = function() {

	};

	p.waitsHandle = function(data) {
		this.playerWaits = data.p;
		this.enemyWaits = data.e;
	};

	p.actionsHandle = function(data) {
		this.actionList = data;
	};

	p._nextTurn = function() {
		this.turnIndex++;
		this.actionList = [];
		this.actionIndexInTurn = 0;

		// module.trigger(module.EVENT_TURN_READY);
	};
	


	p.resultHandle = function(data) {
		if (typeof data.noPhysical !== 'undefined' && data.noPhysical === true) {
			this.error = "体力不足";
		}
		if (typeof data.fightEnd !== 'undefined') {

		}
		if (typeof data.start !== "undefined") {
			this.currRound = 0;
		}
	};


	/**
	 * [开始请求]
	 * @return {[type]} [description]
	 */
	p.start = function(callback) {
		var _this = this;
		$.ajax({
			type: "GET",
			url: 'http://192.168.1.88:88/cardApp/assets/testdata/fightStart.json',
			beforeSend: app.ajaxLoading,
			success: function(data) {
				app.ajaxLoadingEnd();
				_this.initialize(data);
				if (_this.error === null) {
					callback();
				}
			},
			error: function() {
				app.ajaxLoadingEnd();
				_this.error = "数据加载失败";
				_this.trigger(_this.EVENT_START_ERROR);
			}
		});
	};



	var battleModel = new Module();
	module.exports = battleModel;
});