// Enums
import { GAME } from '/src/enums/game.enum.js';
import { PLAYER } from '/src/enums/player.enum.js';
import { ALERT } from '/src/enums/alert.enum.js';
import { SPAWN } from '/src/enums/spawn.enum.js';
import { TEXT_COLOR } from '/src/enums/textColor.enum.js';
import { INSTANCES } from '/src/enums/instances.enum.js';

// Services
import { setupCanva } from './src/services/canva.service';
import { initGameVariables } from './src/services/game.service';
import { initInstancesParams, killInst } from './src/services/instances.service';
import { initImages } from './src/services/image.service';
import { initFramerateParams, updateFramerate } from './src/services/framerate.service';
import { initStateOfKey } from './src/services/keyboard.service';
import { oCollideWithLarger, oCollideWithSmaller } from './src/services/collider.service';
import { drawBg } from './src/services/background.service';
import { oDrawWrap, oWorldWrap } from './src/services/object.service';

// Canvases
let { cv, c } = setupCanva(document);

// Global Game Variables
let { spawning, spawnTimeReset, spawnTime, score, highScore, bxt1, bxt2, byt1, byt2 } = initGameVariables();

// Instances
let { inst, instNext } = initInstancesParams();

// [I] Images
let { sSpaceship, sBullet, sAsteroid, sAlert1, sAlert2, sBg1, sBg2, imagesLoaded, imagesNeeded, imagesToLoad } = initImages();

function imageLoaded() {
	if ((++imagesLoaded) >= imagesNeeded)
		gmTitle();
}

for (var i = 0; i < imagesToLoad.length; ++i) {
	imagesToLoad[i].onload = imageLoaded;
}

// Keyboard Input
let { kl, kr, ku, kd, k1, k2 } = initStateOfKey();

// Events
document.addEventListener("keydown", function (e) {
	switch (e.key) {
		case 'ArrowLeft':
		case 'q':
			kl = 1;
			e.preventDefault();
			break;
		case 'ArrowRight':
		case 'd':
			kr = 1;
			e.preventDefault();
			break;
		case 'ArrowDown':
		case 's':
			kd = 1;
			e.preventDefault();
			break;
		case 'ArrowUp':
		case 'z':
			ku = 1;
			e.preventDefault();
			break;
		case ' ':
			k1 = 1;
			e.preventDefault();
			break;
		case 'Enter':
			k2 = 1;
			break;
		case 'Escape':
			gmEnd();
	}
});
document.addEventListener("keyup", function (e) {
	switch (e.key) {
		case 'ArrowLeft':
		case 'q':
			kl = 0;
			break;
		case 'ArrowRight':
		case 'd':
			kr = 0;
			break;
		case 'ArrowDown':
		case 's':
			kd = 0;
			break;
		case 'ArrowUp':
		case 'z':
			ku = 0;
			break;
		case ' ':
			k1 = 0;
			e.preventDefault();
			break;
	}
});

// Set keys that don't repeat when held 
function stopKeyRepeat() {
	k2 = 0;
}

// Framerate
let { frameLast, frameNow, fps } = initFramerateParams();

updateFramerate(frameNow, fps, frameLast);

