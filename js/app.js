var Endless = Endless || {};

Endless.dim = Endless.getGameLandscapeDimensions(640, 360);
console.log(Endless.dim)

Endless.game = new Phaser.Game(640, 360, Phaser.AUTO, 'ld29', null, false, false);

Endless.game.state.add('Boot', Endless.BootState);
Endless.game.state.add('Preload', Endless.PreloadState);
Endless.game.state.add('Game', Endless.GameState);

Endless.game.state.start('Boot');