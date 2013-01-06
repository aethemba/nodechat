
/**
 * Module dependencies.
 */

var app = require('express')()
  , server = require('http').createServer(app)
  , routes = require('./routes')
  , user = require('./routes/user')
  , path = require('path')
  , express = require('express')
  , io = require('socket.io').listen(server);

server.listen(3000);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);
app.get('/users', user.list);

var users = []

io.sockets.on("connection", function(socket) {
  if(users.indexOf(socket.id) == -1) {
    users.push(socket.id);
  }
  socket.emit("newuser", {user: "user" + socket.id});
  socket.emit("updateusers", users);

  socket.on("disconnect", function() {
    console.log("disconnected user " + socket.id);
  });
});


console.log("Express server listening on port " + app.get('port'));
