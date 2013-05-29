define(function(require, exports, module) {

	var appModel = require("../models/appModel");

	var soundManager, p;

	var ON_SOUND = 1;
	var OFF_SOUND = 2;
	var BG_SOUND = "bgSound";

	function SoundManager() {
		this.bgSoundStatus = appModel.getValue("bgSoundStatus") || ON_SOUND;
		this.effectSoundStatus = appModel.getValue("effectSoundStatus") || ON_SOUND;
	}

	SoundManager.sounds = {};

	p = SoundManager.prototype;

	p.addSound = function(key, instance) {
		SoundManager.sounds[key] = instance;
	};

	p.stopSound = function(key) {
		var instance = null;

		if (key in SoundManager.sounds) {
			instance = SoundManager.sounds[key];
			instance.stop();
		}
		return instance;
	};


	p.playEffectSound = function(key) {
		var instance = null;

		if (key in SoundManager.sounds && this.effectSoundStatus === ON_SOUND) {
			instance = SoundManager.sounds[key];
			instance.play();
		}
		return instance;
	};

	p.playBgSound = function() {
		var instance = null;

		if (this.bgSoundStatus === ON_SOUND) {
			instance = SoundManager.sounds[BG_SOUND];
			instance.play(createjs.Sound.INTERRUPT_ANY, 0, 0, -1);
		}
		return instance;
	};

	p.toggleBgSound = function() {

		if (this.bgSoundStatus === ON_SOUND) {
			this.bgSoundStatus = OFF_SOUND;
			this.stopSound(BG_SOUND);
		} else {
			this.bgSoundStatus = ON_SOUND;
			this.playBgSound();
		}

		appModel.setValue("bgSoundStatus", this.bgSoundStatus);

	};

	p.toggleEffectSound = function() {

		if (this.effectSoundStatus === ON_SOUND) {
			this.effectSoundStatus = OFF_SOUND;
		} else {
			this.effectSoundStatus = ON_SOUND;
		}
		appModel.setValue("effectSoundStatus", this.effectSoundStatus);

	};

	soundManager = new SoundManager();
	soundManager.BG_SOUND = BG_SOUND;
	module.exports = soundManager;
});