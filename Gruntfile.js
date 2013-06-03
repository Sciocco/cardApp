module.exports = function(grunt) {

	var transport = require('grunt-cmd-transport');
	var style = transport.style.init(grunt);
	var text = transport.text.init(grunt);
	var script = transport.script.init(grunt);
	grunt.initConfig({
		transport: {
			options: {
				paths: ['.'],
				parsers: {
					'.js': [script.jsParser]
				}
			},
			app: {
				options: {
					idleading: 'app/'
				},
				files: [{
						cwd: 'app',
						src: ['**/*.js', '!**/*-debug.js'],
						filter: 'isFile',
						dest: '.build'
					}
				]
			}
		},
		concat: {
			app: {
				files: [{
						src: ['.build/**/*.js', '!.build/**/*-debug.js'],
						dest: 'dist/app.js'
					}
				]
			}
		},
		uglify: {
			load: {
				files: [{
						src: [
								'dist/preloadjs.js',
								'libs/seajs/2.0.0/sea.js',
								'app/app.js',
								'app/load.js'
						],
						dest: 'assets/js/load.js'
					}
				]
			},
			preloadjs: {
				files: [{
						src: [
								'libs/createjs/easeljs/events/EventDispatcher.js',
								"libs/createjs/soundjs/Sound.js",
								"libs/createjs/soundjs/WebAudioPlugin.js",
								"libs/createjs/soundjs/HTMLAudioPlugin.js",
								"libs/createjs/preloadjs/AbstractLoader.js",
								"libs/createjs/preloadjs/LoadQueue.js",
								"libs/createjs/preloadjs/TagLoader.js",
								"libs/createjs/preloadjs/XHRLoader.js"
						],
						dest: 'dist/preloadjs.js'
					}
				]
			},
			easeljs: {
				files: [{
						src: [
								"libs/createjs/easeljs/utils/UID.js",
								"libs/createjs/easeljs/utils/Ticker.js",
								"libs/createjs/easeljs/events/MouseEvent.js",
								"libs/createjs/easeljs/geom/Matrix2D.js",
								"libs/createjs/easeljs/geom/Point.js",
								"libs/createjs/easeljs/geom/Rectangle.js",
								"libs/createjs/easeljs/ui/ButtonHelper.js",
								"libs/createjs/easeljs/display/Shadow.js",
								"libs/createjs/easeljs/display/SpriteSheet.js",
								"libs/createjs/easeljs/display/Graphics.js",
								"libs/createjs/easeljs/display/DisplayObject.js",
								"libs/createjs/easeljs/display/Container.js",
								"libs/createjs/easeljs/display/Stage.js",
								"libs/createjs/easeljs/display/Bitmap.js",
								"libs/createjs/easeljs/display/BitmapAnimation.js",
								"libs/createjs/easeljs/display/Shape.js",
								"libs/createjs/easeljs/display/Text.js",
								"libs/createjs/easeljs/utils/SpriteSheetUtils.js",
								"libs/createjs/easeljs/utils/SpriteSheetBuilder.js",
								"libs/createjs/easeljs/display/DOMElement.js",
								"libs/createjs/easeljs/filters/Filter.js",
								"libs/createjs/easeljs/ui/Touch.js",
								"libs/createjs/tweenjs/Tween.js",
								"libs/createjs/tweenjs/Timeline.js",
								"libs/createjs/tweenjs/Ease.js",
								"libs/createjs/tweenjs/MotionGuidePlugin.js"
						],
						dest: 'dist/easeljs.js'
					}
				]
			},
			libsjs: {
				files: [{
						src: [
								'dist/easeljs.js',
								"libs/zepto/1.0/zepto.js",
								'libs/spine/1.10/spine.js'
						],
						dest: 'dist/libs.js'
					}
				]
			},
			app: {
				files: [{
						src: [
								'dist/libs.js',
								'dist/app.js'
						],
						dest: 'assets/js/app.js'
					}
				]
			}
		},
		clean: {
			spm: ['.build']
		}
	});
	grunt.loadNpmTasks('grunt-cmd-transport');
	grunt.loadNpmTasks('grunt-cmd-concat');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.registerTask('load', ['uglify:preloadjs', 'uglify:load']);
	grunt.registerTask('app', ['transport:app', 'concat:app', 'uglify:easeljs', 'uglify:libsjs','uglify:app']);
	grunt.registerTask('clean', ['clean']);
};