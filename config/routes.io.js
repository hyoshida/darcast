module.exports = function(app) {

  app.io.route('ready', function(req) {
    console.log('ready');
  });

  app.io.route('talk', function(req) {
    message = req.data;
    app.io.broadcast('talk', message);
  });

};
