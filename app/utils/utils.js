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


	exports.slice = [].slice;

	exports.indexOf = [].indexOf || function(item) {
		for (var i = 0, l = this.length; i < l; i++) {
			if (i in this && this[i] === item) return i;
		}
		return -1;
	};

	var __hasProp = {}.hasOwnProperty;
	exports.hasProp = __hasProp;

	exports.extends = function(child, parent) {
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

	exports.bind = function(fn, me) {
		return function() {
			return fn.apply(me, arguments);
		};
	};

	exports.concatObject = function(o1, o2) {
		var o = {}, key;

		for (key in o1) {
			if (__hasProp.call(o1, key)) o[key] = o1[key];
		}

		for (key in o2) {
			if (__hasProp.call(o2, key)) o[key] = o2[key];
		}

		return o;
	};



});