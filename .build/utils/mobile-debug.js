define("app/utils/mobile-debug", [ "../config/consts-debug" ], function(require, exports, module) {
    //更多参加 zepto.extend.js
    var pageSize = require("../config/consts-debug").pageSize;
    var canvasRadio = {};
    /**
	 * [getWidth 获取屏幕宽度]
	 * @return {[type]} [description]
	 */
    function getPageWidth() {
        var xWidth = null;
        if (window.innerWidth !== null) {
            xWidth = window.innerWidth;
        } else {
            xWidth = document.body.clientWidth;
        }
        return xWidth;
    }
    function getPageHeight() {
        var xHeight = null;
        if (window.innerHeight !== null) {
            xHeight = window.innerHeight;
        } else {
            xHeight = document.body.clientHeight;
        }
        return xHeight;
    }
    function init() {
        //当前密度的缩放比例
        var width = getPageWidth();
        var height = getPageHeight();
        canvasRadio.width = canvasRadio.height = width / pageSize.WIDTH;
    }
    init();
    exports.canvasRadio = canvasRadio;
});