'use strict';
/**
 * @ngdoc function
 * @name sbAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the sbAdminApp
 */
angular.module('sbAdminApp')
  .controller('LoginCtrl',function($scope, $cookies, authenticationSvc){
    if($cookies.get("userName")){
      $scope.userName = $cookies.get("userName");
      $scope.password = $cookies.get("password");
    }

    //Todo:这里明文保存密码，需更正
    $scope.login = function(){
      if($scope.remember){
        $cookies.put("userName",$scope.userName);
        $cookies.put("password",$scope.password);
      }else{
        $cookies.remove("userName");
        $cookies.remove("password");
      }
      authenticationSvc.login($scope.userName, $scope.password)
    }
  });
