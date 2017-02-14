
$(document).ready(function(){

	console.log("appinit");
	var game = new Phaser.Game(900, 600, Phaser.AUTO, "#app", {preload: preload, create: create, update: update});

	var platforms;

	var player;
	var stars;
	var poulpeman;
	var bullets;

	var cursors;

	var score=0;
	var scoreText;
	var i=0;
	var j=0;

	var nbjumps = 0;
	var vieperso = 5;
	var vieboss = 50;

	function preload(){
		game.load.image("poulpeman", "superpowers-logo.png");
		game.load.image("fond", "planètepoulpe.jpg");
		game.load.image("ground", "platform.png");
		game.load.image("shell1", "shell1.png");
		game.load.image("shell2", "shell2.png");
		game.load.image("shell3", "shell3.png");
		game.load.spritesheet("dude", "dude.png", 32, 48)
	}

	function create(){

		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.startSystem(Phaser.Physics.P2JS);

		game.add.sprite(0, 0, "fond");

		platforms = game.add.group();
		platforms.enableBody = true;
		bullets = game.add.group();

		var ground = platforms.create(0, game.world.height - 50, "ground");

		ground.scale.setTo(3, 1);

		ground.body.immovable = true;

		var ledge = platforms.create(400, 400, "ground");

		ledge.body.immovable = true;

		var ledge = platforms.create(-150, 150, "ground");

		ledge.scale.setTo(1, 2);
		ledge.body.immovable = true;

		poulpeman = game.add.sprite(555, 0, "poulpeman");


		player = game.add.sprite(32, game.world.height - 150, 'dude');

		game.physics.arcade.enable(player);

		player.body.bounce.y = 0.2;
		player.body.gravity.y = 1000;
		player.body.collideWorldBounds = true;

		player.animations.add("left", [0, 1, 2, 3], 10, true);
		player.animations.add("right", [5, 6, 7, 8], 10, true);

		stars = game.add.group();

		stars.enableBody = true;

		for (var i = 0; i<12; i++){

			var coquille = Math.floor(1+(Math.random()*3))

			var star = stars.create(i*70, 0, "shell"+coquille);


			star.body.gravity.y = 300;

			star.body.bounce.y = 0,7 + Math.random()*0.2;
		}

		cursors = game.input.keyboard.createCursorKeys();

		scoreText = game.add.text(16, 16, "score: 0", { fontsize: "32px", fill:"#000"});
	}
	function moveBullets (bullet) { 
		accelerateToObject(bullet,player,500);
	}

	function accelerateToObject(obj1, obj2, speed) {
		if (typeof speed === 'undefined') { speed = 60; }
		var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
		obj1.body.rotation = angle + game.math.degToRad(90);
		obj1.body.force.x = Math.cos(angle) * speed;
		obj1.body.force.y = Math.sin(angle) * speed;
	}

	function update(){

		bullets.forEachAlive(moveBullets,this); 

		j++
		if(j%100===0){
			var bullet = bullets.create(game.rnd.integerInRange(500, 780), game.rnd.integerInRange(0, 200), 'poulpeman');
			bullet.scale.setTo(0.1, 0.1);
			game.physics.p2.enable(bullet,false);
			game.physics.arcade.enable(bullet)
		}

		game.physics.arcade.collide(player, platforms);
			// game.physics.arcade.collide(player, stars);
			game.physics.arcade.collide(stars, platforms);
			game.physics.arcade.overlap(player, stars, collectStar, null, this);
			game.physics.arcade.overlap(bullets, bullets, bulletHit, null, this);

			player.body.velocity.x = 0;

			if(cursors.left.isDown){
				player.body.velocity.x = -500;

				player.animations.play('left')
			}
			else if(cursors.right.isDown){
				player.body.velocity.x = 500;

				player.animations.play('right')
			}
			else{
				player.animations.stop();
				player.frame = 4;
			}

			if(player.body.touching.down){
				nbjumps = 5;
			}

			if(player.body.touching.right || player.body.touching.left){
				nbjumps = 5;
				player.body.velocity.y = 100;
			}

			if(cursors.up.isDown && nbjumps > 0){
				nbjumps--;
				player.body.velocity.y = -600;
			}
			if(cursors.down.isDown){
				player.body.velocity.y = 600;

			}
			function collectStar(player, star){
				star.kill();
				score+=10;
				scoreText.text = "Score: " + score;
			}

			function bulletHit(player, bullet){
				bullet.kill();
				pertevie(2);
			}
			function pertevie(x){
				vieperso-=x;
				if(vieperso === 0){
					player.kill();
					// affichage perdu
				}
			}

			function pertevieBoss(){
				vieboss--
				if(vieperso === 0){
					player.kill();
					// affichage perdu
				}
			}

			i++
			if(i%100===0){

				var puiss = Math.floor(1+(Math.random()*3));
				var pos = Math.floor(1+(Math.random()*11));
				var star = stars.create(pos*70, 0, "shell"+puiss);

				star.body.gravity.y = 300;

				star.body.bounce.y = 0,7 + Math.random()*0.2;
			}

		}

		game.state.start("GameState")
	});
