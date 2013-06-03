define("app/panels/dungeonPanel-debug", [], function(require, exports, module) {
    var Controller = Spine.Controller.sub({
        el: "#dungeonPanel",
        transition: "slide",
        init: function() {}
    });
    var controller = new Controller();
    module.exports = controller;
});