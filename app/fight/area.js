define(function(require, exports, module) {

	var battleModel = require('./battleModel');
	var battleView = require('./battleView');
	var Fighter = require('./fighter');

	var Module = Spine.Module.sub(null,Spine.Events);

	var controller = new Module();

	var p = Area.prototype;

	p.init = function(data, skch) {

		battleModel.bind(battleModel.EVENT_TURN_READY, onTurnReady);
		battleModel.bind(battleModel.EVENT_FIGHTER_ACTION_START, onFighterActionStart);
		battleModel.bind(battleModel.EVENT_BATTLE_ENDED, onBattleEnded);

		battleView.bind(battleView.EVENT_TURN_ACTIONS_SET, onTurnActionsSet);
		battleView.bind(battleView.EVENT_PERFORM_ACTION, onActionBePerformed);
		battleView.bind(battleView.EVENT_ACTION_DONE, onActionDone);
		battleView.bind(battleView.EVENT_READY_TO_ENGAGE, onReadyToEngage);
		battleView.bind(battleView.EVENT_OUTRO_DONE, onOutroDone);

		battleView.bind(battleView.EVENT_READY, function() {
			loadJSON("data/data.json", function(obj) {
				dataDB = obj;
				controller.trigger(controller.EVENT_READY);
			});
		});

		battleView.init(skch);
	};

	p.run = function() {

	};


	module.exports = Area;
});