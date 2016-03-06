/**
 * isAuthenticated
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
module.exports = function(req, res, next) {
  if (req.param('access_token')) {
    return passport.authenticate('bearer', { session: false })(req, res, next);
  }

  // User is allowed, proceed to the next policy, 
  // or if this is the last policy, the controller
  if (req.session.authenticated) {
    return next();
  }

  if (req.isAuthenticated()) {
    return next();
  }

  if (req.wantsJSON) {
    return res.forbidden('You are not permitted to perform this action.');
  }

  // 检查管理员账户是否已经注册，如果没有要求先注册
  User.count().exec(function(err, count) {
    if (err) {
      res.forbidden('Cannot access user info: ' + err);
      return;
    }
    if (count == 0) {
      res.redirect('/register');
      return;
    }
    res.redirect('/login');
  });
};
