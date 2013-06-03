define("app/utils/panelManager-debug", [ "../mvc/stack-debug", "../mvc/manager-debug", "../ui/transitionManager-debug", "../ui/noTransition-debug", "../ui/jq.css3animate-debug", "../ui/slideTransition-debug", "../ui/slideDownTransition-debug", "../panels/dungeonPanel-debug", "../panels/fightPanel-debug", "../panels/mainPanel-debug" ], function(require, exports, module) {
    var SpineStack = require("../mvc/stack-debug");
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
                    var dungeonPanel = require("../panels/dungeonPanel-debug");
                    _this.addChild("dungeon", dungeonPanel);
                    break;

                  case "/panel/fight":
                    var fightPanel = require("../panels/fightPanel-debug");
                    _this.addChild("fight", fightPanel);
                    break;
                }
                _this.navigate(route);
            });
            this.on("contentLoad", this.proxy(this.contentLoad));
        },
        contentLoad: function() {
            var mainPanel = require("../panels/mainPanel-debug");
            this.addChild("main", mainPanel);
            this.navigate("/panel/main", true);
        }
    });
    var controller = new Controller();
    module.exports = controller;
});