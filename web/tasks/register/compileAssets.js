module.exports = function (grunt) {
	grunt.registerTask('compileAssets', [
		'clean:dev',
    'bower:dev',
		'jst:dev',
    'copy:dev',
		'less:dev',
		'coffee:dev'
	]);
};
