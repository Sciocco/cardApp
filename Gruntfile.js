module.exports = function(grunt) {
	// 配置
	grunt.initConfig({
		combo: {
			build: {
				files: [{
					expand: true,
					cwd: 'app/',
					src: '**/*.js',
					dest: 'dist',
					ext: '.combo.js'
				}]
			}
		}
	});

	grunt.loadNpmTasks('grunt-cmd-combo');
	// 注册任务 任务名称可以自定
	grunt.registerTask('default', ["combo"]);

};