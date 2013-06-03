define("app/utils/clientManager", [ "../mvc/route", "../mvc/stack", "../mvc/manager", "../ui/transitionManager", "../ui/noTransition", "../ui/jq.css3animate", "../ui/slideTransition", "../ui/slideDownTransition", "../pages/loginPage", "./panelManager", "../panels/dungeonPanel", "../panels/fightPanel", "../panels/mainPanel" ], function(require, exports, module) {
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
            "/page/game": "game",
            "/page/fight": "fight"
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
        },
        enterGame: function() {
            var panelManager = require("./panelManager");
            this.addChild("game", panelManager);
            this.navigate("/page/game", true);
        }
    });
    function run() {
        var clientManager = new ClientManager();
        return clientManager;
    }
    exports.run = run;
});