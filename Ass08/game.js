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
		DEFAULT_COLOR : 0xBBBBBB,
		CORRECT_COLOR : 0x00FFFF,
		PARTIAL_COLOR : 0xFF4400,
		WRONG_COLOR : 0xCA3513,

		//path colors
		FIRST_COLOR : 0x6E00A0,
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
		
		//AB testing
		ORDER : false,

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
			//G.ORDER = true;
			var difficulty = G.HARD;
			G.level_height = difficulty;
			G.level_width = difficulty;
			
			G.path = [];

			G.generateSolution();
			console.log(G.solution);
			
//			G.solution = [0, 1, 2,
//										5, 4, 3,
//							 			6, 7, 8];
			
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
			PS.gridColor(0x555555);
		},
		
		//TODO: randomly generate a valid solution path
		generateSolution : function() {
			var size = G.level_height * G.level_width;
			var chosen = [];
			var tiles = [];
			var x;
			for (x = 0; x < size; x++) {
				tiles.push(x);
			}
			var tolerance = 0;
			while (G.solution.length < size - tolerance) {
				var start = tiles.splice(PS.random(tiles.length) - 1, 1)[0];
				chosen.splice(0,size,start);
				G.solution = G.buildSolution(chosen, size, tolerance);
			}
			//get the last thing in chosen, randomly pick N/S/E/W from there, push if not in chosen, repick if it is
			//stop when there's no direction to go from last thing in chosen
		},

		buildSolution : function (chosen, size, tolerance) {
			var chosencpy = chosen.slice();
			var prev = chosen[chosen.length-1];
			var prevx = prev % G.level_width;
			var prevy = Math.floor(prev / G.level_width);
			// (prevy * G.level_width) + prevx
			var directions = [];
			if (prevx > 0 && chosen.indexOf((prevy * G.level_width) + prevx - 1) === -1) {
				directions.push(G.LEFT);
			}
			if (prevx < G.level_width - 1 && chosen.indexOf((prevy * G.level_width) + prevx + 1) === -1) {
				directions.push(G.RIGHT);
			}
			if (prevy > 0 && chosen.indexOf(((prevy - 1) * G.level_width) + prevx) === -1) {
				directions.push(G.TOP);
			}
			if (prevy < G.level_height - 1 && chosen.indexOf(((prevy + 1) * G.level_width) + prevx) === -1) {
				directions.push(G.BOTTOM);
			}

			if (directions.length === 0) {
				return chosen;
			}

			var directionOrder = [];
			//var directions = [0, 1, 2, 3];
			var x;
			for (x = 0; x < directions.length; x++) {
				var index = PS.random(directions.length) - 1;
				directionOrder.push(directions[index]);
				directions.splice(index, 1);
			}

			for (x = 0; x < directionOrder.length; x++) {
				chosen = chosencpy.slice();
				switch (directionOrder[x]) {
					case G.LEFT:
						chosen.push(prev - 1);
						chosen = G.buildSolution(chosen, size, tolerance);
						break;
					case G.RIGHT:
						chosen.push(prev + 1);
						chosen = G.buildSolution(chosen, size, tolerance);
						break;

					case G.BOTTOM:
						chosen.push(prev + G.level_width);
						chosen = G.buildSolution(chosen, size, tolerance);
						break;

					case G.TOP:
						chosen.push(prev - G.level_width);
						chosen = G.buildSolution(chosen, size, tolerance);
						break;
				}
				console.log(chosen.length);
				if (chosen.length >= size - tolerance) {
					x += directionOrder.length;
				}
			}

			return chosen;

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

			if (G.path.indexOf(location) === -1) {
				G.path.push(location);
			}
			if(G.path.length > 1 && G.checkDirection(G.path[G.path.length-2], location)==-1) {
				//this kills the path
				G.path = [];
				G.resetBoard();
				G.mouse_down = false;
			}

			G.drawPath();
		},

		//checkDirection(beadA, beadB)
		//returns the direction that beadB is in relative to beadA, or -1 if nonadjacent
		checkDirection: function(beadA, beadB) {
			var ax = beadA % G.level_width;
			var ay = Math.floor(beadA / G.level_width);
			var bx = beadB % G.level_width;
			var by = Math.floor(beadB / G.level_width);
			if(bx - ax === 1 && by === ay) {
				return G.RIGHT;
			} else if(bx - ax === -1 && by === ay) {
				return G.LEFT;
			} else if(by - ay === 1 && bx === ax) {
				return G.BOTTOM;
			} else if(by - ay === -1 && bx === ax) {
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
				var y = Math.floor(G.path[index] / G.level_width);
				if (index === 0) {     //first bead in solution attempt
					PS.color(x, y, G.FIRST_COLOR);
				} else {               //middle bead
					PS.color(x, y, G.MIDDLE_COLOR);
				}
				if (index === G.path.length - 1) { //overwrite color with "cursor" for last bead
					PS.color(x, y, G.LAST_COLOR);
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
						border = { top : 2, left : 0, bottom : 2, right : 2, equal : true, width : 4 };
						break;
					case G.RIGHT:
						border = { top : 2, left : 2, bottom : 2, right : 0, equal : true, width : 4 }
						break;
					case G.TOP:
						border = { top : 0, left : 2, bottom : 2, right : 2, equal : true, width : 4 }
						break;
					case G.BOTTOM:
						border = { top : 2, left : 2, bottom : 0, right : 2, equal : true, width : 4 }
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
			
			if(G.ORDER) {
				for(var i = 0; i < G.path.length; i++) {
					var s = G.solution.indexOf(G.path[i]);
					if(s!=i) {
						x = G.path[i]%G.level_width;
						y = Math.floor(G.path[i]/G.level_width);
						PS.color(x, y, G.WRONG_COLOR);
						correct = false;
					} 
				}
			}
			else {
				for(var i = 0; i < G.path.length; i++) {
					//index of current bead in solution array
					var s = G.solution.indexOf(G.path[i]);

					//if bead exists in solution and isn't the final bead in either array
					if(s != -1 && i != G.path.length-1 && s != G.solution.length-1) {
						//if the following bead in each array doesn't match, color it wrong
						if(G.path[i+1] != G.solution[s+1]) {
							x = G.path[i]%G.level_width;
							y = Math.floor(G.path[i]/G.level_width);
							PS.color(x, y, G.WRONG_COLOR);
							correct = false;
						}
					//if one of beads being checked is the final bead and the other is not, it's wrong
					} else if((i == G.path.length-1 || s == G.solution.length-1) && i != s) {
							x = G.path[i]%G.level_width;
							y = Math.floor(G.path[i]/G.level_width);
							PS.color(x, y, G.WRONG_COLOR);
							correct = false;
					}
				}
			}
			
			//if path length is the same and an incorrect square was never found, you win
			if(G.path.length == G.solution.length && correct) {
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
//PS.exit = function( x, y, data, options ) {
//	if (G.mouse_down) {
//
//	} else {
//		return;
//	}
//};

PS.keyDown = function(key, shift, ctrl, options) {
};

//PS.keyUp = function(key, shift, ctrl, options) {
//};
//
//PS.input = function(device, options) {
//	
//};

// PS.exitGrid ( options )
// Called when the mouse cursor/touch exits the grid perimeter
//PS.exitGrid = function( options ) {
//	
//};