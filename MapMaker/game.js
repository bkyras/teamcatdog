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

// This is a template for creating new Perlenspiel games
var G;
var DEFAULT_COLOR = PS.COLOR_WHITE; //0
var GROUND_COLOR = 0x579532; //1
var PATH_COLOR = 0x222222; //2
var DIRT_COLOR = 0xAF623B; //3
var TREE_COLOR = PS.COLOR_GREEN; //4
var WATER_COLOR = PS.COLOR_BLUE; //5

(function(){
	G = {
		GRID_WIDTH: 30,
		GRID_HEIGHT: 30,
		colors: [DEFAULT_COLOR, GROUND_COLOR, PATH_COLOR, DIRT_COLOR, TREE_COLOR, WATER_COLOR],
		curColor: 1,
		curSize: 1,
		
		statusChange : function() {
			PS.statusText("Color: " + G.curColor + ", Size: " + G.curSize)
		},
		
		incSize : function() {
			if(G.curSize < 10)
				G.curSize++;
		},
		
		decSize : function() {
			if(G.curSize > 1)
				G.curSize--;
		},
		
		colorTiles : function(x, y) {
			for(var i = 0; i < G.curSize; i++) {
				for(var j = 0; j < G.curSize; j++) {
					var a = x+i < G.GRID_WIDTH;
					var b = y+j < G.GRID_HEIGHT;
					if(a && b) {
						PS.color(x+i, y+j, G.colors[G.curColor]);
						PS.data(x+i, y+j, G.curColor);
					}
				}
			}
		},
		
		outputMap: function() {
			var map = [];
			for(var row = 0; row < G.GRID_WIDTH; row++) {
				var rowData = [];
				for(var col = 0; col < G.GRID_HEIGHT; col++) {
					rowData.push(PS.data(col, row));
				}
				map.push(rowData);
			}
			PS.debug("[");
			for(var r = 0; r < G.GRID_HEIGHT; r++) {
				PS.debug("[");
				PS.debug(map[r]);
				PS.debug("],\n");
			}
			PS.debug("]");
		}
	}
}());
// All of the functions below MUST exist, or the engine will complain!

// PS.init( system, options )
// Initializes the game
// This function should normally begin with a call to PS.gridSize( x, y )
// where x and y are the desired initial dimensions of the grid
// [system] = an object containing engine and platform information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.init = function( system, options ) {
	// Use PS.gridSize( x, y ) to set the grid to
	// the initial dimensions you want (32 x 32 maximum)
	// Do this FIRST to avoid problems!
	// Otherwise you will get the default 8x8 grid

	PS.gridSize( G.GRID_WIDTH, G.GRID_HEIGHT );
	PS.gridColor(0xDDDDDD);
	PS.border(PS.ALL, PS.ALL, 0);
	PS.data(PS.ALL, PS.ALL, 0);
	G.statusChange();

	// Add any other initialization code you need here
};

// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.touch = function( x, y, data, options ) {
	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches over a bead
	G.colorTiles(x, y);
};

// PS.release ( x, y, data, options )
// Called when the mouse button is released over a bead, or when a touch is lifted off a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.release = function( x, y, data, options ) {
	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead
};

// PS.enter ( x, y, button, data, options )
// Called when the mouse/touch enters a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.enter = function( x, y, data, options ) {
	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead
	if(options.touching) {
		G.colorTiles(x, y);
	}
};

// PS.exit ( x, y, data, options )
// Called when the mouse cursor/touch exits a bead
// It doesn't have to do anything
// [x] = zero-based x-position of the bead on the grid
// [y] = zero-based y-position of the bead on the grid
// [data] = the data value associated with this bead, 0 if none has been set
// [options] = an object with optional parameters; see documentation for details

PS.exit = function( x, y, data, options ) {
	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead
};

// PS.exitGrid ( options )
// Called when the mouse cursor/touch exits the grid perimeter
// It doesn't have to do anything
// [options] = an object with optional parameters; see documentation for details

PS.exitGrid = function( options ) {
	// Uncomment the following line to verify operation
	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid
};

PS.keyDown = function( key, shift, ctrl, options ) {
	// Uncomment the following line to inspect parameters
	//	PS.debug( "DOWN: key = " + key + ", shift = " + shift + "\n" );

	// Add code here for when a key is pressed
	switch(key) {
		case PS.KEY_PAD_0:
			G.curColor = 0;
			break;
		case PS.KEY_PAD_1:
			G.curColor = 1;
			break;
		case PS.KEY_PAD_2:
			G.curColor = 2;
			break;
		case PS.KEY_PAD_3:
			G.curColor = 3;
			break;
		case PS.KEY_PAD_4:
			G.curColor = 4;
			break;
		case PS.KEY_PAD_5:
			G.curColor = 5;
			break;
		case PS.KEY_ENTER:
			G.outputMap();
			break;
		case PS.KEY_ARROW_UP:
			G.incSize();
			break;
		case PS.KEY_ARROW_DOWN:
			G.decSize();
			break;
	}
	
	G.statusChange();
};

// PS.keyUp ( key, shift, ctrl, options )
// Called when a key on the keyboard is released
// It doesn't have to do anything
// [key] = ASCII code of the pressed key, or one of the PS.KEY constants documented at:
// http://users.wpi.edu/~bmoriarty/ps/constants.html
// [shift] = true if shift key is held down, false otherwise
// [ctrl] = true if control key is held down, false otherwise
// [options] = an object with optional parameters; see documentation for details

PS.keyUp = function( key, shift, ctrl, options ) {
	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.keyUp(): key = " + key + ", shift = " + shift + ", ctrl = " + ctrl + "\n" );

	// Add code here for when a key is released
};

// PS.input ( sensors, options )
// Called when an input device event (other than mouse/touch/keyboard) is detected
// It doesn't have to do anything
// [sensors] = an object with sensor information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

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

// PS.shutdown ( options )
// Called when the browser window running Perlenspiel is about to close
// It doesn't have to do anything
// [options] = an object with optional parameters; see documentation for details

PS.shutdown = function( options ) {

	// Add code here for when Perlenspiel is about to close
};