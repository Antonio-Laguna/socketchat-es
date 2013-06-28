var helperUsuarios = require('../helpers/usuarios')

exports.conexion = function(socket, usuarios, mensajes, datos){
  var usuario = helperUsuarios.usuarioUnico(usuarios,datos.usuario),
    temp = [];

  socket.set('usuario', usuario);
  temp.push(usuario);
  usuarios.push(usuario);

  socket.broadcast.emit('conexion',temp);
  socket.broadcast.emit('mensaje',[{
    'tipo' : 'sistema',
    'usuario' : null,
    'mensaje' : usuario + ' se ha unido al chat'
  }]);
  socket.emit('conexion',usuarios);
  socket.emit('mensaje',mensajes);
};
exports.mensaje = function(socket, mensajes, usuario, datos){
  var mensaje = {
    'tipo' : 'normal',
    'usuario' : usuario,
    'mensaje' : datos.mensaje
  };

  io.sockets.emit('mensaje', [mensaje]);
  mensajes.push(mensaje);
};
exports.desconexion = function(socket,usuarios,usuario){
  usuarios.splice(usuarios.indexOf(usuario),1);
  socket.broadcast.emit('desconexion',{ usuario: usuario });
  socket.broadcast.emit('mensaje',[{
    'tipo' : 'sistema',
    'usuario' : null,
    'mensaje' : usuario + ' ha abandonado el chat'
  }]);
}