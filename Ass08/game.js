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
		
		//direction constants
		LEFT: 1,
		RIGHT: 2,
		BOTTOM: 3,
		TOP: 4,

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
			
			G.solution = [0, 1, 2,
										5, 4, 3,
							 			6, 7, 8];
			
			G.resetBoard();
		},

		//resetBoard()
		//reset the colors of the board to the default condition
		resetBoard : function () {
			PS.statusText("");
			PS.gridSize(G.level_width, G.level_height);
			PS.color(PS.ALL, PS.ALL, G.DEFAULT_COLOR);
			PS.scale(PS.ALL, PS.ALL, 100);
			PS.border(PS.ALL, PS.ALL, PS.DEFAULT);
		},
		
		//TODO: randomly generate a valid solution path
		generatePath : function() {
			
		},

		//createNewPath(x,y)
		//creates a new attempt at solving the puzzle
		createNewPath : function (x, y) {
			G.path = [];
			G.path.push((y * G.level_width) + x);
			G.drawPath();
		},

		//addToPath(x,y)
		//adds the new bead to the current puzzle solution attempt
		addToPath : function(x, y) {
			var location = (y * G.level_width) + x;

			if(G.path.length > 1 && G.checkDirection(G.path[G.path.length-1], location)==-1) {
				//this kills the path
				G.path = [];
				G.resetBoard();
				G.mouse_down = false;
			}
			else if (G.path.indexOf(location) === -1) {
				G.path.push(location);
			}

			G.drawPath();
		},

		//checkDirection(beadA, beadB)
		//returns the direction that beadB is in relative to beadA, or -1 if nonadjacent
		checkDirection: function(beadA, beadB) {
			if(beadB - beadA == 1) {
				return G.RIGHT;
			} else if(beadB - beadA == -1) {
				return G.LEFT;
			} else if(beadB- beadA == G.level_width) {
				return G.BOTTOM;
			} else if(beadB - beadA == -G.level_width) {
				return G.TOP;
			} else {
				return -1;
			}
		},
		
		//drawPath()
		//draws the path that the player has drawn
		drawPath : function() {
			G.resetBoard();
			for(var index = 0; index<G.path.length; index++) {
				var x = G.path[index] % G.level_width;
				var y = G.path[index] / G.level_width;
				if (index === 0) {     //first bead in solution attempt
					PS.color(x,y,G.FIRST_COLOR);
				} else {               //middle bead
					PS.color(x,y,G.MIDDLE_COLOR);
				}

				if (index === G.path.length - 1) { //overwrite color with "cursor" for last bead
					PS.color(x,y,G.LAST_COLOR);
				}
				var prev, next;
				if(index != 0) {
					prev = G.path[index-1];
				}
				if(index != G.path.length-1) {
					next = G.path[index+1];
				}
				var border = {};
				//switch case
				//if previous bead is left, set left=0
				//if previous bead is right, set right=0
				//if previous bead is below, set bottom=0
				//if previous bead is top, set top=0
				switch(G.checkDirection(G.path[index], prev)) {
					case G.LEFT:
						border = { top : 2, left : 0, bottom : 2, right : 2, equal : true, width : 1 };
						break;
					case G.RIGHT:
						border = { top : 2, left : 2, bottom : 2, right : 0, equal : true, width : 1 }
						break;
					case G.TOP:
						border = { top : 0, left : 2, bottom : 2, right : 2, equal : true, width : 1 }
						break;
					case G.BOTTOM:
						border = { top : 2, left : 2, bottom : 0, right : 2, equal : true, width : 1 }
						break;
				}
				//same for next bead.
				switch(G.checkDirection(G.path[index], next)) {
					case G.LEFT:
						border.left = 0;
						break;
					case G.RIGHT:
						border.right = 0;
						break;
					case G.TOP:
						border.top = 0;
						break;
					case G.BOTTOM:
						border.bottom = 0;
						break;
				}
				PS.border(x, y, border);
				PS.borderColor(x, y, PS.COLOR_BLACK);
			}
		},

		//submitSolution()
		//submit the current solution attempt
		submitSolution : function () {
			var x, y;
			var correct = true;
			PS.debug(G.path);
			PS.debug(G.solution);
			
			//currently low performance? would best be done (I think) using PS.data to store
			//the following bead, but couldn't get it to work.
			for(var i = 0; i<G.path.length; i++) {
				//index of current bead in solution array
				var s = G.solution.indexOf(G.path[i]);
				
				//if bead exists in solution and isn't the final bead in either array
				if(s!=-1 && i!=G.path.length-1 && s!=G.solution.length-1) {
					//if the following bead in each array doesn't match, color it wrong
					if(G.path[i+1] != G.solution[s+1]) {
						x = G.path[i]%G.level_width;
						y = Math.floor(G.path[i]/G.level_width);
						PS.color(x, y, G.WRONG_COLOR);
						correct = false;
					}
				} else if((i==G.path.length-1 || s==G.path.length-1) && i != s) {
						x = G.path[i]%G.level_width;
						y = Math.floor(G.path[i]/G.level_width);
						PS.color(x, y, G.WRONG_COLOR);
						correct = false;
				}
			}
			if(G.path.length > 0 && correct) {
				PS.statusText("You did it!");
			}
		}

	};
} () ); // end of self-invoking function


//************ PS FUNCTIONS ************//

// PS.init( system, options )
// Initializes the game
// This function should normally begin with a call to PS.gridSize( x, y )
// where x and y are the desired initial dimensions of the grid
PS.init = function( system, options ) {
	G.init();
};

// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched
PS.touch = function( x, y, data, options ) {
	G.mouse_down = true;
	G.createNewPath(x,y);
};

// PS.release ( x, y, data, options )
// Called when the mouse button is released over a bead, or when a touch is lifted off a bead
PS.release = function( x, y, data, options ) {
	if(G.mouse_down) {
		G.mouse_down = false;
		G.submitSolution();
	}
};

// PS.enter ( x, y, button, data, options )
// Called when the mouse/touch enters a bead
PS.enter = function( x, y, data, options ) {
	if (G.mouse_down) {
		G.addToPath(x,y);
	} else {
		return;
	}
};

// PS.exit ( x, y, data, options )
// Called when the mouse cursor/touch exits a bead
PS.exit = function( x, y, data, options ) {
	if (G.mouse_down) {

	} else {
		return;
	}
};

// PS.exitGrid ( options )
// Called when the mouse cursor/touch exits the grid perimeter
PS.exitGrid = function( options ) {
	
};