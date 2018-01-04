var Endless = Endless || {};

Endless.Platform = function(game, tilePool, segments, x, y, speed, coinsPool){
	Phaser.Group.call(this, game); // initiate a group and pass it the context and the game object
	
	this.size = 40;
	this.game = game;
	this.enableBody = true;
	this.tilePool = tilePool;
	this.coinsPool = coinsPool;
	this.speed = speed;
	this.prepare(segments, x, y, speed);
};

Endless.Platform.prototype = Object.create(Phaser.Group.prototype); // Since we are creating a custom object that extends from the group object
Endless.Platform.prototype.constructor = Endless.Platform; // The constructor will be the one entered above

Endless.Platform.prototype.prepare = function(segments, x, y, speed) {
	   
    // console.log('create tile ' + segments + ' pos - ' + x + ' ' + y);
		this.alive = true;
		var i = 0;
	
			while(i < segments) {  /// the recycled tiles is causing a problem with end sprites being used in wrong place this can likely fixed with getFirstExists(key) and restructuring the getTile function - done see below!!!;
				// check for dead tiles
        var tile = this.tilePool.getFirstExists(false, false, x + i * this.size, y, this.getTile(i, segments-1));          
	
				if(!tile) { // if no dead tiles create a new one
					// console.log('there was no tile')
					tile = new Phaser.Sprite(this.game, x + i * this.size, y, this.getTile(i, segments-1));				
				} else {
					tile.reset(x + i * this.size, y);
				}				
			this.add(tile);
			i++;
		}
	
	//set physics
  this.setAll('body.immovable', true);
  this.setAll('body.allowGravity', false);
	this.setAll('body.velocity.x', speed);  

	this.addCoins(speed);
}

Endless.Platform.prototype.remove = function() {
	this.children.forEach(function(tile){
		tile.kill();
	});
  // console.log(this)
  this.alive = false;
  this.callAll('kill'); // all sprites have a method kill
  // but we want to return the sprites to tilePool for reuse 
  // so we map through the groups children(tiles) and add them to this.tilePool
  this.children.map( (tile) => tile).map( (tile) => {
  	this.tilePool.add(tile);
  });
  // var sprites = [];  /// to be deleted due to improved code!!
  // this.forEach(function(tile){
  //   sprites.push(tile);
  // }, this);
  
  // sprites.forEach(function(tile){
  //   this.tilePool.add(tile);
  // }, this);

}

Endless.Platform.prototype.getTile = function(segmentNo, segments) {
 
	function randomNum(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
	}  
	
  if(segmentNo == 0) {
    return `floor-start-${randomNum(1, 3)}`;  // try this.game.rnd.integerInRange   
  } else if (segmentNo == segments) {
  	return `floor-end-${randomNum(1, 3)}`;
  } else {
    return 'floor';
  }

};

Endless.Platform.prototype.addCoins = function(speed) {
	var coinsY = this.game.rnd.integerInRange(90, 200);

	this.forEach(function(tile) {
		// 40% chance
		hasCoin = Math.random() <= 0.3;

		if(hasCoin) {
			var coin = this.coinsPool.getFirstExists(false);

			if(!coin) {
				coin = new Phaser.Sprite(this.game, tile.x, tile.y - coinsY, 'coin');
				this.coinsPool.add(coin);
			} else {
				coin.reset(tile.x, tile.y - coinsY);
			}
			coin.body.velocity.x = speed;
			coin.body.allowGravity = false;
		}
	}, this)
}