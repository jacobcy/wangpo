module.exports = {
  index : function(req,res){
    WeiboUser.find({}).exec(function(err,found){
      for (var i = 0; i < found.length; i++) {
        var user = found[i];
        var date = user.userBirthday;
        user.formattedBirthday = date ? dateToString(date) : '';
      }
      res.view({
        weibousers: found,
        layout: 'main-layout'
      });
    });
  }
};

function dateToString(date) {
  return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
}
