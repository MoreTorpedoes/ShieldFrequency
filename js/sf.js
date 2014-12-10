var SF = SF || {};

SF.STATE_INTRO     = 1;
SF.STATE_GAME      = 2;
SF.STATE_GAME_OVER = 3;

SF.state = null;

SF.Init = function ( )
{
    SF.W = $(window).width();
    SF.H = $(window).height();

    var setBuffer = function ( )
    {
        if (SF.bfrImg)
        {
            SF.bfrImg.parent.removeChild(SF.bfrImg);
            SF.bfrImg.kill();
        }

        SF.bfr = SF.game.make.bitmapData(SF.W, SF.H);
        SF.bfrImg = SF.bfr.addToWorld(0, 0);

        SF.GW = 100 * (SF.W/SF.H);
        SF.GH = 100;
    };

    var game = SF.game = new Phaser.Game(SF.W, SF.H, Phaser.AUTO, '', {
        preload: function () {

            game.load.image('ship', 'img/player-ship.png');
            game.load.image('ship-left', 'img/player-ship-left.png');
            game.load.image('ship-right', 'img/player-ship-right.png');
            game.load.image('asteroid', 'img/asteroid.png');
            game.load.image('shield-red', 'img/asteroid-shield-red.png');
            game.load.image('shield-yellow', 'img/asteroid-shield-yellow.png');
            game.load.image('shield-green', 'img/asteroid-shield-green.png');

        },
        create: function () {

            setBuffer();

            SF.InitState(SF.STATE_GAME);

        },
        update: SF.Update
    });

    $(window).resize(function(){
        SF.W = $(window).width();
        SF.H = $(window).height();
        game.width = SF.W;
        game.height = SF.H;
        game.renderer.resize(SF.W, SF.H);
        setBuffer();
    });

};

var PX = function ( x )
{
    return (x/SF.GW) * SF.W;
};

var PY = function ( y )
{
    return (y/SF.GH) * SF.H;
};

var LX = function ( lx )
{
    return PX(SF.GW/2.0 + lx*20);
};

var LPX = function ( lx )
{
    return lx*20 + SF.GW/2.0;
};

var PSCALE = function ( sz, isz )
{
    return PY(sz) / isz;
};

var __ctime = 0.0;
var ctime = function ( )
{
    return __ctime;
};

SF.STAR_SPEED = 160.0;
SF.NUM_STARS = 100;
SF.LASER_SPEED = 100.0;
SF.LASER_RATE = 1.0/3.0;

SF.UpdateRenderStars = function ( delta )
{
    Math.seedrandom(ctime());
    if (!SF.stars)
    {
        SF.stars = [];
        for (var i=0; i<SF.NUM_STARS; i++)
        {
            SF.stars.push({
                y: Math.random() * SF.GH * 1.25,
                x: Math.random() * SF.GW,
                s: Math.random()
            });
        }
        SF.stars.sort(function(a,b){
            return b.s - a.s;
        });
    }

    var ctx = SF.bfr.ctx;

    for (var i=0; i<SF.stars.length; i++)
    {
        var ss = SF.STAR_SPEED * (SF.stars[i].s * 0.8 + 0.2);
        SF.stars[i].y += delta * ss;
        var oy = SF.stars[i].y - ss / 4;
        ctx.strokeStyle = 'rgba(255,255,255,' + (SF.stars[i].s*0.5) + ')';
        ctx.beginPath();
        ctx.moveTo(PX(SF.stars[i].x), PY(SF.stars[i].y));
        ctx.lineTo(PX(SF.stars[i].x), PY(oy));
        ctx.stroke();
        if (oy > SF.GH)
        {
            SF.stars[i].y = -Math.random() * SF.GH * 0.5;
            SF.stars[i].x = Math.random() * SF.GW;
        }
    }
};

