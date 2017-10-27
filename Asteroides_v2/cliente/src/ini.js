var game = new Phaser.Game(800, 600, Phaser.CANVAS, 'phaser-example');

var juego = new Juego();

game.state.add('Game', juego);
game.state.start('Game');

var cliente = new Cliente();
cliente.lanzarSocketServer();