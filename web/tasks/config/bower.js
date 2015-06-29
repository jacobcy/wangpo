module.exports = function(grunt) {
  grunt.config.set('bower', {
    dev: {
      dest: '.tmp/public',
      js_dest: '.tmp/public/js',
      css_dest: '.tmp/public/styles',
      less_dest: '.tmp/public/less',
      fonts_dest: '.tmp/public/fonts',
      options: {
        keepExpandedHierarchy: false,
        ignorePackages: [
          'angular-datatables', //直接copy核心文件，避免引入不必要的插件
          'bootstrap', // 直接copy css文件，js部分由angular-strap替代
          'bootstrap-social',//社交分享
          'datatables-plugins',// 暂不使用
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
          datatables: {
            js_dest: '.tmp/public/js/dependencies'
          },
          jquery: {
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
