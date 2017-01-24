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

// The G object will contain all public constants, variables and functions

var G;

// This self-invoking function encapsulates all game functionality.
// It is called as this file is loaded, and initializes the G object.

( function () {
	"use strict";

	G = {
		//constants (all caps)

		//color constants

		//board colors
		DEFAULT_COLOR : 0x888888,
		CORRECT_COLOR : 0x00FFFF,
		PARTIAL_COLOR : 0xFF4400,
		WRONG_COLOR : 0x444444,

		//path colors
		FIRST_COLOR : 0x6E00FF,
		MIDDLE_COLOR : 0x946DFF,
		LAST_COLOR : 0xC9AAFF,

		//difficulty values
		TUTORIAL : 2,
		EASY : 3,
		INTERMEDIATE : 4,
		HARD : 5,

		//variables (lowercase)

		level_height : null,
		level_width : null,

		solution : [], //solution to the current puzzle
		path : [], //user's current attempt at the puzzle

		mouse_down : false,

		//methods

		//init
		//initialize the board on game start
		init : function () {
			var difficulty = G.EASY;
			G.level_height = difficulty;
			G.level_width = difficulty;
			
			G.path = [];
			G.solution = [[0, 0], [1, 0], [2, 0],
										[2, 1], [1, 1], [0, 1],
							 			[0, 2], [1, 2], [2, 2]];
			
			G.resetBoard();
			//Sets up data
			var x1, x2, y1, y2;
			for(var i = 0; i<G.solution.length; i++) {
				PS.debug(i);
				x1 = G.solution[i][0];
				y1 = G.solution[i][1];
				if(i==G.solution.length-1) {
					PS.data(x1, y2, [0, 0]);
				} else {
					x2 = G.solution[i+1][0];
					y2 = G.solution[i+1][1];
					PS.data(x1, y1, [x2-x1, y2-y1]);
					PS.debug(PS.data(x1, y1));
				}
			}
		},

		//resetBoard()
		//reset the colors of the board to the default condition
		resetBoard : function () {
			PS.gridSize(G.level_width, G.level_height);
			PS.color(PS.ALL, PS.ALL, G.DEFAULT_COLOR);
			PS.scale(PS.ALL, PS.ALL, 100);
			PS.border(PS.ALL, PS.ALL, PS.DEFAULT);
		},

		//createNewPath(x,y)
		//creates a new attempt at solving the puzzle
		createNewPath : function (x, y) {
			G.path = [];
			//G.path.push((y * G.level_width) + x);
			G.path.push([x, y]);

			G.drawPath();
		},

		//addToPath(x,y)
		//adds the new bead to the current puzzle solution attempt
		addToPath : function(x, y) {
			var location = [x, y];
			//var location = (y * G.level_width) + x;

			if (G.path.indexOf(location) === -1) {
				G.path.push(location);
			}

			G.drawPath();
		},

		//drawPath()
		//draws the path that the player has drawn
		drawPath : function() {
			G.resetBoard();
			G.path.forEach(function(bead,index){
				var x = bead[0];
				var y = bead[1];
				//var x = bead % G.level_width;
				//var y = bead / G.level_width;
				if (index === 0) {     //first bead in solution attempt
					PS.color(x,y,G.FIRST_COLOR);
				} else {               //middle bead
					PS.color(x,y,G.MIDDLE_COLOR);
				}

				if (index === G.path.length - 1) { //overwrite color with "cursor" for last bead
					PS.color(x,y,G.LAST_COLOR);
				}
			});
		},

		//submitSolution()
		//submit the current solution attempt
		submitSolution : function () {
			var x, y, d, x2, y2;
			for(var i = 0; i<G.path.length; i++) {
				x = G.path[i][0];
				y = G.path[i][1];
				d = PS.data(x, y);
				PS.debug("(" + x + ", " + y + "), d: " + d);
				if(i==G.path.length-1) {
					if(d==[0, 0]) {
						PS.color(x, y, G.CORRECT_COLOR);
					} else {
						PS.color(x, y, G.WRONG_COLOR);
					}
				} else {
					x2 = G.path[i+1][0];
					y2 = G.path[i+1][1];
					if(x+d[0]==x2 && y+d[1]==y2) {
						PS.color(x, y, G.CORRECT_COLOR);
					} else {
						PS.color(x, y, G.WRONG_COLOR);
					}
				}
			}
		}

	};
} () ); // end of self-invoking function

// All of the functions below MUST exist, or the engine will complain!

// PS.init( system, options )
// Initializes the game
// This function should normally begin with a call to PS.gridSize( x, y )
// where x and y are the desired initial dimensions of the grid
// [system] = an object containing engine and platform information; see documentation for details
// [options] = an object with optional parameters; see documentation for details

PS.init = function( system, options ) {
	G.init();
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

	G.mouse_down = true;
	G.createNewPath(x,y);
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

	PS.debug(G.path);
	G.mouse_down = false;
	G.submitSolution();
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

	if (G.mouse_down) {
		G.addToPath(x,y);
	} else {
		return;
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

	if (G.mouse_down) {

	} else {
		return;
	}
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