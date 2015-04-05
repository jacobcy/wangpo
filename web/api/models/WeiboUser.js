var WeiboUser = {

  attributes: {
    // e.g. "0001"
    innerId: {type: 'string'},
    // e.g. "李小敏"
    userName: {type:  'string'},
    // e.g. "1978.03.15"
    userBirthday: {type: 'date'},
    // e.g. "男"
    userSexual: {type: 'string'},
    // e.g. "1.75"
    userHight: {type: 'float'},
    // e.g. "北京"
    userLocation: {type: 'string'}  
  }
};

module.exports = WeiboUser;