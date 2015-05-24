const COUNT_PER_PAGE = 30;

module.exports = {
  list : function(req,res){
    WeiboUser.count().exec(function(err, count) {
      if (err) {
        res.serverError('Database error: ' + err);
        return;
      }

      var page = parseInt(req.param('page') || '1');
      if (isNaN(page)) {
        page = 1;
      }

      totalPages = Math.ceil(count / COUNT_PER_PAGE);

      WeiboUser.find({
        skip: (page - 1) * COUNT_PER_PAGE,
        limit: COUNT_PER_PAGE
      }).exec(function(err,found){
        for (var i = 0; i < found.length; i++) {
          var user = found[i];
          var date = user.userBirthday;
          user.formattedBirthday = date ? dateToString(date) : '';
        }
        res.view({
          weibousers: found,
          page: page,
          totalPages: totalPages,
          layout: 'main-layout'
        });
      });

    });
  }
};

function dateToString(date) {
  return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
}
