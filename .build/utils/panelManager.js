define("app/utils/panelManager", [ "../mvc/stack", "../mvc/manager", "../ui/transitionManager", "../ui/noTransition", "../ui/jq.css3animate", "../ui/slideTransition", "../ui/slideDownTransition", "../panels/dungeonPanel", "../panels/fightPanel", "../panels/mainPanel" ], function(require, exports, module) {
    var SpineStack = require("../mvc/stack");
    var Controller = SpineStack.sub({
        el: "#gamePage",
        transition: "down",
        routes: {
            "/panel/main": "main",
            "/panel/dungeon": "dungeon",
            "/panel/fight": "fight"
        },
        init: function() {
            var _this = this;
            $("#navbar").delegate("a", "click", function() {
                var route = $(this).attr("href").substr(1);
                switch (route) {
                  case "/panel/dungeon":
                    var dungeonPanel = require("../panels/dungeonPanel");
                    _this.addChild("dungeon", dungeonPanel);
                    break;

                  case "/panel/fight":
                    var fightPanel = require("../panels/fightPanel");
                    _this.addChild("fight", fightPanel);
                    break;
                }
                _this.navigate(route);
            });
            this.on("contentLoad", this.proxy(this.contentLoad));
        },
        contentLoad: function() {
            var mainPanel = require("../panels/mainPanel");
            this.addChild("main", mainPanel);
            this.navigate("/panel/main", true);
        }
    });
    var controller = new Controller();
    module.exports = controller;
});