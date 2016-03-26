/**
 * Minify files with UglifyJS.
 *
 * ---------------------------------------------------------------
 *
 * Minifies client-side javascript `assets`.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-uglify
 *
 */
module.exports = function(grunt) {

	grunt.config.set('uglify', {
		dist: {
			src: ['.tmp/public/concat/production.js'],
			dest: '.tmp/public/min/production.min.js'
		}

    //build: {
    //  //任务三：按原文件结构压缩js文件夹内所有JS文件
    //    files: [{
    //      expand:true,
    //      cwd:'.tmp/public/js',//js目录下
    //      src:'**/*.js',//所有js文件
    //      dest: '.tmp/public/min/js'//输出到此目录下
    //    }]
    //}

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
};
