function Cliente(){
	this.socket;
	this.id;
	this.cargarConfiguracion = function () {
 		this.socket.emit('configuracion');
 	}
	this.nuevoJugador = function(){
		this.socket.emit('nuevoJugador',{id:this.id});
	}
	this.enviarPosicion = function(x, y, ang, puntos){
		this.socket.emit('posicion', {"id":this.id, "x":x, "y":y, "ang":ang, "puntos":puntos});
	}
	this.volverAJugar = function(){
		this.socket.emit('volverAJugar');
	}	
	this.ini = function(){
		this.id = randomInt(1, 1000);
		this.socket = io.connect();
		//this.lanzarSocketServer();
	}
	this.reset=function(){
		this.id=randomInt(1,10000);
	}
 	this.lanzarSocketServer = function(){
 		this.socket.on('coord', function(data){
 			game.state.start('Game', true, false, data);
 		});
 		this.socket.on('faltaUno', function(data){
 			console.log('Falta un jugador.');
 		});
 		this.socket.on('aJugar', function(data){
 			for(var jug in data){
 				console.log('aJugar: ', data[jug]);
 				juego.agregarJugador(data[jug].id, data[jug].x, data[jug].y, data[jug].veggie);
 			}
 		});
 		this.socket.on('final', function(data) {
 			juego.finalizar(data);
 		});
 		this.socket.on('reset',function(data){
 			juego.volverAJugar(data);
 		});
 		this.socket.on('crearJugador', function(data){
			juego.agregarJugador(data.id, data.x, data.y);
		});
		cliente.socket.on('todos', function(data){
			console.log(data);
		    for(var i = 0; i < data.length; i++){
		        juego.agregarJugador(data[i].id, data[i].x, data[i].y);
		    }
		});
		cliente.socket.on('movimiento',function(data){
			//juego.moverNave(data.id, data.x, data.y, data.ang);
			juego.moverNave(data);
		});
 	} 	
	this.ini();	
}

function randomInt (low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

/*
function Cliente(cadena){
	this.socket;
	this.id=null;
	this.veg;
	this.coord;
	this.room=cadena;
	this.cargarConfiguracion=function(){
		this.socket.emit('configuracion',this.room);
	}
	this.askNewPlayer = function(){		
    	this.socket.emit('nuevoJugador',{room:this.room,id:this.id});
	};
	this.ini=function(){
		this.socket=io.connect();
		this.id=this.randomInt(1,10000);		
		this.lanzarSocketSrv();
	}
	this.reset=function(){
		this.id=this.randomInt(1,10000);
	};
	this.enviarPosicion=function(x,y,ang,puntos){
		this.socket.emit('posicion',this.room,{"id":this.id,"x":x,"y":y,"ang":ang,"puntos":puntos})
	}
	this.sendClick = function(x,y){
  		this.socket.emit('click',{x:x,y:y});
	};
	this.volverAJugar=function(){
		this.socket.emit('volverAJugar',this.room);	
	}
	this.randomInt=function(low, high){
    	return Math.floor(Math.random() * (high - low) + low);
	}
	this.lanzarSocketSrv=function(){
		var cli=this;
		this.socket.on('connect', function() {   			
   			cli.socket.emit('room', cli.room);
   			console.log("envio room");
   			cli.cargarConfiguracion();
		});
		this.socket.on('coord',function(data){
			this.coord=data;			
			game.state.start('Game',true,false,this.coord);
		});
		this.socket.on('faltaUno',function(data){
			console.log('falta uno');
			juego.faltaUno();
		})
		this.socket.on('aJugar',function(data){		    
		    for(var jug in data){
		    	console.log('aJugar: ',data[jug]);
		        juego.agregarJugador(data[jug].id,data[jug].x,data[jug].y,data[jug].veg);
		    };
		});
		this.socket.on('final',function(data){		    
			juego.finJuego(data);
		});
		this.socket.on('reset',function(data){		    
			juego.volverAJugar(data);
		});
		this.socket.on('todos',function(data){
		    console.log('todos: ',data);
		    for(var i = 0; i < data.length; i++){
		        juego.agregarJugador(data[i].id,data[i].x,data[i].y,data[i].veg);
		    }
		});
		this.socket.on('movimiento',function(data){	
		    juego.moverNave(data);        
		});
		this.socket.on('ganador',function(data){	
			juego.finJuego(data.id);
		});
	}
	this.ini();
}


*/