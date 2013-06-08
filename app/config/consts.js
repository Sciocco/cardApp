define(function(require, exports, module) {
	module.exports = {
		element: {
			FIGHTGROUP: {
				WIDTH: 640,
				HEIGHT: 438
			},
			ATTACK_CARD: {
				WIDTH: 140,
				HEIGHT: 180
			},
			READY_CARD: {
				WIDTH: 110,
				HEIGHT: 110
			},
			ROLE: {
				WIDTH: 110,
				HEIGHT: 110
			}
		},
		entityType: {
			PLAYER: 'player',
			FIGHTER: 'fighter',
			EQUIPMENT: 'equipment',
			ITEM: 'item'
		},
		fighterStatus: {
			FIGHT: "fight",
			READY: "ready",
			DIE: "die"
		}

	};
});