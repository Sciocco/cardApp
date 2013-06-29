define(function(require, exports, module) {

	var viewData = require("./viewData");

	var statusViewData = viewData.fighterStatus;
	var battleViewData = viewData.battleGroup;
	var rectViewData = viewData.sourceRect;
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
		this.readyGroup = [];
		this.waitGroup = new createjs.Container().set(viewData['waitGroup']);
		this.fightGroup = new createjs.Container().set(viewData['fightGroup']);
		this.runeGroup = new createjs.Container().set(viewData['runeGroup']);
		this.diedFighter = new createjs.Container().set(viewData['diedFighter']);
		this.addChild(this.waitGroup, this.fightGroup, this.runeGroup, this.diedFighter);
	};

	p.entranceAnimation = function(fighter, x) {

		if (fighter.status == statusViewData.FIGHT) {
			fighter.set({
				x: x
			});
		} else if (fighter.status === statusViewData.WAIT) {
			createjs.Tween.get(fighter).to({
				x: x
			}, battleViewData.speed['fast']);
		}
	};


	p.addFighter = function(fighter) {
		var _this = this;
		//增加点击事件
		fighter.addEventListener('click', this.proxy(this.fighterHandler));
		this.toggleWaitStatus(fighter);
	};


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

		if (fighter.status === statusViewData.READY_BEFORE) {

			this.battleView.handButton.sourceRect = rectViewData.handNormalRect;

			//将状态切换到准备状态
			fighter.toggleStatus(statusViewData.READY);

			//克隆一个战斗者存放在准备组并且添加到等待组
			var newFighter = fighter.clone(true);
			newFighter.addEventListener('click', this.proxy(this.fighterHandler));
			newFighter.originalFighter = fighter;
			newFighter.status = statusViewData.READY;

			//
			this.readyGroup.push(newFighter);
			this.waitGroup.addChild(newFighter);
			//切换战斗状态将战斗者放到战斗区
			var _this = this;

			var callback = function() {
				_this.toggleFightStatus(fighter);
			};

			//检查战斗组是否有战斗者,确定fighter的x和y
			var showNums = battleViewData.showNums;
			var length = this.fightGroup.getNumChildren();

			if (length < showNums) {
				callback();
			} else {

				var step = length - showNums,
					x;
				i = 0;
				var _moveFighter = function() {
					if (step < 0) {
						return;
					}
					_this.fightGroup.getChildAt(i).visible = 0;

					x = _this.forwardFightGroupXY();

					if (step === 0) {
						createjs.Tween.get(_this.fightGroup).to({
							x: x
						}, battleViewData.speed['normal']).call(callback);
					} else {
						createjs.Tween.get(_this.fightGroup).to({
							x: x
						}, battleViewData.speed['normal']).call(_moveFighter);
					}

					step--;
					i++;
				};
				_moveFighter();
			}

		} else if (fighter.status === statusViewData.READY) {

			if (!fighter.originalFighter) {
				return;
			}

			//将战斗者放回等待区
			fighter.originalFighter.x = fighter.x;
			fighter.originalFighter.y = fighter.y;

			//移除clone的战斗者
			this.removeReadyFighter(fighter);
			this.waitGroup.removeChild(fighter);


			if (this.readyGroup.length === 0) {
				this.battleView.handButton.sourceRect = rectViewData.turnNormalRect;
			}

			//切回等待状态和更改为准备前状态
			this.toggleReadyBeforeStatus(fighter.originalFighter);

		} else if (fighter.status !== statusViewData.SHOW) {
			var stage = this.getStage();
			var container = fighter.showStatus();
			stage.addChild(container);
			createjs.Ticker.setPaused(true);
			stage.update();
		}
	};


	p.removeReadyFighter = function(fighter) {
		var _this = this;
		this.readyGroup.forEach(function(v, k) {
			if (fighter === v) {
				_this.readyGroup.splice(k, 1);
			}
		});
	};


	p.toggleFightStatus = function(fighter) {
		fighter.toggleStatus(statusViewData.FIGHT);
		this.setFighterXY(this.fightGroup, fighter);
		this.fightGroup.addChild(fighter);
	};


	p.toggleReadyBeforeStatus = function(fighter) {
		var _this = this;
		var callback = function() {
			//移除战斗区的战斗者
			_this.fightGroup.removeChild(fighter.originalFighter);
			fighter.toggleStatus(statusViewData.READY_BEFORE);
			_this.waitGroup.addChild(fighter);
		};

		var showNums = battleViewData.showNums;
		var index = this.fightGroup.getChildIndex(fighter);

		//如果后面的不存在则 直接执行
		if (index >= showNums) {
			//step 是要移动的步数
			var step = index - showNums,
				x;
			var _moveFighter = function() {
				if (step < 0) {
					return;
				}

				_this.fightGroup.getChildAt(step).visible = 1;

				x = _this.backwardFightGroupXY();

				if (step === 0) {
					createjs.Tween.get(_this.fightGroup).to({
						x: x
					}, battleViewData.speed['normal']).call(callback);
				} else {
					createjs.Tween.get(_this.fightGroup).to({
						x: x
					}, battleViewData.speed['normal']).call(_moveFighter);
				}

				step--;
			};
			_moveFighter();
		} else {
			callback();
		}
	};

	p.toggleWaitStatus = function(fighter) {
		//修改坐标
		fighter.toggleStatus(statusViewData.WAIT);
		this.setFighterXY(this.waitGroup, fighter);
		//增加到等待组
		this.waitGroup.addChild(fighter);
	};


	p.fighterActionsAttack = function(fighter, actions, callback) {
		var _this = this;
		var action = actions.shift();
		var targets = action.targets;

		var func;
		var target;

		fighter.addAttackEffect();
		//攻击动画
		createjs.Tween.get(fighter).to({
			y: fighter.y + 15
		}, 100).to({
			y: fighter.y
		}, 100).call(function() {

			fighter.removeAttackEffect();

			if (actions.length === 0) {
				func = function() {
					callback();
				};
			} else {
				func = function() {
					_this.fighterActionsAttack(fighter, actions, callback);
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
			_this.fighterActionsAttack(fighter, actions, callback);
		};

		var showNums = battleViewData.showNums;

		var index = this.fightGroup.getChildIndex(fighter);

		//lastMoveiNDEX  待删除

		if (index >= showNums) {

			callback = this.proxy(this.backFighter, fighter, callback);

			//step 是要移动的步数  1 是牌数
			var i = index - showNums,
				x;

			this.fightGroup.getChildAt(i).visible = 0;

			x = _this.forwardFightGroupXY();

			createjs.Tween.get(this.fightGroup).to({
				x: x
			}, battleViewData.speed['normal']).call(fight, [callback]);

		} else {
			fight(callback);
		}
	};



	p.launchRune = function(fighter, actions, callback) {
		var _this = this;

		var func = function() {
			fighter.currNums++;

			_this.actionsAttack(actions, callback);

			if (fighter.currNums === fighter.model["nums"]) {
				fighter.fireEnd();
			}
		};

		if (fighter.currNums === 0) {
			fighter.fireStart();
			setTimeout(func, 500);
		} else {
			func();
		}

	};


	p.actionsAttack = function(actions, callback) {
		var _this = this;
		var action = actions.shift();
		var targets = action.targets;

		var func;
		var target;

		if (actions.length === 0) {
			func = function() {
				callback();
			};
		} else {
			func = function() {
				_this.actionsAttack(actions, callback);
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
	};


	p.backFighter = function(fighter, callback) {

		var showNums = battleViewData.showNums;

		var _this = this;

		var index = this.fightGroup.getChildIndex(fighter);

		//如果后面的不存在则 直接执行
		if (this.fightGroup.getChildAt(index + 1) === undefined && index >= showNums) {

			//step 是要移动的步数
			var step = index - showNums,
				x;
			var _moveFighter = function() {
				if (step < 0) {
					return;
				}

				_this.fightGroup.getChildAt(step).visible = 1;

				x = _this.backwardFightGroupXY();

				if (step === 0) {
					createjs.Tween.get(_this.fightGroup).to({
						x: x
					}, battleViewData.speed['normal']).call(callback);
				} else {
					createjs.Tween.get(_this.fightGroup).to({
						x: x
					}, battleViewData.speed['normal']).call(_moveFighter);
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