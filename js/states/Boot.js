var Endless = Endless || {};

Endless.BootState = {
	init: function() {

		this.game.stage.backgroundColor = '#FF0000';
	//		game.stage.backgroundColor = "#4488AA";
		this.game.stage.smoothed = false;
	    //scaling options
	    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;    
	    //have the game centered horizontally
	    this.scale.pageAlignHorizontally = true;
	    this.scale.pageAlignVertically = true;
	},
	
	preload: function() {
	
	// add loader graphic
//		console.log(this);

	},
	
	create: function() {
		this.state.start('Preload');
	}
};