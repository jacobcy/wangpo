'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
    .controller('LoginCtrl', ['$scope', '$resource', '$cookieStore',
        function ($scope, $resource, $cookieStore) {
            var login = $resource('http://api.iwangpo.com/main/accessToken', {withCredentials: true});

            $scope.submit = function (id, pw) {
                login.get({
                    identifier: id,
                    password: pw
                }, function (data) {
                    $cookieStore.put('token', data)
                }, function (error) {
                    $scope.error = error;
                    console.log(error)
                })
            }
        }]);
