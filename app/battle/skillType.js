define(function(require, exports, module) {

	var viewData = require("./viewData");
	var rectViewData = viewData.sourceRect;
	var skillTypes = viewData.skillTypes;

	var battleViewData = viewData.battleGroup;
	var fontNormal = battleViewData.font.normal;



	var preload = window.APP.preload;

	var SkillType = function(model) {
		this.initialize(model);
	};

	var p = SkillType.prototype = new createjs.Container();

	p.Container_initialize = p.initialize;

	p.initialize = function(model) {
		this.model = model;

		var skillTypeImg = new createjs.Bitmap(preload.getResult('skillType'));
		skillTypeImg.sourceRect = rectViewData[skillTypes[this.model['type']] + "SkillRect"];

		var skillName = new createjs.Text(this.model['name'], fontNormal, "#fff");

		this.addChild(skillTypeImg);
		this.addChild(skillName);
	};


	module.exports = SkillType;

});