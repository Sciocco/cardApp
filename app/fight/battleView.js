define(function(require, exports, module) {

	var Module = Spine.Module.sub(null, Spine.Events);
	var view = new Module();

	view.EVENT_READY = "battleViewReady"; // view was initialized
	view.EVENT_READY_TO_ENGAGE = "battleViewReadyToEngage"; // intro was done
	view.EVENT_TURN_ACTIONS_SET = "turnActionsSet";
	view.EVENT_PERFORM_ACTION = "performAction";
	view.EVENT_ACTION_DONE = "actionDone";
	view.EVENT_OUTRO_DONE = "outroDone"; // battle final status displayed, ready to quit

	var stage;

	view.init = function(pCanvas) {
		stage = new createjs.Stage(pCanvas);
		createjs.Ticker.setFPS(40);
		createjs.Ticker.addEventListener("tick", handleTick);

		initStage();
		view.trigger(view.EVENT_READY);
	};


	function handleTick() {
		stage.update();
	}

	function initStage() {
		drawBackground();
		fightersContainer = new createjs.Container();
		stage.addChild(fightersContainer);
	}


});