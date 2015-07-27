'use strict';

angular.module('sbAdminApp')

  .factory('userFactory', ['$resource', function ($resource) {
    return $resource('/weibouser/:id', {id: '@id'})
  }])

  .factory('weiboUser', ['$resource', function ($resource) {
    return $resource('/weibouser/userInfo/:weiboId', {weiboId: '@weiboId'})
  }])

  .factory('filters', function () {
    return {
      image: function (data) {
        var pics = new String;
        for (var i in data) {
          var pic = '<div class="col-md-3"><img src="' + data[i] + '" class="user-photo" /></div>';
          pics = pics + pic;
        }
        pics = '<div class="row show-grid user-photos">' + pics + '</div>';
        return pics;
      },
      button: function (data, type, full, meta) {
        var editButton = '<button class="btn btn-info" ng-click="user.edit(' + data + ')">' +
          '   <i class="fa fa-edit"></i>' +
          '</button>&nbsp;';
        var lockButton = '<button class="btn btn-warning" ng-click="user.lock(' + data + ')">' +
          '   <i class="fa fa-eye-slash"></i>' +
          '</button>';
        var unlockButton = '<button class="btn btn-success" ng-click="user.unlock(' + data + ')">' +
          '   <i class="fa fa-eye "></i>' +
          '</button>';
        if (full.lock) {
          return (editButton + unlockButton);
        } else {
          return (editButton + lockButton);
        }
      }
    }
  });
