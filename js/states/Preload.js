var Endless = Endless || {};

Endless.PreloadState = {
	preload: function() {
		console.log('Preloader started');
		this.bitmapSquare = this.add.bitmapData(32, 32);
	    this.bitmapSquare.ctx.fillStyle = '#222';
	  	this.bitmapSquare.ctx.fillRect(0, 0, 32, 32);
		
		this.load.image('background', 'assets/img/background.png');
		this.load.image('water', 'assets/img/water.png');

		// Buttons 
		this.load.image('arrow', 'assets/img/arrow-left-inv.svg');
		
		this.load.image('floor', 'assets/img/Bricks_1.png');
		this.load.image('floor-start-1', 'assets/img/Bricks_End_Left_1.png');	
		this.load.image('floor-start-2', 'assets/img/Bricks_End_Left_2.png');				
		this.load.image('floor-end-1', 'assets/img/Bricks_End_Right_1.png');
		this.load.image('floor-end-2', 'assets/img/Bricks_End_Right_2.png');
		
		this.load.image('coin', 'assets/img/platform-crate-alt.png');
		this.load.spritesheet('player', 'assets/img/player.png', 30, 60, 7);

		this.load.audio('spaceCredits', 'assets/audio/coin.mp3');		
	},
	create: function() {
		this.state.start('Game');
	}
}


