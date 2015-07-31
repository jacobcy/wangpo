'use strict';

angular.module('sbAdminApp')

  //通过后台数据库获取用户资料
  .factory('userFactory', ['$resource', function ($resource) {
    return $resource('/weibouser/:id', {id: '@id'})
  }])



  //通过微博用户ID或者用户主页URL查询用户资料
  .service('weiboUser', ['$q', '$resource', 'userFactory', 'utils',
    function ($q, $resource, userFactory, utils) {

      //根据微博用户ID，从微博后台获取用户资料
      //Todo:调试结束，替换为相对地址
      var searchId = $resource('http://iwangpo.com/weibouser/userInfo/', {weiboId: '@weiboId'});
      //根据微博用户个性化域名，从微博后台获取用户资料
      var searchUrl = $resource('http://iwangpo.com/weibouser/userByUrl/', {domain: '@domain'});
      var user = {};

      //根据微博数据结构，返回用户性别
      function getGender(data) {
        switch (data) {
          case "m":
            return 1;
            break;
          case"f":
            return 2;
            break;
          default:
            return 3;
        }
      }

      //输入用户ID或者个性化域名，返回用户基本资料
      this.getInfo = function (data) {
        var deferred = $q.defer();

        if (angular.isString(data)) {
          // Todo:通过个性化域名获得用户资料
          var regName = /weibo\.com\/(\w*?)[\/\?]?/i;
          var regId = /^.*?weibo\.com\/u\/(\d*?)[\/\?]?.*$'/i;

          //判断是否为个性化域名
          var resultUrl = data.match(/weibo\.com\/(\w{3,})/i);

          //如果是个性化域名，取回微博数据
          if (resultUrl) {
            var weiboUrl = resultUrl[0];
            weiboUrl = weiboUrl.replace(/weibo\.com\//i, '');
            console.log(weiboUrl);
            searchUrl.query({domain: weiboUrl}, function (data) {
              user = {
                weiboId: data.id,
                nickname: data.screen_name,
                avatar: data.profile_image_url,
                gender: getGender(data.gender),
                location: utils.cityToCode(data.province, data.city)
              }
              console.log('resolve');
            }, function (error) {
              console.log('reject');
              deferred.reject('无法获得该用户的微博ID');
              return deferred.promise;
            });

            //如果不是个性化域名， 检查输入框中的数字
          } else {
            var resultId = data.match(/\d{3,}/);
            if (resultId) {
              var weiboId = resultId[0];
              //从微博后台取回用户数据
              searchId.query({weiboId: weiboId}, function (data) {
                user = {
                  weiboId: data.id,
                  nickname: data.screen_name,
                  avatar: data.profile_image_url,
                  gender: getGender(data.gender),
                  location: utils.cityToCode(data.province, data.city)
                }
              }, function (error) {
                deferred.reject(error.data.error);
                return deferred.promise;
              })
            } else {
              deferred.reject('无法识别，请输入微博用户的ID号或URL');
              return deferred.promise;
            }
          }

          //查询当前数据库是否存在该微博ID
          userFactory.query({weiboId: user.weiboId}, function (data) {
            // 如果存在2个或以上的微博ID，报错
            if (data.length > 1) {
              deferred.reject('存在' + data.length + '个重复的账号：' + user.weiboId);
              return deferred.promise;
              // 如果微博ID已存在，可以修改此用户资料
            } else if (data.length === 1) {
              data.nickname = user.nickname;
              date.avatar = user.avatar;
              data.gender = data.gender || user.gender;
              data.location = data.location || user.location;
              deferred.resolve(data);
              return deferred.promise;
              //如果微博ID不存在，可以创建新用户
            } else {
              console.log(data);
              deferred.resolve(user);
              return deferred.promise;
            }
          }, function (error) {
            deferred.reject('数据库连接故障，请稍后再试！');
            return deferred.promise;
          });
        } else {
          deferred.reject('请输入微博ID或者用户URL');
          return deferred.promise;
        }
      }
    }])





  .factory('utils', function () {
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

      //格式化用户照片
      photos: function (data) {
        if (angular.isDefined(data)) {
          var pics = new String;
          for (var i in data) {
            var pic = '<div class="col-md-2"><img src="' + data[i] + '" class="user-photo" /></div>';
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
        var cities = {
          "010": "北京",
          "021": "上海",
          "022": "天津",
          "023": "重庆",
          "0311": "石家庄",
          "0312": "保定",
          "0314": "承德",
          "0310": "邯郸",
          "0315": "唐山",
          "0335": "秦皇岛",
          "0317": "沧州",
          "0318": "衡水",
          "0316": "廊坊",
          "0319": "邢台",
          "0313": "张家口",
          "0351": "太原",
          "0355": "长治",
          "0352": "大同",
          "0356": "晋城",
          "0354": "晋中",
          "0357": "临汾",
          "0358": "吕梁",
          "0349": "朔州",
          "0350": "忻州",
          "0359": "运城",
          "0353": "阳泉",
          "0471": "呼和浩特",
          "0472": "包头",
          "0476": "赤峰",
          "0477": "鄂尔多斯",
          "0470": "呼伦贝尔",
          "0475": "通辽",
          "0474": "乌兰察布",
          "0473": "乌海",
          "0482": "兴安盟",
          "024": "沈阳",
          "0411": "大连",
          "0412": "鞍山",
          "0415": "丹东",
          "0413": "抚顺",
          "0416": "锦州",
          "0417": "营口",
          "0414": "本溪",
          "0428": "朝阳",
          "0418": "阜新",
          "0429": "葫芦岛",
          "0419": "辽阳",
          "0427": "盘锦",
          "0410": "铁岭",
          "0431": "长春",
          "0432": "吉林",
          "0436": "白城",
          "0439": "白山",
          "0437": "辽源",
          "0434": "四平",
          "0438": "松原",
          "0435": "通化",
          "0451": "哈尔滨",
          "0459": "大庆",
          "0452": "齐齐哈尔",
          "0454": "佳木斯",
          "0457": "大兴安岭",
          "0456": "黑河",
          "0468": "鹤岗",
          "0467": "鸡西",
          "0453": "牡丹江",
          "0464": "七台河",
          "0455": "绥化",
          "0469": "双鸭山",
          "0458": "伊春",
          "025": "南京",
          "0512": "苏州",
          "0519": "常州",
          "0518": "连云港",
          "0523": "泰州",
          "0510": "无锡",
          "0516": "徐州",
          "0514": "扬州",
          "0511": "镇江",
          "0517": "淮安",
          "0513": "南通",
          "0527": "宿迁",
          "0515": "盐城",
          "0571": "杭州",
          "0574": "宁波",
          "0573": "嘉兴",
          "0575": "绍兴",
          "0577": "温州",
          "0580": "舟山",
          "0572": "湖州",
          "0579": "金华",
          "0578": "丽水",
          "0576": "台州",
          "0551": "合肥",
          "0553": "芜湖",
          "0556": "安庆",
          "0552": "蚌埠",
          "0558": "亳州/阜阳",
          "0565": "巢湖",
          "0566": "池州",
          "0550": "滁州",
          "0559": "黄山",
          "0561": "淮北",
          "0554": "淮南",
          "0564": "六安",
          "0555": "马鞍山",
          "0557": "宿州",
          "0562": "铜陵",
          "0563": "宣城",
          "0591": "福州",
          "0592": "厦门",
          "0595": "泉州",
          "0597": "龙岩",
          "0593": "宁德",
          "0599": "南平",
          "0594": "莆田",
          "0598": "三明",
          "0596": "漳州",
          "0791": "南昌",
          "0797": "赣州",
          "0792": "九江",
          "0798": "景德镇",
          "0796": "吉安",
          "0799": "萍乡",
          "0793": "上饶",
          "0790": "新余",
          "0795": "宜春",
          "0701": "鹰潭",
          "0531": "济南",
          "0532": "青岛",
          "0631": "威海",
          "0535": "烟台",
          "0536": "潍坊",
          "0538": "泰安",
          "0543": "滨州",
          "0534": "德州",
          "0546": "东营",
          "0530": "菏泽",
          "0537": "济宁",
          "0635": "聊城",
          "0539": "临沂",
          "0634": "莱芜",
          "0633": "日照",
          "0533": "淄博",
          "0632": "枣庄",
          "020": "广州",
          "0755": "深圳",
          "0756": "珠海",
          "0769": "东莞",
          "0757": "佛山",
          "0752": "惠州",
          "0750": "江门",
          "0760": "中山",
          "0754": "汕头",
          "0759": "湛江",
          "0768": "潮州",
          "0762": "河源",
          "0663": "揭阳",
          "0668": "茂名",
          "0753": "梅州",
          "0763": "清远",
          "0751": "韶关",
          "0660": "汕尾",
          "0662": "阳江",
          "0766": "云浮",
          "0758": "肇庆",
          "0898": "海南",
          "0771": "南宁/崇左",
          "0779": "北海",
          "0770": "防城港",
          "0773": "桂林",
          "0775": "贵港/玉林",
          "0778": "河池",
          "0774": "贺州/梧州",
          "0772": "柳州/来宾",
          "0777": "钦州",
          "0371": "郑州",
          "0379": "洛阳",
          "0378": "开封",
          "0374": "许昌",
          "0372": "安阳",
          "0375": "平顶山",
          "0392": "鹤壁",
          "0391": "焦作/济源",
          "0395": "漯河",
          "0377": "南阳",
          "0393": "濮阳",
          "0398": "三门峡",
          "0370": "商丘",
          "0373": "新乡",
          "0376": "信阳",
          "0396": "驻马店",
          "0394": "周口",
          "027": "武汉",
          "0710": "襄樊",
          "0719": "十堰/神农架林区",
          "0714": "黄石",
          "0711": "鄂州",
          "0718": "恩施",
          "0713": "黄冈",
          "0716": "荆州",
          "0724": "荆门",
          "0722": "随州",
          "0717": "宜昌",
          "0728": "天门/潜江/仙桃",
          "0712": "孝感",
          "0715": "咸宁",
          "0731": "长沙",
          "0730": "岳阳",
          "0732": "湘潭",
          "0736": "常德",
          "0735": "郴州",
          "0743": "凤凰",
          "0734": "衡阳",
          "0745": "怀化",
          "0738": "娄底",
          "0739": "邵阳",
          "0737": "益阳",
          "0746": "永州",
          "0733": "株洲",
          "0744": "张家界",
          "028": "成都",
          "0816": "绵阳",
          "0832": "资阳/内江",
          "0827": "巴中",
          "0838": "德阳",
          "0818": "达州",
          "0826": "广安",
          "0839": "广元",
          "0833": "乐山/眉山",
          "0830": "泸州",
          "0817": "南充",
          "0812": "攀枝花",
          "0825": "遂宁",
          "0831": "宜宾",
          "0835": "雅安",
          "0813": "自贡",
          "0851": "贵阳",
          "0853": "安顺",
          "0857": "毕节",
          "0856": "铜仁",
          "0852": "遵义",
          "0871": "昆明",
          "0877": "玉溪",
          "0878": "楚雄",
          "0872": "大理",
          "0873": "红河",
          "0874": "曲靖",
          "0691": "西双版纳",
          "0870": "昭通",
          "0891": "拉萨",
          "0892": "日喀则",
          "0983": "山南",
          "029": "西安",
          "0915": "安康",
          "0917": "宝鸡",
          "0916": "汉中",
          "0914": "商洛",
          "0919": "铜川",
          "0913": "渭南",
          "0910": "咸阳",
          "0911": "延安",
          "0912": "榆林",
          "0931": "兰州",
          "0943": "白银",
          "0932": "定西",
          "0935": "金昌/武威",
          "0937": "酒泉/嘉峪关",
          "0939": "陇南",
          "0930": "临夏/庆阳",
          "0933": "平凉",
          "0938": "天水",
          "0936": "张掖",
          "0971": "西宁",
          "0972": "海东",
          "0970": "海北",
          "0974": "海南",
          "0951": "银川",
          "0952": "石嘴山",
          "0953": "吴忠/中卫",
          "0991": "乌鲁木齐",
          "0901": "塔城",
          "0902": "哈密",
          "0903": "和田",
          "0906": "阿勒泰",
          "0908": "阿图什",
          "0909": "博乐",
          "0990": "克拉玛依",
          "0992": "奎屯",
          "0993": "石河子",
          "0994": "昌吉",
          "0995": "吐鲁番",
          "0996": "库尔勒",
          "0997": "阿克苏",
          "0998": "喀什",
          "0999": "伊宁",
          "0888": "丽江",
          "0837": "阿坝藏族羌族自治州",
          "0834": "凉山彝族自治州",
          "0887": "迪庆藏族自治州",
          "0875": "保山",
          "0570": "衢州",
          "0836": "甘孜藏族自治州",
          "0876": "文山壮族苗族自治州",
          "0692": "德宏傣族景颇族自治州",
          "1853": "澳门",
          "1852": "香港",
          "1886": "台湾"
        }
        if (angular.isDefined(data)) {
          if (cities[data]) {
            return cities[data];
          }
          return '未知'
        } else {
          return '-'
        }
      },

      //根据微博的数据结构，返回城市区号
      cityToCode: function (province, city) {
        if (angular.isDefined(province)) {
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
              var cityCode = province.toString() + city.toString();
              return cityCode;
          }
        } else {
          return '-'
        }
      }
    }
  });
