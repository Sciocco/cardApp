define("app/panels/serverPanel", [], function(require, exports, module) {
    var Controller = Spine.Controller.sub({
        el: "#serverPanel",
        init: function() {
            $.selectBox.getOldSelects("selectServer");
            $("#enterGameButton").click(function() {
                enterGame();
            });
        }
    });
    var controller = new Controller();
    function enterGame() {
        controller.parent.parent.enterGame();
    }
    module.exports = controller;
});