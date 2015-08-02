var app = angular.module('myApp', ['ngCookies']);

app.controller('login', function login($scope, $cookies, $http) {

  if($cookies.get("userName")){
    // Todo： 记住密码自动勾选
    console.log($scope.remember);
    $scope.identifier = $cookies.get("userName");
    $scope.password = $cookies.get("password");
    $scope.remember = $cookies.get("remember");
    console.log($scope.remember);
  }

  $scope.login = function () {
    if ($scope.remember) {
      // $scope.password= SHA1($scope.password).toString();
      $cookies.put("userName", $scope.identifier, {expires: '2015-12-31'});
      $cookies.put("password", $scope.password, {expires: '2015-12-31'});
      $cookies.put("remember", $scope.remember, {expires: '2015-12-31'});
    }
    /*
    $http.post("/auth/local", {
      identifier: $scope.identifier,
      password: password
    })
    */
  }
})
