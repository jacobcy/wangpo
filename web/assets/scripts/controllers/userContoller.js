'use strict';

angular.module('sbAdminApp')


.controller('UserCtrl',function(DTOptionsBuilder, DTColumnBuilder, userFactory, $scope, $modal, $filter, filters ){
    var user = this;
    user.dtInstance = {};

    function alert(obj, type, message) {
      obj.alert = {
        'type': type,
        'message': message
      }
    }
    alert(user, 'hide');

    var modalInstance = $modal.open({
      animation: $scope.animationsEnabled,
      templateUrl: '/templets/userform.html',
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
    });

    /*
    // Pre-fetch an external template populated with a custom scope
    var myOtherModal = $modal({scope: $scope, template: '/templates/userform.html', show: false});
    // Show when some event occurs (use $promise property to ensure the template has been loaded)
    $scope.showModal = function() {
      myOtherModal.$promise.then(myOtherModal.show);
    };
    $scope.hideModal = function() {
      myOtherModal.$promise.then(myOtherModal.hide);
    };
    */

    user.sex = [{
      value: 1,
      title: '男'
    }, {
      value: 2,
      title: '女'
    }, {
      value: 0,
      title: '未知'
    }];

    //创建用户数据
    user.create = function () {
      alert(user, 'alert-success', '创建新用户');
      user.newbie = true;
      user.city = false;
      user.detail = {};
      $scope.showModal();
    }
    user.save = function () {
      user.detail.birthday = filters.date(user.date);
       userFactory.save(user.detail, function () {
       user.dtInstance.reloadData()
       }, function (error) {
       alert(user, 'alert-danger', '更新失败' + error);
       });
    }

//编辑用户数据
    user.edit = function (id) {
      user.newbie = false;
       userFactory.get({id: id}, function () {
       console.log($filter('age')(user.detail.userBirthday));
       });
    }
    user.addPhoto = function () {
      user.detail.photos.push(user.photo);
      user.photo = null;
    }
    user.removePhoto = function(id){
      user.detail.photos.splice(id, 1);
    }
    user.update = function (id) {
      if (!user.detail.photos) {
        user.detail.photos = [];
      }
      if(user.date){
        user.detail.birthday = filters.date(user.date);
      }
      //console.log(user.detail.photos);

    };

//删除用户数据
    user.delete = function (id) {
      alert(user, 'alert-danger', '删除【' + user.detail.nickname + '】的个人资料');
       userFactory.remove({id: id},
       function () {
       user.dtInstance.reloadData()
       }, function () {
       alert(user, 'alert-danger', '删除失败');
       });
      $scope.hideModal();
    };

//锁定用户数据
    user.lock = function (id) {

       userFactory.remove({id: id},
       function () {
       user.dtInstance.reloadData()
       }, function () {
       alert(user, 'alert-danger', '删除失败');
       });
    };

//恢复用户数据
    user.unlock = function (id) {
      userSails.get(id).success(
        function (data) {
          user.detail = data;
          alert(user, 'alert-success', '解锁【' + user.detail.nickname + '】的个人资料');
        });


    };


    user.dtOptions = DTOptionsBuilder.fromSource(userFactory.query)
      .withOption('responsive', true)
      //过滤表格数据
      .withColumnFilter({
        aoColumns: [{
          type: 'numble'
        }, {
          type: 'text',
          bRegex: true,
          bSmart: true
        }, {
          type: 'select',
          bRegex: false,
          values: ['男', '女']
        }, {
          type: 'numble'
        }, {
          type: 'numble'
        }, {
          type: 'text',
          bRegex: true,
          bSmart: true
        }]
      });


    user.dtColumns = [
      DTColumnBuilder.newColumn('weiboId').withTitle('ID').withOption('width', '20%').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn('nickname').withTitle('昵称').withOption('width', '20%').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn('gender').withTitle('性别').withOption('width', '10%').renderWith(function (data) {
        return $filter('sex')(data)
      }),
      DTColumnBuilder.newColumn('birthday').withTitle('年龄').withOption('width', '10%').withOption('defaultContent', '-').renderWith(function (data) {
        return $filter('age')(data);
      }),
      DTColumnBuilder.newColumn('height').withTitle('身高').withOption('width', '10%').withOption('defaultContent', '-'),
      DTColumnBuilder.newColumn('location').withTitle('地址').withOption('width', '15%').withOption('defaultContent', '-').renderWith(function (data) {
        return filters.city(data);
      }),
      DTColumnBuilder.newColumn('id').withTitle('Actions').withOption('width', '15%').notSortable().renderWith(function (data, type, full, meta) {
        return filters.button(data, type, full, meta);
      }),
      // 展开显示数据
      DTColumnBuilder.newColumn('photos').withTitle('照片').withOption('width', '100%').withOption('defaultContent', '-').withClass('none').renderWith(function (data) {
        return filters.image(data);
      }),
      DTColumnBuilder.newColumn('description').withTitle('个人说明').withOption('defaultContent', '-').withClass('none')
    ]
  })
