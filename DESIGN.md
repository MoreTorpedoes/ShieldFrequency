Intro text
==========

Earth is under attack!
Someone is sending artifically shielded asteroids towards it!

We'll be able to measure the shield frequency of these asteroids, and
display that information for you, however it is up to you to set your
lazer frequency to some non-trival prime factor of the frequency in order
for your weapons to penatrate the shields.

Be mindful of the color of the shields, they may have different effects.
Good luck!


Basic game setup
================

 - Asteroids come from the top of the screen to the bottom in five rows
 - Earth population starts at 10 billion
 - Every time an asteroid gets passed the population drops by 100 million
 - If the population reaches 0, you lose
 - If an asteroid impacts the player ship, or the ship's lazer bounces back
   and hits it, the ship is destroyed, and a 10s countdown where asteroids
   are free to pass is started until 10s is up (and a new ship spawns), or
   earth's population is 0
 - Earth's population rises by 1% every minute
 - There is no win screen. Only a score screen when the player eventually loses.

Controls:

 - Player presses left and right arrows to switch lanes (animated, timed)
 - Player presses space to fire
 - Default shield frequency is 2
 - User presses number keys to type the shield frequency
 - Backspace acts as expected on numbers
 - Space to fire (animated, timed)
 - After firing, any number key press will erase current frequency first


Shield colors
=============

Green shield
 - Shot always passes through

Yellow shield
 - Shot stops if wrong freq
 - On hit shot passes through

Red shield
 - Bounces shot back if wrong freq
 - On hit shot does not pass through


Difficulty scaling
==================

Methods to increase difficulty as time progresses:
 - Increase number of asteroids
 - Increase difficulty of prime factor finding (larger prime factors)
 - Increase % of yellow shields vs green shields
 - Increase % of red shields vs yellow shields