define(function(require, exports, module) {
	var clientManager = require("utils/clientManager");

	exports.init = function() {
		clientManager.init();
	};
});