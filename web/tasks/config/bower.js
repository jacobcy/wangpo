module.exports = function(grunt) {
  grunt.config.set('bower', {
    dev: {
      dest: '.tmp/public',
      js_dest: '.tmp/public/js',
      css_dest: '.tmp/public/styles',
      fonts_dest: '.tmp/public/fonts/',
      options: {
        keepExpandedHierarchy: false,
        ignorePackages: ['datatables-plugins','mocha','raphael'],
        packageSpecific: {
          angular: {
            js_dest: '.tmp/public/js/dependencies'
          },
          'sails.io.js': {
            js_dest: '.tmp/public/js/dependencies'
          },
          jquery: {
            js_dest: '.tmp/public/js/dependencies'
          },
          'datatables-responsive': {
            js_dest: '.tmp/public/js/lib'
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower');

};
