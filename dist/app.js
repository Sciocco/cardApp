define("app/config/consts", [], function(require, exports, module) {
    module.exports = {
        aniOrientation: {
            // LEFT_DOWN: 'LeftDown',
            LEFT_UP: "LeftUp"
        },
        TaskState: {
            COMPLETED: 2,
            COMPLETED_NOT_DELIVERY: 1,
            NOT_COMPLETED: 0,
            NOT_START: -1
        },
        Border: {
            LEFT: "left",
            RIGHT: "right",
            TOP: "top",
            BOTTOM: "bottom"
        },
        EntityType: {
            PLAYER: "player",
            NPC: "npc",
            MOB: "mob",
            EQUIPMENT: "equipment",
            ITEM: "item"
        },
        SpecialCharacter: {
            Angle: "210"
        },
        MESSAGE: {
            RES: 200,
            ERR: 500,
            PUSH: 600
        },
        AttackResult: {
            SUCCESS: 1,
            KILLED: 2,
            MISS: 3,
            NOT_IN_RANGE: 4,
            NO_ENOUGH_MP: 5,
            NOT_COOLDOWN: 6,
            ATTACKER_CONFUSED: 7
        },
        NodeCoordinate: {
            MAP_NODE: 0,
            CURPLAY_NODE: .1,
            PLAYER_NODE: .5,
            MOB_NODE: 1,
            NPC_NODE: 1,
            ITEM_NODE: 1,
            RED_BLOOD_NODE: 1.5,
            BLACK_BLOOD_NODE: 1.2,
            NAME_NODE: 1.5,
            UPDATE_NODE: 2,
            NUMBER_NODE: 2
        },
        CacheType: {
            IMAGE: "image",
            FRAME_ANIM: "frame_animation"
        },
        buttonContent: {
            YES: "确定",
            NO: "取消",
            GIVE_UP: "放弃",
            ACCEPT: "接受",
            DELIVER: "交付"
        }
    };
});

define("app/config/resource", [], function(require, exports, module) {
    module.exports = {
        sounds: [ {
            id: "bgSound",
            src: "sound/sound.ogg"
        } ]
    };
});

define("app/mvc/container", [ "./manager" ], function(require, exports, module) {
    var __hasProp = {}.hasOwnProperty, __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProContainer.prototype.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, Manager = require("./manager");
    Spine.Controller.include({
        visible: true,
        x: 0,
        y: 0,
        render: function(parent) {
            this.el.css({
                position: "absolute",
                left: x,
                top: y
            });
            this.appendTo(parent);
        }
    });
    var Module = function(_super) {
        __extends(Container, _super);
        Container.prototype.controllers = {};
        function Container() {
            var key, _ref;
            Container.__super__.constructor.apply(this, arguments);
            //分配控制器
            _ref = this.controllers;
            for (key in _ref) {
                this.addChild(_ref[key]);
            }
        }
        Container.prototype.render = function() {
            var list = this.children.slice(0);
            for (var i = 0, l = list.length; i < l; i++) {
                var child = list[i];
                if (!child.visible) {
                    continue;
                }
                child.render(this);
            }
            return true;
        };
        return Container;
    }(Manager);
    module.exports = Module;
});

define("app/mvc/manager", [], function(require, exports, module) {
    var __hasProp = {}.hasOwnProperty, __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    };
    Spine.Controller.include({
        name: null,
        parent: null
    });
    var Module = function(_super) {
        __extends(Manager, _super);
        function Manager() {
            Manager.__super__.constructor.apply(this, arguments);
            this.children = {};
        }
        Manager.prototype.addChild = function(name, child) {
            if (child === null) {
                return child;
            } else if (typeof child === "function") {
                child = new child();
            }
            if (child.parent) {
                child.parent.removeChild(name);
            }
            child.name = name;
            child.parent = this;
            this.children[name] = child;
            return child;
        };
        Manager.prototype.removeChild = function(name) {
            var child = this.children[name];
            if (child) {
                child.parent = null;
            }
            this.children[name] = null;
            return true;
        };
        Manager.prototype.getChildAt = function(name) {
            return this.children[name];
        };
        Manager.prototype.getNumChildren = function() {
            return this.children.length;
        };
        return Manager;
    }(Spine.Controller);
    module.exports = Module;
});

