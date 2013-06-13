define(function(require, exports, module) {

    var noTransition = require("./noTransition");

    var TransitionManager = function() {
        this.availableTransitions = {};
        this.availableTransitions['default'] = this.availableTransitions['none'] = noTransition.transition;
    };

    TransitionManager.prototype.runTransition = function(oldController, currController, back) {

        var oldDiv, currDiv, oldCallback, transition, contentLoadBefore;
        var _this = this;

        contentLoadBefore = oldCallback = function(callback) {
            callback();
        };

        if (oldController !== null) {
            oldDiv = oldController.el[0];
            if (typeof oldController.contentUnload === 'function') {
                oldCallback = oldController.contentUnload;
            }
        } else {
            oldDiv = document.createElement('div');
        }



        noTransition.finishCallback = null;
        if (currController !== undefined) {
            currDiv = currController.el[0];
            noTransition.finishCallback = function() {
                oldDiv.style.display = 'none';
                currController.trigger('contentLoad');
            };

            if (typeof currController.contentLoadBefore === 'function') {
                contentLoadBefore = currController.contentLoadBefore;
            }
        } else {
            console.log("新控制器不能为空!");
            return;
        }

        transition = currController['transition'];

        if (!this.availableTransitions[transition]) {
            switch (transition) {
                case 'slide':
                    this.availableTransitions['slide'] = require("./slideTransition");
                    break;
                case 'down':
                    this.availableTransitions['down'] = require("./slideDownTransition");
                    break;
                default:
                    transition = 'default';
            }
        }

        oldCallback.call(oldController, function() {
            contentLoadBefore.call(currController, function() {
                _this.availableTransitions[transition].call(noTransition, oldDiv, currDiv, back);
            }, oldController);
        }, currController);
    };

    transitionManager = new TransitionManager();

    module.exports = transitionManager;
});