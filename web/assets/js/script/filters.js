'use strict';

/* Filters */

angular.module('myApp.filters', [])

//返回userDataTable中的用户性别
  .filter('sex', function () {
    return function (data) {
      switch (data) {
        case 1:
          return '男';
        case 2:
          return '女';
        default:
          return '-';
      }
    }
  })

//返回userDataTable中的用户年龄
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
      var pics;
      for (var i in data) {
        var pic = '<div class="col-md-3"><img src="' + data[i] + '" style="width:' + width + 'px; height:auto; padding:5px" /></div>';
        pics += pic;
      }
      return ('<div class="row">' + pics + '</div>');
    }
  })

  //返回userDataTable中的用户编辑按钮
  .filter('button', function () {
    return function (data, type, full, meta) {
      var editButton = '<button data-target="#myModal" data-toggle="modal" class="btn btn-warning" ng-click="user.edit(' + data + ')">' +
        '   <i class="fa fa-edit"></i>' +
        '</button>&nbsp;';
      var lockButton = '<button class="btn btn-danger" ng-click="user.lock(' + data + ')">' +
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
  })

//返回userDataTable中的用户城市
  .filter('city', function () {
    return function (data) {
      var CityMap = {
        "010": "北京市",
        "021": "上海市",
        "022": "天津市",
        "023": "重庆市",
        "0311": "石家庄市",
        "0312": "保定市",
        "0314": "承德市",
        "0310": "邯郸市",
        "0315": "唐山市",
        "0335": "秦皇岛市",
        "0317": "沧州市",
        "0318": "衡水市",
        "0316": "廊坊市",
        "0319": "邢台市",
        "0313": "张家口市",
        "0351": "太原市",
        "0355": "长治市",
        "0352": "大同市",
        "0356": "晋城市",
        "0354": "晋中市",
        "0357": "临汾市",
        "0358": "吕梁市",
        "0349": "朔州市",
        "0350": "忻州市",
        "0359": "运城市",
        "0353": "阳泉市",
        "0471": "呼和浩特市",
        "0472": "包头市",
        "0476": "赤峰市",
        "0477": "鄂尔多斯市",
        "0470": "呼伦贝尔市",
        "0475": "通辽市",
        "0474": "乌兰察布市",
        "0473": "乌海市",
        "0482": "兴安盟市",
        "024": "沈阳市",
        "0411": "大连市",
        "0412": "鞍山市",
        "0415": "丹东市",
        "0413": "抚顺市",
        "0416": "锦州市",
        "0417": "营口市",
        "0414": "本溪市",
        "0428": "朝阳市",
        "0418": "阜新市",
        "0429": "葫芦岛市",
        "0419": "辽阳市",
        "0427": "盘锦市",
        "0410": "铁岭市",
        "0431": "长春市",
        "0432": "吉林市",
        "0436": "白城市",
        "0439": "白山市",
        "0437": "辽源市",
        "0434": "四平市",
        "0438": "松原市",
        "0435": "通化市",
        "0451": "哈尔滨市",
        "0459": "大庆市",
        "0452": "齐齐哈尔市",
        "0454": "佳木斯市",
        "0457": "大兴安岭市",
        "0456": "黑河市",
        "0468": "鹤岗市",
        "0467": "鸡西市",
        "0453": "牡丹江市",
        "0464": "七台河市",
        "0455": "绥化市",
        "0469": "双鸭山市",
        "0458": "伊春市",
        "025": "南京市",
        "0512": "苏州市",
        "0519": "常州市",
        "0518": "连云港市",
        "0523": "泰州市",
        "0510": "无锡市",
        "0516": "徐州市",
        "0514": "扬州市",
        "0511": "镇江市",
        "0517": "淮安市",
        "0513": "南通市",
        "0527": "宿迁市",
        "0515": "盐城市",
        "0571": "杭州市",
        "0574": "宁波市",
        "0573": "嘉兴市",
        "0575": "绍兴市",
        "0577": "温州市",
        "0580": "舟山市",
        "0572": "湖州市",
        "0579": "金华市",
        "0578": "丽水市",
        "0576": "台州市",
        "0551": "合肥市",
        "0553": "芜湖市",
        "0556": "安庆市",
        "0552": "蚌埠市",
        "0558": "亳州市/阜阳市",
        "0565": "巢湖市",
        "0566": "池州市",
        "0550": "滁州市",
        "0559": "黄山市",
        "0561": "淮北市",
        "0554": "淮南市",
        "0564": "六安市",
        "0555": "马鞍山市",
        "0557": "宿州市",
        "0562": "铜陵市",
        "0563": "宣城市",
        "0591": "福州市",
        "0592": "厦门市",
        "0595": "泉州市",
        "0597": "龙岩市",
        "0593": "宁德市",
        "0599": "南平市",
        "0594": "莆田市",
        "0598": "三明市",
        "0596": "漳州市",
        "0791": "南昌市",
        "0797": "赣州市",
        "0792": "九江市",
        "0798": "景德镇市",
        "0796": "吉安市",
        "0799": "萍乡市",
        "0793": "上饶市",
        "0790": "新余市",
        "0795": "宜春市",
        "0701": "鹰潭市",
        "0531": "济南市",
        "0532": "青岛市",
        "0631": "威海市",
        "0535": "烟台市",
        "0536": "潍坊市",
        "0538": "泰安市",
        "0543": "滨州市",
        "0534": "德州市",
        "0546": "东营市",
        "0530": "菏泽市",
        "0537": "济宁市",
        "0635": "聊城市",
        "0539": "临沂市",
        "0634": "莱芜市",
        "0633": "日照市",
        "0533": "淄博市",
        "0632": "枣庄市",
        "020": "广州市",
        "0755": "深圳市",
        "0756": "珠海市",
        "0769": "东莞市",
        "0757": "佛山市",
        "0752": "惠州市",
        "0750": "江门市",
        "0760": "中山市",
        "0754": "汕头市",
        "0759": "湛江市",
        "0768": "潮州市",
        "0762": "河源市",
        "0663": "揭阳市",
        "0668": "茂名市",
        "0753": "梅州市",
        "0763": "清远市",
        "0751": "韶关市",
        "0660": "汕尾市",
        "0662": "阳江市",
        "0766": "云浮市",
        "0758": "肇庆市",
        "0898": "海南",
        "0771": "南宁市/崇左市",
        "0779": "北海市",
        "0770": "防城港市",
        "0773": "桂林市",
        "0775": "贵港市/玉林市",
        "0778": "河池市",
        "0774": "贺州市/梧州市",
        "0772": "柳州市/来宾市",
        "0777": "钦州市",
        "0371": "郑州市",
        "0379": "洛阳市",
        "0378": "开封市",
        "0374": "许昌市",
        "0372": "安阳市",
        "0375": "平顶山市",
        "0392": "鹤壁市",
        "0391": "焦作市/济源市",
        "0395": "漯河市",
        "0377": "南阳市",
        "0393": "濮阳市",
        "0398": "三门峡市",
        "0370": "商丘市",
        "0373": "新乡市",
        "0376": "信阳市",
        "0396": "驻马店市",
        "0394": "周口市",
        "027": "武汉市",
        "0710": "襄樊市",
        "0719": "十堰市/神农架林区市",
        "0714": "黄石市",
        "0711": "鄂州市",
        "0718": "恩施市",
        "0713": "黄冈市",
        "0716": "荆州市",
        "0724": "荆门市",
        "0722": "随州市",
        "0717": "宜昌市",
        "0728": "天门市/潜江市/仙桃市",
        "0712": "孝感市",
        "0715": "咸宁市",
        "0731": "长沙市",
        "0730": "岳阳市",
        "0732": "湘潭市",
        "0736": "常德市",
        "0735": "郴州市",
        "0743": "凤凰市",
        "0734": "衡阳市",
        "0745": "怀化市",
        "0738": "娄底市",
        "0739": "邵阳市",
        "0737": "益阳市",
        "0746": "永州市",
        "0733": "株洲市",
        "0744": "张家界市",
        "028": "成都市",
        "0816": "绵阳市",
        "0832": "资阳市/内江市",
        "0827": "巴中市",
        "0838": "德阳市",
        "0818": "达州市",
        "0826": "广安市",
        "0839": "广元市",
        "0833": "乐山市/眉山市",
        "0830": "泸州市",
        "0817": "南充市",
        "0812": "攀枝花市",
        "0825": "遂宁市",
        "0831": "宜宾市",
        "0835": "雅安市",
        "0813": "自贡市",
        "0851": "贵阳市",
        "0853": "安顺市",
        "0857": "毕节市",
        "0856": "铜仁市",
        "0852": "遵义市",
        "0871": "昆明市",
        "0877": "玉溪市",
        "0878": "楚雄市",
        "0872": "大理市",
        "0873": "红河市",
        "0874": "曲靖市",
        "0691": "西双版纳市",
        "0870": "昭通市",
        "0891": "拉萨市",
        "0892": "日喀则市",
        "0983": "山南市",
        "029": "西安市",
        "0915": "安康市",
        "0917": "宝鸡市",
        "0916": "汉中市",
        "0914": "商洛市",
        "0919": "铜川市",
        "0913": "渭南市",
        "0910": "咸阳市",
        "0911": "延安市",
        "0912": "榆林市",
        "0931": "兰州市",
        "0943": "白银市",
        "0932": "定西市",
        "0935": "金昌市/武威市",
        "0937": "酒泉市/嘉峪关市",
        "0939": "陇南市",
        "0930": "临夏市/庆阳市",
        "0933": "平凉市",
        "0938": "天水市",
        "0936": "张掖市",
        "0971": "西宁市",
        "0972": "海东市",
        "0970": "海北市",
        "0974": "海南市",
        "0951": "银川市",
        "0952": "石嘴山市",
        "0953": "吴忠市/中卫市",
        "0991": "乌鲁木齐市",
        "0901": "塔城市",
        "0902": "哈密市",
        "0903": "和田市",
        "0906": "阿勒泰市",
        "0908": "阿图什市",
        "0909": "博乐市",
        "0990": "克拉玛依市",
        "0992": "奎屯市",
        "0993": "石河子市",
        "0994": "昌吉市",
        "0995": "吐鲁番市",
        "0996": "库尔勒市",
        "0997": "阿克苏市",
        "0998": "喀什市",
        "0999": "伊宁市",
        "0888": "丽江市",
        "0837": "阿坝藏族羌族自治州市",
        "0834": "凉山彝族自治州市",
        "0887": "迪庆藏族自治州市",
        "0875": "保山市",
        "0570": "衢州市市",
        "0836": "甘孜藏族自治州市",
        "0876": "文山壮族苗族自治州市",
        "0692": "德宏傣族景颇族自治州市",
        "1853": "澳门特别行政区",
        "1852": "香港特别行政区",
        "1886": "台湾"
      };
      return CityMap[data];
    }
  });

