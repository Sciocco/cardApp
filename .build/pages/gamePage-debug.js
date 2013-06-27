define("app/pages/gamePage-debug", [ "../mvc/stack-debug", "../mvc/manager-debug", "../ui/transitionManager-debug", "../ui/noTransition-debug", "../ui/jq.css3animate-debug", "../ui/slideTransition-debug", "../ui/slideDownTransition-debug", "../panels/dungeonPanel-debug", "../panels/fightPanel-debug", "../panels/mainPanel-debug", "../panels/battlePanel-debug", "../config/consts-debug", "../utils/mobile-debug", "../battle/battleModel-debug", "../battle/viewData-debug", "../battle/battleView-debug", "../mvc/createjs.extend-debug", "../battle/playerGroup-debug", "../battle/battleGroup-debug", "../battle/effect-debug", "../battle/enemyGroup-debug", "../battle/fighter-debug", "../utils/utils-debug", "../battle/role-debug", "../battle/rune-debug", "../battle/skill-debug", "../utils/dataApi-debug", "../battle/turnPointer-debug", "../utils/utils-debug.js" ], function(require, exports, module) {
    var SpineStack = require("../mvc/stack-debug");
    var Controller = SpineStack.sub({
        el: "#gamePage",
        transition: "down",
        routes: {
            "/panel/main": "main",
            "/panel/dungeon": "dungeon",
            "/panel/battle/:fb1/:fb2": "battle"
        },
        init: function() {
            var _this = this;
            $("#navbar").delegate("a", "click", function() {
                var route = $(this).attr("href");
                switch (route) {
                  case "#/panel/dungeon":
                    var dungeonPanel = require("../panels/dungeonPanel-debug");
                    _this.addChild("dungeon", dungeonPanel);
                    break;

                  case "#/panel/fight":
                    var fightPanel = require("../panels/fightPanel-debug");
                    _this.addChild("fight", fightPanel);
                    break;
                }
                _this.navigate(route);
            });
            this.bind("contentLoad", this.proxy(this.enterBattle));
        },
        contentLoad: function() {
            var mainPanel = require("../panels/mainPanel-debug");
            this.addChild("main", mainPanel);
            this.navigate("/panel/main", true);
        },
        enterBattle: function(route) {
            var route = "/panel/battle/1/2";
            var battlePanel = require("../panels/battlePanel-debug");
            this.addChild("battle", battlePanel);
            this.navigate(route, true);
        }
    });
    var controller = new Controller();
    module.exports = controller;
});