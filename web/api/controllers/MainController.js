/**
 * MainControllerController
 *
 * @description :: Server-side logic for managing Maincontrollers
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
  index: function(req, res) {
    return res.view('index', {
      layout: 'layout'
    });
  },

  app: function(req, res) {
    return res.view('angular', {
      layout: 'main-layout'
    });
  },

  messages: function(req, res) {
    return res.view('messages', {
      layout: 'main-layout'
    });
  },

  posts: function(req, res) {
    return res.view('posts', {
      layout: 'main-layout'
    });
  },

  tables: function(req, res) {
    return res.view('tables', {
      layout: 'main-layout'
    });
  },

  forms: function(req, res) {
    return res.view('forms', {
      layout: 'main-layout'
    });
  },

  panels: function(req, res) {
    return res.view('panels', {
      layout: 'main-layout'
    });
  },

  buttons: function(req, res) {
    return res.view('buttons', {
      layout: 'main-layout'
    });
  },

  notifications: function(req, res) {
    return res.view('notifications', {
      layout: 'main-layout'
    });
  },

  typography: function(req, res) {
    return res.view('typography', {
      layout: 'main-layout'
    });
  },

  icons: function(req, res) {
    return res.view('icons', {
      layout: 'main-layout'
    });
  },

  grid: function(req, res) {
    return res.view('grid', {
      layout: 'main-layout'
    });
  },

  angular: function(req, res) {
    return res.view('angular', {
      layout: 'main-layout'
    });
  }
};
