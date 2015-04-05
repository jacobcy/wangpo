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

  req.flash('error', '请登录后访问。');
  return res.redirect('/login');
};
