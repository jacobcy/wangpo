/**
 * MainControllerController
 *
 * @description :: Server-side logic for managing Maincontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  index: function(req, res) {
    return res.view('index', {
      layout: 'main-layout'
    });
  },

  blankPage: function(req, res) {
    return res.view('blank-page', {
      layout: 'main-layout'
    });
  },

  bootstrapElements: function(req, res) {
    return res.view('bootstrap-elements', {
      layout: 'main-layout'
    });
  },

  angular: function(req, res) {
    return res.view('angular', {
      layout: 'main-layout'
    });
  }
};
