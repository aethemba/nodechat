
/**
 * Module dependencies.
 */

var app = require('express')()
  , server = require('http').createServer(app)
  , routes = require('./routes')({'app': app})
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

var users = [];
var msgs = [];
var max_msgs = 30;

io.sockets.on("connection", function(socket) {
  var randint = Math.floor( (Math.random()*100)+1 );
  socket.set("nickname", "User " + randint, function(){
    socket.emit("msgupdated", msgs);
  });

  socket.on("setnickname", function(name) {
    socket.set("nickname", name, function() {
      update_users();
    });
  });

  socket.on("disconnect", function() {
    console.log("disconnected user ");
    io.sockets.emit("updateusers", users);
  });

  update_users();

  socket.on("msg", function(msg) {
    socket.get("nickname", function(err, name) {
      console.log("NAME", name);
      if (max_msgs.length >= 30) {
        msgs.shift();
      }
      msgs.push({name:name, msg:msg})
      socket.emit("msgupdated", msgs);
    });
  });


});

function update_users() {
  users = [];
  for(var i=0; i < io.sockets.clients().length; i++) {
    io.sockets.sockets[io.sockets.clients()[i].id].get('nickname', function(err, name) {
      console.log("NNAME", name);
      if (name == null) {
        var randint = Math.floor( (Math.random()*100)+1 );
        name = "User " + randint;
      }
      users.push({id: io.sockets.clients()[i].id, nickname: name});
    });
  };
  io.sockets.emit("updateusers", users);
}

console.log("Express server listening on port " + app.get('port'));
