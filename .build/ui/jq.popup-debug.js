define("app/ui/jq.popup-debug", [], function(require, exports, module) {
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
                this.title = opts.suppressTitle ? "" : opts.title || "提示";
                this.message = opts.message || "";
                this.cancelText = opts.cancelText || "取消";
                this.cancelCallback = opts.cancelCallback || function() {};
                this.cancelClass = opts.cancelClass || "button";
                this.doneText = opts.doneText || "确定";
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
                    $el.find("a#action").hide();
                    $el.find("a#cancel").addClass("center");
                }
                $el.find("a").each(function() {
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
                $el.find("button#action").unbind("click");
                $el.find("button#cancel").unbind("click");
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
        $("body").prepend($("<div id='mask'" + opacity + "></div>"));
        $("body div#mask").bind("touchstart", function(e) {
            e.preventDefault();
        });
        $("body div#mask").bind("touchmove", function(e) {
            e.preventDefault();
        });
        uiBlocked = true;
    };
    $.unblockUI = function() {
        uiBlocked = false;
        $("body div#mask").unbind("touchstart");
        $("body div#mask").unbind("touchmove");
        $("body div#mask").remove();
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