module.exports = function(grunt) {
  grunt.config.set('bower', {
    dev: {
      dest: '.tmp/public',
      js_dest: '.tmp/public/js',
      css_dest: '.tmp/public/styles',
      less_dest: '.tmp/public/less',
      fonts_dest: '.tmp/public/fonts',
      images_dest: '.tmp/public/img',
      options: {
        keepExpandedHierarchy: false,
        packageSpecific: {
          jquery: {
            js_dest: '.tmp/public/js/dependencies'
          },
          datatables: {
            js_dest: '.tmp/public/js/dependencies'
          },
          angular: {
            js_dest: '.tmp/public/js/dependencies'
          },
          bootstrap: {
            js_dest: '.tmp/public/js/dependencies'
          },
          'sails.io.js': {
            js_dest: '.tmp/public/js/dependencies'
          }
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-bower');

};
