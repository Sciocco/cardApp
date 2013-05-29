define(function(require, exports, module) {

    var noTransition = require("./noTransition");

    var TransitionManager = function() {
        this.availableTransitions = {};
        this.availableTransitions['default'] = this.availableTransitions['none'] = noTransition.transition;
    };

    TransitionManager.prototype = {

        /**
         * This executes the transition for the panel
            ```
            $.ui.runTransition(transition,oldDiv,currDiv,back)
            ```
         * @api private
         * @title $.ui.runTransition(transition,oldDiv,currDiv,back)
         */
        runTransition: function(transition, oldController, currController, back) {

            var oldDiv, currDiv, oldCallback;
            var _this = this;

            if (oldController !== '') {
                oldDiv = oldController.el[0];

                if (typeof oldController.contentUnload === 'function') {
                    oldCallback = oldController.contentUnload;
                } else {
                    oldCallback = function(callback) {
                        callback();
                    }
                }
            }

            if (currController !== undefined) {
                currDiv = currController.el[0];
                noTransition.finishCallback = function() {
                    currController.trigger('contentLoad');
                    noTransition.finishCallback = null;
                }
            }

            if (!this.availableTransitions[transition]) {
                switch (transition) {
                    case 'slide':
                        this.availableTransitions['slide'] = require("./slideTransition");
                        break;
                    case 'down':
                        this.availableTransitions['down'] = require("./slideTransition");
                    default:
                        transition = 'default';
                }
            }

            oldCallback(function() {
                _this.availableTransitions[transition].call(_this, oldDiv, currDiv, back);
            })

        },
        /**
         * This is the default transition.  It simply shows the new panel and hides the old
         */
        noTransition: function(oldDiv, currDiv, back) {
            currDiv.style.display = "block";
            oldDiv.style.display = "block";
            var that = this;
            that.clearAnimations(currDiv);
            that.css3animate(oldDiv, {
                x: "0%",
                y: 0
            });
            that.finishTransition(oldDiv);
            currDiv.style.zIndex = 2;
            oldDiv.style.zIndex = 1;
        },
        /**
         * This must be called at the end of every transition to hide the old div and reset the doingTransition variable
         *
         * @param {Object} Div that transitioned out
         * @title $.ui.finishTransition(oldDiv)
         */
        finishTransition: function(oldDiv, currDiv) {
            oldDiv.style.display = 'none';
            this.doingTransition = false;
            if (currDiv)
                this.clearAnimations(currDiv);
            if (oldDiv)
                this.clearAnimations(oldDiv);
        },

        /**
         * This must be called at the end of every transition to remove all transforms and transitions attached to the inView object (performance + native scroll)
         *
         * @param {Object} Div that transitioned out
         * @title $.ui.finishTransition(oldDiv)
         */
        clearAnimations: function(inViewDiv) {
            inViewDiv.style[$.feat.cssPrefix + 'Transform'] = "none";
            inViewDiv.style[$.feat.cssPrefix + 'Transition'] = "none";
        }
    };

    transitionManager = new TransitionManager();

    module.exports = transitionManager;
});