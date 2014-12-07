var SF = SF || {};

SF.Init = function ( )
{
    var game = SF.game = new Phaser.Game(600, 800, Phaser.AUTO, '', {
        preload: function () {

            game.load.image('ship', 'img/player-ship.png');
            game.load.image('asteroid', 'img/asteroid.png');
            game.load.image('shield-red', 'img/asteroid-shield-red.png');
            game.load.image('shield-yellow', 'img/asteroid-shield-yellow.png');
            game.load.image('shield-green', 'img/asteroid-shield-green.png');

        },
        create: function () {

        }
    });
};