define("app/mvc/route", [], function(require, exports, module) {
    var $, escapeRegExp, hashStrip, namedParam, splatParam, __hasProp = {}.hasOwnProperty, __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, __slice = [].slice;
    $ = Spine.$;
    hashStrip = /^#*/;
    namedParam = /:([\w\d]+)/g;
    splatParam = /\*([\w\d]+)/g;
    escapeRegExp = /[-[\]{}()+?.,\\^$|#\s]/g;
    Spine.Route = function(_super) {
        var _ref;
        __extends(Route, _super);
        Route.extend(Spine.Events);
        Route.historySupport = ((_ref = window.history) != null ? _ref.pushState : void 0) != null;
        Route.routes = [];
        Route.options = {
            trigger: true,
            history: false,
            shim: false,
            replace: false
        };
        Route.add = function(path, callback) {
            var key, value, _results;
            if (typeof path === "object" && !(path instanceof RegExp)) {
                _results = [];
                for (key in path) {
                    value = path[key];
                    _results.push(this.add(key, value));
                }
                return _results;
            } else {
                return this.routes.push(new this(path, callback));
            }
        };
        Route.setup = function(options) {
            if (options == null) {
                options = {};
            }
            this.options = $.extend({}, this.options, options);
            if (this.options.history) {
                this.history = this.historySupport && this.options.history;
            }
            if (this.options.shim) {
                return;
            }
            if (this.history) {
                $(window).bind("popstate", this.change);
            } else {
                $(window).bind("hashchange", this.change);
            }
            return this.change();
        };
        Route.unbind = function() {
            if (this.options.shim) {
                return;
            }
            if (this.history) {
                return $(window).unbind("popstate", this.change);
            } else {
                return $(window).unbind("hashchange", this.change);
            }
        };
        Route.navigate = function() {
            var args, lastArg, options, path;
            args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
            options = {};
            lastArg = args[args.length - 1];
            if (typeof lastArg === "object") {
                options = args.pop();
            } else if (typeof lastArg === "boolean") {
                options.trigger = args.pop();
            }
            options = $.extend({}, this.options, options);
            path = args.join("/").replace(hashStrip, "");
            if (this.path === path) {
                return;
            }
            this.path = path;
            this.trigger("navigate", this.path);
            if (options.trigger) {
                this.matchRoute(this.path, options);
            }
            if (options.shim) {
                return;
            }
            if (this.history && options.replace) {
                return history.replaceState({}, document.title, this.path);
            } else if (this.history) {
                return history.pushState({}, document.title, this.path);
            } else {
                return window.location.hash = this.path;
            }
        };
        Route.getPath = function() {
            var path;
            if (this.history) {
                path = window.location.pathname;
                if (path.substr(0, 1) !== "/") {
                    path = "/" + path;
                }
            } else {
                path = window.location.hash;
                path = path.replace(hashStrip, "");
            }
            return path;
        };
        Route.getHost = function() {
            return "" + window.location.protocol + "//" + window.location.host;
        };
        Route.change = function() {
            var path;
            path = this.getPath();
            if (path === this.path) {
                return;
            }
            this.path = path;
            return this.matchRoute(this.path);
        };
        Route.matchRoute = function(path, options) {
            var route, _i, _len, _ref1;
            _ref1 = this.routes;
            for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                route = _ref1[_i];
                if (!route.match(path, options)) {
                    continue;
                }
                this.trigger("change", route, path);
                return route;
            }
        };
        function Route(path, callback) {
            var match;
            this.path = path;
            this.callback = callback;
            this.names = [];
            if (typeof path === "string") {
                namedParam.lastIndex = 0;
                while ((match = namedParam.exec(path)) !== null) {
                    this.names.push(match[1]);
                }
                splatParam.lastIndex = 0;
                while ((match = splatParam.exec(path)) !== null) {
                    this.names.push(match[1]);
                }
                path = path.replace(escapeRegExp, "\\$&").replace(namedParam, "([^/]*)").replace(splatParam, "(.*?)");
                this.route = new RegExp("^" + path + "$");
            } else {
                this.route = path;
            }
        }
        Route.prototype.match = function(path, options) {
            var i, match, param, params, _i, _len;
            if (options == null) {
                options = {};
            }
            match = this.route.exec(path);
            if (!match) {
                return false;
            }
            options.match = match;
            params = match.slice(1);
            if (this.names.length) {
                for (i = _i = 0, _len = params.length; _i < _len; i = ++_i) {
                    param = params[i];
                    options[this.names[i]] = param;
                }
            }
            return this.callback.call(null, options) !== false;
        };
        return Route;
    }(Spine.Module);
    Spine.Route.change = Spine.Route.proxy(Spine.Route.change);
    Spine.Controller.include({
        route: function(path, callback) {
            return Spine.Route.add(path, this.proxy(callback));
        },
        routes: function(routes) {
            var key, value, _results;
            _results = [];
            for (key in routes) {
                value = routes[key];
                _results.push(this.route(key, value));
            }
            return _results;
        },
        navigate: function() {
            return Spine.Route.navigate.apply(Spine.Route, arguments);
        }
    });
    if (typeof module !== "undefined" && module !== null) {
        module.exports = Spine.Route;
    }
});

