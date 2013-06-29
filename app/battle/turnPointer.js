define(function(require, exports, module) {
	var viewData = require("./viewData");
	var battleViewData = viewData.battleGroup;
	var preload = window.APP.preload;

	var turnPointer = new createjs.Container().set({
		x: 571,
		y: 400
	});

	var pointerBg = new createjs.Bitmap(preload.getResult('turn-pointerBg')).set({
		x: 19,
		y: 0
	});

	var pointer = new createjs.Bitmap(preload.getResult('turn-pointer')).set({
		x: 69,
		y: 51,
		regX: 69,
		regY: 17
	});


	var pointerInfo = new createjs.Bitmap(preload.getResult('turn-pointerInfo')).set({
		x: 39,
		y: 14
	});

	var turnIndex = new createjs.Text('', "bold 24px Arial", "#fff").set({
		x: 42,
		y: 36
	});

	turnPointer.addChild(pointerBg, pointer, pointerInfo, turnIndex);

	turnPointer.setTurn = function(index, current) {

		if (index < 10) {
			turnIndex.x = 50;
		} else {
			turnIndex.x = 42;
		}

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