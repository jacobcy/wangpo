module.exports = function(grunt) {
  grunt.config.set('bower', {
    dev: {
      dest: '.tmp/public',
      js_dest: '.tmp/public/js',
      css_dest: '.tmp/public/styles',
      fonts_dest: '.tmp/public/fonts/',
      options: {
        keepExpandedHierarchy: false,
        ignorePackages: ['bootstrap-social',//社交分享
          'datatables-plugins',
          'datatables-responsive',
          'flot',//图表样式
          'flot.tooltip',
          'holderjs',//缩略图占位
          'mocha',//单元测试
          'morrisjs',//图表样式
          'raphael'//矢量图形
        ],
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
