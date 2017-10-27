function Juego(){
    this.naves = {};
    this.naveLocal;
    this.rival;
    this.cursors;
    this.veggies;
    this.fin = false;
    this.marcador;

    this.preload=function() {
       game.load.image('space', 'cliente/recursos/deep-space.jpg');
       game.load.image('bullet', 'cliente/recursos/bullets.png');
       game.load.image('ship', 'cliente/recursos/ship.png');
       game.load.spritesheet('veggies', 'cliente/recursos/fruitnveg32wh37.png', 32, 32);
    }
    this.init=function(){
        game.stage.disableVisibilityChange = true;
    }
    this.collisionHandler=function(bullet, veg) { 
        if (veg.frame==this.naves[cliente.id].veggie){
             console.log("ñam ñam");
             this.naveLocal.puntos++;
             veg.kill();
        }
    }
    this.processHandler=function(player, veg) {
        return true;
    }
    this.create=function() {
        game.renderer.clearBeforeRender = false;
        game.renderer.roundPixels = true;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.tileSprite(0, 0, game.width, game.height, 'space');
        this.cursors = game.input.keyboard.createCursorKeys();
        game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);

        this.veggies = game.add.physicsGroup();
        for (var i = 0; i < 50; i++)
        {
            var c = this.veggies.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', game.rnd.between(0, 15));
            c.body.mass = -100;
        }
        for (var i = 0; i < 50; i++)
        {
            var c = this.veggies.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', game.rnd.between(18, 35));
            c.body.mass = -100;
        }
        for (var i = 0; i < 10; i++)
        {
            var c = this.veggies.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', 16);
        }
        for (var i = 0; i < 10; i++)
        {
            var c = this.veggies.create(game.rnd.between(100, 770), game.rnd.between(0, 570), 'veggies', 17);
        }

        this.marcador = game.add.text(game.world.centerX, 25, "Puntos. Yo: 0 - Rival: 0", {
            font: "25px Arial",
            fill: "#FDFEFE",
            align: "center"
        });
        this.marcador.anchor.setTo(0.5, 0.5);

        cliente.nuevoJugador();
    }

    this.update=function() {
        var nave;
        var id=cliente.id;
        nave=this.naves[id];  

        if(!this.fin){
            if (nave){
                if (game.input.mousePointer.isDown){
                    var targetAngle = game.math.angleBetween(nave.sprite.x, nave.sprite.y,game.input.mousePointer.x, game.input.mousePointer.y); nave.sprite.rotation = targetAngle;
                    nave.mover(game.input.mousePointer.x,game.input.mousePointer.y,targetAngle);
                }
        // if (this.cursors.up.isDown)
         // {
         // game.physics.arcade.accelerationFromRotation(sprite.rotation, 200, sprite.body.acceleration);
         // }
         // else
         // {
         // sprite.body.acceleration.set(0);
         // }
            if (this.cursors.left.isDown){
                nave.sprite.body.angularVelocity = -300;
            }else if (this.cursors.right.isDown){
                nave.sprite.body.angularVelocity = 300;
            }else{
                nave.sprite.body.angularVelocity = 0;
            }
            if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
                nave.disparar();
            }
            this.actualizarMarcador();

            this.screenWrap(nave.sprite);
            nave.bullets.forEachExists(this.screenWrap, this);
            
            if (game.physics.arcade.collide(nave.sprite, this.veggies, this.collisionHandler, this.processHandler, this)){
                console.log('boom');
            }
        }
    }
}

    this.agregarJugador = function(id, x, y, veggie){
        console.log("nuevo jugador");
        var nave = new Nave(id, x, y, veggie);
        this.naves[id] = nave;
        if (id == cliente.id){
            this.naveLocal = this.naves[cliente.id];
        } else {
            this.rival = nave;
        }        
    }
    this.finalizar = function (data) {
        console.log('Ha ganado: ', data);
        this.fin = true;
    }
    this.moverNave = function(data){
        var nave = this.naves[data.id];
        nave.puntos = data.puntos;
        nave.mover(data.x, data.y, data.ang, true);
        this.rival = nave;
        this.actualizarMarcador();
    }
    this.actualizarMarcador = function(){
        this.marcador.setText("Puntos. Yo:" +this.naveLocal.puntos + "- Rival:"+this.rival.puntos);
        game.world.bringToTop(this.marcador);
    }
    this.screenWrap=function(sprite) {
        if (sprite.x < 0){
            sprite.x = game.width;
        }else if (sprite.x > game.width){
            sprite.x = 0;
        }
        if (sprite.y < 0){
            sprite.y = game.height;
        }else if (sprite.y > game.height){
            sprite.y = 0;
        }
    }    
}

function Nave(id,x,y,veggie){
    this.id = id;
    this.x = x;
    this.y = y;
    this.veggie = veggie;
    this.sprite;
    this.bullets;
    this.bullet;
    this.bulletTime = 0;
    this.puntos = 0;

    this.mover=function(x,y,ang,socket){
        this.sprite.rotation=ang;
        var distance=Phaser.Math.distance(this.sprite.x, this.sprite.y, x, y);
        var duration = distance * 3;
        var tween = game.add.tween(this.sprite);
        tween.to({x:x, y:y}, duration);
        tween.start();
        if (!socket) tween.onComplete.add(this.onComplete, this);
    }
    this.onComplete=function(){
        cliente.enviarPosicion(this.sprite.x, this.sprite.y, this.sprite.rotation, this.puntos);
    }
    this.disparar=function() {
        if (game.time.now > this.bulletTime){
            this.bullet = this.bullets.getFirstExists(false);
            if (this.bullet){
               this.bullet.reset(this.sprite.body.x + 16, this.sprite.body.y + 16);
               this.bullet.lifespan = 1000;
               this.bullet.rotation = this.sprite.rotation;
               game.physics.arcade.velocityFromRotation(this.sprite.rotation, 400, this.bullet.body.velocity);
               this.bulletTime =game.time.now + 50;
            }
        }
    }
    this.ini=function(){
        this.bullets= game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.bullets.createMultiple(40, 'bullet');
        this.bullets.setAll('anchor.x', 0.5);
        this.bullets.setAll('anchor.y', 0.5);

        this.sprite = game.add.sprite(this.x, this.y, 'ship');
        this.sprite.anchor.set(0.5);

        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.sprite.body.drag.set(50);
        this.sprite.body.maxVelocity.set(200);
    }
    this.ini();
}