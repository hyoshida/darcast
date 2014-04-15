module.exports = function(app){

  // home route
  var home = require('../app/controllers/home');
  app.get('/', home.index);

  // admin route
  var admin = require('../app/controllers/admin');
  app.get('/admin', admin.index);

};
