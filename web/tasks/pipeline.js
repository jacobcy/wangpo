/**
 * grunt/pipeline.js
 *
 * The order in which your css, javascript, and template files should be
 * compiled and linked from your views and static HTML files.
 *
 * (Note that you can take advantage of Grunt-style wildcard/glob/splat expressions
 * for matching multiple files.)
 */



// CSS files to inject in order
//
// (if you're using LESS with the built-in default config, you'll want
//  to change `assets/styles/importer.less` instead.)
var cssFilesToInject = [
  //dependency css
  'css/bootstrap.css',
  'css/main.css',
  'css/sb-admin-2.css',
  'css/metisMenu.css',
  'css/loading-bar.css',
  'css/font-awesome.css',
  // dataTables css
  'css/jquery.dataTables.css',
  'css/dataTables.responsive.css',
  // SB-Admin-2 css
  // 'css/angular-chart.css',
  //'css/timeline.css',

  'css/style.css'
];


// Client-side javascript files to inject in order
// (uses Grunt-style wildcard/glob/splat expressions)
var jsFilesToInject = [

  // Load sails.io before everything else
  //'js/dependencies/sails.io.js',

  // Dependencies like jQuery, or Angular are brought in here
  'js/dependencies/jquery.js',
  'js/dependencies/angular.js',
  'js/dependencies/bootstrap.js',

  // All of the rest of importants js
  'js/angular-ui-router.js',
  'js/angular-resource.js',
  'js/angular-cookies.js',
  'js/json3.js',
  'js/ocLazyLoad.js',
  'js/loading-bar.js',
  'js/ui-bootstrap-tpls.js',
  'js/metisMenu.js',

  // dataTables js
  'js/jquery.dataTables.js',
  'js/dataTables.responsive.js',
  'js/angular-datatables.js',
  'js/jquery.dataTables.columnFilter.js',
  'js/angular-datatables.columnfilter.js',

  // SB-Admin-2 js
  //'js/Chart.js',
  //'js/angular-chart.js',
  'js/sb-admin-2.js',

  'scripts/app.js',
  // angular controllers
  'scripts/controllers/userController.js',
  'scripts/controllers/loginController.js',
  'scripts/controllers/formController.js',


  // angular directives
  'scripts/directives/directives.js',
  'scripts/directives/header/header.js',
  'scripts/directives/header/header-notification/header-notification.js',
  'scripts/directives/sidebar/sidebar.js',

  // angular filters
  'scripts/filters/filters.js',

  // angular services
  'scripts/services/services.js',
  'scripts/services/utils.js',
  'scripts/services/cities.js'

];


// Client-side HTML templates are injected using the sources below
// The ordering of these templates shouldn't matter.
// (uses Grunt-style wildcard/glob/splat expressions)
//
// By default, Sails uses JST templates and precompiles them into
// functions for you.  If you want to use jade, handlebars, dust, etc.,
// with the linker, no problem-- you'll just want to make sure the precompiled
// templates get spit out to the same file.  Be sure and check out `tasks/README.md`
// for information on customizing and installing new tasks.
var templateFilesToInject = [
  'templates/**/*.html'
];



// Prefix relative paths to source files so they point to the proper locations
// (i.e. where the other Grunt tasks spit them out, or in some cases, where
// they reside in the first place)
module.exports.cssFilesToInject = cssFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.jsFilesToInject = jsFilesToInject.map(function(path) {
  return '.tmp/public/' + path;
});
module.exports.templateFilesToInject = templateFilesToInject.map(function(path) {
  return 'assets/' + path;
});
