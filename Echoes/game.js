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
	var LADY_PLANE = 1, ZEUS_PLANE = 2, HERA_PLANE = 3, ECHO_PLANE = 4, NARC_PLANE = 5;
	var LURE_RADIUS = 9;
	var MAX_LADIES = 6;
	
	var echoSprite = "", echoActive = false;
	var echoGhostSprite = "", echoGhostActive = false;
	var heraSprite = "", heraActive = false;
	var zeusSprite = "", zeusActive = false;
	var narcSprite = "", narcActive = false;
	var ladiesActive = false;
	
	var spawnLadyTimer = 50;
	var ladySprites = [];
	var forDeletion = [];
	
	var echoX = 14, echoY = 6;
	var heraX = 12, heraY = 15;
	var zeusX = 10, zeusY = 2;
	var narcX = 14, narcY = 9;
	var narcMapRow = 1, narcMapCol = 0;
	
	var lure = 0;
	var lureCooldown = 0;
	var heraTime = 2, zeusTime = 4, ladyTime = 3;
	
	var idMoveTimer = "";
	var path = [];
	var step = 0;
	
	var statusTextTimer = null;
	var curStatText = "";
	var fullStatText = ""; 
	
	var girlsEaten = 0;
	var timeRemaining = 0;
	var curseFlag = false;
	var CURSE1 = 0xBBBBBB;
	var CURSE2 = 0x777777;
	
	var heraCaughtZeus = false;

	var isPart2 = false;
	var firstEnc = false;
	var firstTalk = false;
	
	var T; //variable containing tutorial functions. 
	T = {
		index : 0,
		numMoves : 0,
		timer : null,
		onMove : function(){}
	};
	
	var tick = function () {
		if (G.gameover) {
			return;
		}
		
		if (echoActive) {
			moveEcho(echoSprite);
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
			console.log(spr);
			deleteLady(spr);
		}
		
		if (heraCaughtZeus) {
			zeusGameOver();
		}
	};
	
	var tick2 = function() {
		moveEcho(echoGhostSprite);
		G.mapMove(echoX, echoY);
	}
	
	var deleteLady = function(ladySpr) {
		PS.spriteDelete(ladySpr);
	};
	
	var heraCollide = function(s1, p1, s2, p2, type) {
		if(s2 == zeusSprite) {
			heraCaughtZeus = true;
		}
	};

	var narcCollide = function() {
		if (isPart2) {
			if (!firstEnc) {
				PS.statusText("");
				PS.statusColor(PS.COLOR_RED);
				customStatusText("'Who are you?'");
				firstEnc = true;
				setTimeout(function(){
					//T.index = 25;
					incrementTutorial();
				}, 3000);
			}
		} else {

		}
	};
	
	var zeusGameOver = function() {
		PS.statusText("Zeus got caught... refresh");
		PS.timerStop(idMoveTimer);
		clearTimeout(T.timer);
		clearInterval(T.timer);
		T.timer = null;
		G.gameover = true;
		T.index = 999;
		//G.lastDbSend(false);
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

	var moveRandomHera = function(sprite, x, y) {
        var rand = PS.random(10);
        var pos;

        if (rand > 6 && zeusActive) {
            var hPath = PS.line(heraX, heraY, zeusX, zeusY);
            if (hPath.length > 0) {
                var hx = hPath[0][0];
                var hy = hPath[0][1]
                pos = {xPos: hx, yPos: hy};
            } else {
                pos = moveRandom(sprite, x, y);
            }
        } else {
            pos = moveRandom(sprite, x, y);
        }

        PS.spriteMove(sprite, pos.xPos, pos.yPos)
        return {xPos: pos.xPos, yPos: pos.yPos};
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
			var pos = moveRandomHera(heraSprite, heraX, heraY);
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
            var pLength = PS.line(heraX, heraY, pos.x, pos.y).length;
            ladySprites.forEach(function(spr){
               var newPos =  PS.spriteMove(spr);
                if (PS.line(heraX, heraY, newPos.x, newPos.y).length > pLength) {
                    pos = newPos;
                    pLength = PS.line(heraX, heraY, newPos.x, newPos.y).length;
                }
            });
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
	
	var moveEcho = function(spr) {
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
			PS.spriteMove(spr, nx, ny);
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
			girlsEaten += 1;
		}
	};
	
	var hearLady = function(s1, p1, s2, p2, type) {
		var keys = Object.keys(chattyLadies)
		var i = keys.indexOf(s2);
		if(i != -1) {
			var phrase = chattyLadies[keys[i]].phrase;
			PS.statusText("");
			PS.statusColor(PS.COLOR_BLACK);
			PS.statusText(phrase);
			repeatable = PS.statusText();
		}
	}
	
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
		var MEDIUM_WAIT = 5000;
		
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
					T.numMoves += 1;
					if (T.timer === null && T.numMoves > 1) {
						incrementTutorial();
					}
				};
				T.timer = setTimeout(function(){
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
				activateBeads(30,30);
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
				customStatusText("Hera will approach to listen.");
				T.timer = setTimeout(function(){
					incrementTutorial();
				}, MEDIUM_WAIT);
				break;
			case 6:
				customStatusText("So will regular ladies.");
				ladiesActive = true;
				spawnLady();
				T.timer = setTimeout(function(){
					incrementTutorial();
				}, MEDIUM_WAIT);
				break;
			case 7:
				customStatusText("Hera's husband, Zeus, is cheating.");
				T.timer = setTimeout(function(){
					incrementTutorial();
				}, MEDIUM_WAIT);
				break;
			case 8:
				customStatusText("Don't let Hera find him.");
				T.timer = setTimeout(function(){
					incrementTutorial();
				}, MEDIUM_WAIT);
				break;
			case 9:
				customStatusText("There he is now!");
				G.initZeus();
				T.timer = setTimeout(function(){
					T.index = 10;
					incrementTutorial();
				}, MEDIUM_WAIT);
				break;
//			case 10:
//				customStatusText("Keep Hera distracted by chatting.");
//				T.timer = setTimeout(function(){
//					incrementTutorial();
//				}, MEDIUM_WAIT);
//				break;
			case 11:
				customStatusText("Time remaining: 0m 30s  Ladies Loved: " + girlsEaten);
				T.timer = setTimeout(function(){
					incrementTutorial();
				}, 1000);
				break;
			case 12:
				timeRemaining = 30;
				T.timer = setInterval(function(){
					timeRemaining -= 1;
					if (timeRemaining >= 0) {
						PS.statusText("Time: " + Math.floor(timeRemaining / 60) +"m " + ("00" + timeRemaining % 60).slice(-2) + "s  Ladies Loved: " + girlsEaten);
					} else {
						clearInterval(T.timer);
						T.timer = null;
						incrementTutorial();
					}
				}, 1000);
				break;
			case 13:
				customStatusText("Zeus got away! Good job!");
				PS.timerStop(idMoveTimer);

				deleteAllLadies();
				deleteZeus();

				//G.lastDbSend(true);
				PS.spriteSolidAlpha(echoSprite, 255);
				PS.spriteSolidAlpha(heraSprite, 255);
				PS.spriteMove(echoSprite, 10, 7);
				PS.spriteMove(heraSprite, 17, 7);
				activateBeads(17,17);

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, MEDIUM_WAIT);
				break;
			case 14:
				customStatusText("But Hera caught on.");
				PS.spriteMove(heraSprite, 15, 7);

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 15:
				customStatusText("She knows you distracted her.");
				PS.spriteMove(echoSprite, 9, 7);
				PS.spriteMove(heraSprite, 13, 7);

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 16:
				customStatusText("Hera is furious.");
				PS.spriteMove(echoSprite, 8, 7);
				PS.spriteMove(heraSprite, 11, 7);

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 17:
				customStatusText("She has cursed you.");
				PS.spriteMove(echoSprite, 8, 7);
				PS.spriteMove(heraSprite, 11, 7);

				timeRemaining = 10;
				curseFlag = true;
				T.timer = setInterval(function(){
					timeRemaining -= 1;
					if (timeRemaining >= 0) {
						if (curseFlag) {
							PS.gridColor(CURSE1);
							curseFlag = false;
						} else {
							PS.gridColor(CURSE2);
							curseFlag = true;
						}
					} else {
						clearInterval(T.timer);
						T.timer = null;
						incrementTutorial();
					}
				}, 250);
				break;
			case 18:
				PS.spriteDelete(echoSprite);
				echoActive = false;
				PS.spriteDelete(heraSprite);
				heraActive = false;
				ladiesActive = false;

				activateBeads(0,0);

				customStatusText("You can no longer speak.");

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 19:
				customStatusText("You can only repeat others.");

				T.timer = setTimeout(function(){
				 incrementTutorial();
				 }, MEDIUM_WAIT);
				break;
			case 20:
				customStatusText("Some time later...");

				isPart2 = true;

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 21:
				customStatusText("You're wandering the forest.");

				activateBeads(20,20);
				echoX = 8;
				echoY = 9;
				G.initEcho();

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 22:
				customStatusText("You encounter Narcissus.");

				initNarcissus();

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, MEDIUM_WAIT);
				break;
			case 23:
				customStatusText("Narcissus is a total hottie.");

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 24:
				customStatusText("Go on. Approach him.");

				idMoveTimer = PS.timerStart(5, tick);
				break;
			case 25:
				PS.statusText("");
				PS.statusColor(PS.DEFAULT);
				customStatusText("Now try talking to him.");
				break;
			case 26:
				PS.statusText("");
				PS.statusColor(PS.COLOR_RED);
				customStatusText("'You're weird. Leave me alone.'");

				timeRemaining = 12;
				T.timer = setInterval(function(){
					timeRemaining -= 1;
					if (timeRemaining >= 0) {
						narcX += 1;
						PS.spriteMove(narcSprite,narcX,narcY);
					} else {
						deleteNarcissus();
						clearInterval(T.timer);
						T.timer = null;
						incrementTutorial();
					}
				}, 200);
				break;
			case 27:
				PS.statusText("");
				PS.statusColor(PS.DEFAULT);
				customStatusText("Oh no. You got rejected.");

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 28:
				customStatusText("You die of sadness.");

				activateBeads(0,0);

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 29:
				customStatusText("Some time later...");

				activateBeads(30,30);
				G.initPart2();

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 30:
				customStatusText("You are now a ghost.");

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 31:
				customStatusText("That pond looked nice.");

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 32:
				customStatusText("Find Narcissus, bring him there.");

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
		}
	};

	var deleteNarcissus = function() {
		if (narcSprite !== "") {
			PS.spriteShow(narcSprite, false);
		}
		narcActive = false;
	};

	var initNarcissus = function() {
		narcSprite = PS.spriteSolid(2, 2);
		PS.spritePlane(narcSprite, NARC_PLANE);
		PS.spriteCollide(narcSprite, narcCollide);
		PS.spriteSolidColor(narcSprite, PS.COLOR_MAGENTA);
		PS.spriteMove(narcSprite, narcX, narcY);
	};

	var deleteAllLadies = function() {
		ladySprites.forEach(function(spr){
			PS.spriteDelete(spr);
		});
		ladySprites = [];
	};

	var deleteZeus = function() {
		if (zeusSprite !== "") {
			PS.spriteDelete(zeusSprite);
		}
		zeusActive = false;
	};

	var deleteHera = function() {
		if (heraSprite !== "") {
			PS.spriteDelete(heraSprite);
		}
		heraActive = false;
	};

	var deleteEcho = function() {
		if (echoSprite !== "") {
			PS.spriteDelete(echoSprite);
		}
		echoActive = false;
	};
	
	//DEFAULT_COLOR = PS.COLOR_WHITE; //0
	//GROUND_COLOR = 0x579532; //1
	//PATH_COLOR = 0x222222; //2
	//DIRT_COLOR = 0xAF623B; //3
	//TREE_COLOR = PS.COLOR_GREEN; //4
	//WATER_COLOR = PS.COLOR_BLUE; //5
	var loadMap = function(mapData) {
		for(var row = 0; row < mapData.length; row++) {
			for(var col = 0; col < mapData[row].length; col++) {
				switch(mapData[row][col]) {
					case 0:
						PS.color(col, row, DEFAULT_COLOR);
						break;
					case 1:
						PS.color(col, row, GROUND_COLOR);
						break;
					case 2:
						PS.color(col, row, PATH_COLOR);
						break;
					case 3:
						PS.color(col, row, DIRT_COLOR);
						break;
					case 4:
						PS.color(col, row, TREE_COLOR);
						break;
					case 5:
						PS.color(col, row, WATER_COLOR);
						break;
					default:
						PS.color(col, row, DEFAULT_COLOR);
				}
			}
		}
	};
	
	var makeChattyLadies = function() {
		var l1 = PS.spriteSolid(2, 2);
		PS.spriteSolidColor(l1, PS.COLOR_YELLOW);
		PS.spritePlane(l1, HERA_PLANE);
		PS.spriteShow(l1, false);
		PS.spriteMove(l1, 5, 15);
		chattyLadies[l1] = {mapPos: [1, 2],
												phrase: "I like trees"};
		var l2 = PS.spriteSolid(2, 2);
		PS.spriteSolidColor(l2, PS.COLOR_YELLOW);
		PS.spritePlane(l2, HERA_PLANE);
		PS.spriteShow(l2, false);
		PS.spriteMove(l2, 7, 17);
		chattyLadies[l2] = {mapPos: [1, 1],
											 phrase: "Let's eat rocks"};
		
		var l3 = PS.spriteSolid(2, 2);
		PS.spriteSolidColor(l2, PS.COLOR_YELLOW);
		PS.spritePlane(l3, HERA_PLANE);
		PS.spriteShow(l3, false);
		PS.spriteMove(l3, 10, 3);
		chattyLadies[l3] = {mapPos: [1, 0],
											 phrase: "Follow me!"};
	};
	
	var appearLadies = function(row, col) {
		for(var key in chattyLadies) {
			PS.spriteShow(key, false);
			if(chattyLadies[key].mapPos[0] == row &&
				chattyLadies[key].mapPos[1] == col)
				PS.spriteShow(key, true);
		}
	};
	
	var drawNarc = function(row, col) {
		if(row == narcMapRow && col == narcMapCol) {
			PS.spriteShow(narcSprite, true);
		}
	};
	
	G = {
		GRID_HEIGHT : 30,
		GRID_WIDTH : 30,
		
		gameover: false,
	
		activeBoardWidth : null,
		activeBoardHeight : null,
		
		gameStarted : false,

		isPart2 : false,
		
		init : function() {
			PS.gridSize(G.GRID_WIDTH, G.GRID_HEIGHT);
			PS.border(PS.ALL, PS.ALL, 0);
			PS.color(PS.ALL, PS.ALL, GROUND_COLOR);
			PS.gridColor(0xDDDDDD);
			
			G.activeBoardHeight = G.GRID_HEIGHT;
			G.activeBoardWidth = G.GRID_WIDTH;
			
			idMoveTimer = PS.timerStart(5, tick); //uncomment for real game
			PS.audioLoad(ECHO_LURE_SOUND);
			PS.audioLoad(LADY_SOUND);
			ladiesActive = false;
			G.initEcho(); //uncomment for real game
			activateBeads(30,30);
			
			//incrementTutorial();
			
			//PS.statusText("Press spacebar to begin.");
			PS.dbInit("echoesprototype", {login: G.finishInit});

			//For tut skips
			//T.index = 20;
			//isPart2 = true;
		},

		skipToNarc : function() {
			T.index = 20;
			isPart2 = true;
			deleteAllLadies();
			deleteHera();
			deleteZeus();
			deleteEcho();
			PS.timerStop(idMoveTimer);
			incrementTutorial();
		},

		finishInit : function() {
			G.gameStarted = true;
			G.startTutorial();
		},
		
		initPart2: function() {
			G.isPart2 = true;
			PS.spriteDelete(echoSprite);
			PS.timerStop(idMoveTimer);
			idMoveTimer = PS.timerStart(5, tick2);
			loadMap(pond);
			G.initGhostEcho();
			makeChattyLadies();
			echoActive = true;
		},
		
		mapMove: function(x, y) {
			// RIGHT same row, +1 col
			if(x==G.GRID_WIDTH-2) {
				if(map[mapPos[0]].length > mapPos[1]+1) {
					if(map[mapPos[0]][mapPos[1]+1] != null) {
						loadMap(map[mapPos[0]][mapPos[1]+1]);
						mapPos = [mapPos[0], mapPos[1]+1];
						echoX = 1;
						PS.spriteMove(echoGhostSprite, 1, y);
						appearLadies(mapPos[0], mapPos[1]);
						drawNarc(mapPos[0], mapPos[1]);
					}
				}
				// LEFT same row, -1 col
			} else if(x==0) {
				if(mapPos[1]-1 >= 0) {
					if(map[mapPos[0]][mapPos[1]-1] != null) {
						loadMap(map[mapPos[0]][mapPos[1]-1]);
						mapPos = [mapPos[0], mapPos[1]-1];
						echoX = G.GRID_WIDTH-3;
						PS.spriteMove(echoGhostSprite, G.GRID_WIDTH-3, y);
						appearLadies(mapPos[0], mapPos[1]);
						drawNarc(mapPos[0], mapPos[1]);
					}
				}
				// DOWN +1 row, same col
			} else if(y==G.GRID_HEIGHT-2) {
				if(map.length > mapPos[0]+1) {
					if(map[mapPos[0]+1][mapPos[1]] != null) {
						loadMap(map[mapPos[0]+1][mapPos[1]]);
						mapPos = [mapPos[0]+1, mapPos[1]];
						echoY = 2;
						PS.spriteMove(echoGhostSprite, x, 2);
						appearLadies(mapPos[0], mapPos[1]);
						drawNarc(mapPos[0], mapPos[1]);
					}
				}
				// UP -1 row, same col
			} else if(y==0) {
				if(mapPos[0]-1 >= 0) {
					if(map[mapPos[0]-1][mapPos[1]] != null) {
						loadMap(map[mapPos[0]-1][mapPos[1]]);
						mapPos = [mapPos[0]-1, mapPos[1]];
						echoY = G.GRID_HEIGHT-3;
						PS.spriteMove(echoGhostSprite, x, G.GRID_HEIGHT-3);
						appearLadies(mapPos[0], mapPos[1]);
						drawNarc(mapPos[0], mapPos[1]);
						
					}
				}
			}
			
		},
		
		echo : function(phrase) {
			PS.audioPlay(ECHO_LURE_SOUND);
			PS.statusText("");
			PS.statusColor(PS.COLOR_CYAN);
			customStatusText(phrase);
			if(mapPos[0] == narcMapRow && mapPos[1] == narcMapCol)
				narcReact(phrase);
		},
		
		initEcho : function() {
			echoSprite = PS.spriteSolid(2, 2);
			PS.spritePlane(echoSprite, ECHO_PLANE);
			PS.spriteMove(echoSprite, echoX, echoY);
			echoActive = true;
		},
		
		initGhostEcho : function() {
			echoGhostSprite = PS.spriteSolid(2, 2);
			PS.spritePlane(echoGhostSprite, ECHO_PLANE);
			echoX = 14;
			echoY = 20;
			PS.spriteSolidColor(echoGhostSprite, 0xAAAAAA);
			PS.spriteSolidAlpha(echoGhostSprite, 165);
			PS.spriteCollide(echoGhostSprite, hearLady);
			PS.spriteMove(echoGhostSprite, echoX, echoY);
			echoGhostActive = true;
		},
		
		initZeus : function() {
			if (heraX < 15) {
				zeusX = 28;
			} else {
				zeusX = 1;
			}
			if (heraY < 15) {
				zeusY = 28;
			} else {
				zeusY = 1;
			}
			
			zeusSprite = PS.spriteSolid(2, 2);
			PS.spritePlane(zeusSprite, ZEUS_PLANE);
			PS.spriteCollide(zeusSprite, wooLady);
			PS.spriteSolidColor(zeusSprite, 0xFFCC22);
			PS.spriteMove(zeusSprite, zeusX, zeusY);
			zeusActive = true;
		},
		
		initHera : function() {
			heraSprite = PS.spriteSolid(2, 2);
			PS.spritePlane(heraSprite, HERA_PLANE);
			PS.spriteCollide(heraSprite, heraCollide);
			PS.spriteSolidColor(heraSprite, PS.COLOR_CYAN);
			PS.spriteMove(heraSprite, heraX, heraY);
			heraActive = true;
		},
		
		move : function(x, y) {
			step = 0;
			path = PS.line(echoX, echoY, x, y);
			T.onMove();
		},
		
		lure : function() {
			if(lureCooldown == 0) {
				if (isPart2 && !firstTalk) {
					PS.statusText("");
					PS.statusColor(PS.COLOR_CYAN);
					customStatusText("'Who are you?'");
					firstTalk = true;
					setTimeout(function(){
						incrementTutorial();
					}, 3000);
				}
				PS.audioPlay(ECHO_LURE_SOUND);
				lure = 18; //num ticks to be lured for
				lureCooldown = 30; //num ticks of lure cooldown (includes lured time)
				PS.spriteSolidAlpha(echoSprite, 125);
			}
		},
		
		restart : function() {
			deleteAllLadies();
			PS.spriteMove(zeusSprite, 2, 2);
			zeusX = 2;
			zeusY = 2;
			PS.spriteMove(heraSprite, 15, 15);
			heraX = 15;
			heraY = 15;
			PS.spriteMove(echoSprite, 7, 7);
			echoX = 7;
			echoY = 7;
			G.gameover = false;
			heraCaughtZeus = false;
			T.index = 10;
			incrementTutorial();
			idMoveTimer = PS.timerStart(5, tick);
		},
		
		lastDbSend : function(won) {
			if(won)
				PS.dbEvent("echoesprototype", "endgame", "won");
			else
				PS.dbEvent("echoesprototype", "endgame", "lost");
			PS.dbEvent("echoesprototype", "timeLeft", timeRemaining, "girlsLoved", girlsEaten);
			PS.dbSend("echoesprototype", ["nchaput", "bsheridan"], {discard: true, message: "Thanks for playing!"});
		},
		
		startTutorial : function() {
			incrementTutorial();
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
//	if(!G.gameover){
//		PS.dbEvent("echoesprototype", "mouseclick", "true");
//		G.move(x, y);
//	}
	if (!G.gameover) {
		G.move(x, y);
	} else {
		G.restart();
	}
};


PS.release = function( x, y, data, options ) {
	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead
};


PS.enter = function( x, y, data, options ) {
	// Uncomment the following line to inspect parameters
	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	if (options.touching) {
		//PS.dbEvent("echoesprototype", "mouseclick", "true");
		G.move(x, y);
	}
	
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
		if (!G.isPart2) {
			if(!G.gameover){
				PS.dbEvent("echoesPrototype", "spacebar", "true");
				G.lure();
			} else {
				G.restart();
			}
		} else {
			G.echo(repeatable);
		}
	} else if (key == PS.KEY_ARROW_DOWN) {
		if (!G.isPart2) {
			G.skipToNarc();
		}
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
	PS.dbEvent("echoesprototype", "endgame", "closed");
	//PS.dbSend("echoesprototype", ["nchaput", "bsheridan"], {discard: true});
	PS.dbErase("echoesprototype");
};