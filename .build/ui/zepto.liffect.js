define("app/ui/zepto.liffect", [], function(require, exports, module) {
    $.fn.listEffect = function(opts, callback) {
        opts = opts || {};
        if (typeof opts.effect === "undefined") {
            return false;
        }
        this.attr("data-liffect", opts.effect);
        return new listEffect(this, opts, callback);
    };
    var listEffect = function(container, opts, callback) {
        var attributes = {};
        attributes.id = opts.id || $.uuid();
        attributes.container = container;
        attributes.childElName = opts.childElName || "li";
        attributes.childs = attributes.container.find(attributes.childElName);
        attributes.size = opts.size || attributes.childs.size() - 1;
        attributes.time = opts.time || "500";
        attributes.reverse = opts.reverse || false;
        attributes.out = opts.out || false;
        attributes.doneCallback = function() {
            attributes.container.removeClass("play");
            if (attributes.out) {
                attributes.container.attr("data-liffect", "");
            }
            if (typeof callback === "function") {
                callback();
            }
        };
        attributes.donetotalTime = (attributes.size + 1) * attributes.time;
        if (attributes.reverse) {
            this.reverseShow(attributes);
        } else {
            this.show(attributes);
        }
    };
    listEffect.prototype = {
        show: function(attributes) {
            attributes.childs.each(function(i) {
                $(this).attr("style", "-webkit-animation-delay:" + i * attributes.time + "ms");
                if (i == attributes.size) {
                    attributes.container.addClass("play");
                }
            });
            setTimeout(function() {
                attributes.doneCallback();
            }, attributes.donetotalTime);
        },
        reverseShow: function(attributes) {
            attributes.childs.each(function(i) {
                $(this).attr("style", "-webkit-animation-delay:" + (attributes.size - i) * attributes.time + "ms");
                if (i == attributes.size) {
                    attributes.container.addClass("play");
                }
            });
            setTimeout(function() {
                attributes.doneCallback();
            }, attributes.donetotalTime);
        }
    };
});