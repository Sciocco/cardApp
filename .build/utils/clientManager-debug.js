define("app/utils/clientManager-debug", [ "../mvc/route-debug", "../mvc/stack-debug", "../mvc/manager-debug", "../ui/transitionManager-debug", "../ui/noTransition-debug", "../ui/jq.css3animate-debug", "../ui/slideTransition-debug", "../ui/slideDownTransition-debug", "../pages/loginPage-debug", "../panels/loginPanel-debug", "../panels/serverPanel-debug", "../pages/gamePage-debug", "../panels/dungeonPanel-debug", "../panels/fightPanel-debug", "../panels/mainPanel-debug", "../panels/battlePanel-debug", "../config/consts-debug", "./mobile-debug", "../battle/battleModel-debug", "../battle/viewData-debug", "../battle/battleView-debug", "../mvc/createjs.extend-debug", "../battle/playerGroup-debug", "../battle/battleGroup-debug", "../battle/effect-debug", "../battle/enemyGroup-debug", "../battle/fighter-debug", "./utils-debug", "../battle/role-debug", "../battle/rune-debug", "../battle/skill-debug", "./dataApi-debug", "../battle/turnPointer-debug", "./utils-debug.js" ], function(require, exports, module) {
    require("../mvc/route-debug");
    var SpineStack = require("../mvc/stack-debug");
    var loginPage = require("../pages/loginPage-debug");
    var ClientManager = SpineStack.sub({
        el: "#g-doc",
        controllers: {
            login: loginPage
        },
        routes: {
            "/page/login": "login",
            "/page/game": "game"
        },
        "default": "/page/login",
        init: function() {
            //初始化路由,兼容手机版本去除history
            Spine.Route.setup({
                trigger: true,
                history: false,
                shim: true,
                replace: false
            });
            this["default"] = "/page/game";
            this.bind("defaultRoute", this.proxy(this.enterGame));
        },
        enterGame: function() {
            var gamePage = require("../pages/gamePage-debug");
            this.addChild("game", gamePage);
            this.navigate("/page/game", true);
        }
    });
    function run() {
        var clientManager = new ClientManager();
        return clientManager;
    }
    exports.run = run;
});