module.exports = function (grunt) {
	grunt.registerTask('linkAssets', [
		'sails-linker:devJsRelative',
		'sails-linker:devStyles',
		'sails-linker:devTpl',
		'sails-linker:devJsJade',
		'sails-linker:devStylesJade',
		'sails-linker:devTplJade'
	]);
};
