'use strict';

angular.module('sbAdminApp')

  .config(['$httpProvider', function ($httpProvider) {
    $httpProvider.defaults.withCredentials = true;
  }])

  .controller('loginCtrl', ['$scope', '$cookies', '$http', function login($scope, $cookies, $http) {

    if ($cookies.get("identifier")) {
      // Todo： 记住密码自动勾选
      $scope.identifier = $cookies.get("identifier");
      $scope.password = $cookies.get("password");
      $scope.remember = $cookies.get("remember");
    }

    $scope.login = function () {
      if ($scope.remember) {
        //$scope.password= SHA1($scope.password).toString();
        console.log($scope.remember);
        $cookies.put("identifier", $scope.identifier, {expires: '2015-12-31'});
        $cookies.put("password", $scope.password, {expires: '2015-12-31'});
        $cookies.put("remember", $scope.remember, {expires: '2015-12-31'});
      }

      $http.post("http://iwangpo.com/auth/local", {
        identifier: $scope.identifier,
        password: $scope.password
      }).then(function (data) {
        console.log('iwangpo.success')
      }, function (error) {
        console.log('iwangpo:' + error.toSource())
      })

      $http.post("/auth/local", {
        identifier: $scope.identifier,
        password: $scope.password
      }).then(function (data) {
        console.log('local.success')
      }, function (error) {
        console.log('local.error')
      })
    }
  }]);
