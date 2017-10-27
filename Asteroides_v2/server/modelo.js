module.exports.Juego = Juego;

function Juego(){
	this.estado = new Inicial();
	this.jugadores = {};
	this.veggie = 16;
	this.socket;

	this.agregarJugador = function(id, socket){
		this.socket = socket;
		this.estado.agregarJugador(id, this);
	}
	this.puedeAgregarJugador = function(id){
		this.jugadores[id] = new Jugador(id, this.veggie);
		this.veggie++;
		if (Object.keys(this.jugadores).length >= 2){
			this.estado = new Jugar();
			this.enviarAJugar();
		}
		else{
			this.enviarFaltaUno();
		}
	}
	this.enviarFaltaUno = function(){
		this.socket.emit('faltaUno');
	}
	this.enviarAJugar = function(){
   		this.socket.broadcast.emit('crearJugador',this.jugadores);
   		this.socket.emit('aJugar',this.jugadores);
	}
	this.movimiento = function (data, socket) {
		this.socket = socket;
		this.estado.movimiento(data, this);
	}
	this.puedeMover = function (data){
		if (data.puntos >= 10){
			this.estado = new Final();
			this.enviarFinal(data.id);			
		}else{
			this.socket.broadcast.emit('movimiento', data);
		}
	}
	this.enviarFinal = function (id) {
		this.socket.broadcast.emit('final', id);
		this.socket.emit('final', id);
	}
}

function Inicial(){
	this.agregarJugador = function(id, juego){
		juego.puedeAgregarJugador(id);
	}
	this.movimiento = function () {
		console.log('No se puede mover la nave.');
	}
}

function Jugar(){
	this.agregarJugador = function(id, juego){
		console.log('No se pueden agregar jugadores.');
	}
	this.movimiento = function (data, juego) {
		juego.puedeMover(data);
	}
}

function Final(){
	this.agregarJugador = function(id, juego){
		//console.log('No se pueden agregar jugadores.');
	}
	this.movimiento = function () {
		console.log('No se puede mover la nave.');
	}
}

function Jugador(id, veggie){
	this.id = id;
	this.x = randomInt(100, 400);
	this.y = randomInt(100, 400);
	this.veggie = veggie;
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}