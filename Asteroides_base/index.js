var fs=require("fs");
var config=JSON.parse(fs.readFileSync("config.json"));
var host=config.host;
var port=config.port;
var exp=require("express");
var app=exp(); //el tutorial indicaba exp.createServer()
//var http=require('http').Server(app);
//var io=require('socket.io').listen(http);


app.use(exp.static(__dirname + "/cliente"));

app.get("/",function(request,response){
	var  contenido = fs.readFileSync("./cliente/index.html");
	response.writeHead(200, {'Content-Type': 'text/html'});
    response.send(contenido);
});

app.use(exp.static(__dirname + "/public"));

app.get("/",function(request,response){
	response.send("hola");
});
console.log("Servidor escuchando en "+host+":"+port);
app.listen(port,host);