define("app/mvc/stack", [ "./manager", "../ui/transitionManager", "../ui/noTransition", "../ui/jq.css3animate", "../ui/slideTransition", "../ui/slideDownTransition" ], function(require, exports, module) {
    var __hasProp = {}.hasOwnProperty, __extends = function(child, parent) {
        for (var key in parent) {
            if (__hasProp.call(parent, key)) child[key] = parent[key];
        }
        function ctor() {
            this.constructor = child;
        }
        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }, Manager = require("./manager"), transitionManager = require("../ui/transitionManager");
    var Module = function(_super) {
        __extends(Stack, _super);
        Stack.prototype.controllers = {};
        Stack.prototype.routes = {};
        function Stack() {
            var key, _ref, _ref1;
            this.oldController = null;
            Stack.__super__.constructor.apply(this, arguments);
            //分配控制器
            _ref = this.controllers;
            for (key in _ref) {
                this.addChild(key, _ref[key]);
            }
            //分配路由
            _ref1 = this.routes;
            for (key in _ref1) {
                this.addRoute(key, _ref1[key]);
            }
            this.trigger("defaultRoute");
            if (this["default"]) {
                this.navigate(this["default"], true);
            }
        }
        Stack.prototype.addRoute = function(key, value) {
            var _ref2, callback;
            if (typeof value === "function") {
                callback = value;
            } else {
                callback = this.proxy(function() {
                    _ref2 = this.getChildAt(value);
                    if (this.oldController === _ref2) {
                        return;
                    }
                    this.render(this.oldController, _ref2);
                    this.oldController = _ref2;
                });
            }
            return this.route(key, callback);
        };
        Stack.prototype.render = function(oldController, currController) {
            transitionManager.runTransition(oldController, currController);
        };
        return Stack;
    }(Manager);
    module.exports = Module;
});

define("app/pages/loginPage", [], function(require, exports, module) {
    var loading = false;
    var httpHost = location.href.replace(location.hash, "");
    var Controller = Spine.Controller.sub({
        el: "#loginPage",
        init: function() {
            $("#loginBtn").on("click", this.proxy(this.login));
        },
        login: function() {
            if (loading) {
                return;
            }
            loading = true;
            var username = $("#loginUser").val().trim();
            var pwd = $("#loginPwd").val().trim();
            $("#loginPwd").val("");
            if (!username) {
                alert("Username is required!");
                loading = false;
                return;
            }
            if (!pwd) {
                alert("Password is required!");
                loading = false;
                return;
            }
            // $.post(httpHost + 'login', {
            // 	username: username,
            // 	password: pwd
            // }, function(data) {
            // 	if (data.code === 501) {
            // 		alert('Username or password is invalid!');
            // 		loading = false;
            // 		return;
            // 	}
            // 	if (data.code !== 200) {
            // 		alert('Username is not exists!');
            // 		loading = false;
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
            this.afterLogin(data);
            localStorage.setItem("username", username);
        },
        afterLogin: function(data) {
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
            this.parent.enterGame();
        }
    });
    var controller = new Controller();
    module.exports = controller;
});

define("app/panels/dungeonPanel", [], function(require, exports, module) {
    var Controller = Spine.Controller.sub({
        el: "#dungeonPanel",
        transition: "slide",
        init: function() {}
    });
    var controller = new Controller();
    module.exports = controller;
});

define("app/panels/fightPanel", [], function(require, exports, module) {
    var Controller = Spine.Controller.sub({
        el: "#fightPanel",
        transition: "down",
        init: function() {}
    });
    var controller = new Controller();
    module.exports = controller;
});

