(function($){
  var usuario = prompt('Nombre de usuario','Usuario');
  var Chat = {
    socket : null,
    el : {
      listaUsuarios : $('#conectados ul'),
      listaMensajes : $('#lista-mensajes'),
      textoMensaje : $('#mensaje'),
      botonEnviar : $('#enviar')
    },
    iniciar : function(usuario){
      this.conectarSocket();
      // Enviando el usuario al servidor
      this.socket.emit('conexion', { usuario: usuario });
      this.asociarEventos();
    },
    conectarSocket : function(){
      this.socket = io.connect('http://localhost:3000');
    },
    asociarEventos : function(){
      this.socket.on('conexion', $.proxy(this.anadirUsuarioAChat, this));
      this.socket.on('desconexion', $.proxy(this.eliminarUsuarioDeChat, this));
      this.socket.on('mensaje', $.proxy(this.anadirMensaje, this));
      this.el.botonEnviar.on('click', $.proxy(this.enviarMensaje, this))
    },
    anadirUsuarioAChat : function(datos){
      var html = '';

      $.each(datos,function(i,usuario){
        html += '<li>' + usuario + '</li>';
      });

      this.el.listaUsuarios.append(html);
    },
    eliminarUsuarioDeChat : function(datos){
      this.el.listaUsuarios.find('li').filter(function(){
        return datos.usuario === $(this).text()
      }).remove();
    },
    anadirMensaje : function(mensajes){
      console.log(mensajes);
      var html = '';

      $.each(mensajes, function(i, mensaje){
        var clase = mensaje.tipo ? ' class="'+ mensaje.tipo +'"' : '';
        html += '<p'+clase+'>';
        if (mensaje.usuario) {
          html += '<strong>' + mensaje.usuario + '</strong>: ';
        }
        html += mensaje.mensaje;
      });

      this.el.listaMensajes.append(html);
    },
    enviarMensaje : function(e){
      e.preventDefault();
      this.socket.emit('mensaje', {
        mensaje : this.escapar(this.el.textoMensaje.val())
      });
      this.el.textoMensaje.val('');
    },
    escapar : function(texto){
      return String(texto)
        .replace(/&(?!\w+;)/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }
  };


  if (usuario){
    Chat.iniciar(usuario);
  }
  else {
    alert('Sin usuario no tienes acceso al chat!');
  }
})(jQuery);