// Game Objects
function makeInst(x, y, o) {
	// Skip past instance indexes that are full or have persistent objects
	while (inst[instNext] != null && inst[instNext].ps != null) {
		if ((++instNext) >= INSTANCES.MAX)
			instNext = 0;
	}

	// Add instance to instance array
	inst[instNext] = this;
	this.id = instNext;

	if ((++instNext) >= INSTANCES.MAX)
		instNext = 0;

	// Set x & y position
	this.x = x;
	this.y = y;

	this.o = o;

	// Execute object constructor
	switch (o) {
		case 0:
			{
				this.xforces = new Array(PLAYER.FORCE_COUNT).fill(0);
				this.yforces = new Array(PLAYER.FORCE_COUNT).fill(0);
				this.force = 0;
				this.forceSpeed = PLAYER.SPEED_FORCE;
				this.turnSpeed = PLAYER.SPEED_TURN;
				this.bulletSpeed = PLAYER.SPEED_BULLET;
				this.shootCooldownReset = 10;
				this.shootCooldown = 0;
				this.dir = 0;
				this.w = sSpaceship.width;
				this.h = sSpaceship.height;

				this.worldWrap = oWorldWrap;
				this.shoot = oSpaceshipShoot;
				this.draw = oSpaceshipDraw;
				this.drawWrap = oDrawWrap;
				this.hit = oCollideWithLarger;

				this.ps = true;
				this.ud = oSpaceshipUD;
				break;
			}
		case 1:
			{
				this.hsp = 0;
				this.vsp = 0;

				this.ud = oBulletUD;
				break;
			}
		case 2:
			{
				var speed = 2, dir = Math.random() * (Math.PI * 2);
				this.hsp = Math.cos(dir) * speed;
				this.vsp = Math.sin(dir) * speed;
				this.hp = 5;

				this.halfWidth = sAsteroid.width / 2;
				this.halfHeight = sAsteroid.height / 2;

				this.worldWrap = oWorldWrap;
				this.draw = oAsteroidDraw;
				this.drawWrap = oDrawWrap;
				this.hit = oCollideWithSmaller;

				this.ps = true;
				this.ud = oAsteroidUD;
				break;
			}
		case 3:
			{
				this.frame1 = true;
				this.frames = ALERT.FRAMES;
				this.dur = ALERT.DURATION;

				this.ud = oAlertUD;
				break;
			}
		case 4:
			{
				this.ud = oTitleUD;
				break;
			}
		case 5:
			{
				this.ud = oEndUD;
				break;
			}
	}
}

// [O] Objects
function oSpaceshipUD() {
	// Checking if hit by something
	if (this.hit(2, this.x - 10, this.y - 10, 20, 20, -20, -20, 40, 40) != null) {
		killInst(inst, this);
		gmEnd();
	}

	// Turn ship
	this.dir += (kr - kl) * this.turnSpeed;

	// Move ship 
	if (ku) {
		this.xforces[this.force] = Math.cos(this.dir) * this.forceSpeed;
		this.yforces[this.force] = Math.sin(this.dir) * this.forceSpeed;

		++this.force;
		if (this.force >= PLAYER.FORCE_COUNT)
			this.force = 0;
	}
	if (kd) {
		this.xforces[this.force] = -Math.cos(this.dir) * this.forceSpeed;
		this.yforces[this.force] = -Math.sin(this.dir) * this.forceSpeed;

		++this.force;
		if (this.force >= PLAYER.FORCE_COUNT)
			this.force = 0;
	}

	// Apply movement	
	for (var i = 0; i < PLAYER.FORCE_COUNT; ++i) {
		this.x += this.xforces[i];
		this.y += this.yforces[i];
	}

	// Wrap around world
	this.worldWrap();

	// Shooting
	if (this.shootCooldown == 0) {
		if (k1) {
			this.shoot();
			this.shootCooldown = this.shootCooldownReset;
		}
	}
	else {
		--this.shootCooldown;
		if (!k1)
			this.shootCooldown = 0;
	}

	// Draw
	this.drawWrap();
}

function oSpaceshipShoot() {
	var bullet = new makeInst(this.x, this.y, 1);
	bullet.hsp = Math.cos(this.dir) * this.bulletSpeed;
	bullet.vsp = Math.sin(this.dir) * this.bulletSpeed;
}

function oSpaceshipDraw(x, y) {
	c.save();
	c.translate(x, y);
	c.rotate(this.dir);
	c.drawImage(sSpaceship, -this.w / 2, -this.h / 2);
	c.restore();
}

function oBulletUD() {
	this.x += this.hsp;
	this.y += this.vsp;
	c.drawImage(sBullet, this.x, this.y);
}

function oAsteroidUD() {
	// Move
	this.x += this.hsp;
	this.y += this.vsp;

	// Wrap around world
	this.worldWrap();

	// Check for collision with a bullet
	var hitby;
	if ((hitby = this.hit(1, this.x - this.halfWidth, this.y - this.halfHeight, 64, 64, 0, 0, 10, 10)) != null) {
		if ((--this.hp) == 0) {
			++score;
			killInst(inst, this);
		}
		killInst(inst, hitby);
	}

	// Draw
	this.drawWrap();
}

