var app = angular.module('myApp', ['ngCookies']);

app.controller('login', function login($scope, $apply, $cookies, $http) {

  if($cookies.get("userName")){
    $scope.$apply();
    $scope.identifier = $cookies.get("userName");
    $scope.password = $cookies.get("password");
    $scope.remember = $cookies.get("remember");
  }

  $scope.login = function () {
    if ($scope.remember) {
      // $scope.password= SHA1($scope.password).toString();
      $cookies.put("userName", $scope.identifier, {expires: '2015-12-31'});
      $cookies.put("password", $scope.password, {expires: '2015-12-31'});
      $cookies.put("remember", $scope.remember, {expires: '2015-12-31'});
    } else {
      $cookies.remove("userName");
      $cookies.remove("password");
    }
    /*
    $http.post("/auth/local", {
      identifier: $scope.identifier,
      password: password
    })
    */
  }
})
