
$(document).ready(function(){

	console.log("appinit");
	var game = new Phaser.Game(900, 600, Phaser.AUTO, "#app", {GameState});

	var platforms;
	var player;
	var cursors;
	var i=0;
	var score=0;
	var scoreText;
	var stars;
	var poulpeman;

	var GameState = {
		preload: function(){
			game.load.image("poulpeman", "superpowers-logo.png");
			game.load.image("fond", "planètepoulpe.jpg");
			game.load.image("ground", "platform.png");
			game.load.image("shell1", "shell1.png");
			game.load.image("shell2", "shell2.png");
			game.load.image("shell3", "shell3.png");
			game.load.spritesheet("dude", "dude.png", 32, 48)
		},

		create: function(){

			game.physics.startSystem(Phaser.Physics.ARCADE);

			game.add.sprite(0, 0, "fond");

			platforms = game.add.group();

			platforms.enableBody = true;

			var ground = platforms.create(0, game.world.height - 50, "ground");

			ground.scale.setTo(2, 2);

			ground.body.immovable = true;

			var ledge = platforms.create(400, 400, "ground");

			ledge.body.immovable = true;

			var ledge = platforms.create(-150, 250, "ground");

			ledge.body.immovable = true;

			game.add.sprite(550, 0, "poulpeman");

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
		},
		update: function(){

			game.physics.arcade.collide(player, platforms);
			// game.physics.arcade.collide(player, stars);
			game.physics.arcade.collide(stars, platforms);
			game.physics.arcade.overlap(player, stars, collectStar, null, this);

			player.body.velocity.x = 0;

			if(cursors.left.isDown){
				player.body.velocity.x = -1000;

				player.animations.play('left')
			}
			else if(cursors.right.isDown){
				player.body.velocity.x = 1000;

				player.animations.play('right')
			}
			else{
				player.animations.stop();
				player.frame = 4;
			}

			if(cursors.up.isDown ){
				player.body.velocity.y = -1500;

			}
			if(cursors.down.isDown ){
				player.body.velocity.y = 1500;

			}
			function collectStar(player, star){
				star.kill();
				score+=10;
				scoreText.text = "Score: " + score;
			}


			// i++
			// if(i%60===0){
			// 	poulpeman(move.right)
			// }

		}

	};
	game.state.add("GameState",GameState);
	game.state.start("GameState")
});
