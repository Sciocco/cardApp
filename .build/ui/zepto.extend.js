define("app/ui/zepto.extend", [], function(require, exports, module) {
    /**
	 * Helper function to parse the user agent.  Sets the following
	 * .os.webkit
	 * .os.android
	 * .os.ipad
	 * .os.iphone
	 * .os.webos
	 * .os.touchpad
	 * .os.blackberry
	 * .os.opera
	 * .os.fennec
	 * .os.ie
	 * .os.ieTouch
	 * .os.supportsTouch
	 * .os.playbook
	 * .feat.nativetouchScroll
	 * @api private
	 */
    function detectUA($, userAgent) {
        $.os = {};
        $.os.webkit = userAgent.match(/WebKit\/([\d.]+)/) ? true : false;
        $.os.android = userAgent.match(/(Android)\s+([\d.]+)/) || userAgent.match(/Silk-Accelerated/) ? true : false;
        $.os.androidICS = $.os.android && userAgent.match(/(Android)\s4/) ? true : false;
        $.os.ipad = userAgent.match(/(iPad).*OS\s([\d_]+)/) ? true : false;
        $.os.iphone = !$.os.ipad && userAgent.match(/(iPhone\sOS)\s([\d_]+)/) ? true : false;
        $.os.webos = userAgent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/) ? true : false;
        $.os.touchpad = $.os.webos && userAgent.match(/TouchPad/) ? true : false;
        $.os.ios = $.os.ipad || $.os.iphone;
        $.os.playbook = userAgent.match(/PlayBook/) ? true : false;
        $.os.blackberry = $.os.playbook || userAgent.match(/BlackBerry/) ? true : false;
        $.os.blackberry10 = $.os.blackberry && userAgent.match(/Safari\/536/) ? true : false;
        $.os.chrome = userAgent.match(/Chrome/) ? true : false;
        $.os.opera = userAgent.match(/Opera/) ? true : false;
        $.os.fennec = userAgent.match(/fennec/i) ? true : userAgent.match(/Firefox/) ? true : false;
        $.os.ie = userAgent.match(/MSIE 10.0/i) ? true : false;
        $.os.ieTouch = $.os.ie && userAgent.toLowerCase().match(/touch/i) ? true : false;
        $.os.supportsTouch = window.DocumentTouch && document instanceof window.DocumentTouch || "ontouchstart" in window;
        //features
        $.feat = {};
        var head = document.documentElement.getElementsByTagName("head")[0];
        $.feat.nativeTouchScroll = typeof head.style["-webkit-overflow-scrolling"] !== "undefined" && $.os.ios;
        $.feat.cssPrefix = $.os.webkit ? "Webkit" : $.os.fennec ? "Moz" : $.os.ie ? "ms" : $.os.opera ? "O" : "";
        $.feat.cssTransformStart = !$.os.opera ? "3d(" : "(";
        $.feat.cssTransformEnd = !$.os.opera ? ",0)" : ")";
        if ($.os.android && !$.os.webkit) $.os.android = false;
    }
    detectUA($, navigator.userAgent);
    $.__detectUA = detectUA;
    //needed for unit tests
    $.uuid = function() {
        var S4 = function() {
            return ((1 + Math.random()) * 65536 | 0).toString(16).substring(1);
        };
        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    };
    // Like setTimeout(fn, 0); but much faster
    var timeouts = [];
    var contexts = [];
    var params = [];
    /**
         * This adds a command to execute in the JS stack, but is faster then setTimeout
           ```
           $.asap(function,context,args)
           ```
         * @param {Function} function
         * @param {Object} context
         * @param {Array} arguments
         */
    $.asap = function(fn, context, args) {
        if (!$.isFunction(fn)) throw "$.asap - argument is not a valid function";
        timeouts.push(fn);
        contexts.push(context ? context : {});
        params.push(args ? args : []);
        //post a message to ourselves so we know we have to execute a function from the stack 
        window.postMessage("jqm-asap", "*");
    };
    window.addEventListener("message", function(event) {
        if (event.source == window && event.data == "jqm-asap") {
            event.stopPropagation();
            if (timeouts.length > 0) {
                //just in case...
                timeouts.shift().apply(contexts.shift(), params.shift());
            }
        }
    }, true);
    if (!window.numOnly) {
        window.numOnly = function numOnly(val) {
            if (val === undefined || val === "") return 0;
            if (isNaN(parseFloat(val))) {
                if (val.replace) {
                    val = val.replace(/[^0-9.-]/, "");
                } else return 0;
            }
            return parseFloat(val);
        };
    }
});