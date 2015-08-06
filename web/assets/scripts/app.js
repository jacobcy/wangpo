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
    'datatables',
    //'chart.js',
    'datatables.columnfilter',
    'sbAdminApp.directives',
    'sbAdminApp.services'
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

      .state('dashboard.user', {
        url: '/user',
        controller: 'UserCtrl as user',
        templateUrl: 'views/user.html'
      })
      .state('dashboard.home', {
        url: '/home',
        controller: 'MainCtrl',
        templateUrl: 'views/dashboard/home.html'
      })
      .state('login', {
        url: '/login',
        controller: 'LoginCtrl',
        templateUrl: 'views/pages/login.html'
      })
      .state('dashboard.chart', {
        url: '/chart',
        controller: 'ChartCtrl',
        templateUrl: 'views/dashboard/chart.html'
      })

      .state('dashboard.welcome', {
        //templateUrl: 'views/welcome.html',
        template:'<div class="row"><div class="col-lg-12"><h1 class="page-header">Welcome</h1></div></div><div class="row"><div class="col-md-10 col-md-offset-1"><div class="jumbotron"><h1>欢迎进入后台管理系统</h1><p>Help you find friends</p><p><a href="index.html" class="btn btn-primary btn-lg" role="button">返回首页<span class="fa fa-arrow-left fa-fw"></span></a></p></div></div></div>',
        url: '/welcome'
      })
      .state('dashboard.form', {
        templateUrl: 'views/dashboard/form.html',
        controller: 'FormCtrl',
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
  }]);


