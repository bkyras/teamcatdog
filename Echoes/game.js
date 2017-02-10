// game.js for Perlenspiel 3.2.x

/*
Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
Perlenspiel is Copyright © 2009-17 Worcester Polytechnic Institute.
This file is part of Perlenspiel.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with Perlenspiel. If not, see <http://www.gnu.org/licenses/>.
*/

// The "use strict" directive in the following line is important. Don't remove it!
"use strict";

// The following comment lines are for JSLint/JSHint. Don't remove them!

/*jslint nomen: true, white: true */
/*global PS */

var G;

(function(){
	
	var ECHO_LURE_SOUND = "fx_squawk";
	var LADY_SOUND = "fx_hoot";
	var LADY_PLANE = 1, ZEUS_PLANE = 2, HERA_PLANE = 3, ECHO_PLANE = 4;
	var LURE_RADIUS = 12;
	var MAX_LADIES = 6;
	
	var echoSprite = "", echoActive = false;
	var heraSprite = "", heraActive = false;
	var zeusSprite = "", zeusActive = false;
	var ladiesActive = false;
	
	var spawnLadyTimer = 50;
	var ladySprites = [];
	var forDeletion = [];
	
	var echoX = 14, echoY = 6;
	var heraX = 12, heraY = 15;
	var zeusX = 10, zeusY = 2;
	
	var lure = 0;
	var lureCooldown = 0;
	var heraTime = 2, zeusTime = 4, ladyTime = 3;
	
	var idMoveTimer = "";
	var path = [];
	var step = 0;
	
	var statusTextTimer = null;
	var curStatText = "";
	var fullStatText = ""; 
	
	var T; //variable containing tutorial functions. 
	T = {
		index : 0,
		numMoves : 0,
		timer : null,
		onMove : function(){}
	};
	
	var tick = function () {
		if (echoActive) {
			moveEcho();
		}
		heraTime--;
		zeusTime--;
		ladyTime--;
		
		if(heraActive && heraTime <= 0) {
			moveHera();
			heraTime = 2;
		}
		if(zeusActive && zeusTime <= 0) {
			moveZeus();
			zeusTime = 4;
		}
		if(ladyTime <= 0) {
			moveLadies();
			ladyTime = 3;
		}
		if(lureCooldown == 0)
			PS.spriteSolidAlpha(echoSprite, 255);
		if(lureCooldown > 0) {
			var a = PS.spriteSolidAlpha(echoSprite);
			PS.spriteSolidAlpha(echoSprite, a+((255-a)/lureCooldown));
			lureCooldown--;
		}
		if(lure > 0)
			lure--;
		
		if(ladiesActive && ladySprites.length < MAX_LADIES && spawnLadyTimer == 0) {
			spawnLady();
			spawnLadyTimer = 50;
		}
		if(spawnLadyTimer > 0)
			spawnLadyTimer--;
		while(forDeletion.length > 0) {
			var spr = forDeletion.pop();
			PS.spriteDelete(spr);
		}
	};
	
	var heraCollide = function(s1, p1, s2, p2, type) {
		if(s2 == zeusSprite) {
			PS.statusText("Hera found zeus, you loser");
		}
	};
	
	var moveRandom = function(sprite, x, y) {
		var rand = PS.random(4) - 1;
			switch(rand){
				case 0:
					if(x != 0)
						x -= 1;
					break;
				case 1:
					if(x != G.GRID_WIDTH-2)
						x += 1;
					break;
				case 2:
					if(y != 0)
						y -= 1;
					break;
				case 3:
					if(y != G.GRID_HEIGHT-2)
						y += 1;
					break;
			}
		PS.spriteMove(sprite, x, y)
		return {xPos: x, yPos: y};
	};
	
	var moveHera = function() {
		var rand = PS.random(4) - 1;
		if(lure > 0) {
			var hPath = PS.line(heraX, heraY, echoX, echoY);
			if(hPath.length > 1 && hPath.length <= LURE_RADIUS) {
				PS.spriteSolidAlpha(heraSprite, 180);
				var hx = hPath[0][0];
				var hy = hPath[0][1]
				PS.spriteMove(heraSprite, hx, hy)
				heraX = hx;
				heraY = hy;
				} else {
					var pos = moveRandom(heraSprite, heraX, heraY);
					heraX = pos.xPos;
					heraY = pos.yPos;
				}
		} else {
			PS.spriteSolidAlpha(heraSprite, 255);
			var pos = moveRandom(heraSprite, heraX, heraY);
			heraX = pos.xPos;
			heraY = pos.yPos;
		}
	};
	
	var moveLadies = function() {
		for(let spr of ladySprites) {
			if(lure > 0) {
				var pos = PS.spriteMove(spr);
				var lPath = PS.line(pos.x, pos.y, echoX, echoY);
				if(lPath.length > 1 && lPath.length <= LURE_RADIUS) {
					PS.spriteSolidAlpha(spr, 180);
					var lx = lPath[0][0];
					var ly = lPath[0][1]
					PS.spriteMove(spr, lx, ly)
				}
			} else
				PS.spriteSolidAlpha(spr, 255);
		}
	};
	
	var moveZeus = function() {
		var rand = PS.random(4) - 1;
		if(ladySprites.length > 0) {
			var pos = PS.spriteMove(ladySprites[0]);
			var zPath = PS.line(zeusX, zeusY, pos.x, pos.y);
			if(zPath.length > 1) {
				var zx = zPath[0][0];
				var zy = zPath[0][1]
				PS.spriteMove(zeusSprite, zx, zy)
				zeusX = zx;
				zeusY = zy;
				}
		} else {
			var pos = moveRandom(zeusSprite, zeusX, zeusY);
			zeusX = pos.xPos;
			zeusY = pos.yPos;
		}
	};
	
	var moveEcho = function() {
		var p, nx, ny, ptr, val;

		if (path.length === 0) {
			return;
		}

		p = path[ step ];
		
		nx = p[ 0 ]; // next x-pos
		ny = p[ 1 ]; // next y-pos

		if ((echoX === nx) && (echoY === ny)) {
			path = [];
			return;
		}

		if(nx == G.GRID_WIDTH-1 || ny == G.GRID_HEIGHT-1)
			path = [];
		else {
			PS.spriteMove(echoSprite, nx, ny);
			echoX = nx;
			echoY = ny;
		}
		
		step++;
		
		if ( step >= path.length ) {
			path = [];
		}
	};
	
	var spawnLady = function() {
		var a = PS.spriteSolid(2, 2);
		PS.spritePlane(a, LADY_PLANE);
		PS.spriteSolidColor(a, PS.COLOR_BLUE);
		var rx = PS.random(G.GRID_WIDTH - 1) - 1;
		var ry = PS.random(G.GRID_HEIGHT - 1) - 1;
		PS.spriteMove(a, rx, ry);
		ladySprites.push(a);
	};
	
	var wooLady = function(s1, p1, s2, p2, type) {
		var i = ladySprites.indexOf(s2);
		if(i != -1) {
			PS.audioPlay(LADY_SOUND);
			ladySprites.splice(i, 1);
			forDeletion.push(s2);
		}
	};
	
	var customStatusText = function (statusText) {
		var characterDelay = 20;
		
		if (statusTextTimer !== null) {
			clearInterval(statusTextTimer);
			statusTextTimer = null;
		}
		
		curStatText = "";
		fullStatText = statusText;
		statusTextTimer = setInterval(incrementStatusText, characterDelay);
	};
	
	var incrementStatusText = function() {
		curStatText = fullStatText.slice(0,curStatText.length + 1);
		PS.statusText(curStatText);
		
		if(curStatText.length === fullStatText.length) {
			clearInterval(statusTextTimer);
			statusTextTimer = null;
		}
	};
	
	var activateBeads = function(newWidth, newHeight) {
		var x, y;
		
		//should only use even values
		G.activeBoardWidth = newWidth;
		G.activeBoardHeight = newHeight;
		
		if (G.activeBoardWidth > G.GRID_WIDTH) {
			G.activeBoardWidth = G.GRID_WIDTH;
		}
		
		if (G.activeBoardHeight > G.GRID_HEIGHT) {
			G.activeBoardHeight = G.GRID_HEIGHT;
		}
		
		for (x = 0; x < G.GRID_WIDTH; x++) {
			for (y = 0; y < G.GRID_HEIGHT; y++) {
				var dw = (2*x) + 1;
				var lowBound = G.GRID_WIDTH - (G.activeBoardWidth + 1);
				var upBound = G.GRID_WIDTH + (G.activeBoardWidth + 1);
				if (y < G.activeBoardHeight && dw > lowBound && dw < upBound) {
					PS.active(x,y,true);
					PS.visible(x,y,true);
				} else {
					PS.visible(x,y,false);
					PS.active(x,y,false);
				}
			}
		}
	};
	
	var incrementTutorial = function() {
		T.index += 1;
		T.numMoves = 0;
		clearTimeout(T.timer);
		T.timer = null;
		T.onMove = function(){};
		
		var SMALL_WAIT = 3000;
		
		switch(T.index) {
			case 1:
				customStatusText("You are Echo, a nymph.");
				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 2:
				customStatusText("Click to move.");
				T.onMove = function(){
					console.log("On move fired\n" + T.timer);
					T.numMoves += 1;
					if (T.timer === null && T.numMoves > 1) {
						incrementTutorial();
					}
				};
				T.timer = setTimeout(function(){
					console.log("timeout fired");
					if (T.numMoves > 1) {
						incrementTutorial();
					} else {
						clearTimeout(T.timer);
						T.timer = null;
					}
				}, SMALL_WAIT);
				break;
			case 3:
				customStatusText("This is Hera, a Goddess.");
				activateBeads(22,22);
				G.initHera();
				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 4:
				customStatusText("Talk to Hera with Spacebar.");
				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 5:
				customStatusText("If you're near, she'll listen.");
				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 6:
				customStatusText("So will regular ladies.");
				T.timer = setTimeout(function(){
					ladiesActive = true;
					spawnLady();
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 7:
				customStatusText("Hera's husband, Zeus, is cheating.");
				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
			case 8:
				customStatusText("Don't let Hera find him.");
				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
			case 9:
				customStatusText("There he is now!");
				G.initZeus();
				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
			case 10:
				customStatusText("Keep Hera distracted by chatting.");
				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
		}
	};
	
	G = {
		GRID_HEIGHT : 30,
		GRID_WIDTH : 30,
	
		activeBoardWidth : null,
		activeBoardHeight : null,
		
		init : function() {
			PS.gridSize(G.GRID_WIDTH, G.GRID_HEIGHT);
			PS.border(PS.ALL, PS.ALL, 0);
			PS.gridColor(0xDDDDDD);
			
			G.activeBoardHeight = G.GRID_HEIGHT;
			G.activeBoardWidth = G.GRID_WIDTH;
			
			idMoveTimer = PS.timerStart(5, tick);
			PS.audioLoad(ECHO_LURE_SOUND);
			PS.audioLoad(LADY_SOUND);
			ladiesActive = false;
			G.initEcho();
			activateBeads(14,14);
			
			incrementTutorial();
		},
		
		initEcho : function() {
			echoSprite = PS.spriteSolid(2, 2);
			PS.spritePlane(echoSprite, ECHO_PLANE);
			PS.spriteMove(echoSprite, echoX, echoY);
			echoActive = true;
		},
		
		initZeus : function() {
			zeusSprite = PS.spriteSolid(2, 2);
			PS.spritePlane(zeusSprite, ZEUS_PLANE);
			PS.spriteCollide(zeusSprite, wooLady);
			PS.spriteSolidColor(zeusSprite, PS.COLOR_YELLOW);
			PS.spriteMove(zeusSprite, zeusX, zeusY);
			zeusActive = true;
			customStatusText("Zeus created");
		},
		
		initHera : function() {
			heraSprite = PS.spriteSolid(2, 2);
			PS.spritePlane(heraSprite, HERA_PLANE);
			PS.spriteCollide(heraSprite, heraCollide);
			PS.spriteSolidColor(heraSprite, PS.COLOR_RED);
			PS.spriteMove(heraSprite, heraX, heraY);
			heraActive = true;
		},
		
		move : function(x, y) {
			step = 0;
			path = PS.line(echoX, echoY, x, y);
			T.onMove();
		},
		
		spawn : function() {
			spawnLady();
		},
		
		lure : function() {
			if(lureCooldown == 0) {
				customStatusText("Over here!");
				PS.audioPlay(ECHO_LURE_SOUND);
				lure = 18; //num ticks to be lured for
				lureCooldown = 30; //num ticks of lure cooldown (includes lured time)
				PS.spriteSolidAlpha(echoSprite, 125);
			}
		}
	};
}());


// This is a template for creating new Perlenspiel games

// All of the functions below MUST exist, or the engine will complain!
/**********************************************************************************/

PS.init = function( system, options ) {
	// Use PS.gridSize( x, y ) to set the grid to
	// the initial dimensions you want (32 x 32 maximum)
	// Do this FIRST to avoid problems!
	// Otherwise you will get the default 8x8 grid


	G.init();

	// Add any other initialization code you need here
};


PS.touch = function( x, y, data, options ) {
	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches over a bead
	G.move(x, y);
};


PS.release = function( x, y, data, options ) {
	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead
};


PS.enter = function( x, y, data, options ) {
	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead
};


PS.exit = function( x, y, data, options ) {
	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead
};


PS.exitGrid = function( options ) {
	// Uncomment the following line to verify operation
	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid
};


PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following line to inspect parameters
	//	PS.debug( "DOWN: key = " + key + ", shift = " + shift + "\n" );

	// Add code here for when a key is pressed
	if (key == 32) {
		G.lure();
	} else if (key == PS.KEY_ARROW_UP) {
		G.initHera();
	} else if (key == PS.KEY_ARROW_DOWN) {
		G.initZeus();
	} else if (key == PS.KEY_ARROW_RIGHT) {
		G.spawn();
	}
};


PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.keyUp(): key = " + key + ", shift = " + shift + ", ctrl = " + ctrl + "\n" );

	// Add code here for when a key is released
};


PS.input = function( sensors, options ) {
	// Uncomment the following block to inspect parameters
	/*
	PS.debug( "PS.input() called\n" );
	var device = sensors.wheel; // check for scroll wheel
	if ( device )
	{
		PS.debug( "sensors.wheel = " + device + "\n" );
	}
	*/
	
	// Add code here for when an input event is detected
};


PS.shutdown = function( options ) {

	// Add code here for when Perlenspiel is about to close
};