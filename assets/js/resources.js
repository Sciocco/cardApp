(function() {
	var app = window.APP;
	var i;
	var skill = [];
	var rune = [];

	for (i = 1; i <= 4; i++) {
		skill.push({
			id: "skill-" + i,
			src: "images/skill/" + i + ".png"
		});
		skill.push({
			id: "skill-sprite-" + i,
			src: "images/skill/" + i + ".json"
		});
	}

	for (i = 1; i <= 48; i++) {
		rune.push({
			id: "rune-" + i,
			src: "images/rune/" + i + ".png"
		});
	}

	app.resources = {
		sounds: [{
				id: "bgSound",
				src: "sound/M-GameBG.ogg"
			}
		],
		images: [{
				id: "battleBg",
				src: "images/battleBg.jpg"
			}, {
				id: "avatar",
				src: "images/avatar.png"
			}, {
				id: "fightButton",
				src: "images/fightButton.png"
			}, {
				id: "fighterAttack",
				src: "images/effect/fighterAttack.png"
			}, {
				id: "fighterReady",
				src: "images/effect/fighterReady.png"
			}, {
				id: "fighterReady-sprite",
				src: "images/effect/fighterReady.json"
			}, {
				id: "runeAttack",
				src: "images/effect/runeAttack.png"
			}, {
				id: "runeAttack-sprite",
				src: "images/effect/runeAttack.json"
			}, {
				id: "runeFire-1",
				src: "images/effect/runeFire-1.png"
			}, {
				id: "runeFire-sprite-1",
				src: "images/effect/runeFire-1.json"
			}, {
				id: "runeFire-2",
				src: "images/effect/runeFire-2.png"
			}, {
				id: "runeFire-sprite-2",
				src: "images/effect/runeFire-2.json"
			}, {
				id: "runeFire-3",
				src: "images/effect/runeFire-3.png"
			}, {
				id: "runeFire-sprite-3",
				src: "images/effect/runeFire-3.json"
			}, {
				id: "runeFire-4",
				src: "images/effect/runeFire-4.png"
			}, {
				id: "runeFire-sprite-4",
				src: "images/effect/runeFire-4.json"
			}, {
				id: "star-1",
				src: "images/star/1.png"
			}, {
				id: "star-2",
				src: "images/star/2.png"
			}, {
				id: "star-3",
				src: "images/star/3.png"
			}, {
				id: "star-4",
				src: "images/star/4.png"
			}, {
				id: "star-5",
				src: "images/star/5.png"
			}, {
				id: "turn-pointer",
				src: "images/turnpointer/pointer.png"
			}, {
				id: "turn-pointerBg",
				src: "images/turnpointer/pointerBg.png"
			}, {
				id: "turn-pointerInfo",
				src: "images/turnpointer/pointerInfo.png"
			}
		],
		figureFrame: [{
				id: "cardFrame-wait",
				src: "images/figureFrame/wait.png"
			}, {
				id: "cardFrame-large-1",
				src: "images/figureFrame/large-1.png"
			}, {
				id: "cardFrame-large-2",
				src: "images/figureFrame/large-2.png"
			}, {
				id: "cardFrame-large-3",
				src: "images/figureFrame/large-3.png"
			}, {
				id: "cardFrame-large-4",
				src: "images/figureFrame/large-4.png"
			}, {
				id: "cardFrame-normal-1",
				src: "images/figureFrame/normal-1.png"
			}, {
				id: "cardFrame-normal-2",
				src: "images/figureFrame/normal-2.png"
			}, {
				id: "cardFrame-normal-3",
				src: "images/figureFrame/normal-3.png"
			}, {
				id: "cardFrame-normal-4",
				src: "images/figureFrame/normal-4.png"
			}, {
				id: "runeFrame-1",
				src: "images/figureFrame/rune-1.png"
			}, {
				id: "runeFrame-2",
				src: "images/figureFrame/rune-2.png"
			}, {
				id: "runeFrame-3",
				src: "images/figureFrame/rune-3.png"
			}, {
				id: "runeFrame-4",
				src: "images/figureFrame/rune-4.png"
			}
		],
		skill: skill,
		rune: rune,
		config: [{
				id: "characterData",
				src: 'config/character.json'
			}, {
				id: "fightskillData",
				src: "config/fightskill.json"
			}, {
				id: "runeData",
				src: "config/rune.json"
			}
		],
		scripts: ['js/app.js'],
		styles: ['css/app.css']
	};
})();