// Constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const GAME_WIDTH_HALF = GAME_WIDTH / 2;
const GAME_HEIGHT_HALF = GAME_HEIGHT / 2;

const MAX_INSTANCES = 500; 

const PLAYER_FORCE_COUNT = 80;
const PLAYER_SPEED_FORCE = 0.06;
const PLAYER_SPEED_TURN = 0.06;
const PLAYER_SPEED_BULLET = 10;

const ALERT_FRAMES = 8;
const ALERT_DURATION = 110;

const SPAWN_TIME_START = 240;
const SPAWN_TIME_DEC = 10;
const SPAWN_TIME_MIN = 50;

const TEXT_COLOR_WHITE = "#ffffff";
const TEXT_COLOR_GREEN = "#88ff88";

// Canvases
var cv = document.getElementById("can");
cv.width = GAME_WIDTH;
cv.height = GAME_HEIGHT;
var c = cv.getContext("2d", {alpha: false});
c.imageSmoothingEnabled = false;
c.fillStyle = "#ffffff";

// Global Game Variables
var spawning = false;
var spawnTimeReset = SPAWN_TIME_START;
var spawnTime = spawnTimeReset;
var score = 0;
var highScore = 0;
var bxt1 = 0;
var byt1 = 0;
var bxt2 = 0;
var byt2 = 0;

// Instances
var inst = new Array(MAX_INSTANCES);
var instNext = 0;

// [I] Images
var sSpaceship = new Image(); sSpaceship.src = "ship.png";
var sBullet = new Image(); sBullet.src = "bullet.png";
var sAsteroid = new Image(); sAsteroid.src = "asteroid.png";
var sAlert1 = new Image(); sAlert1.src = "alert1.png";
var sAlert2 = new Image(); sAlert2.src = "alert2.png";
var sBg1 = new Image(); sBg1.src = "bg1.png";
var sBg2 = new Image(); sBg2.src = "bg2.png";

var imagesLoaded = 0;
var imagesNeeded = 7;
var imagesToLoad = [sSpaceship, sBullet, sAsteroid, sAlert1, sAlert2, sBg1, sBg2];

function imageLoaded()
{
	if ((++imagesLoaded) >= imagesNeeded)
		gmTitle();
}

for (var i = 0; i < imagesToLoad.length; ++i)
{
	imagesToLoad[i].onload = imageLoaded;
}

// Keyboard Input
var kl = 0, kr = 0, ku = 0, kd = 0, k1 = 0, k2 = 0;

// Listen for keyboard input
document.addEventListener("keydown", function(e)
{
	switch (e.keyCode)
	{
		case 37:{kl=1;e.preventDefault();break;}
		case 39:{kr=1;e.preventDefault();break;}
		case 40:{kd=1;e.preventDefault();break;}
		case 38:{ku=1;e.preventDefault();break;}
		
		case 90:{k1=1;break;}
		case 13:{k2=1;break;}
	}
});
document.addEventListener("keyup", function(e)
{
	switch (e.keyCode)
	{
		case 37:{kl=0;break;}
		case 39:{kr=0;break;}
		case 40:{kd=0;break;}
		case 38:{ku=0;break;}

		case 90:{k1=0;break;}
	}
});

// Set keys that don't repeat when held 
function stopKeyRepeat()
{
	k2 = 0;
}

// Framerate
var frameLast = Date.now();
var frameNow = frameLast;
var fps = 0;

function updateFramerate()
{
	frameNow = Date.now();
	fps = Math.round(1000 / (frameNow - frameLast));
	frameLast = frameNow;
}

