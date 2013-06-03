define("app/ui/noTransition-debug", [ "./jq.css3animate-debug" ], function(require, exports, module) {
    var css3animate = require("./jq.css3animate-debug");
    noTransition = {
        finishCallback: null,
        css3animate: function(el, opts) {
            el = $(el);
            return el.css3Animate(opts);
        },
        /**
         * This is the default transition.  It simply shows the new panel and hides the old
         */
        transition: function(oldDiv, currDiv, back) {
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
            oldDiv.style.display = "none";
            if (currDiv) this.clearAnimations(currDiv);
            if (oldDiv) this.clearAnimations(oldDiv);
            if (this.finishCallback !== null) {
                this.finishCallback();
            }
        },
        /**
         * This must be called at the end of every transition to remove all transforms and transitions attached to the inView object (performance + native scroll)
         *
         * @param {Object} Div that transitioned out
         * @title $.ui.finishTransition(oldDiv)
         */
        clearAnimations: function(inViewDiv) {
            inViewDiv.style[$.feat.cssPrefix + "Transform"] = "none";
            inViewDiv.style[$.feat.cssPrefix + "Transition"] = "none";
        }
    };
    module.exports = noTransition;
});