define(function(require, exports, module) {

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

		if (width !== undefined)
			cv.width = width;
		if (height !== undefined)
			cv.height = height;

		return cv;
	}

	function createHiddenSketchpad(width, height) {
		var cv = document.createElement("canvas");

		if (width !== undefined)
			cv.width = width;
		if (height !== undefined)
			cv.height = height;

		return cv;
	}

	function loadImage(src, type, callback) {
		var img = new Image();
		img.src = src;

		//FIXME: type?

		img.loaded = false;

		img.onload = function() {
			img.loaded = true;

			if (callback)
				callback();
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