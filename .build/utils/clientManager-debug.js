define("app/utils/clientManager-debug", [ "../mvc/route-debug", "../mvc/stack-debug", "../mvc/manager-debug", "../ui/transitionManager-debug", "../ui/noTransition-debug", "../ui/jq.css3animate-debug", "../ui/slideTransition-debug", "../ui/slideDownTransition-debug", "../pages/loginPage-debug", "./panelManager-debug", "../panels/dungeonPanel-debug", "../panels/fightPanel-debug", "../panels/mainPanel-debug" ], function(require, exports, module) {
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
            var panelManager = require("./panelManager-debug");
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