function oAsteroidDraw(x, y) {
	c.drawImage(sAsteroid, x - this.halfWidth, y - this.halfHeight);
}
function oAlertUD() {
	// Duration
	if ((--this.dur) == 0) {
		// Spawn an asteroid, then delete self
		new makeInst(this.x, this.y, 2);
		killInst(inst, this);
	}

	// Animation
	if ((--this.frames) == 0) {
		this.frames = ALERT.FRAMES;
		this.frame1 = !this.frame1;
	}

	// Drawing
	c.drawImage(this.frame1 ? sAlert1 : sAlert2, this.x, this.y);
}
function oTitleUD() {
	c.textAlign = "center";
	c.font = "20px Courier";
	c.fillStyle = TEXT_COLOR.GREEN;
	c.fillText("the game finished loading. yay.", GAME.WIDTH_HALF, GAME.HEIGHT_HALF - 120);
	c.fillStyle = TEXT_COLOR.WHITE;
	c.fillText("Bad Asteroid Game", GAME.WIDTH_HALF, GAME.HEIGHT_HALF - 60);
	c.fillStyle = TEXT_COLOR.GREEN;
	c.fillText("by Luke Lawlor", GAME.WIDTH_HALF, GAME.HEIGHT_HALF - 30);
	c.fillText("Press Enter to Play", GAME.WIDTH_HALF, GAME.HEIGHT_HALF + 20);

	if (k2)
		gmStart();
}

function oEndUD() {
	c.textAlign = "center";
	c.font = "20px Courier";
	c.fillStyle = TEXT_COLOR.WHITE;
	c.fillText("G A M E   O V E R", GAME.WIDTH_HALF, GAME.HEIGHT_HALF - 60);
	c.fillStyle = TEXT_COLOR.GREEN;
	c.fillText("Score: " + score, GAME.WIDTH_HALF, GAME.HEIGHT_HALF - 30);
	c.fillText("High Score: " + highScore, GAME.WIDTH_HALF, GAME.HEIGHT_HALF - 12);
	c.fillText("Press Enter to Replay", GAME.WIDTH_HALF, GAME.HEIGHT_HALF + 20);

	if (k2)
		gmStart();
}

// Game Functions
function gmTitle() {
	new makeInst(0, 0, 4);
	gmLoop();
}

function gmStart() {
	inst.fill(null);
	spawning = true;
	spawnTimeReset = SPAWN.TIME_START;
	spawnTime = 10;
	score = 0;
	new makeInst(100, 80, 0);
}

function gmEnd() {
	if (score > highScore)
		highScore = score;
	inst.fill(null);
	spawning = false;
	new makeInst(0, 0, 5);
}

// Game Loop
function gmLoop() {
	// Request another frame
	requestAnimationFrame(gmLoop);

	// Clear Screen
	c.clearRect(0, 0, cv.width, cv.height);

	// Draw Background
	drawBg(c, sBg1, sBg2, bxt1, byt1, bxt2, byt2);

	// Update Instances
	for (var i = 0; i < INSTANCES.MAX; ++i)
		if (inst[i] != null)
			inst[i].ud();

	// Spawn Asteroids
	if (spawning && (--spawnTime) <= 0) {
		// Spawn Asteroid
		var x = Math.random() * GAME.WIDTH;
		var y = Math.random() * GAME.HEIGHT;
		new makeInst(x, y, 3);

		// Reset Spawn Time
		spawnTimeReset -= SPAWN.TIME_DEC;
		if (spawnTimeReset < SPAWN.TIME_MIN)
			spawnTimeReset = SPAWN.TIME_MIN;
		spawnTime = spawnTimeReset;
	}

	// Keyboard Input
	stopKeyRepeat();

	// Show Framerate & Score
	updateFramerate();

	c.fillStyle = TEXT_COLOR.GREEN;
	c.font = "16px Courier";
	c.textAlign = "left";
	c.fillText("FPS: " + fps, 6, 16);
	c.fillText("SCORE: " + score, 6, 32);
	c.fillText("HISCORE: " + highScore, 6, 48);
}

// Exports
export function getInst() {
	return inst;
}

export function getC() {
	return c;
}

export function getSAlert1() {
	return sAlert1;
}

export function getSAlert2() {
	return sAlert2;
}