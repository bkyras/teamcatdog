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
	var GRID_HEIGHT = 20;
	var GRID_WIDTH = 20;
	var ECHO_LURE_SOUND = "fx_squawk";
	
	var echoSprite = "", echoActive = false;
	var heraSprite = "", heraActive = false;
	var zeusSprite = "", zeusActive = false;
	
	var echoX = 2, echoY = 3;
	var heraX = 12, heraY = 15;
	var zeusX = 10, zeusY = 2;
	
	var lure = 0;
	var lureCooldown = 0;
	var heraTime = 2;
	
	var idMoveTimer = "";
	var path = [];
	var step = 0;
	
	var statusTextTimer = null;
	var curStatText = "";
	var fullStatText = "";
	
	var tick = function () {
		if (echoActive) {
			moveEcho();
		}
		
		if (heraActive) {
			if(heraTime == 0) {
				moveHera();
				heraTime = 2;
			}
		heraTime--;
		}
		if(lureCooldown > 0)
			lureCooldown--;
		if(lure > 0)
			lure--;
//		else if(lure == 0)
//			PS.statusText("");
	};
	
	var heraCollide = function(s1, p1, s2, p2, type) {
		if(s2 == zeusSprite) {
			PS.statusText("Hera found zeus, you loser");
		}
	};
	
	var moveHera = function() {
		var rand = PS.random(4) - 1;
		if(lure > 0) {
			var hPath = PS.line(heraX, heraY, echoX, echoY);
			if(hPath.length > 1) {
				var hx = hPath[0][0];
				var hy = hPath[0][1]
				PS.spriteMove(heraSprite, hx, hy)
				heraX = hx;
				heraY = hy;
				}
		} else {
			switch(rand){
				case 0:
					if(heraX != 0) {
						PS.spriteMove(heraSprite, heraX-1, heraY)
						heraX -= 1;
					}
					break;
				case 1:
					if(heraX != GRID_WIDTH-2) {
						PS.spriteMove(heraSprite, heraX+1, heraY)
						heraX += 1;
					}
					break;
				case 2:
					if(heraY != 0) {
						PS.spriteMove(heraSprite, heraX, heraY-1)
						heraY -= 1;
					}
					break;
				case 3:
					if(heraY != GRID_HEIGHT-2) {
						PS.spriteMove(heraSprite, heraX, heraY+1)
						heraY += 1;
					}
					break;
			}
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

		if(nx == GRID_WIDTH-1 || ny == GRID_HEIGHT-1)
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
	
	var customStatusText = function (statusText) {
		var characterDelay = 20;
		
		if (statusTextTimer !== null) {
			clearInterval(statusTextTimer);
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
		}
	}
	
	G = {
		init : function() {
			idMoveTimer = PS.timerStart(5, tick);
			PS.audioLoad(ECHO_LURE_SOUND);
			G.initEcho();
		},
		
		initEcho : function() {
			echoSprite = PS.spriteSolid(2, 2);
			PS.spritePlane(echoSprite, 1);
			PS.spriteMove(echoSprite, echoX, echoY);
			echoActive = true;
		},
		
		initZeus : function() {
			zeusSprite = PS.spriteSolid(2, 2);
			PS.spritePlane(zeusSprite, 3);
			PS.spriteSolidColor(zeusSprite, PS.COLOR_YELLOW);
			PS.spriteMove(zeusSprite, zeusX, zeusY);
			zeusActive = true;
			customStatusText("Hera created");
		},
		
		initHera : function() {
			heraSprite = PS.spriteSolid(2, 2);
			PS.spritePlane(heraSprite, 2);
			PS.spriteCollide(heraSprite, heraCollide);
			PS.spriteSolidColor(heraSprite, PS.COLOR_RED);
			PS.spriteMove(heraSprite, heraX, heraY);
			heraActive = true;
			customStatusText("Zeus created");
		},
		
		move : function(x, y) {
			step = 0;
			path = PS.line(echoX, echoY, x, y);
		},
		
		lure : function() {
			if(lureCooldown == 0) {
				PS.statusText("Over here!");
				PS.audioPlay(ECHO_LURE_SOUND);
				lure = 12; //num ticks to be lured for
				lureCooldown = 30; //num ticks of lure cooldown (includes lured time)
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

	PS.gridSize(20, 20);
	PS.border(PS.ALL, PS.ALL, 0);
	PS.gridColor(0xDDDDDD);
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