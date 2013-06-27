define("app/pages/loginPage-debug", [ "../mvc/stack-debug", "../mvc/manager-debug", "../ui/transitionManager-debug", "../ui/noTransition-debug", "../ui/jq.css3animate-debug", "../ui/slideTransition-debug", "../ui/slideDownTransition-debug", "../panels/loginPanel-debug", "../panels/serverPanel-debug" ], function(require, exports, module) {
    var SpineStack = require("../mvc/stack-debug");
    var Controller = SpineStack.sub({
        el: "#loginPage",
        routes: {
            "/panel/login": "login",
            "/panel/server": "server"
        },
        init: function() {
            this.on("contentLoad", this.proxy(this.contentLoad));
        },
        contentLoad: function() {
            var loginPanel = require("../panels/loginPanel-debug");
            this.addChild("login", loginPanel);
            this.navigate("/panel/login", true);
        },
        enterServer: function() {
            var serverPanel = require("../panels/serverPanel-debug");
            this.addChild("server", serverPanel);
            this.navigate("/panel/server", true);
        }
    });
    var controller = new Controller();
    module.exports = controller;
});