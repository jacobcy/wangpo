'use strict';

angular.module('sbAdminApp')

  .factory('utils', ['codeToCity', 'cityToCode', 'weiboCities',
    function (codeToCity, cityToCode, weiboCities) {
      return {

        //格式化用户的性别
        gender: function (data) {
          if (angular.isDefined(data)) {
            switch (data) {
              case 1:
                return '男';
                break;
              case 2:
                return '女';
                break;
              default:
                return '未知';
            }
          } else {
            return '-'
          }
        },

        //格式化用户的年龄
        age: function (data) {
          if (angular.isDefined(data)) {
            if (!data.isDate) {
              data = new Date(data)
            }
            var today = new Date();
            return today.getFullYear() - data.getFullYear();
          } else {
            return '-'
          }
        },

        //格式化用户头像
        avatar: function (data) {
          if (angular.isDefined(data)) {
            return '<div class="avatar-grid"><img src="' + data + '" class="user-avatar" /></div>'
          } else {
            return '<div class="avatar-grid"><img src="http://tp3.sinaimg.cn/3304467554/50/22869450874/0" class="user-avatar" /></div>'
          }
        },

        photos: function (data) {
          if (angular.isDefined(data)) {
            var pics = new String;
            for (var i in data) {
              var pic = '<div class="col-md-3"><img src="' + data[i] + '!sample" class="user-photo" /></div>';
              pics = pics + pic;
            }
            pics = '<div class="row show-grid user-photos">' + pics + '</div>';
            return pics;
          } else {
            return '暂无照片'
          }
        },


        //格式化用户操作按钮
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
        },

        // 转换区码为城市
        codeToCity: function (data) {
          if (angular.isDefined(data)) {
            if (codeToCity[data]) {
              return codeToCity[data];
            }
            return '未知'
          } else {
            return '-'
          }
        },

        //根据微博的数据结构，返回城市区号
        weiboCities: function (province, city) {
          switch (province) {
            case '11':
              return '010';
              break;
            case '31':
              return '021';
              break;
            case '12':
              return '022';
              break;
            case '50':
              return '023';
              break;
            default :
              // Todo:根据省市的不同获得城市区号(province.json)
              if(!weiboCities[province]){
                return '000';
              }
              var resCity = weiboCities[province]['cities'][city];
              if (!resCity) {
                return weiboCities[province]['defaultCode'];
              }
              var resCode = cityToCode[resCity];
              if(!resCode){
                return weiboCities[province]['defaultCode'];
              }
              return resCode;
          }
        }
      }
    }]);