// Game Objects
function makeInst(x, y, o)
{
	// Skip past instance indexes that are full or have persistent objects
	while (inst[instNext] != null && inst[instNext].ps != null)
	{
		if ((++instNext) >= MAX_INSTANCES)
			instNext = 0;
	}
	
	// Add instance to instance array
	inst[instNext] = this;
	this.id = instNext;

	if ((++instNext) >= MAX_INSTANCES)
		instNext = 0;

	// Set x & y position
	this.x = x;
	this.y = y;

	this.o = o;
	
	// Execute object constructor
	switch (o)
	{
		case 0:
		{
			this.xforces = new Array(PLAYER_FORCE_COUNT).fill(0);
			this.yforces = new Array(PLAYER_FORCE_COUNT).fill(0);
			this.force = 0;
			this.forceSpeed = PLAYER_SPEED_FORCE;
			this.turnSpeed = PLAYER_SPEED_TURN;
			this.bulletSpeed = PLAYER_SPEED_BULLET;
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
			this.frames = ALERT_FRAMES;
			this.dur = ALERT_DURATION;

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
function killInst(o)
{
	inst[o.id] = null;
}

// [O] Objects
function oSpaceshipUD()
{
	// Checking if hit by something
	if (this.hit(2, this.x - 10, this.y - 10, 20, 20, -20, -20, 40, 40) != null)
	{
		killInst(this);
		gmEnd();
	}

	// Turn ship
	this.dir += (kr - kl) * this.turnSpeed;
	
	// Move ship 
	if (ku)
	{
		this.xforces[this.force] = Math.cos(this.dir) * this.forceSpeed;
		this.yforces[this.force] = Math.sin(this.dir) * this.forceSpeed;
		
		++this.force;
		if (this.force >= PLAYER_FORCE_COUNT)
			this.force = 0;
	}

	// Apply movement	
	for (var i = 0; i < PLAYER_FORCE_COUNT; ++i)
	{
		this.x += this.xforces[i];
		this.y += this.yforces[i];
	}

	// Wrap around world
	this.worldWrap();	

	// Shooting
	if (this.shootCooldown == 0)
	{
		if (k1)
		{
			this.shoot();
			this.shootCooldown = this.shootCooldownReset;
		}
	}
	else
	{
		--this.shootCooldown;
		if (!k1)
			this.shootCooldown = 0;
	}

	// Draw
	this.drawWrap();
}
function oSpaceshipShoot()
{
	var bullet = new makeInst(this.x, this.y, 1);
	bullet.hsp = Math.cos(this.dir) * this.bulletSpeed;
	bullet.vsp = Math.sin(this.dir) * this.bulletSpeed;
}
function oSpaceshipDraw(x, y)
{
	c.save();
	c.translate(x, y);
	c.rotate(this.dir);
	c.drawImage(sSpaceship, -this.w / 2, -this.h / 2);
	c.restore();
}
function oBulletUD()
{
	this.x += this.hsp;
	this.y += this.vsp;
	c.drawImage(sBullet, this.x, this.y);
}
function oAsteroidUD()
{
	// Move
	this.x += this.hsp;
	this.y += this.vsp;

	// Wrap around world
	this.worldWrap();

	// Check for collision with a bullet
	var hitby;
	if ((hitby = this.hit(1, this.x - this.halfWidth, this.y - this.halfHeight, 64, 64, 0, 0, 10, 10)) != null)
	{
		if ((--this.hp) == 0)
		{
			++score;
			killInst(this);
		}
		killInst(hitby);
	}

	// Draw
	this.drawWrap();
}
function oAsteroidDraw(x, y)
{
	c.drawImage(sAsteroid, x - this.halfWidth, y - this.halfHeight);
}
function oAlertUD()
{
	// Duration
	if ((--this.dur) == 0)
	{
		// Spawn an asteroid, then delete self
		new makeInst(this.x, this.y, 2);
		killInst(this);
	}

	// Animation
	if ((--this.frames) == 0)
	{
		this.frames = ALERT_FRAMES;
		this.frame1 = !this.frame1;
	}

	// Drawing
	c.drawImage(this.frame1 ? sAlert1 : sAlert2, this.x, this.y);
}
function oTitleUD()
{
	c.textAlign = "center";
	c.font = "20px Courier";
	c.fillStyle = TEXT_COLOR_GREEN;
	c.fillText("the game finished loading. yay.", GAME_WIDTH_HALF, GAME_HEIGHT_HALF - 120);
	c.fillStyle = TEXT_COLOR_WHITE;
	c.fillText("Bad Asteroid Game", GAME_WIDTH_HALF, GAME_HEIGHT_HALF - 60);
	c.fillStyle = TEXT_COLOR_GREEN;
	c.fillText("by Luke Lawlor", GAME_WIDTH_HALF, GAME_HEIGHT_HALF - 30);
	c.fillText("Press Enter to Play", GAME_WIDTH_HALF, GAME_HEIGHT_HALF + 20);

	if (k2)
		gmStart();
}
function oEndUD()
{
	c.textAlign = "center";
	c.font = "20px Courier";
	c.fillStyle = TEXT_COLOR_WHITE;
	c.fillText("G A M E   O V E R", GAME_WIDTH_HALF, GAME_HEIGHT_HALF - 60);
	c.fillStyle = TEXT_COLOR_GREEN;
	c.fillText("Score: " + score, GAME_WIDTH_HALF, GAME_HEIGHT_HALF - 30);
	c.fillText("High Score: " + highScore, GAME_WIDTH_HALF, GAME_HEIGHT_HALF - 12);
	c.fillText("Press Enter to Replay", GAME_WIDTH_HALF, GAME_HEIGHT_HALF + 20);

	if (k2)
		gmStart();
}

// General Object Functions
function oWorldWrap()
{
	if (this.x > GAME_WIDTH)
		this.x = GAME_WIDTH - this.x;
	else if (this.x < 0)
		this.x = GAME_WIDTH + this.x;
	
	if (this.y > GAME_HEIGHT)
		this.y = GAME_HEIGHT - this.y; 
	else if (this.y < 0)
		this.y = GAME_HEIGHT + this.y;
}

// Draw an object normally, and as it wraps across the screen
// Precondition: object has a draw() function
function oDrawWrap()
{
	var xstop = this.x + GAME_WIDTH;
	var ystop = this.y + GAME_HEIGHT;

	for (var x = this.x - GAME_WIDTH - 1; x <= xstop; x += GAME_WIDTH)
	{
		for (var y = this.y - GAME_HEIGHT - 1; y <= ystop; y += GAME_HEIGHT)
		{
			this.draw(x, y);
		}
	}
}

function oCollideWithLarger(o, x1, y1, w1, h1, s1, s2, w2, h2)
{	
	var other; 
	for (var i = 0; i < MAX_INSTANCES; ++i)
	{
		other = inst[i];
		if (other != null && other.o == o)
		{
			if (checkRect(x1, y1, w1, h1, other.x + s1, other.y + s2, w2, h2))
				return other;
		}
	}
	return null;
}

function oCollideWithSmaller(o, x1, y1, w1, h1, s1, s2, w2, h2)
{	
	var other; 
	for (var i = 0; i < MAX_INSTANCES; ++i)
	{
		other = inst[i];
		if (other != null && other.o == o)
		{
			if (checkRect(other.x + s1, other.y + s2, w2, h2, x1, y1, w1, h1))
				return other;
		}
	}
	return null;
}

// Check for a collision between two rectangles
// Pass the variables for the smaller rectangle first
function checkRect(x1,y1,w1,h1,x2,y2,w2,h2)
{
	var x12 = x1 + w1;
	var y12 = y1 + h1;
	var x22 = x2 + w2;
	var y22 = y2 + h2;

	if (x1 >= x2 && x1 <= x22)
	{
		//Left Side Hit
		if (y1 >= y2 && y1 <= y22)
		{
			//Top Side Hit
			return true;
		}
		if (y12 >= y2 && y12 <= y22)
		{
			// Bottom Side Hit
			return true;
		}
	}
	else if (x12 >= x2 && x12 <= x22)
	{
		// Right Side Hit
		if (y1 >= y2 && y1 <= y22)
		{
			//Top Side Hit
			return true;
		}
		if (y12 >= y2 && y12 <= y22)
		{
			// Bottom Side Hit
			return true;
		}
	}
	return false;
}

// Background
function drawBg()
{
	// Vars
	var bw1 = sBg1.width;
	var bh1 = sBg1.height;
	var bw2 = sBg1.width;
	var bh2 = sBg1.height;

	// Increase ticks
	if ((bxt1 += 0.3) > bw1)
		bxt1 = 0;
	if ((byt1 += 0.1) > bh1)
		byt1 = 0;

	if ((bxt2 += 0.2) > bw2)
		bxt2 = 0;
	if ((byt2 += 0.05) > bh2)
		byt2 = 0;

	// Draw
	for (var x = -bw2 + bxt2; x < GAME_WIDTH + bw2; x += bw2)
	{
		for (var y = -bh2 + byt2; y < GAME_HEIGHT + bh2; y += bh2)
		{
			c.drawImage(sBg2, x, y);
		}
	}

	for (var x = -bw1 + bxt1; x < GAME_WIDTH + bw1; x += bw1)
	{
		for (var y = -bh1 + byt1; y < GAME_HEIGHT + bh1; y += bh1)
		{
			c.drawImage(sBg1, x, y);
		}
	}

}

// Game Functions
function gmTitle()
{
	new makeInst(0, 0, 4);
	gmLoop();
}

function gmStart()
{
	inst.fill(null);
	spawning = true;
	spawnTimeReset = SPAWN_TIME_START;
	spawnTime = 10;
	score = 0;
	new makeInst(100, 80, 0);
}

function gmEnd()
{
	if (score > highScore)
		highScore = score;
	inst.fill(null);
	spawning = false;
	new makeInst(0, 0, 5);
}

// Game Loop
function gmLoop()
{
	// Request another frame
	requestAnimationFrame(gmLoop);

	// Clear Screen
	c.clearRect(0,0,cv.width,cv.height);	

	// Draw Background
	drawBg();
	
	// Update Instances
	for (var i = 0; i < MAX_INSTANCES; ++i)
		if (inst[i] != null)
			inst[i].ud();
	
	// Spawn Asteroids
	if (spawning && (--spawnTime) <= 0)
	{
		// Spawn Asteroid
		var x = Math.random() * GAME_WIDTH;
		var y = Math.random() * GAME_HEIGHT;
		new makeInst(x, y, 3);

		// Reset Spawn Time
		spawnTimeReset -= SPAWN_TIME_DEC;
		if (spawnTimeReset < SPAWN_TIME_MIN)
			spawnTimeReset = SPAWN_TIME_MIN;
		spawnTime = spawnTimeReset;
	}
	
	// Keyboard Input
	stopKeyRepeat();

	// Show Framerate & Score
	updateFramerate();

	c.fillStyle = TEXT_COLOR_GREEN;
	c.font = "16px Courier";
	c.textAlign = "left";
	c.fillText("FPS: " + fps, 6, 16);
	c.fillText("SCORE: " + score, 6, 32);
	c.fillText("HISCORE: " + highScore, 6, 48);
}
