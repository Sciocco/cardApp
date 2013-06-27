define("app/mvc/createjs.extend", [], function(require, exports, module) {
    var stageMouseDownHandler = createjs.Stage.prototype._handlePointerDown;
    var stageMouseUpHandler = createjs.Stage.prototype._handlePointerUp;
    if (navigator.userAgent.indexOf("Android") > -1) {
        createjs.Stage.prototype._handlePointerDown = function(id, event, clear) {
            if (typeof event.x != "undefined") {
                event.screenX = event.x;
                event.screenY = event.y;
                stageMouseDownHandler.call(this, id, event, clear);
            }
        };
        createjs.Stage.prototype._handlePointerUp = function(id, event, clear) {
            if (typeof event.x != "undefined") {
                event.screenX = event.x;
                event.screenY = event.y;
                stageMouseUpHandler.call(this, id, event, clear);
            }
        };
    }
    createjs.DisplayObject.prototype.proxy = function(func) {
        var _this = this;
        var aArgs = Array.prototype.slice.call(arguments, 1);
        return function() {
            return func.apply(_this, Array.prototype.slice.call(arguments, 0).concat(aArgs));
        };
    };
});