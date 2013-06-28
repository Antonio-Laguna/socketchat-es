
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path')
  , config = require('./config')
  , socketio = require('socket.io')
  , chat = require('./lib/chat');

var app = express(),
    server = app.listen(config.port || 3000),
    io = socketio.listen(server),
    usuarios = [], mensajes = [];

process.setMaxListeners(0);

io.configure(function(){
  io.enable('browser client minification');
  io.enable('browser client etag');
  io.enable('browser client gzip');
  io.set('log level', 1);
  io.set('transports', [
    'websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling'
  ]);
});

// all environments
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);


io.sockets.on('connection', function(socket){
  socket.on('conexion',function(datos){
    chat.conexion(socket,usuarios, mensajes,datos)
  });

  socket.on('mensaje', function(datos){
    socket.get('usuario', function(err, usuario){
      chat.conexion(socket, mensajes, usuario,datos)
    });
  });

  socket.on('disconnect', function(){
    socket.get('usuario', function(err,usuario){
      chat.desconexion(socket,usuarios,usuario);
    })
  });
});