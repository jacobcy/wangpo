'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('LoginCtrl', ['$scope', '$state', 'dataServer', '$cookieStore',
        function ($scope, $state, dataServer, $cookieStore) {
            $scope.submit = function (id, pw) {
                dataServer.login().get({
                    identifier: id,
                    password: pw
                }, function (data) {
                    $cookieStore.put('Bearer', data);
                    $state.go('dashboard.welcome')
                }, function (error) {
                    $scope.error = '无法访问后台服务器，请咨询管理员'
                })
            }
        }])