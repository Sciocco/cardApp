define("app/panels/dungeonPanel", [], function(require, exports, module) {
    var Controller = Spine.Controller.sub({
        el: "#dungeonPanel",
        transition: "slide",
        init: function() {
            var _this = this;
            $("#enterFight").delegate("a", "click", function() {
                var route = $(this).attr("href");
                _this.parent.enterBattle(route);
            });
        }
    });
    var controller = new Controller();
    module.exports = controller;
});