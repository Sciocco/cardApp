define("app/panels/loginPanel-debug", [], function(require, exports, module) {
    var logining = false;
    var Controller = Spine.Controller.sub({
        el: "#loginPanel",
        init: function() {
            showLogin();
            $("#loginButton").click(function() {
                showLogin();
            });
            $("#registerButton").click(function() {
                showRegister();
            });
        }
    });
    var controller = new Controller();
    function showLogin() {
        $("#g-doc").popup({
            title: "登录",
            message: "用户名: <input type='text' id='loginUser'><br>密码: <input type='text' id='loginPwd' style='webkit-text-security:disc'>",
            cancelCallback: function() {},
            doneText: "登录",
            doneCallback: login,
            cancelOnly: false
        });
    }
    function showRegister() {
        $("#g-doc").popup({
            title: "注册",
            message: "用户名: <input type='text' id='regUser'><br>密码: <input type='text' id='regPwd' style='webkit-text-security:disc'><br>重复密码: <input type='text' id='regPwd2' style='webkit-text-security:disc'>",
            cancelCallback: function() {},
            doneText: "注册",
            doneCallback: register,
            cancelOnly: false
        });
    }
    function login() {
        if (logining) {
            return;
        }
        logining = true;
        var username = $("#loginUser").val().trim();
        var pwd = $("#loginPwd").val().trim();
        $("#loginPwd").val("");
        if (!username) {
            alert("用户名不能为空!");
            logining = false;
            return;
        }
        if (!pwd) {
            alert("密码不能为空!");
            logining = false;
            return;
        }
        // $.post(httpHost + 'login', {
        // 	username: username,
        // 	password: pwd
        // }, function(data) {
        // 	if (data.code === 501) {
        // 		alert('Username or password is invalid!');
        // 		logining = false;
        // 		return;
        // 	}
        // 	if (data.code !== 200) {
        // 		alert('Username is not exists!');
        // 		logining = false;
        // 		return;
        // 	}
        //test data
        var data = {
            user: {
                id: 1
            },
            player: {
                areaId: "5"
            }
        };
        afterLogin(data);
    }
    function afterLogin(data) {
        var app = window.APP;
        var userData = data.user;
        var playerData = data.player;
        var areaId = playerData.areaId;
        if (!!userData) {
            app.uid = userData.id;
        }
        app.playerId = playerData.id;
        app.areaId = areaId;
        app.player = playerData;
        //加载资源
        controller.parent.enterServer();
    }
    function register() {
        var username = $("#regUser").val().trim();
        var pwd = $("#regPwd").val().trim();
        var pwd2 = $("#regPwd2").val().trim();
        $("#loginPwd").val("");
        if (!username) {
            alert("用户名不能为空!");
            logining = false;
            return;
        }
        if (!pwd) {
            alert("密码不能为空!");
            logining = false;
            return;
        }
        if (pwd !== pwd2) {
            alert("两次输入的密码不同!");
            logining = false;
            return;
        }
    }
    module.exports = controller;
});