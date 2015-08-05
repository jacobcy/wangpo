'use strict';
/**
 * @ngdoc overview
 * @name sbAdminApp
 * @description
 * # sbAdminApp
 *
 * Main module of the application.
 */
angular
  .module('sbAdminApp', [
    'ngResource',
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'datatables'
  ])

  .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider) {

    $ocLazyLoadProvider.config({
      debug: false,
      events: true
    });

    $urlRouterProvider.otherwise('/dashboard/welcome');

    $stateProvider
      .state('dashboard', {
        url: '/dashboard',
        templateUrl: 'views/dashboard/main.html',
        resolve: {
          loadMyDirectives: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'sbAdminApp',
                files: [
                  'scripts/directives/header/header.js',
                  'scripts/directives/header/header-notification/header-notification.js',
                  'scripts/directives/sidebar/sidebar.js',
                  'scripts/directives/sidebar/sidebar-search/sidebar-search.js'
                ]
              })
            /*
             $ocLazyLoad.load(
             {
             name: 'ngCookies',
             files: ['js/angular-cookies.js']
             })
             $ocLazyLoad.load(
             {
             name: 'ngAnimate',
             files: ['js/angular-animate.js']
             }),
             $ocLazyLoad.load(
             {
             name: 'toggle-switch',
             files: [
             "js/angular-toggle-switch.js",
             "css/angular-toggle-switch.css"
             ]
             }),
             $ocLazyLoad.load(
             {
             name: 'ngSanitize',
             files: ['js/angular-sanitize.js']
             }),
             $ocLazyLoad.load(
             {
             name: 'ngTouch',
             files: ['js/angular-touch.js']
             })
             */
          }
        }
      })

      .state('dashboard.welcome', {
        templateUrl: 'views/welcome.html',
        url: '/welcome'
      })

      .state('dashboard.user', {
        url: '/user',
        controller: 'UserCtrl as user',
        templateUrl: 'views/user.html',
        resolve: {
          loadMyFile: function ($ocLazyLoad) {
            return $ocLazyLoad.load(
              {
                name: 'datatables.columnfilter',
                files: [
                  'js/jquery.dataTables.columnFilter.js',
                  'js/angular-datatables.columnfilter.js'
                ]
              }),
              $ocLazyLoad.load({
                name: 'sbAdminApp',
                files: [
                  'scripts/services/cities.js',
                  'scripts/services/utils.js',
                  'scripts/services/services.js',
                  'scripts/filters/filters.js',
                  'scripts/controllers/userContorller.js'
                ]
              })
            /*
             $ocLazyLoad.load(
             {
             name: 'datatables.bootstrap',
             files: [
             'js/angular-datatables.bootstrap.js',
             'css/datatables.bootstrap.css'
             ]
             }),
             */
          }
        }
      })

      .state('dashboard.home', {
        url: '/home',
        controller: 'MainCtrl',
        templateUrl: 'views/dashboard/home.html',
        resolve: {
          loadMyFiles: function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sbAdminApp',
              files: [
                'scripts/controllers/main.js',
                'scripts/directives/timeline/timeline.js',
                'scripts/directives/notifications/notifications.js',
                'scripts/directives/chat/chat.js',
                'scripts/directives/dashboard/stats/stats.js',

                'css/timeline.css'
              ]
            })
          }
        }
      })

      .state('login', {
        url: '/login',
        controller: 'LoginCtrl',
        templateUrl: 'views/pages/login.html',
        resolve: {
          loadMyFiles: function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'sbAdminApp',
              files: [
                'js/controllers/loginController.js',
              ]
            })
          }
        }
      })

      .state('dashboard.chart', {
        url: '/chart',
        controller: 'ChartCtrl',
        templateUrl: 'views/dashboard/chart.html',
        resolve: {
          loadMyFile: function ($ocLazyLoad) {
            return $ocLazyLoad.load({
              name: 'chart.js',
              files: [
                'js/Chart.js',
                'js/angular-chart.js',

                'css/angular-chart.css',
              ]
            }),
              $ocLazyLoad.load({
                name: 'sbAdminApp',
                files: ['scripts/controllers/chartContorller.js']
              })
          }
        }
      })
      .state('dashboard.form', {
        templateUrl: 'views/dashboard/form.html',
        url: '/form'
      })
      .state('dashboard.blank', {
        templateUrl: 'views/pages/blank.html',
        url: '/blank'
      })
      .state('dashboard.table', {
        templateUrl: 'views/dashboard/table.html',
        url: '/table'
      })
      .state('dashboard.panels-wells', {
        templateUrl: 'views/ui-elements/panels-wells.html',
        url: '/panels-wells'
      })
      .state('dashboard.buttons', {
        templateUrl: 'views/ui-elements/buttons.html',
        url: '/buttons'
      })
      .state('dashboard.notifications', {
        templateUrl: 'views/ui-elements/notifications.html',
        url: '/notifications'
      })
      .state('dashboard.typography', {
        templateUrl: 'views/ui-elements/typography.html',
        url: '/typography'
      })
      .state('dashboard.icons', {
        templateUrl: 'views/ui-elements/icons.html',
        url: '/icons'
      })
      .state('dashboard.grid', {
        templateUrl: 'views/ui-elements/grid.html',
        url: '/grid'
      })
  }])


