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
        'angular-loading-bar'
    ])

    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider',
        //'$httpProvider',
        function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider
                  //, $httpProvider
        ) {
            /**
             // TODO：拦截器，user agent添加bearer token
             $httpProvider.interceptors.push(['$q', '$state', '$cookieStore', function ($q, $state, $cookieStore) {
                return {
                    request: function (config) {
                        config.headers = config.headers || {};
                        config.headers.Authorization = $cookieStore.get("Bearer").token;
                        return config;
                    },
                    responseError: function (response) {
                        if (response.status === 401 || response.status === 403) {
                            $state.go('dashboard.login');
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
                    templateUrl: 'views/dashboard/main.html',
                    //template: '<div id="wrapper"><header></header><div id="page-wrapper" style="min-height: 561px;"><div ui-view></div></div></div>',
                    resolve: {
                        loadMyDirectives: function ($ocLazyLoad) {
                            return $ocLazyLoad.load(
                                {
                                    name: 'sbAdminApp',
                                    files: [
                                        'scripts/services/services.js',
                                        'scripts/directives/header/header.js',
                                        'scripts/directives/header/header-notification/header-notification.js',
                                        'scripts/directives/sidebar/sidebar.js',
                                        'scripts/directives/sidebar/sidebar-search/sidebar-search.js'
                                    ]
                                }),
                                $ocLazyLoad.load(
                                    {
                                        name: 'dataTables',
                                        files: ["bower_components/datatables/media/js/jquery.dataTables.min.js",
                                            "bower_components/datatables/media/css/jquery.dataTables.min.css",
                                            "bower_components/angular-datatables/dist/angular-datatables.min.js"
                                        ]
                                    }),
                                $ocLazyLoad.load(
                                    {
                                        name: 'ngResource',
                                        files: ['bower_components/angular-resource/angular-resource.min.js']
                                    }),
                                $ocLazyLoad.load(
                                    {
                                        name: 'ngCookies',
                                        files: ['bower_components/angular-cookies/angular-cookies.min.js']
                                    })
                            /**
                             $ocLazyLoad.load(
                             {
                                 name: 'toggle-switch',
                                 files: ["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                                     "bower_components/angular-toggle-switch/angular-toggle-switch-bootstrap.css"
                                 ]
                             }),
                             $ocLazyLoad.load(
                             {
                                 name: 'ngAnimate',
                                 files: ['bower_components/angular-animate/angular-animate.min.js']
                             }),
                             $ocLazyLoad.load(
                             {
                                 name: 'ngSanitize',
                                 files: ['bower_components/angular-sanitize/angular-sanitize.min.js']
                             }),
                             $ocLazyLoad.load(
                             {
                                 name: 'ngTouch',
                                 files: ['bower_components/angular-touch/angular-touch.min.js']
                             })
                             **/
                        }
                    }
                })

                //后台自建页面
                .state('dashboard.welcome', {
                    url: '/welcome',
                    templateUrl: 'views/welcome.html'
                })
                .state('dashboard.user', {
                    url: '/user',
                    controller: 'UserCtrl as user',
                    templateUrl: 'views/user.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'styles/style.css',
                                    'scripts/controllers/userController.js',
                                    'scripts/controllers/userModalController.js',
                                    'scripts/directives/directives.js',
                                    'scripts/filters/filters.js',
                                    'scripts/services/cities.js',
                                    'scripts/services/utils.js'
                                ]
                            }),
                                $ocLazyLoad.load(
                                    {
                                        name: 'dataTables',
                                        files: [
                                            "bower_components/datatables-responsive/js/dataTables.responsive.js",
                                            "bower_components/datatables-responsive/css/dataTables.responsive.css",
                                            'bower_components/select2/dist/js/select2.min.js',
                                            'bower_components/select2/dist/css/select2.min.css',
                                            'bower_components/jquery-datatables-columnfilter/jquery.dataTables.columnFilter.js',
                                            "bower_components/angular-datatables/dist/plugins/columnfilter/angular-datatables.columnfilter.min.js"
                                            //'bower_components/datatables-light-columnfilter/dist/dataTables.lightColumnFilter.min.js',
                                            //'bower_components/angular-datatables/dist/plugins/light-columnfilter/angular-datatables.light-columnfilter.min.js'
                                        ]
                                    })
                        }
                    }
                })
                .state('dashboard.imageUpload', {
                    url: '/imageupload',
                    //controller: 'ImageUploadCtrl',
                    templateUrl: 'views/pages/imageupload.html'
                })
                //todo: 尚未添加bearer login的controller和页面
                .state('dashboard.login', {
                    url: '/login',
                    controller: 'LoginCtrl',
                    templateUrl: 'views/pages/login.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/controllers/loginController.js'
                                ]
                            })
                        }
                    }
                })
                // 数据示例页面
                .state('dashboard.datatable', {
                    url: '/datatable',
                    templateUrl: 'views/pages/datatable.html'
                })
                .state('dashboard.angularTable', {
                    url: '/angulartable',
                    controller: 'DataCtrl as dt',
                    templateUrl: 'views/pages/angulartable.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/controllers/dataController.js'
                                ]
                            })
                        }
                    }
                })
                //后台模块参考页面
                .state('dashboard.home', {
                    url: '/home',
                    controller: 'MainCtrl',
                    templateUrl: 'views/dashboard/home.html',
                    resolve: {
                        loadMyFiles: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'sbAdminApp',
                                files: [
                                    'scripts/controllers/mainController.js',
                                    'scripts/directives/timeline/timeline.js',
                                    'scripts/directives/notifications/notifications.js',
                                    'scripts/directives/chat/chat.js',
                                    'scripts/directives/dashboard/stats/stats.js'
                                ]
                            })
                        }
                    }
                })
                .state('dashboard.forms', {
                    url: '/form',
                    templateUrl: 'views/dashboard/form.html'
                })
                .state('dashboard.charts', {
                    url: '/chart',
                    controller: 'ChartCtrl',
                    templateUrl: 'views/dashboard/chart.html',
                    resolve: {
                        loadMyFile: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'chart.js',
                                files: [
                                    'bower_components/angular-chart.js/dist/angular-chart.min.js',
                                    'bower_components/angular-chart.js/dist/angular-chart.css'
                                ]
                            }),
                                $ocLazyLoad.load({
                                    name: 'sbAdminApp',
                                    files: ['scripts/controllers/chartController.js']
                                })
                        }
                    }
                })
                .state('dashboard.tables', {
                    url: '/table',
                    templateUrl: 'views/dashboard/table.html'
                })
                .state('dashboard.blank', {
                    templateUrl: 'views/pages/blank.html',
                    url: '/blank'
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
        }]
);


