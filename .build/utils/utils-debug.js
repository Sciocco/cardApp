define("app/utils/utils-debug", [], function(require, exports, module) {
    var app = window.APP;
    function createSketchpad(width, height, parent) {
        if (arguments.length == 1) {
            parent = width;
            width = undefined;
        }
        var cv = document.createElement("canvas");
        if (parent === undefined) {
            document.body.appendChild(cv);
        } else {
            parent.appendChild(cv);
        }
        if (width !== undefined) cv.width = width;
        if (height !== undefined) cv.height = height;
        return cv;
    }
    function createHiddenSketchpad(width, height) {
        var cv = document.createElement("canvas");
        if (width !== undefined) cv.width = width;
        if (height !== undefined) cv.height = height;
        return cv;
    }
    function loadImage(src, callback) {
        var img = new Image();
        img.src = app.config.ASSET_URL + src;
        //FIXME: type?
        img.loaded = false;
        img.onload = function() {
            img.loaded = true;
            if (callback) callback(img);
        };
        return img;
    }
    function createAudio() {
        return document.createElement("audio");
    }
    exports.createSketchpad = createSketchpad;
    exports.loadImage = loadImage;
    exports.createAudio = createAudio;
    exports.createHiddenSketchpad = createHiddenSketchpad;
});