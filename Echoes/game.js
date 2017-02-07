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
	
	var echoSprite = "";
	var heraSprite = "";
	var echoX = 2;
	var echoY = 3;
	var heraX = 12;
	var heraY = 15;
	
	var idMoveTimer = "";
	var path = null;
	var step = 0;
	
	var tick = function () {
		moveEcho();
		moveHera();
	};
	
	var moveHera = function() {
		var rand = PS.random(4) - 1;
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
	};
	
	var moveEcho = function() {
		var p, nx, ny, ptr, val;

		if (!path) {
			return;
		}

		p = path[ step ];
		nx = p[ 0 ]; // next x-pos
		ny = p[ 1 ]; // next y-pos

		if ((echoX === nx) && (echoY === ny)) {
			path = null;
			return;
		}

		PS.spriteMove(echoSprite, nx, ny);
		echoX = nx;
		echoY = ny;
		
		step++;
		
		if ( step >= path.length ) {
			path = null;
		}
	};
	
	G = {
		init : function() {
			idMoveTimer = PS.timerStart(5, tick);
			echoSprite = PS.spriteSolid(2, 2);
			heraSprite = PS.spriteSolid(2, 2);
			PS.spriteSolidColor(heraSprite, PS.COLOR_RED);
			PS.spriteMove(echoSprite, echoX, echoY);
			PS.spriteMove(heraSprite, heraX, heraY);
		},
		
		move : function(x, y) {
			step = 0;
			path = PS.line(echoX, echoY, x, y);
		},
		
		influence : function() {
			
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
	PS.statusText(key);
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