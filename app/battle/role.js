define(function(require, exports, module) {
	var utils = require('../utils/utils');
	var viewData = require("./viewData");
	var battleViewData = viewData.battleGroup;
	var rectViewData = viewData.sourceRect;
	var fontNormal = battleViewData.font.normal;

	var roleSex = require('../config/consts').roleSex;

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
		this.model['currHp'] = this.model['hp'];

		this.hpTextShapeRadio = battleViewData.hpShape.width / this.model['hp'];

		this.addAvatar();
		this.name = new createjs.Text(this.model['name'], fontNormal, "#fff");
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

		this.lessHp.set({
			x: 75,
			y: 75,
			alpha: 0
		});

		if (viewData.hpShape.turn === true) {
			this.hpShape.regX = battleViewData.hpShape.width;
			this.hpShape.scaleX = -1;
		}
	};

	p.addAvatar = function() {
		var _this = this;
		if (this.model['currentFighter'] === battleViewData.fighters.player || this.model['avatar']) {

			this.avatar = new createjs.Bitmap(preload.getResult("avatar")).set({
				x: battleViewData.avatar.x,
				y: battleViewData.avatar.y
			});

			if (this.model['avatar'] === roleSex.MAN) {

				this.avatar.sourceRect = rectViewData.manAvatarRect;

			} else if (this.model['avatar'] === roleSex.WOMAN) {
				this.avatar.sourceRect = rectViewData.womanAvatarRect;
			}


			this.avatar.scaleX = 0.92;
			this.avatar.scaleY = 0.9;

			this.addChildAt(this.avatar, 0);

		} else if (this.model['currentFighter'] === battleViewData.fighters.enemy) {
			var createFighterFigure = function(img) {
				_this.avatar = new createjs.Bitmap(img).set({
					x: battleViewData.avatar.x,
					y: battleViewData.avatar.y
				});


				_this.avatar.scaleX = 0.92;
				_this.avatar.scaleY = 0.9;


				_this.addChildAt(_this.avatar, 0);
			};
			var src = "images/card/small/fA" + this.model['entityId'] + ".png";
			utils.loadImage(src, createFighterFigure);
		}

	};

	p.addHp = function() {

		this.hpShape = new createjs.Shape();

		this.drawHpShape(battleViewData.hpShape.width);

		this.hpText = new createjs.Text(this.model['hp'] + "/" + this.model['hp'], fontNormal, "#fff");

		this.lessHp = new createjs.Text('', fontNormal, "#ff0000");

		this.addChild(this.hpShape, this.hpText, this.lessHp);
	};


	p.hit = function(callback) {
		var data = this.hitData;

		var skill = data.skill;

		skill.scaleX = 0.9;
		skill.scaleY = 0.6;
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


			_this.hpText.text = _this.model['currHp'] + "/" + _this.model['hp'];
			var width = _this.hpTextShapeRadio * _this.model['currHp'];
			_this.drawHpShape(width);


			createjs.Tween.get(_this.lessHp).to({
				alpha: 0,
				y: _this.lessHp.y - 50
			}, battleViewData.speed['normal']).call(function() {
				_this.lessHp.y = _this.lessHp.y + 50;
			});

			//目标有无防御技能

			//掉血

			//目标受到攻击后的动作

			//buffer

			//如果当前攻击者有buffer,则去掉buffer  然后掉血


			if (callback !== undefined) {
				callback();
			}
		});

		skill.gotoAndPlay('all');



	};


	p.drawHpShape = function(width) {
		this.hpShape.graphics.clear().beginFill("#990000").drawRect(0, 0, Math.floor(width), battleViewData.hpShape.height);
	};

	module.exports = Role;
});