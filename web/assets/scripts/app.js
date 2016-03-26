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
    'oc.lazyLoad',
    'ui.router',
    'ui.bootstrap',
    'angular-loading-bar',
    'chart.js',
    'datatables',
    'datatables.columnfilter',
    'ngResource',
    'ngCookies'
  ])

  .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider','$httpProvider',
    //'$httpProvider',
    function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $httpProvider
      //, $httpProvider
    ) {

/**
      // TODO：拦截器，user agent添加bearer token
      $httpProvider.interceptors.push(['$q', '$location','$cookieStore', function ($q, $location, $cookieStore) {
        return {
          request: function (config) {
            // Todo 修改获取Token的方式
            $cookieStore.put("token","myAccessToken");
            config.headers = config.headers || {};
            config.headers.Authorization = 'Bearer '+ $cookieStore.get("token");
            return config;
          },
          responseError: function (response) {
            if (response.status === 401 || response.status === 403) {
              $location.path('/login');
            }
            return $q.reject(response);
          }
        };
      }]);
**/

      $ocLazyLoadProvider.config({
        debug: false,
        events: true
      });

      $urlRouterProvider.otherwise('/dashboard/welcome');

      $stateProvider
        .state('dashboard', {
          url: '/dashboard',
          //templateUrl: 'views/dashboard/main.html'
          template: '<div id="wrapper"><header></header><div id="page-wrapper" style="min-height: 561px;"><div ui-view></div></div></div>'
        })

        //后台自建页面
        .state('dashboard.welcome', {
          url: '/welcome',
          templateUrl: 'views/welcome.html',
        })
        .state('dashboard.user', {
          url: '/user',
          controller: 'UserCtrl as user',
          templateUrl: 'views/user.html'
        })

        //后台模块参考页面
        .state('dashboard.home', {
          url: '/home',
          controller: 'MainCtrl',
          templateUrl: 'views/dashboard/home.html'
        })
        .state('dashboard.forms', {
          url: '/form',
          controller: 'FormCtrl',
          templateUrl: 'views/dashboard/form.html'
        })
        .state('dashboard.charts', {
          url: '/chart',
          controller: 'ChartCtrl',
          templateUrl: 'views/dashboard/chart.html'
        })
        .state('dashboard.tables', {
          url: '/table',
          templateUrl: 'views/dashboard/table.html'
        })
        .state('dashboard.imageUpload', {
          url: '/imageupload',
          //controller: 'ImageUploadCtrl',
          templateUrl: 'views/pages/imageupload.html'
        })

        //UI设计参考页面
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

        // 数据示例页面
        .state('dashboard.datatable', {
          url: '/datatable',
          templateUrl: 'views/pages/datatable.html'
        })
        .state('dashboard.angularTable', {
          url: '/angulartable',
          controller: 'DataCtrl as dt',
          templateUrl: 'views/pages/angulartable.html'
        })
        //todo: 尚未添加bearer login的controller和页面
        .state('dashboard.login', {
          url: '/login',
          // controller: 'LoginCtrl',
          templateUrl: 'views/pages/login.html'
        })
    }]
);


