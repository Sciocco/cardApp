define("app/utils/clientManager", [ "../mvc/route", "../mvc/stack", "../mvc/manager", "../ui/transitionManager", "../ui/noTransition", "../ui/jq.css3animate", "../ui/slideTransition", "../ui/slideDownTransition", "../pages/loginPage", "../panels/loginPanel", "../panels/serverPanel", "../pages/gamePage", "../panels/dungeonPanel", "../panels/fightPanel", "../panels/mainPanel", "../panels/battlePanel", "../config/consts", "./mobile", "../battle/battleModel", "../battle/viewData", "../battle/battleView", "../mvc/createjs.extend", "../battle/playerGroup", "../battle/battleGroup", "../battle/effect", "../battle/enemyGroup", "../battle/fighter", "./utils", "../battle/role", "../battle/rune", "../battle/skill", "./dataApi", "../battle/turnPointer", "./utils.js" ], function(require, exports, module) {
    require("../mvc/route");
    var SpineStack = require("../mvc/stack");
    var loginPage = require("../pages/loginPage");
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
            var gamePage = require("../pages/gamePage");
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