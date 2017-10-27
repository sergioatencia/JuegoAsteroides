function Cliente(){
	this.socket;
	this.id;

	this.nuevoJugador = function(){
		this.socket.emit('nuevoJugador',{id:this.id});
	}

	this.ini = function(){
		this.id = randomInt(1, 1000);
		this.socket = io.connect();
		//this.lanzarSocketServer();
	}

	this.enviarPosicion=function(x,y,ang){
		this.socket.emit('posicion', {"id":this.id, "x":x, "y":y, "ang":ang});
	}
 	this.lanzarSocketServer = function(){
 		this.socket.on('faltaUno', function(data){
 			console.log('Falta un jugador.');
 		});
 		this.socket.on('aJugar', function(data){
 			for(var jug in data){
 				console.log('A jugar: ', data[jug]);
 				juego.agregarJugador(data[jug].id, data[jug].x, data[jug].y, data[jug].veg);
 			}
 		});
 		this.socket.on('final', function (data) {
 			juego.finalizar(data);
 		});
 		cliente.socket.on('crearJugador', function(data){
			juego.agregarJugador(data.id, data.x, data.y);
		});

		cliente.socket.on('todos',function(data){
			console.log(data);
		    for(var i = 0; i < data.length; i++){
		        juego.agregarJugador(data[i].id, data[i].x, data[i].y);
		    }
		});
		cliente.socket.on('movimiento',function(data){
			juego.moverNave(data.id, data.x, data.y, data.ang);
		});
 	}
	this.ini();	
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}