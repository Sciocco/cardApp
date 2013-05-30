define(function(require, exports, module) {
	//加载插件
	require("ui/zepto.extend");
	require("ui/jq.popup");

	var clientManager = require("utils/clientManager");

	exports.init = function() {
		clientManager.init();
	};
});