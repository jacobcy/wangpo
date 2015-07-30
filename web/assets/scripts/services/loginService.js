'use strict';

angular.module('sbAdminApp')

  //从后台获得授权
  .factory("authenticationSvc", function ($http, $q, $window) {
    var userInfo;

    function login(userName, password) {
      var deferred = $q.defer();

      $http.post("/auth/local", {
        userName: userName,
        password: password
      }).then(function (result) {
        console.log(result.data);
        userInfo = {
          accessToken: result.data.access_token,
          userName: result.data.userName
        };
        $window.sessionStorage["userInfo"] = JSON.stringify(userInfo);
        deferred.resolve(userInfo);
      }, function (error) {
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function getUserInfo() {
      return userInfo;
    }

    return {
      login: login,
      getUserInfo: getUserInfo
    };
  });
