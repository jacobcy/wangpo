'use strict';

/* Filters */

//返回userDataTable中的用户年龄
angular.module('myApp.filters', [])
  .filter('age', function () {
    return function (data) {
      var nowDate = new Date();
      var birthDate = new Date(data);
      var myAge = nowDate.getFullYear() - birthDate.getFullYear();
      return myAge;
    }
  })

  //返回userDataTable中的用户头像
  .filter('image', function () {
    return function (data, width) {
      var pic = data ? '<img src="' + data + '" style="width:' + width + 'px; height:auto" />' : null;
      return pic;
    }
  })

  //返回userDataTable中的用户编辑按钮
  .filter('button', function () {
    return function (data) {
      return '<button data-target="#myModal" data-toggle="modal" class="btn btn-warning" ng-click="user.edit(' + data + ')">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;' +
        '<button class="btn btn-danger" ng-click="user.delete(' + data + ')">' +
        '   <i class="fa fa-trash-o"></i>' +
        '</button>';
    }
  });
