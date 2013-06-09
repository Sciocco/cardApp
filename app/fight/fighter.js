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
	 *
	 * opts ={
	 * id,opts
	 * 
	 * 
	 * }
	 * @param {Object} opts
	 * @api public
	 */
	var Fighter = function() {
		this.id = id;
		this.type = entityType.FIGHTER;

		this.level = opts.level;
		this.entityid = opts.entityid;


		this.addAttackEffect();
		this.createEntity();

	};

	var p = Fighter.prototype;

	p.attack = function(){

	};

	p.hit = function(skill){

	};

	p.die = function(){

	};


	p.createEntity = function(){
		var entity = new entity(opts);
		this.addChild(entity);
	};


















	Fighter.prototype = Object.create(Character.prototype);

	/**
	 * Expose 'Player' constructor.
	 */
	module.exports = Fighter;


});