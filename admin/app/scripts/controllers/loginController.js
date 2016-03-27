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
            $scope.submit = function (id, pw) {
                $resource('http://api.iwangpo.com/main/accessToken').get({
                    identifier: id,
                    password: pw
                }, function (data) {
                    $cookieStore.put('Bearer', data)
                }, function (error) {
                    $scope.error = error;
                    console.log(error)
                })
            }
        }]);
