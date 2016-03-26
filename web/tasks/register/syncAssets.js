module.exports = function (grunt) {
	grunt.registerTask('syncAssets', [
    'sync:dev',
		'jst:dev',
		'less:dev',
		'coffee:dev'
	]);
};
