define("app/panels/mainPanel-debug", [], function(require, exports, module) {
    var Controller = Spine.Controller.sub({
        el: "#mainPanel",
        transition: "down",
        init: function() {
            this.bind("contentLoad", this.contentLoad);
        },
        contentLoad: function() {
            $(".slideLeft").listEffect({
                effect: "slideInLeft"
            });
            $(".slideRight").listEffect({
                effect: "slideInRight"
            });
        },
        contentUnload: function(callback) {
            $(".slideLeft").listEffect({
                effect: "slideOutLeft",
                reverse: true,
                out: true
            });
            $(".slideRight").listEffect({
                effect: "slideOutRight",
                reverse: true,
                out: true
            }, callback);
        }
    });
    var controller = new Controller();
    module.exports = controller;
});