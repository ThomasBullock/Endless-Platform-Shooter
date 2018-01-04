var Endless = Endless || {};

Endless.GameState = {
	init: function() {
		this.game.stage.backgroundColor = '#FF6347';
		console.log('Game Started!');
		
		this.scrollSpeed = 200;	
			
	    // pool of tiles that make up platforms - passed to Platform prefab
	    this.tilePool = this.add.group();

	    // coins pool
	    this.coinsPool = this.add.group();
	    this.coinsPool.enableBody = true;
    
		// pool of platforms
		this.platformPool = this.add.group();
		
		// Gravity
		this.game.physics.arcade.gravity.y = 1000;
		
		// Max jump distance
		this.maxJumpDistance = 100;
		
		this.cursors = this.game.input.keyboard.createCursorKeys();
		
		this.spaceCredits = 0;
	},
	create: function(){
		// var myBitmap = 
// var myBitmap = game.add.bitmapData(100, 100);
// 		myBitmap.beginLinearGradientFill(["#000", "#FFF"], [0, 1], 0, 20, 0, 120);
// 		myBitmap.rect(20, 20, 120, 120);
// 		myBitmap.fill();
// 		game.add.sprite(50, 50, myBitmap);

// var myBitmap = game.add.bitmapData(800, 600);
// var grd=myBitmap.context.createLinearGradient(0,0,0,500);
// gradient.addColorStop(0,"white");
// gradient.addColorStop(1,"#0a68b0");
// myBitmap.context.fillStyle=grd;
// myBitmap.context.fillRect(0,0,800,580);
// grd=myBitmap.context.createLinearGradient(0,580,0,600);
// grd.addColorStop(0,"#0a68b0");grd.addColorStop(1,"black");
// myBitmap.context.fillStyle=grd;myBitmap.context.fillRect(0,580,800,20);game.add.sprite(0, 0, myBitmap);

		this.sky = this.game.add.bitmapData(this.game.world.width, this.game.world.height);
		console.log(this.sky)
		var gradient = this.sky.context.createLinearGradient(this.game.world.width / 2, 0, this.game.world.width / 2, this.game.world.height);
		gradient.addColorStop(0,"#0a68b0");
		gradient.addColorStop(1,"#F9F9F9");
		this.sky.context.fillStyle = gradient;
		this.sky.context.fillRect(0, 0, this.game.world.width, this.game.world.height);
		// this.sky.rect(0, 0, this.game.world.width, this.game.world.height);
		// grd.addColorStop(0, "#0000FF");            
		// grd.addColorStop(1, "#FFFFFF");
		// this.sky.fill();
		this.add.sprite(0, 0, this.sky);
		this.game.world.sendToBack(this.sky);

		this.background = this.add.tileSprite(0, 20, this.game.world.width, this.game.world.height, 'background');
		this.background.tileScale.y = 2;
		this.background.autoScroll(-this.scrollSpeed / 3, 0);
		// this.game.world.sendToBack(this.background);

		this.water = this.add.tileSprite(0, this.game.world.height - 30, this.game.world.width, 30, 'water');
		this.water.autoScroll(this.scrollSpeed / 10, 0);

		// Create Controls  //////   this needs to refactored to work with cursors in detecting jump !!!!! ////
		this.jumpButton = this.game.add.sprite(50, 300, 'arrow');
		this.jumpButton.anchor.setTo(0.5);
		this.jumpButton.inputEnabled = true;
		this.jumpButton.events.onInputDown.add(this.playerJump, this);


		// Hard code first platform 
		this.currentPlatform = new Endless.Platform(this.game, this.tilePool, 15, 100, 200, -this.scrollSpeed, this.coinsPool);  
    // console.log(this.currentPlatform);
		this.platformPool.add(this.currentPlatform);
    	this.game.world.bringToTop(this.platformPool);

		// create the player
		this.player = this.add.sprite(50, 70, 'player');
		this.player.animations.add('running', [0, 1, 2, 3, 4, 5], 15, true);
		this.player.anchor.setTo(0.5);
    	this.game.physics.arcade.enable(this.player);
		this.player.play('running');
		
		// change player bounding box
		this.player.body.setSize(30, 50, 0, 10);

		this.spaceCreditsSound = this.add.audio('spaceCredits');

		/// show number of spaceCredits
		var style = { font: '30px Arial', fill: '#F9F9F9'};
		this.spaceCreditsLabel = this.add.text(10, 10, `$: ${this.spaceCredits}`, style);
	},
	update: function(){
    if(this.player.alive) {

			this.platformPool.forEachAlive(function(platform, index) { //iterate over group of platforms
				// add physics check for player collision with platform here
				this.game.physics.arcade.collide(this.player, platform); 
				if(platform.length && platform.children[platform.length-1].right < 0) {
						// console.log('platform offscreen');
						platform.remove(); // remove() is a method on the Platform
				}  
			}, this);
			
			//    console.log(this.currentPlatform);
	    if(this.currentPlatform.length && this.currentPlatform.children[this.currentPlatform.length-1].right < this.game.world.width) {
	      this.createPlatform();
	    }

	    if(this.cursors.up.isDown || this.game.input.activePointer.isDown) {
	    	this.playerJump();
	    } else if(this.cursors.up.isUp || this.game.input.activePointer.isUp) {
	    	this.isJumping = false;
	    }

			// we need to give the player velocity = to scrollSpeed to counter platforms velocity but only when the player is grounded(touching the scrolling platforms)
			if(this.player.body.touching.down) {
				// console.log('grounded!')
				this.player.body.velocity.x = this.scrollSpeed;		
			} else {
				this.player.body.velocity.x = 0;
			}

			this.game.physics.arcade.overlap(this.player, this.coinsPool, this.collectCoins, null, this);		
		}
		// Check if player is dead
		if(this.player.top >= this.game.world.height || this.player.left <= 0) {
			console.log('Game Over')
			this.gameOver();
		}
	},
	render: function() {
		// this.game.debug.body(this.player);	
		// this.game.debug.bodyInfo(this.player, 0, 0);
	},
	
	playerJump: function() {
		console.log('Jumping!')
		if(this.player.body.touching.down) {
			// starting point of the jump
			this.startJumpY = this.player.y;
			
			// keep track of the fact the player is jumping
			this.isJumping = true;
			this.jumpPeak = false;
			
			this.player.body.velocity.y = -300;
		} else if(this.isJumping && !this.jumpPeak){
			this.player.body.velocity.y = -300;
			if( (Math.floor(this.player.y - this.startJumpY)) * -1 > this.maxJumpDistance ) {
				this.jumpPeak = true;
			}
		}
	},

	createPlatform: function() {
			var nextPlatformData = this.genRandomPlatform();
			
		if(nextPlatformData) {
			// console.log(nextPlatformData.separation)
			this.currentPlatform = this.platformPool.getFirstDead();

		if(!this.currentPlatform) {
			this.currentPlatform = new Endless.Platform(this.game, this.tilePool, nextPlatformData.segments, this.game.world.width + nextPlatformData.separation, nextPlatformData.y, -this.scrollSpeed, this.coinsPool);
		} else {
			this.currentPlatform.prepare(nextPlatformData.segments, this.game.world.width + nextPlatformData.separation, nextPlatformData.y, -this.scrollSpeed);
		}
		// console.log(this.platformPool);
			// this.nextPlatform = new Endless.Platform(this.game, this.tilePool, nextPlatformData.segments, this.game.world.width + nextPlatformData.separation, nextPlatformData.y, -this.scrollSpeed);

		this.platformPool.add(this.currentPlatform);
		}
	},
	
	genRandomPlatform: function() {
			var platform = {};
			
			platform.separation = this.game.rnd.integerInRange(30, 80);

			// y in regards to previous platform
			var minY = -120;
			var maxY = 120;
			// platform.y = this.game.rnd.integerInRange(70, 320);
			platform.y = this.currentPlatform.children[0].y + minY + Math.random() * (maxY - minY);
//      platform.y = this.currentPlatform.children[0].y;
			platform.y = Math.max(150, platform.y);
			platform.y = Math.min(this.game.world.height - 50, platform.y);
			platform.segments = this.game.rnd.integerInRange(2, 10);
			
			return platform;
	},

	collectCoins: function(player, coin) {
		console.log(coin)
		coin.kill();
		this.spaceCredits += 1;
		this.spaceCreditsSound.play();
		this.spaceCreditsLabel.text = `$: ${this.spaceCredits}`;		
		console.log('collected coins! ' + this.spaceCredits);
	},

	gameOver: function() {
		this.player.kill();
		this.updateHighScore();
		this.restart();
	},	

	restart: function() {
		this.game.state.start('Game');
	},

	updateHighScore: function() {
		this.highScore = localStorage.getItem('highScore')

		console.log(this.highScore);
		// do we have a new high score
		if(this.highScore < this.spaceCredits) {
			this.highScore = this.spaceCredits;
			// save highScore to local Storage
			localStorage. setItem('highScore', this.highScore);
		}
	}

}