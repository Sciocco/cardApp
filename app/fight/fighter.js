define(function(require, exports, module) {
	/**
	 * Module dependencies
	 */
	var Character = require('character');
	var entityType = require('consts').entityType;

	/**
	 * Initialize a new 'Player' with the given 'opts'.
	 * It is common player, not current player
	 * Player inherits Character
	 *
	 * @param {Object} opts
	 * @api public
	 */
	var Fighter = function(opts) {
		this.type = entityType.FIGHTER;
		this.target = null;
		Character.call(this, opts);
	};

	Fighter.prototype = Object.create(Character.prototype);

	/**
	 * Expose 'Player' constructor.
	 */
	module.exports = Fighter;


});