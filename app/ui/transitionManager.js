define(function(require, exports, module) {

    var noTransition = require("./noTransition");

    var TransitionManager = function() {
        this.availableTransitions = {};
        this.availableTransitions['default'] = this.availableTransitions['none'] = noTransition.transition;
    };

    TransitionManager.prototype.runTransition = function(oldController, currController, back) {

        var oldDiv, currDiv, oldCallback, transition;
        var _this = this;

        oldCallback = function(callback) {
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

        oldCallback(function() {
            _this.availableTransitions[transition].call(noTransition, oldDiv, currDiv, back);
        });
    };

    transitionManager = new TransitionManager();

    module.exports = transitionManager;
});