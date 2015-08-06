module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
    'bower:dev',
    'copy:dev',
		'jst:dev',
		'less:dev',
		'coffee:dev'
	]);
};