SF.Update = function ( )
{
    var delta = 1.0/60.0;
    var newTime = SF.game.time.now / 1000.0;
    if (SF.lastFrameTime)
        delta = newTime - SF.lastFrameTime;
    SF.lastFrameTime = newTime;
    if (delta > 1/10) delta = 1/10;
    __ctime += delta;

    if (SF.state === null)
        return;

    SF.bfr.ctx.fillStyle = 'black';
    SF.bfr.ctx.fillRect(0, 0, SF.W, SF.H);

    SF.UpdateRenderStars(delta);

    SF.wasPressed = {};
    SF.lkey = SF.ckey || {};
    SF.ckey = {};

    for (var k in Phaser.Keyboard)
        if (Phaser.Keyboard[k] > 0 && Phaser.Keyboard[k] < 255)
        {
            SF.wasPressed[k] = false;
            SF.ckey[k] = false;
            if (SF.game.input.keyboard.isDown(Phaser.Keyboard[k]))
            {
                SF.wasDown[k] = true;
                SF.ckey[k] = true;
            }
            else if (SF.wasDown[k])
            {
                SF.wasDown[k] = false;
                SF.wasPressed[k] = true;
            }
        }

    if (SF.state === SF.STATE_INTRO)
    {

    }
    else if (SF.state === SF.STATE_GAME)
    {
        for (var i=0; i<SF.sprite.asteroids.length; i++)
        {
            Math.seedrandom(i);
            SF.sprite.asteroids[i].angle = ctime() * (Math.random() * 90.0 - 45.0);
        }
        
        var t = 0.0;
        if ((SF.player.toLane - SF.player.lane) > 0.0)
        {
            var t = SF.sprite.shipr.alpha = Math.pow(Math.min(SF.player.toLane - SF.player.lane, 1), 0.3);
            SF.bfr.draw(SF.sprite.shipr, LX(SF.player.lane), PY(100 - 12 + Math.sin(ctime()) * 1.0));
        }
        else if ((SF.player.toLane - SF.player.lane) < -0.0)
        {
            var t = SF.sprite.shipl.alpha = Math.pow(Math.min(SF.player.lane - SF.player.toLane, 1), 0.3);
            SF.bfr.draw(SF.sprite.shipl, LX(SF.player.lane), PY(100 - 12 + Math.sin(ctime()) * 1.0));
        }
        
        SF.sprite.ship.alpha = 1.0 - t;
        SF.bfr.draw(SF.sprite.ship, LX(SF.player.lane), PY(100 - 12 + Math.sin(ctime()) * 1.0));

        SF.sprite.shields[0].angle = SF.sprite.asteroids[9].angle;
        SF.bfr.draw(SF.sprite.shields[0], LX(-1), PY(20 + SF.aster.speed * ctime()));
        SF.bfr.draw(SF.sprite.asteroids[9], LX(-1), PY(20 + SF.aster.speed * ctime()));

        SF.bfr.draw(SF.sprite.asteroids[1], LX(1), PY(70 + SF.aster.speed * ctime()));

        if (SF.ckey.LEFT && !SF.lkey.LEFT)
        {
            SF.player.toLane -= 1;
            if (SF.player.toLane < -2) SF.player.toLane = -2;
        }
        if (SF.ckey.RIGHT && !SF.lkey.RIGHT)
        {
            SF.player.toLane += 1;
            if (SF.player.toLane > 2) SF.player.toLane = 2;
        }
        if (SF.ckey.SPACEBAR && (ctime() - SF.player.lastFire) > SF.LASER_RATE)
        {
            SF.lasers.push({
                x: LPX(SF.player.lane) - 3.65,
                y: 100 - 12 + Math.sin(ctime()) * 1.0,
                freq: SF.player.freq,
                dir: -1
            });
            SF.lasers.push({
                x: LPX(SF.player.lane) + 3.65,
                y: 100 - 12 + Math.sin(ctime()) * 1.0,
                freq: SF.player.freq,
                dir: -1
            });
            SF.player.lastFire = ctime();
        }

        for (var i=0; i<SF.lasers.length; i++)
        {
            SF.lasers[i].y += delta * SF.lasers[i].dir * SF.LASER_SPEED;

            if (SF.lasers[i].y < -5.0 || SF.lasers[i].y > 105.0)
            {
                SF.lasers.splice(i, 1);
                i --;
                continue;
            }

            var y1 = SF.lasers[i].y - 2.5;
            var y2 = SF.lasers[i].y + 2.5;

            var ctx = SF.bfr.ctx;
            ctx.beginPath();
            ctx.strokeStyle = 'rgba(25, 255, 25, .8)';
            ctx.lineWidth = 2.0;
            ctx.moveTo(PX(SF.lasers[i].x), PY(y1));
            ctx.lineTo(PX(SF.lasers[i].x), PY(y2));
            ctx.stroke();
            ctx.lineWidth = 1.0;
        }

        SF.player.lane += Math.max(Math.min(SF.player.toLane - SF.player.lane, 1), -1) * Math.max(Math.min(delta * 1.5, 1), 0.05);
    }
    else if (SF.state === SF.STATE_GAME_OVER)
    {

    }
};

SF.InitState = function ( state )
{
    SF.state = state;

    if (SF.state === SF.STATE_INTRO)
    {

    }
    else if (SF.state === SF.STATE_GAME)
    {
        var spr = SF.game.make.sprite(0, 0, 'ship');
        spr.anchor.set(0.5);
        spr.scale.set(PSCALE(10, 128.0));
        var sprl = SF.game.make.sprite(0, 0, 'ship-left');
        sprl.anchor.set(0.5);
        sprl.scale.set(PSCALE(10, 128.0));
        var sprr = SF.game.make.sprite(0, 0, 'ship-right');
        sprr.anchor.set(0.5);
        sprr.scale.set(PSCALE(10, 128.0));
        var aspr = [];
        for (var i=0; i<10; i++)
        {
            var s = SF.game.make.sprite(0, 0, 'asteroid');
            s.anchor.set(0.5);
            s.scale.set(PSCALE(20*(i/19+0.5), 256.0));
            Math.seedrandom(i);
            aspr.push(s);
        }
        var rsspr = SF.game.make.sprite(0, 0, 'shield-red');
        rsspr.anchor.set(0.5);
        rsspr.scale.set(PSCALE(33, 420.0));
        var gsspr = SF.game.make.sprite(0, 0, 'shield-green');
        gsspr.anchor.set(0.5);
        gsspr.scale.set(PSCALE(33, 420.0));
        var ysspr = SF.game.make.sprite(0, 0, 'shield-yellow');
        ysspr.anchor.set(0.5);
        ysspr.scale.set(PSCALE(33, 420.0));

        SF.sprite = {
            'ship': spr,
            'shipl': sprl,
            'shipr': sprr,
            'asteroids': aspr,
            'shields': [
                gsspr,
                ysspr,
                rsspr
            ]
        };

        SF.player = {

            population: 10, // billions
            lane: 0,
            toLane: 0,
            freq: 2,
            lastFire: ctime(),
            fireSinceFreq: true

        };

        SF.aster = {
            all: [],
            speed: 1.0,
            max: 5,
            nsp: 1.0, // No shield percentage
            gp: 0.0,  // Green shield percentage
            yp: 0.0,  // Yellow shield percentage
            rp: 0.0   // Red shield percentage
        };

        SF.wasDown = {};

        SF.lasers = [];

    }
    else if (SF.state === SF.STATE_GAME_OVER)
    {

    }
};