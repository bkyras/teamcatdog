// game.js for Perlenspiel 3.2.x
// Team Catdog
// Bailey Sheridan
// Nicholas Chaput

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
		DEFAULT_COLOR : 0x555555,
		WRONG_COLOR : 0xE04C4C,

		//path colors
		MIDDLE_COLOR : 0x946DFF,
		LAST_COLOR : 0xC9AAFF,

		//difficulty values
		EASY : 3,
		INTERMEDIATE : 4,
		HARD : 5,
		EX1 : 6,
		EX2 : 7,
		
		//direction constants
		LEFT : 1,
		RIGHT : 2,
		BOTTOM : 3,
		TOP : 4,

		//Sounds
		LEVEL_LOAD : "fx_bloop",
		CREATE_PATH : "fx_pop",
		INCORRECT_ANSWER : "fx_rip",
		LEVEL_COMPLETE : "fx_beep",
		
		TUT1 : [0, 1, 2,
						5, 4, 3,
						6, 7, 8],
			
		TUT2 : [4, 1, 0,
						3, 6, 7,
						8, 5, 2],
		
		TUT3 : [8, 5, 2,
					 	1, 0, 3,
					 	4, 7, 6],

		//Glyphs
		LEFT_ARROW : 8592,
		UP_ARROW : 8593,
		RIGHT_ARROW : 8594,
		DOWN_ARROW : 8595,
		EXIT_MARK : 10022,
		NO_MARK : 0,

		//variables (lowercase)

		level_height : null,
		level_width : null,
		current_level : 0,
		level_complete : false,

		solution : [], //solution to the current puzzle
		path : [], //user's current attempt at the puzzle

		mouse_down : false,
		can_flag : false,
		tut_msg : 1,
		
		numClicks: 0,
		timeSpent: 0,

		newX : null,
		newY : null,
		newOldColor : null,

		//methods

		//init
		//initialize the board on game start
		init : function () {
			PS.audioLoad(G.LEVEL_LOAD);
			PS.audioLoad(G.CREATE_PATH);
			PS.audioLoad(G.INCORRECT_ANSWER);
			PS.audioLoad(G.LEVEL_COMPLETE);

			G.loadNewLevel();
		},

		loadNewLevel : function() {
			G.current_level += 1;
			G.level_complete = false;

			var difficulty;
			if (G.current_level < 4) {
				difficulty = G.EASY;
			} else if (G.current_level < 7) {
				difficulty = G.INTERMEDIATE;
			} else if (G.current_level < 11) {
				difficulty = G.HARD;
			} else {
				difficulty = G.EX1;
			}

			if(G.current_level == 2) {
				G.tut_msg = 3;
			}
			if(G.current_level == 3) {
				G.can_flag = true;
				G.tut_msg = 4;
			}
			if(G.current_level > 3) {
				G.tut_msg = 5;
			}
			
			G.level_height = difficulty;
			G.level_width = difficulty;

			G.path = [];
			G.solution = [];

			if(G.current_level == 1) {
				G.solution = G.TUT1;
			} else if(G.current_level == 2) {
				G.solution = G.TUT2;
			} else if(G.current_level == 3) {
				G.solution = G.TUT3;
			} else {
				G.generateSolution();
			}

			PS.gridSize(G.level_width, G.level_height);
			PS.glyph(PS.ALL, PS.ALL, G.NO_MARK);
			PS.glyphColor(PS.ALL, PS.ALL, PS.DEFAULT);
			
			G.resetBoard();
			G.timeSpent = PS.date().time;

			PS.audioPlay(G.LEVEL_LOAD);
		},

		//resetBoard()
		//reset the colors of the board to the default condition
		resetBoard : function () {
			PS.statusText("");
			PS.color(PS.ALL, PS.ALL, G.DEFAULT_COLOR);
			PS.scale(PS.ALL, PS.ALL, 100);
			PS.border(PS.ALL, PS.ALL, PS.DEFAULT);
			PS.borderColor(PS.ALL, PS.ALL, 0x222222);
			PS.gridColor(0x999999);
			if(G.tut_msg == 1) {
				PS.statusText("Click and drag. Fill the board.");
			} else if(G.tut_msg == 2) {
				PS.statusText("Try a different direction.");
			} else if(G.tut_msg == 3) {
				PS.statusText("The right path is... thataway!");
			} else if(G.tut_msg == 4) {
				PS.statusText("Click and release to mark tiles.");
			} else {
				PS.statusText("Level " + (G.current_level-3));
			}
			if(G.current_level < 3) {
				PS.glyph(PS.ALL, PS.ALL, G.NO_MARK);
				PS.glyphColor(PS.ALL, PS.ALL, PS.DEFAULT);
			}
		},

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
			PS.audioPlay(G.CREATE_PATH);
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
				//if new bead is NOT adjacent to last bead added, get rid of it
				//if new bead is in path already, ignore
				if(!(G.path.includes(location) && G.path.indexOf(location) < G.path.length-2))
					G.path.pop();
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
				PS.color(x, y, G.MIDDLE_COLOR);
				if (index === G.path.length - 1) { //overwrite color with "cursor" for last bead
					PS.color(x, y, G.LAST_COLOR);
				}
				var prev, next;
				if(index != 0) {
					prev = G.path[index-1];
				}
				if(index != G.path.length-1) {
					next = G.path[index+1];
				} else {
					if(!G.can_flag) { PS.glyph(x, y, 10022); }
				}
				var border = {};
				//switch case
				//if previous bead is left, set left=0
				//if previous bead is right, set right=0
				//if previous bead is below, set bottom=0
				//if previous bead is top, set top=0
				switch(G.checkDirection(G.path[index], prev)) {
					case G.LEFT:
						border = { top : 2, left : 0, bottom : 2, right : 2};
						break;
					case G.RIGHT:
						border = { top : 2, left : 2, bottom : 2, right : 0}
						break;
					case G.TOP:
						border = { top : 0, left : 2, bottom : 2, right : 2}
						break;
					case G.BOTTOM:
						border = { top : 2, left : 2, bottom : 0, right : 2}
						break;
					default:
						border = { top : 2, left : 2, bottom : 2, right : 2}
						break;
				}
				//same for next bead.
				switch(G.checkDirection(G.path[index], next)) {
					case G.LEFT:
						border.left = 0;
						if(!G.can_flag) { PS.glyph(x, y, 8592); }
						break;
					case G.RIGHT:
						border.right = 0;
						if(!G.can_flag) { PS.glyph(x, y, 8594); }
						break;
					case G.TOP:
						border.top = 0;
						if(!G.can_flag) { PS.glyph(x, y, 8593); }
						break;
					case G.BOTTOM:
						border.bottom = 0;
						if(!G.can_flag) { PS.glyph(x, y, 8595); }
						break;
				}
				PS.border(x, y, border);
				PS.borderColor(x, y, 0x222222);
			}
		},

		//submitSolution()
		//submit the current solution attempt
		submitSolution : function () {
			var x, y;
			var correct = true;
			G.numClicks += 1;
			
			for(var i = 0; i < G.path.length; i++) {
				//index of current bead in solution array
				var s = G.solution.indexOf(G.path[i]);

				//if bead exists in solution and isn't the final bead in either array
				if(s != -1 && i != G.path.length-1 && s != G.solution.length-1) {
					//if the following bead in each array doesn't match, color it wrong
					if(G.path[i+1] != G.solution[s+1]) {
						x = G.path[i]%G.level_width;
						y = Math.floor(G.path[i]/G.level_width);
						if(G.can_flag) {
							PS.color(x, y, G.WRONG_COLOR);
						} else {
							PS.glyphColor(x, y, G.WRONG_COLOR);
						}
						correct = false;
					}
				//if one of beads being checked is the final bead and the other is not, it's wrong
				} else if((i == G.path.length-1 || s == G.solution.length-1) && (G.path.length-i) != (G.solution.length-s)) {
					x = G.path[i]%G.level_width;
					y = Math.floor(G.path[i]/G.level_width);
					if(G.can_flag) {
					 PS.color(x, y, G.WRONG_COLOR);
					 } else {
					 PS.glyphColor(x, y, G.WRONG_COLOR);
					 }
					correct = false;
				}
			}
			
			if(G.tut_msg == 1) {
				PS.statusText("Try a different direction.");
				G.tut_msg = 2;
			} else if(G.tut_msg == 3) {
				PS.statusText("The right path is... thataway!");
			} else if(G.tut_msg == 4) {
				PS.statusText("Click and release to mark tiles.");
			}
			
			//if path length is the same and an incorrect square was never found, you win
			if(G.path.length == G.solution.length && correct) {
				G.level_complete = true;
				PS.statusText("Level Complete! Click to continue");
				PS.audioPlay(G.LEVEL_COMPLETE);
				PS.dbEvent("thatawayfinal", "level", G.current_level, "levelTime", PS.date().time - G.timeSpent, "moves", G.numClicks);
				G.timeSpent = 0;
				G.numClicks = 0;
			} else {
				PS.audioPlay(G.INCORRECT_ANSWER);
			}
		},

		//markTile (x,y)
		//mark the tile with the direction you think it goes in
		markTile : function (x,y) {
			switch(PS.glyph(x,y)) {
				case G.LEFT_ARROW:
					PS.glyph(x,y,G.EXIT_MARK);
					break;
				case G.UP_ARROW:
					PS.glyph(x,y,G.RIGHT_ARROW);
					break;
				case G.RIGHT_ARROW:
					PS.glyph(x,y,G.DOWN_ARROW);
					break;
				case G.DOWN_ARROW:
					PS.glyph(x,y,G.LEFT_ARROW);
					break;
				case G.EXIT_MARK:
					PS.glyph(x,y,G.NO_MARK);
					break;
				default:
					PS.glyph(x,y,G.UP_ARROW);
					break;
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
	PS.dbInit("thatawayfinal");
	G.init();
};

// PS.touch ( x, y, data, options )
// Called when the mouse button is clicked on a bead, or when a bead is touched
PS.touch = function( x, y, data, options ) {
	if (G.level_complete) {
		G.loadNewLevel();
	} else {
		G.mouse_down = true;
		if (!G.can_flag) {
			G.createNewPath(x,y);
		} else {
			G.newX = x;
			G.newY = y;
			G.newOldColor = PS.color(x,y);
			PS.color(x,y,G.LAST_COLOR);
		}
	}
};

// PS.release ( x, y, data, options )
// Called when the mouse button is released over a bead, or when a touch is lifted off a bead
PS.release = function( x, y, data, options ) {
	if(G.mouse_down) {
		G.mouse_down = false;

		if (!G.can_flag) {
			G.submitSolution();
		} else {
			if (G.newX !== null && G.newY !== null && G.newOldColor !== null) {
				G.markTile(G.newX, G.newY);
				PS.color(G.newX, G.newY, G.newOldColor);

				G.newX = null;
				G.newY = null;
				G.newOldColor = null;
			} else {
				G.submitSolution();
			}
		}
	}
};

// PS.enter ( x, y, button, data, options )
// Called when the mouse/touch enters a bead
PS.enter = function( x, y, data, options ) {
	if (G.mouse_down) {
		if (G.newX !== null && G.newY !== null && G.newOldColor !== null) {
			G.createNewPath(G.newX, G.newY);

			G.newX = null;
			G.newY = null;
			G.newOldColor = null;
		}
		G.addToPath(x,y);
	} else {
		return;
	}
};

PS.exitGrid = function(options) {
	if(G.mouse_down) {
		G.mouse_down = false;
		G.drawPath();
		G.submitSolution();
	}
}

PS.shutdown = function() {
	if(PS.dbData("thatawayfinal").events.length!=0) {
		PS.dbSend("thatawayfinal", "nchaput", {discard: true}); //uncomment for proper release
		//PS.dbErase("thatawayfinal"); //uncomment for testing
	}
};