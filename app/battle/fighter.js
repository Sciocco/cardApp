define(function(require, exports, module) {

	var utils = require('../utils/utils');

	var viewData = require("./viewData");
	var statusViewData = viewData.fighterStatus;
	var rectViewData = viewData.sourceRect;
	var battleViewData = viewData.battleGroup;
	var fontNormal = battleViewData.font.normal;
	var fontLarge = battleViewData.font.large;

	var effect = require("./effect");
	var fighterAttackEffect = effect.fighterAttackEffect;
	var FighterReadyEffect = effect.FighterReadyEffect;


	var preload = window.APP.preload;


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

			this.waitFighterFigure = new createjs.Bitmap(preload.getResult("card-small-" + this.model['entityId']));

			this.waitFrame = new createjs.Bitmap(preload.getResult("cardFrame-wait"));

			this.atk = new createjs.Text(this.model['atk'], fontNormal, "#fff");

			this.hp = new createjs.Text(this.model['hp'], fontNormal, "#fff");

			this.currWaitTime = new createjs.Text(this.model['currWaitTime'], fontNormal, "#fff");


			this.waitFighterContainer.scaleX = 0.98;
			this.waitFighterContainer.scaleY = 0.92;

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

		this.waitFighterContainer.removeChild(this.canelFighterFigure);
		this.waitFighterContainer.addChildAt(this.waitFighterFigure);
		this.waitFighterContainer.addChild(this.atk);
		this.waitFighterContainer.addChild(this.hp);
		this.addChild(this.waitFighterContainer);
	};

	p.fightStatus = function() {

		this.removeAllChildren();

		if (!this.fightFighterContainer) {
			this.fightFighterContainer = new createjs.Container();

			this.fightFighterFigure = new createjs.Bitmap(preload.getResult("card-normal-" + this.model['entityId']));
			this.fightFrame = new createjs.Bitmap(preload.getResult("cardFrame-normal-" + this.model['country']));

			this.currHp = new createjs.Text(this.model['currHp'], fontNormal, "#fff");
			this.currHp.addEventListener('tick', function(event) {
				event.target.text = Math.ceil(event.target.text);
			});

			this.currAtk = new createjs.Text(this.model['currAtk'], fontNormal, "#fff");

			if (!this.level) {
				this.level = new createjs.Text(this.model["level"], fontNormal, "#fff");
			}

			if (!this.name) {
				this.name = new createjs.Text(this.model["name"], fontNormal, "#fff");
			}


			this.lessHp = new createjs.Text('', fontLarge, "#ff0000").set({
				x: 50,
				y: 152,
				alpha: 0
			});

			this.fightFighterContainer.scaleX = 0.99;
			this.fightFighterContainer.scaleY = 0.95;

			this.fightFighterContainer.addChild(this.fightFighterFigure);
			this.fightFighterContainer.addChild(this.fightFrame);
			this.fightFighterContainer.addChild(this.currAtk);
			this.fightFighterContainer.addChild(this.currHp);
			this.fightFighterContainer.addChild(this.lessHp);
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


	p.hideShowFighter = function() {
		var stage = this.getStage();
		if (this.waitFighterContainer) {
			this.atk.set({
				x: 40,
				y: 77
			});
			this.hp.set({
				x: 40,
				y: 97
			});

			this.waitFighterContainer.addChild(this.atk);
			this.waitFighterContainer.addChild(this.hp);

		}

		if (this.fightFighterContainer) {

			this.name.set({
				x: 50,
				y: 0,
				font: fontNormal
			});

			this.level.set({
				x: 65,
				y: 20
			});

			this.fightFighterContainer.addChild(this.name);
			this.fightFighterContainer.addChild(this.level);
		}

		stage.removeChild(this.showFighterContainer);
		createjs.Ticker.setPaused(false);
	};



	/**
	 * []
	 * @return {[type]} [description]
	 */
	p.showStatus = function() {

		if (!this.showFighterContainer) {

			this.showFighterContainer = new createjs.Container();

			this.showFighterContainer.fighter = this;

			this.showFighterContainer.addEventListener('click', this.proxy(this.hideShowFighter));

			this.showBg = new createjs.Shape();
			this.showBg.graphics.beginFill("#000").drawRect(0, 0, battleViewData.stage.width, battleViewData.stage.height);

			this.showFighterFigure = new createjs.Bitmap(preload.getResult("card-large-" + this.model['entityId']));

			this.showFrame = new createjs.Bitmap(preload.getResult("cardFrame-large-" + this.model['country']));

			this.fightskill = new createjs.Text(this.model["fightskill"], fontLarge, "#fff").set({
				x: 0,
				y: 560
			});

			this.waitTime = new createjs.Text(this.model['waitTime'], fontNormal, "#fff");
			this.cost = new createjs.Text(this.model['cost'], fontLarge, "#fff").set({
				x: 250,
				y: 45
			});
			this.star = new createjs.Bitmap(preload.getResult("star-" + this.model['star'])).set({
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

		this.showFighterContainer.set({
			x: 0,
			y: 0
		});

		this.name.set({
			x: 116,
			y: 0,
			font: fontLarge
		});

		this.waitTime.set({
			x: 13,
			y: 355,
			font: fontLarge
		});

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

		return this.showFighterContainer;
	};

	p.readyBeforeStatus = function() {
		if (this.status !== statusViewData.WAIT) {
			this.toggleStatus(statusViewData.WAIT);
		}

		if (!this.readyEffect) {
			this.addReadyEffect();
		} else {
			this.waitFighterContainer.addChild(this.readyEffect);
		}
	};

	p.readyStatus = function() {
		var diedFigure = this.getDiedFighterFigure();
		this.waitFighterContainer.removeChild(this.waitFighterFigure);
		this.waitFighterContainer.addChildAt(diedFigure);
	};

	p.diedStatus = function() {
		this.removeChild(this.fighterData);
		var diedFigure = this.getDiedFighterFigure();

		this.addChild(diedFigure);
	};

	p.getDiedFighterFigure = function() {

		if (!this.canelFighterFigure) {

			var figureImg = preload.getResult("card-small-" + this.model['entityId']);
			this.canelFighterFigure = new createjs.Bitmap(figureImg);

			var greyScaleFilter = new createjs.ColorMatrixFilter([
				0.33, 0.33, 0.33, 0, 0, // red
				0.33, 0.33, 0.33, 0, 0, // green
				0.33, 0.33, 0.33, 0, 0, // blue
				0, 0, 0, 1, 0 // alpha
			]);

			this.canelFighterFigure.filters = [greyScaleFilter];

			this.canelFighterFigure.cache(0, 0, figureImg.width, figureImg.height);
		}

		return this.canelFighterFigure;
	};


	p.hit = function(callback) {
		var data = this.hitData;

		var skill = data.skill;

		this.addChild(skill);

		var _this = this;

		//减少角色hp
		var currHp = data['hurt'] + this.model['currHp'];
		this.model['currHp'] = currHp <= 0 ? 0 : currHp;

		this.lessHp.set({
			text: data['hurt'],
			alpha: 1
		});

		if (data['hurt'] > 0) {
			this.lessHp.color = "#00FF00";
		} else {
			this.lessHp.color = "#ff0000";
		}


		skill.addEventListener('animationend', function() {

			_this.removeChild(skill);

			if (skill.type !== 4) {

				createjs.Tween.get(_this).to({
					x: _this.x - 10
				}, battleViewData.speed['fast']).to({
					x: _this.x + 10
				}, battleViewData.speed['fast']).to({
					x: _this.x
				}, battleViewData.speed['fast']);
			}

			createjs.Tween.get(_this.currHp).to({
				text: _this.model['currHp']
			}, battleViewData.speed['normal']);

			createjs.Tween.get(_this.lessHp).to({
				alpha: 0,
				y: _this.lessHp.y - 50
			}, battleViewData.speed['normal']).call(function() {
				_this.lessHp.y = _this.lessHp.y + 50;
			});


			if (data.status === 0) {
				//触发死亡事件  ,里面还会根据技能触发死亡后事件
				_this.trigger(this.EVENT_DIED, _this);
			}

			if (callback !== undefined) {
				callback();
			}

			//不能放在技能放完的回调里否则.当点击技能会挂掉

			//如果技能类型不是攻击类型的则不用动
			//


			//目标有无防御技能

			//buffer

			//如果当前攻击者有buffer,则去掉buffer  然后掉血
			//
		});
		skill.gotoAndPlay('all');

	};

	p.toggleStatus = function(status) {
		switch (status) {
			case statusViewData.WAIT:
				this.waitStatus();
				break;
			case statusViewData.FIGHT:
				this.fightStatus();
				break;
			case statusViewData.READY_BEFORE:
				this.readyBeforeStatus();
				break;
			case statusViewData.READY:
				this.readyStatus();
				break;
			case statusViewData.DIED:
				this.diedStatus();
				break;
			case statusViewData.SHOW:
				break;
		}
		this.status = status;
	};


	p.costWaitTime = function() {
		var result = this.model['currWaitTime'] - 1;
		this.model['currWaitTime'] = result < 0 ? 0 : result;
		this.currWaitTime.text = this.model['currWaitTime'];
	};


	p.addReadyEffect = function() {
		this.readyEffect = new FighterReadyEffect().set({
			x: -45,
			y: -45
		});
		this.readyEffect.gotoAndPlay("all");
		this.waitFighterContainer.addChild(this.readyEffect);
	};

	p.removeReadyEffect = function() {
		this.waitFighterContainer.removeChild(this.readyEffect);
	};

	p.addAttackEffect = function() {
		fighterAttackEffect.set({
			x: -15,
			y: -15
		});
		fighterAttackEffect.visible = true;
		this.fightFighterContainer.addChildAt(fighterAttackEffect);
	};

	p.removeAttackEffect = function() {
		this.fightFighterContainer.removeChild(fighterAttackEffect);
		fighterAttackEffect.visible = false;
	};

	module.exports = Fighter;
});