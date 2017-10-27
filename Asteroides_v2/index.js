var fs = require("fs");
var express = require('express');
var modelo = require ('./server/modelo.js');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);
var juego = new modelo.Juego();


app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname + '/'));

app.get('/', function(request, response) {
 	var contenido = fs.readFileSync("./cliente/views/index.html");    
	response.setHeader("Content-type", "text/html");
	response.send(contenido);  
});

server.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});

//var naves = 0;

io.on('connection', function(socket){
  socket.on('nuevoJugador', function(data){
    juego.agregarJugador(data.id, socket);
  });
  socket.on('posicion', function(data){
    juego.movimiento(data, socket);
   /*socket.jugador = {
        id: data.id,
        x: data.x,
        y: data.y,
        ang:data.ang
    };
    console.log("movimiento id:",socket.jugador.id," ",socket.jugador.x," ",socket.jugador.y);
    socket.broadcast.emit('movimiento',socket.jugador); */
  });
});

function obtenerTodos(){
    var jugadores = [];
    Object.keys(io.sockets.connected).forEach(function(socketID){
        var jugador = io.sockets.connected[socketID].jugador;
        if(jugador) jugadores.push(jugador);
    });
    return jugadores;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