define("app/panels/mainPanel", [], function(require, exports, module) {
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

define("app/ui/jq.css3animate", [], function(require, exports, module) {
    var cache = [];
    var objId = function(obj) {
        if (!obj.jqmCSS3AnimateId) obj.jqmCSS3AnimateId = $.uuid();
        return obj.jqmCSS3AnimateId;
    };
    var getEl = function(elID) {
        if (typeof elID == "string" || elID instanceof String) {
            return document.getElementById(elID);
        } else {
            return elID;
        }
    };
    var getCSS3Animate = function(obj, options) {
        var tmp, id, el = getEl(obj);
        //first one
        id = objId(el);
        if (cache[id]) {
            cache[id].animate(options);
            tmp = cache[id];
        } else {
            tmp = css3Animate(el, options);
            cache[id] = tmp;
        }
        return tmp;
    };
    $.fn["css3Animate"] = function(opts) {
        //keep old callback system - backwards compatibility - should be deprecated in future versions
        if (!opts.complete && opts.callback) opts.complete = opts.callback;
        //first on
        var tmp = getCSS3Animate(this[0], opts);
        opts.complete = null;
        opts.sucess = null;
        opts.failure = null;
        for (var i = 1; i < this.length; i++) {
            tmp.link(this[i], opts);
        }
        return tmp;
    };
    $["css3AnimateQueue"] = function() {
        return new css3Animate.queue();
    };
    //if (!window.WebKitCSSMatrix) return;
    var translateOpen = $.feat.cssTransformStart;
    var translateClose = $.feat.cssTransformEnd;
    var transitionEnd = $.feat.cssPrefix.replace(/-/g, "") + "TransitionEnd";
    transitionEnd = $.os.fennec || $.feat.cssPrefix == "" || $.os.ie ? "transitionend" : transitionEnd;
    transitionEnd = transitionEnd.replace(transitionEnd.charAt(0), transitionEnd.charAt(0).toLowerCase());
    var css3Animate = function() {
        var css3Animate = function(elID, options) {
            if (!(this instanceof css3Animate)) return new css3Animate(elID, options);
            //start doing stuff
            this.callbacksStack = [];
            this.activeEvent = null;
            this.countStack = 0;
            this.isActive = false;
            this.el = elID;
            this.linkFinishedProxy_ = $.proxy(this.linkFinished, this);
            if (!this.el) return;
            this.animate(options);
            var that = this;
            $(this.el).bind("destroy", function() {
                var id = that.el.jqmCSS3AnimateId;
                that.callbacksStack = [];
                if (cache[id]) delete cache[id];
            });
        };
        css3Animate.prototype = {
            animate: function(options) {
                //cancel current active animation on this object
                if (this.isActive) this.cancel();
                this.isActive = true;
                if (!options) {
                    alert("Please provide configuration options for animation of " + this.el.id);
                    return;
                }
                var classMode = !!options["addClass"];
                if (classMode) {
                    //class defines properties being changed
                    if (options["removeClass"]) {
                        $(this.el).replaceClass(options["removeClass"], options["addClass"]);
                    } else {
                        $(this.el).addClass(options["addClass"]);
                    }
                } else {
                    //property by property
                    var timeNum = numOnly(options["time"]);
                    if (timeNum == 0) options["time"] = 0;
                    if (!options["y"]) options["y"] = 0;
                    if (!options["x"]) options["x"] = 0;
                    if (options["previous"]) {
                        var cssMatrix = new $.getCssMatrix(this.el);
                        options.y += numOnly(cssMatrix.f);
                        options.x += numOnly(cssMatrix.e);
                    }
                    if (!options["origin"]) options.origin = "0% 0%";
                    if (!options["scale"]) options.scale = "1";
                    if (!options["rotateY"]) options.rotateY = "0";
                    if (!options["rotateX"]) options.rotateX = "0";
                    if (!options["skewY"]) options.skewY = "0";
                    if (!options["skewX"]) options.skewX = "0";
                    if (!options["timingFunction"]) options["timingFunction"] = "linear";
                    //check for percent or numbers
                    if (typeof options.x == "number" || options.x.indexOf("%") == -1 && options.x.toLowerCase().indexOf("px") == -1 && options.x.toLowerCase().indexOf("deg") == -1) options.x = parseInt(options.x) + "px";
                    if (typeof options.y == "number" || options.y.indexOf("%") == -1 && options.y.toLowerCase().indexOf("px") == -1 && options.y.toLowerCase().indexOf("deg") == -1) options.y = parseInt(options.y) + "px";
                    var trans = "translate" + translateOpen + options.x + "," + options.y + translateClose + " scale(" + parseFloat(options.scale) + ") rotate(" + options.rotateX + ")";
                    if (!$.os.opera) trans += " rotateY(" + options.rotateY + ")";
                    trans += " skew(" + options.skewX + "," + options.skewY + ")";
                    this.el.style[$.feat.cssPrefix + "Transform"] = trans;
                    this.el.style[$.feat.cssPrefix + "BackfaceVisibility"] = "hidden";
                    var properties = $.feat.cssPrefix + "Transform";
                    if (options["opacity"] !== undefined) {
                        this.el.style.opacity = options["opacity"];
                        properties += ", opacity";
                    }
                    if (options["width"]) {
                        this.el.style.width = options["width"];
                        properties = "all";
                    }
                    if (options["height"]) {
                        this.el.style.height = options["height"];
                        properties = "all";
                    }
                    this.el.style[$.feat.cssPrefix + "TransitionProperty"] = "all";
                    if (("" + options["time"]).indexOf("s") === -1) {
                        var scale = "ms";
                        var time = options["time"] + scale;
                    } else if (options["time"].indexOf("ms") !== -1) {
                        var scale = "ms";
                        var time = options["time"];
                    } else {
                        var scale = "s";
                        var time = options["time"] + scale;
                    }
                    this.el.style[$.feat.cssPrefix + "TransitionDuration"] = time;
                    this.el.style[$.feat.cssPrefix + "TransitionTimingFunction"] = options["timingFunction"];
                    this.el.style[$.feat.cssPrefix + "TransformOrigin"] = options.origin;
                }
                //add callback to the stack
                this.callbacksStack.push({
                    complete: options["complete"],
                    success: options["success"],
                    failure: options["failure"]
                });
                this.countStack++;
                var that = this;
                var style = window.getComputedStyle(this.el);
                if (classMode) {
                    //get the duration
                    var duration = style[$.feat.cssPrefix + "TransitionDuration"];
                    var timeNum = numOnly(duration);
                    options["time"] = timeNum;
                    if (duration.indexOf("ms") !== -1) {
                        scale = "ms";
                    } else {
                        options["time"] *= 1e3;
                        scale = "s";
                    }
                }
                //finish asap
                if (timeNum == 0 || scale == "ms" && timeNum < 5 || style.display == "none") {
                    //the duration is nearly 0 or the element is not displayed, finish immediatly
                    $.asap($.proxy(this.finishAnimation, this, [ false ]));
                } else {
                    //setup the event normally
                    var that = this;
                    this.activeEvent = function(event) {
                        clearTimeout(that.timeout);
                        that.finishAnimation(event);
                        that.el.removeEventListener(transitionEnd, that.activeEvent, false);
                    };
                    that.timeout = setTimeout(this.activeEvent, numOnly(options["time"]) + 50);
                    this.el.addEventListener(transitionEnd, this.activeEvent, false);
                }
            },
            addCallbackHook: function(callback) {
                if (callback) this.callbacksStack.push(callback);
                this.countStack++;
                return this.linkFinishedProxy_;
            },
            linkFinished: function(canceled) {
                if (canceled) this.cancel(); else this.finishAnimation();
            },
            finishAnimation: function(event) {
                if (event) event.preventDefault();
                if (!this.isActive) return;
                this.countStack--;
                if (this.countStack == 0) this.fireCallbacks(false);
            },
            fireCallbacks: function(canceled) {
                this.clearEvents();
                //keep callbacks after cleanup
                // (if any of the callbacks overrides this object, callbacks will keep on fire as expected)
                var callbacks = this.callbacksStack;
                //cleanup
                this.cleanup();
                //fire all callbacks
                for (var i = 0; i < callbacks.length; i++) {
                    var complete = callbacks[i]["complete"];
                    var success = callbacks[i]["success"];
                    var failure = callbacks[i]["failure"];
                    //fire callbacks
                    if (complete && typeof complete == "function") complete(canceled);
                    //success/failure
                    if (canceled && failure && typeof failure == "function") failure(); else if (success && typeof success == "function") success();
                }
            },
            cancel: function() {
                if (!this.isActive) return;
                this.fireCallbacks(true);
            },
            cleanup: function() {
                this.callbacksStack = [];
                this.isActive = false;
                this.countStack = 0;
            },
            clearEvents: function() {
                if (this.activeEvent) {
                    this.el.removeEventListener(transitionEnd, this.activeEvent, false);
                }
                this.activeEvent = null;
            },
            link: function(elID, opts) {
                var callbacks = {
                    complete: opts.complete,
                    success: opts.success,
                    failure: opts.failure
                };
                opts.complete = this.addCallbackHook(callbacks);
                opts.success = null;
                opts.failure = null;
                //run the animation with the replaced callbacks
                getCSS3Animate(elID, opts);
                //set the old callback back in the obj to avoid strange stuff
                opts.complete = callbacks.complete;
                opts.success = callbacks.success;
                opts.failure = callbacks.failure;
                return this;
            }
        };
        return css3Animate;
    }();
    css3Animate.queue = function() {
        return {
            elements: [],
            push: function(el) {
                this.elements.push(el);
            },
            pop: function() {
                return this.elements.pop();
            },
            run: function() {
                var that = this;
                if (this.elements.length == 0) return;
                if (typeof this.elements[0] == "function") {
                    var func = this.shift();
                    func();
                }
                if (this.elements.length == 0) return;
                var params = this.shift();
                if (this.elements.length > 0) params.complete = function(canceled) {
                    if (!canceled) that.run();
                };
                css3Animate(document.getElementById(params.id), params);
            },
            shift: function() {
                return this.elements.shift();
            }
        };
    };
});

define("app/ui/jq.popup", [], function(require, exports, module) {
    $.fn.popup = function(opts) {
        return new popup(this[0], opts);
    };
    var queue = [];
    var popup = function() {
        var popup = function(containerEl, opts) {
            if (typeof containerEl === "string" || containerEl instanceof String) {
                this.container = document.getElementById(containerEl);
            } else {
                this.container = containerEl;
            }
            if (!this.container) {
                alert("Error finding container for popup " + containerEl);
                return;
            }
            try {
                if (typeof opts === "string" || typeof opts === "number") opts = {
                    message: opts,
                    cancelOnly: "true",
                    cancelText: "OK"
                };
                this.id = id = opts.id = opts.id || $.uuid();
                //opts is passed by reference
                var self = this;
                this.title = opts.suppressTitle ? "" : opts.title || "Alert";
                this.message = opts.message || "";
                this.cancelText = opts.cancelText || "Cancel";
                this.cancelCallback = opts.cancelCallback || function() {};
                this.cancelClass = opts.cancelClass || "button";
                this.doneText = opts.doneText || "Done";
                this.doneCallback = opts.doneCallback || function(self) {};
                this.doneClass = opts.doneClass || "button";
                this.cancelOnly = opts.cancelOnly || false;
                this.onShow = opts.onShow || function() {};
                this.autoCloseDone = opts.autoCloseDone !== undefined ? opts.autoCloseDone : true;
                queue.push(this);
                if (queue.length == 1) this.show();
            } catch (e) {
                console.log("error adding popup " + e);
            }
        };
        popup.prototype = {
            id: null,
            title: null,
            message: null,
            cancelText: null,
            cancelCallback: null,
            cancelClass: null,
            doneText: null,
            doneCallback: null,
            doneClass: null,
            cancelOnly: false,
            onShow: null,
            autoCloseDone: true,
            supressTitle: false,
            show: function() {
                var self = this;
                var markup = '<div id="' + this.id + '" class="jqPopup hidden">        				<header>' + this.title + '</header>        				<div><div style="width:1px;height:1px;-webkit-transform:translate3d(0,0,0);float:right"></div>' + this.message + '</div>        				<footer style="clear:both;">        					<a href="javascript:;" class="' + this.cancelClass + '" id="cancel">' + this.cancelText + '</a>        					<a href="javascript:;" class="' + this.doneClass + '" id="action">' + this.doneText + "</a>        				</footer>        			</div></div>";
                $(this.container).append($(markup));
                var $el = $("#" + this.id);
                $el.bind("close", function() {
                    self.hide();
                });
                if (this.cancelOnly) {
                    $el.find("A#action").hide();
                    $el.find("A#cancel").addClass("center");
                }
                $el.find("A").each(function() {
                    var button = $(this);
                    button.bind("click", function(e) {
                        if (button.attr("id") == "cancel") {
                            self.cancelCallback.call(self.cancelCallback, self);
                            self.hide();
                        } else {
                            self.doneCallback.call(self.doneCallback, self);
                            if (self.autoCloseDone) self.hide();
                        }
                        e.preventDefault();
                    });
                });
                self.positionPopup();
                $.blockUI(.5);
                $el.removeClass("hidden");
                $el.bind("orientationchange", function() {
                    self.positionPopup();
                });
                //force header/footer showing to fix CSS style bugs
                $el.find("header").show();
                $el.find("footer").show();
                this.onShow(this);
            },
            hide: function() {
                var self = this;
                $("#" + self.id).addClass("hidden");
                $.unblockUI();
                setTimeout(function() {
                    self.remove();
                }, 250);
            },
            remove: function() {
                var self = this;
                var $el = $("#" + self.id);
                $el.unbind("close");
                $el.find("BUTTON#action").unbind("click");
                $el.find("BUTTON#cancel").unbind("click");
                $el.unbind("orientationchange").remove();
                queue.splice(0, 1);
                if (queue.length > 0) queue[0].show();
            },
            positionPopup: function() {
                var popup = $("#" + this.id);
                popup.css("top", window.innerHeight / 2.5 + window.pageYOffset - popup[0].clientHeight / 2 + "px");
                popup.css("left", window.innerWidth / 2 - popup[0].clientWidth / 2 + "px");
            }
        };
        return popup;
    }();
    var uiBlocked = false;
    $.blockUI = function(opacity) {
        if (uiBlocked) return;
        opacity = opacity ? " style='opacity:" + opacity + ";'" : "";
        $("BODY").prepend($("<div id='mask'" + opacity + "></div>"));
        $("BODY DIV#mask").bind("touchstart", function(e) {
            e.preventDefault();
        });
        $("BODY DIV#mask").bind("touchmove", function(e) {
            e.preventDefault();
        });
        uiBlocked = true;
    };
    $.unblockUI = function() {
        uiBlocked = false;
        $("BODY DIV#mask").unbind("touchstart");
        $("BODY DIV#mask").unbind("touchmove");
        $("BODY DIV#mask").remove();
    };
    /**
     * Here we override the window.alert function due to iOS eating touch events on native alerts
     */
    window.alert = function(text) {
        if (text === null || text === undefined) text = "null";
        $(document.body).popup({
            suppressTitle: true,
            message: text.toString(),
            cancelOnly: "true",
            cancelText: "OK"
        });
    };
});

define("app/ui/loadUi", [], function(require, exports, module) {
    require("./zepto.extend");
    require("./jq.popup");
    require("./zepto.liffect");
});

define("app/ui/noTransition", [], function(require, exports, module) {
    var css3animate = require("./jq.css3animate");
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

define("app/ui/slideDownTransition", [], function(require, exports, module) {
    function slideDownTransition(oldDiv, currDiv, back) {
        oldDiv.style.display = "block";
        currDiv.style.display = "block";
        var that = this;
        if (back) {
            currDiv.style.zIndex = 1;
            oldDiv.style.zIndex = 2;
            that.clearAnimations(currDiv);
            that.css3animate(oldDiv, {
                y: "-100%",
                x: "0%",
                time: "150ms",
                complete: function(canceled) {
                    if (canceled) {
                        that.finishTransition(oldDiv, currDiv);
                        return;
                    }
                    that.css3animate(oldDiv, {
                        x: "-100%",
                        y: 0,
                        complete: function() {
                            that.finishTransition(oldDiv);
                        }
                    });
                    currDiv.style.zIndex = 2;
                    oldDiv.style.zIndex = 1;
                }
            });
        } else {
            oldDiv.style.zIndex = 1;
            currDiv.style.zIndex = 2;
            that.css3animate(currDiv, {
                y: "-100%",
                x: "0%",
                complete: function() {
                    that.css3animate(currDiv, {
                        y: "0%",
                        x: "0%",
                        time: "150ms",
                        complete: function(canceled) {
                            if (canceled) {
                                that.finishTransition(oldDiv, currDiv);
                                return;
                            }
                            that.clearAnimations(currDiv);
                            that.css3animate(oldDiv, {
                                x: "-100%",
                                y: 0,
                                complete: function() {
                                    that.finishTransition(oldDiv);
                                }
                            });
                        }
                    });
                }
            });
        }
    }
    module.exports = slideDownTransition;
});

define("app/ui/slideTransition", [], function(require, exports, module) {
    function slideTransition(oldDiv, currDiv, back) {
        oldDiv.style.display = "block";
        currDiv.style.display = "block";
        var that = this;
        if (back) {
            currDiv.style.zIndex = 2;
            oldDiv.style.zIndex = 1;
            that.css3animate(oldDiv, {
                x: "0%",
                y: "0%",
                complete: function() {
                    that.css3animate(oldDiv, {
                        x: "100%",
                        time: "150ms",
                        complete: function() {
                            that.finishTransition(oldDiv, currDiv);
                        }
                    }).link(currDiv, {
                        x: "0%",
                        time: "150ms"
                    });
                }
            }).link(currDiv, {
                x: "-100%",
                y: "0%"
            });
        } else {
            currDiv.style.zIndex = 2;
            oldDiv.style.zIndex = 1;
            that.css3animate(oldDiv, {
                x: "0%",
                y: "0%",
                complete: function() {
                    that.css3animate(oldDiv, {
                        x: "-100%",
                        time: "150ms",
                        complete: function() {
                            that.finishTransition(oldDiv, currDiv);
                        }
                    }).link(currDiv, {
                        x: "0%",
                        time: "150ms"
                    });
                }
            }).link(currDiv, {
                x: "100%",
                y: "0%"
            });
        }
    }
    module.exports = slideTransition;
});

define("app/ui/transitionManager", [ "./noTransition", "./slideTransition", "./slideDownTransition" ], function(require, exports, module) {
    var noTransition = require("./noTransition");
    var TransitionManager = function() {
        this.availableTransitions = {};
        this.availableTransitions["default"] = this.availableTransitions["none"] = noTransition.transition;
    };
    TransitionManager.prototype.runTransition = function(oldController, currController, back) {
        var oldDiv, currDiv, oldCallback, transition;
        var _this = this;
        oldCallback = function(callback) {
            callback();
        };
        if (oldController !== null) {
            oldDiv = oldController.el[0];
            if (typeof oldController.contentUnload === "function") {
                oldCallback = oldController.contentUnload;
            }
        } else {
            oldDiv = document.createElement("div");
        }
        noTransition.finishCallback = null;
        if (currController !== undefined) {
            currDiv = currController.el[0];
            noTransition.finishCallback = function() {
                currController.trigger("contentLoad");
            };
        }
        transition = currController["transition"];
        if (!this.availableTransitions[transition]) {
            switch (transition) {
              case "slide":
                this.availableTransitions["slide"] = require("./slideTransition");
                break;

              case "down":
                this.availableTransitions["down"] = require("./slideDownTransition");
                break;

              default:
                transition = "default";
            }
        }
        oldCallback(function() {
            _this.availableTransitions[transition].call(noTransition, oldDiv, currDiv, back);
        });
    };
    transitionManager = new TransitionManager();
    module.exports = transitionManager;
});

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

define("app/utils/clientManager", [ "../mvc/route", "../mvc/stack", "../mvc/manager", "../ui/transitionManager", "../ui/noTransition", "../ui/jq.css3animate", "../ui/slideTransition", "../ui/slideDownTransition", "../pages/loginPage", "./panelManager", "../panels/dungeonPanel", "../panels/fightPanel", "../panels/mainPanel" ], function(require, exports, module) {
    require("../mvc/route");
    var SpineStack = require("../mvc/stack");
    var loginPage = require("../pages/loginPage");
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
            var panelManager = require("./panelManager");
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

define("app/utils/panelManager", [ "../mvc/stack", "../mvc/manager", "../ui/transitionManager", "../ui/noTransition", "../ui/jq.css3animate", "../ui/slideTransition", "../ui/slideDownTransition", "../panels/dungeonPanel", "../panels/fightPanel", "../panels/mainPanel" ], function(require, exports, module) {
    var SpineStack = require("../mvc/stack");
    var Controller = SpineStack.sub({
        el: "#gamePage",
        transition: "down",
        routes: {
            "/panel/main": "main",
            "/panel/dungeon": "dungeon",
            "/panel/fight": "fight"
        },
        init: function() {
            var _this = this;
            $("#navbar").delegate("a", "click", function() {
                var route = $(this).attr("href").substr(1);
                switch (route) {
                  case "/panel/dungeon":
                    var dungeonPanel = require("../panels/dungeonPanel");
                    _this.addChild("dungeon", dungeonPanel);
                    break;

                  case "/panel/fight":
                    var fightPanel = require("../panels/fightPanel");
                    _this.addChild("fight", fightPanel);
                    break;
                }
                _this.navigate(route);
            });
            this.on("contentLoad", this.proxy(this.contentLoad));
        },
        contentLoad: function() {
            var mainPanel = require("../panels/mainPanel");
            this.addChild("main", mainPanel);
            this.navigate("/panel/main", true);
        }
    });
    var controller = new Controller();
    module.exports = controller;
});
