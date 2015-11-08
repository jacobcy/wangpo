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
    'ngResource'
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
        //templateUrl: 'views/dashboard/main.html'
        template:'<div id="wrapper"><header></header><div id="page-wrapper" style="min-height: 561px;"><div ui-view></div></div></div>'
      })

      //后台自建页面
      .state('dashboard.welcome', {
        url: '/welcome',
        //templateUrl: 'views/welcome.html',
        template:'<div class="row"><div class="col-lg-12"><h1 class="page-header">Welcome</h1></div></div><div class="row"><div class="col-md-10 col-md-offset-1"><div class="jumbotron"><h1>欢迎进入后台管理系统</h1><p>Help you find friends</p><p><a href="index.html" class="btn btn-primary btn-lg" role="button">返回首页<span class="fa fa-arrow-left fa-fw"></span></a></p></div></div></div>'
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
      .state('dashboard.blank', {
        url: '/blank',
        templateUrl: 'views/pages/blank.html'
      })
      .state('dashboard.dataTable', {
        url: '/datatable',
        controller: 'DataCtrl as dt',
        templateUrl: 'views/pages/datatable.html'
      })
      .state('dashboard.login', {
        url: '/login',
        controller: 'LoginCtrl',
        templateUrl: 'views/pages/login.html'
      })
  }]);


