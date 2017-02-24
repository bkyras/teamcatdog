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

	//timer function for the first half of the game
	var tick = function () {
		if (G.gameover) {
			return;
		}

		heraTime--;
		zeusTime--;
		ladyTime--;

		//moves actors of part 1
		if(echoActive) {
			moveEcho(echoSprite);
		}
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

		//sets echo's transparency for cooldown
		if(lureCooldown == 0) {
			PS.spriteSolidAlpha(echoSprite, 255);
		}
		if(lureCooldown > 0) {
			var a = PS.spriteSolidAlpha(echoSprite);
			PS.spriteSolidAlpha(echoSprite, a+((255-a)/lureCooldown));
			lureCooldown--;
		}

		//draws lure visual effect
		fadeGlyphs();
		eraseLure();
		if(lure > 0) {
			lure--;
			if (!isPart2) {
				drawLure(lure);
			}
		}

		//spawns a lady occasionally
		if(ladiesActive && ladySprites.length < MAX_LADIES && spawnLadyTimer == 0 && !isPart2) {
			spawnLady();
			spawnLadyTimer = 50;
		}
		if(spawnLadyTimer > 0) {
			spawnLadyTimer--;
		}

		while(forDeletion.length > 0) {
			var spr = forDeletion.pop();
			PS.spriteDelete(spr);
		}

		if(heraCaughtZeus) {
			zeusGameOver();
		}
	};

	//timer function for the second half of the game
	var tick2 = function() {
		if(!endGame) {
			var drawLureInt = 0;
			moveEcho(echoGhostSprite);
			eraseLure();
			if(lure > 0) {
				drawLureInt = lure;
				lure--;
			}
			if(repel > 0) {
				drawLureInt = repel;
				repel--;
			}
			if(stop > 0) {
				drawLureInt = stop;
				stop--;
			}
			if (drawLureInt > 0) {
				drawLure(drawLureInt);
			}
			if(lureCooldown > 0) {
				lureCooldown--;
			}
			moveNarc();
			movePart2Ladies();
			G.mapMove(echoX, echoY);
		}
	};

	/**MOVE FUNCTIONS*****************************************/

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
		//PS.spriteMove(sprite, x, y)
		return {xPos: x, yPos: y};
	};

	var moveRandomHera = function(sprite, x, y) {
		var rand = PS.random(10);
		var pos;

		if (rand < 7 && zeusActive) {
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

		return {xPos: pos.xPos, yPos: pos.yPos};
	};

	//wrapper to check if moving a sprite is valid
	var moveSprite = function(isPart1, spr, x, y) {
		if(isPart1) {
			if(isMoveValidPart1(spr, x, y)) {
				PS.spriteMove(spr, x, y);
				return true;
			}
		} else {
			if(isMoveValidPart2(spr, x, y)) {
				PS.spriteMove(spr, x, y);
				return true;
			}
		}
		return false;
	};

	var moveHera = function() {
		var rand = PS.random(4) - 1;
		if(lure > 0) {
			var pathRet = pathToEcho(heraSprite, true, heraX, heraY);
			if(pathRet.pathed) {
				heraX = pathRet.location.x;
				heraY = pathRet.location.y;
			} else {
				var pos = moveRandom(heraSprite, heraX, heraY);
				if(moveSprite(true, heraSprite, pos.xPos, pos.yPos)) {
					heraX = pos.xPos;
					heraY = pos.yPos;
				}
			}
		} else {
			PS.spriteSolidAlpha(heraSprite, 255);
			var pos = moveRandomHera(heraSprite, heraX, heraY);
			if(moveSprite(true, heraSprite, pos.xPos, pos.yPos)) {
				heraX = pos.xPos;
				heraY = pos.yPos;
			}
		}
	};

	var moveLadies = function() {
		for(let spr of ladySprites) {
			if(lure > 0) {
				pathToEcho(spr, true);
			} else
				PS.spriteSolidAlpha(spr, 255);
		}
	};

	var moveZeus = function() {
		var rand = PS.random(4) - 1
		if (zeusTarget !== "") {
			pos = PS.spriteMove(zeusTarget);
			var zPath = PS.line(zeusX, zeusY, pos.x, pos.y);
			if(zPath.length > 1) {
				var zx = zPath[0][0];
				var zy = zPath[0][1];
				if(moveSprite(true, zeusSprite, zx, zy)) {
					zeusX = zx;
					zeusY = zy;
				}
			}
		} else if(ladySprites.length > 0) {
			var targetSpr = ladySprites[0];
			var pos = PS.spriteMove(ladySprites[0]);
			var pLength = PS.line(heraX, heraY, pos.x, pos.y).length;
			ladySprites.forEach(function(spr){
				var newPos =  PS.spriteMove(spr);
				if (PS.line(heraX, heraY, newPos.x, newPos.y).length > pLength) {
					targetSpr = spr;
					pos = newPos;
					pLength = PS.line(heraX, heraY, newPos.x, newPos.y).length;
				}
			});
			var zPath = PS.line(zeusX, zeusY, pos.x, pos.y);
			if(zPath.length > 1) {
				var zx = zPath[0][0];
				var zy = zPath[0][1];
				zeusTarget = targetSpr;
				if(moveSprite(true, zeusSprite, zx, zy)) {
					zeusX = zx;
					zeusY = zy;
				}
			}
		} else {
			var pos = moveRandom(zeusSprite, zeusX, zeusY);
			if(moveSprite(true, zeusSprite, pos.xPos, pos.yPos)) {
				zeusX = pos.xPos;
				zeusY = pos.yPos;
			}
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
			if(echoGhostActive) {
				if (mapMoveDelay > 0) {
					mapMoveDelay -= 1;
					path = [];
				} else {
					PS.spriteMove(spr, nx, ny)
					echoX = nx;
					echoY = ny;
					step++;
				}
			} else if (echoActive) {
				if(moveSprite(true, spr, nx, ny)) {
					echoX = nx;
					echoY = ny;
					step++;
				}
			}
		}

		if(step >= path.length) {
			path = [];
		}
	};

	var movePart2Ladies = function() {
		if(ladyTime > 0)
			ladyTime--;
		else {
			var moveAhead = true;
			var curLadies = nymphs[mapPos[0]][mapPos[1]];
			for(var i = 0; i < curLadies.length; i++) {
				var ladyPos = PS.spriteMove(curLadies[i].sprite);

				//check for lure/repel/stop effects
				if(lure > 0) {
					if(pathToEcho(curLadies[i].sprite, false).pathed)
						moveAhead = false;
				} else if(repel > 0) {
					if(pathFromEcho(curLadies[i].sprite, false).pathed)
						moveAhead = false;
				} else if(stop > 0){
					if(checkWithinLure(ladyPos.x, ladyPos.y, narcX, narcY).isWithinDist)
						moveAhead = false;
				}
				if(moveAhead) {
					if(PS.spriteShow(narcSprite))
						pathToNarc(curLadies[i].sprite);
				}
			}
			ladyTime = 4;
		}
	};

	var moveNarc = function() {
		//if Narcissus can move and is on your map
		if(narcTime <= 0 && mapPos[0] == narcMapRow && mapPos[1] == narcMapCol) {
			var moveAhead = true;

			//checks for lure/repel/stop effects
			if(lure > 0) {
				var nPos = pathToEcho(narcSprite, false, narcX, narcY).location;
				if(narcX != nPos.x || narcY != nPos.y)
					moveAhead = false;
				narcX = nPos.x;
				narcY = nPos.y;
				narcTime = 5;
			} else if(repel > 0) {
				var nPos = pathFromEcho(narcSprite, false, narcX, narcY).location;
				if(narcX != nPos.x || narcY != nPos.y)
					moveAhead = false;
				narcX = nPos.x;
				narcY = nPos.y;
				narcTime = 5;
			} else if (stop > 0) {
				//do nothing!
				if(checkWithinLure(narcX, narcY, echoX, echoY).isWithinDist)
					moveAhead = false;
				narcTime = 5;
			}

			//if not in distance of echo's lure/no lure was used
			if(moveAhead) {
				var endOfPath = true;
				//Narcissus is on a tile that is not on his destined path
				if(!hasCoord(narcPaths[narcMapRow][narcMapCol], [narcX, narcY]).found) {
					var p = narcPaths[narcMapRow][narcMapCol]
					var path = PS.line(narcX, narcY, p[0][0], p[0][1])
					for(var i = 0; i < p.length; i++) {
						var newPath = PS.line(narcX, narcY, p[i][0], p[i][1]);
						if(newPath.length <= path.length) {
							narcPathPos = i;
							path = newPath;
						}
					}
					if(path.length > 0) {
						narcX = path[0][0];
						narcY = path[0][1];
						PS.spriteMove(narcSprite, narcX, narcY);
					}
					narcTime = 5;
					endOfPath = false;
				}
				//He is on the path, and is not on the last tile on the path
				else if(narcPaths[narcMapRow][narcMapCol].length > narcPathPos) {
					var coordInfo = hasCoord(narcPaths[narcMapRow][narcMapCol], [narcX, narcY]);
					if(coordInfo.found) {
						narcPathPos = coordInfo.coord + 1;
					}
					if(narcPathPos < narcPaths[narcMapRow][narcMapCol].length) {
						var p = narcPaths[narcMapRow][narcMapCol][narcPathPos];
						narcX = p[0];
						narcY = p[1];
						PS.spriteMove(narcSprite, narcX, narcY);
						narcPathPos++;
						narcTime = 5;
						endOfPath = false;
					}
				}
				//If the end of the path is reached
				if(endOfPath) {
					if(narcMapCol != 2) {
						narcMapCol += 1;
						PS.spriteShow(narcSprite, false);
					}
					else if(narcMapRow != 1) {
						narcMapRow +=1;
						PS.spriteShow(narcSprite, false);
					}
					//Got to the last tile of the last map
					else {
						endGame = true;
						PS.dbEvent(DB_NAME, "Game Won", 1);
						PS.dbSend(DB_NAME, ["nchaput", "bsheridan"], {discard: true, message: "Thanks for playing!"});
						incrementTutorial();
					}
					narcPathPos = 0;
					var newPos = narcPaths[narcMapRow][narcMapCol][narcPathPos];
					narcX = newPos[0];
					narcY = newPos[1];
				}
			}
		}
		narcTime--;
	};


	/**COLLISION FUNCTIONS*****************************************/

		//Narcissus collision
	var narcCollide = function(s1, p1, s2, p2, type) {
			if(isPart3) {
				var narcLadySprites = [];
				nymphs[mapPos[0]][mapPos[1]].forEach(function(spr){
					narcLadySprites.push(spr.sprite);
				});
				if(narcLadySprites.includes(s2)) {
					G.gameOverPart3 = true;
					repeatable = "";
					if (idMoveTimer !== null) {
						PS.timerStop(idMoveTimer);
						idMoveTimer = null;
					}
					customStatusText("You lost Narcissus to nymphs!");
				}
			} else if(isPart2) {
				if (!firstEnc) {
					clearTutorial();
					PS.statusText("");
					PS.statusColor(NARC_COLOR);
					customStatusText("'Who are you?'");
					firstEnc = true
					T.index = 24;
					T.timer = setTimeout(function(){
						//T.index = 25;
						incrementTutorial();
					}, 3000);
				}
			}
		};

	//Hera collision with Echo
	var heraCollide = function(s1, p1, s2, p2, type) {
		if(s2 == zeusSprite) {
			heraCaughtZeus = true;
		}
	};

	//Zeus collision with girls
	var wooLady = function(s1, p1, s2, p2, type) {
		var i = ladySprites.indexOf(s2);
		if(i != -1) {
			PS.audioPlay(LADY_SOUND, {path: AUDIO_PATH});
			var pos = PS.spriteMove(s2);
			if (s2 === zeusTarget) {
				zeusTarget = "";
			}
			showGlyphs(pos.x, pos.y);
			ladySprites.splice(i, 1);
			forDeletion.push(s2);
			girlsEaten += 1;
		}
	};

	//Ghost Echo collision with chatters, prompting text
	var hearLady = function(s1, p1, s2, p2, type) {
		var lads = chattyLadies[mapPos[0]][mapPos[1]];
		var i = -1;
		for(var j = 0; j < lads.length; j++) {
			if(lads[j].sprite == s2)
				i = j;
		}
		if(i != -1) {
			var phrase = lads[i].phrase;
			PS.statusText("");
			PS.statusColor(REPEATABLE_COLOR);
			PS.statusText(phrase);
			repeatable = PS.statusText();
		}
	};

	var zeusGameOver = function() {
		PS.statusText("Zeus got caught... try again");
		PS.timerStop(idMoveTimer);
		clearTimeout(T.timer);
		clearInterval(T.timer);
		T.timer = null;
		G.gameover = true;
		T.index = 999;
		//G.lastDbSend(false);
	};

	var pathToNarc = function(spr) {
		var sprLoc = PS.spriteMove(spr);
		var checkLure = checkWithinLure(sprLoc.x, sprLoc.y, narcX, narcY);
		if(checkLure.isWithinDist) {
			var nx = checkLure.nPath[0][0];
			var ny = checkLure.nPath[0][1];
			moveSprite(false, spr, nx, ny);
		}
		return PS.spriteMove(spr);
	};

	var pathByEcho = function(spr, isPart1, isAttract, sprX, sprY) {
		var checkLure = checkWithinLure(sprX, sprY, echoX, echoY);
		var pathed = false;
		if(checkLure.isWithinDist) {
			pathed = true;
			//PS.spriteSolidAlpha(spr, 180);
			var nx = checkLure.nPath[0][0];
			var ny = checkLure.nPath[0][1]
			//if repel, need to reverse direction of lure
			if(!isAttract) {
				var xdiff = (sprX - nx);
				var ydiff = (sprY - ny);
				nx = sprX + xdiff;
				ny = sprY + ydiff;
			}
			moveSprite(isPart1, spr, nx, ny);
		}
		return {pathed: pathed, location: PS.spriteMove(spr)};
	};

	//wrapper functions to pathByEcho for readability's sake
	var pathToEcho = function(spr, isPart1, sprX = PS.spriteMove(spr).x, sprY = PS.spriteMove(spr).y) {
		return pathByEcho(spr, isPart1, true, sprX, sprY);
	};

	var pathFromEcho = function(spr, isPart1, sprX = PS.spriteMove(spr).x, sprY = PS.spriteMove(spr).y) {
		return pathByEcho(spr, isPart1, false, sprX, sprY);
	};

	//returns true if a move will not cause sprites to be overlapped
	var isMoveValidPart1 = function(spr, x, y) {
		var collision = false;
		var spriteList = [];

		ladySprites.forEach(function(lSpr){
			if (lSpr !== spr) {
				spriteList.push(lSpr);
			}
		});
		if (heraSprite !== spr && heraActive) {
			spriteList.push(heraSprite);
		}
		if (zeusSprite !== spr && zeusActive) {
			spriteList.push(zeusSprite);
		}
		if (echoSprite !== spr && echoActive) {
			spriteList.push(echoSprite);
		}

		spriteList.forEach(function(cSpr){
			var cPos = PS.spriteMove(cSpr);
			if (cPos.x >= x - 1 && cPos.x <= x + 1
				&& cPos.y >= y - 1 && cPos.y <= y + 1) {
				collision = true;
			}
		});

		return !collision;
	};

	//returns true if a move will not cause sprites to be overlapped
	var isMoveValidPart2 = function(spr, x, y) {
		var collision = false;
		var spriteList = [];

		nymphs[mapPos[0]][mapPos[1]].forEach(function(lSpr){
			if (lSpr.sprite !== spr) {
				PS.spriteMove(lSpr.sprite);
				spriteList.push(lSpr.sprite);
			}
		});
		chattyLadies[mapPos[0]][mapPos[1]].forEach(function(lSpr){
			if (lSpr.sprite !== spr) {
				PS.spriteMove(lSpr.sprite);
				spriteList.push(lSpr.sprite);
			}
		});
		if (narcSprite !== spr) {
			PS.spriteMove(narcSprite);
			spriteList.push(narcSprite);
		}

		spriteList.forEach(function(cSpr){
			var cPos = PS.spriteMove(cSpr);
			if (cPos.x >= x - 1 && cPos.x <= x + 1
				&& cPos.y >= y - 1 && cPos.y <= y + 1) {
				collision = true;
			}
		});

		return !collision;
	};

	var spawnLady = function() {
		var a = PS.spriteSolid(2, 2);
		PS.spritePlane(a, LADY_PLANE);
		PS.spriteSolidColor(a, LADY_COLOR);
		var rx = PS.random(G.GRID_WIDTH - 1) - 1;
		var ry = PS.random(G.GRID_HEIGHT - 1) - 1;
		while (!isMoveValidPart1(null, rx, ry)) {
			rx = PS.random(G.GRID_WIDTH - 1) - 1;
			ry = PS.random(G.GRID_HEIGHT - 1) - 1;
		}
		PS.spriteMove(a, rx, ry);
		ladySprites.push(a);
	};

	var setPhraseAbility = function(phrase) {
		if(phrase.includes("Come")) {
			lure = MAX_LURE_TIMER;
			lureCooldown = 30;
		} else if(phrase.includes("Leave")) {
			repel = MAX_LURE_TIMER;
			lureCooldown = 30;
		} else if(phrase.includes("Stop")) {
			stop = MAX_LURE_TIMER;
			lureCooldown = 30;
		}
	};

	G = {
		GRID_HEIGHT : 30,
		GRID_WIDTH : 30,

		activeBoardWidth : null,
		activeBoardHeight : null,

		gameover: false,
		gameStarted : false,
		isPart2 : false,
		gameOverPart3 : false,
		localClicks : 0,

		init : function() {
			PS.gridSize(G.GRID_WIDTH, G.GRID_HEIGHT);
			PS.border(PS.ALL, PS.ALL, 0);
			PS.color(PS.ALL, PS.ALL, GROUND_COLOR);
			PS.gridColor(BG_COLOR_1);

			G.activeBoardHeight = G.GRID_HEIGHT;
			G.activeBoardWidth = G.GRID_WIDTH;

			initLurePlane();
			initGlyphPlace();

			G.restartTimer();
			PS.audioLoad(ECHO_LURE_SOUND, {path : AUDIO_PATH, fileTypes : ["mp3", "ogg", "wav"]});
			//PS.audioLoad(ECHO_LURE_SOUND);
			PS.audioLoad(ECHO_FAIL_SOUND, {path : AUDIO_PATH, fileTypes : ["mp3", "ogg", "wav"]});
			PS.audioLoad(LADY_SOUND, {path : AUDIO_PATH, fileTypes : ["mp3", "ogg", "wav"]});
			ladiesActive = false;
			G.initEcho();
			activateBeads(30,30);

			//incrementTutorial();

			PS.dbInit(DB_NAME, {login: G.finishInit});
			//PS.dbInit(DB_NAME);
			//G.finishInit();

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
			if (idMoveTimer !== null) {
				PS.timerStop(idMoveTimer);
			}
			idMoveTimer = PS.timerStart(5, tick2);
			loadMap(map[mapPos[0]][mapPos[1]]);
			G.initGhostEcho();
			narcX = 1;
			narcY = 15;
			PS.spriteMove(narcSprite, narcX, narcY);
			PS.spriteShow(narcSprite, true);
			makeChattyLadies();
			changeLadies(mapPos[0], mapPos[1], true);
			echoActive = true;
		},

		mapMove: function(x, y) {
			// RIGHT same row, +1 col
			var DELAY = 3;
			if(x==G.GRID_WIDTH-2) {
				if(map[mapPos[0]].length > mapPos[1]+1) {
					if(dirMove(mapPos[0], mapPos[1]+1)) {
						echoX = 1;
						PS.spriteMove(echoGhostSprite, echoX, y);
						mapMoveDelay = DELAY;
					}
				}
				// LEFT same row, -1 col
			} else if(x==0) {
				if(mapPos[1]-1 >= 0) {
					if(dirMove(mapPos[0], mapPos[1]-1)) {
						echoX = G.GRID_WIDTH-3;
						PS.spriteMove(echoGhostSprite, echoX, y);
						mapMoveDelay = DELAY;
					}
				}
				// DOWN +1 row, same col
			} else if(y==G.GRID_HEIGHT-2) {
				if(map.length > mapPos[0]+1) {
					if(dirMove(mapPos[0]+1, mapPos[1])) {
						echoY = 2;
						PS.spriteMove(echoGhostSprite, x, echoY);
						mapMoveDelay = DELAY;
					}
				}
				// UP -1 row, same col
			} else if(y==0) {
				if(mapPos[0]-1 >= 0) {
					if(dirMove(mapPos[0]-1, mapPos[1])) {
						echoY = G.GRID_HEIGHT-3;
						PS.spriteMove(echoGhostSprite, x, echoY);
						mapMoveDelay = DELAY;
					}
				}
			}
		},

		echo : function(phrase) {
			if(lureCooldown == 0) {
				PS.audioPlay(ECHO_LURE_SOUND, {path: AUDIO_PATH});
				PS.statusText("");
				PS.statusColor(ECHO_COLOR);
				customStatusText(phrase);
				setPhraseAbility(phrase);
			}
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
			PS.spriteSolidColor(echoGhostSprite, ECHO_GHOST_COLOR);
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
			PS.spriteSolidColor(zeusSprite, ZEUS_COLOR);
			PS.spriteMove(zeusSprite, zeusX, zeusY);
			zeusActive = true;
		},

		initHera : function() {
			heraSprite = PS.spriteSolid(2, 2);
			PS.spritePlane(heraSprite, HERA_PLANE);
			PS.spriteCollide(heraSprite, heraCollide);
			PS.spriteSolidColor(heraSprite, HERA_COLOR);
			PS.spriteMove(heraSprite, heraX, heraY);
			heraActive = true;
		},

		initNarcissus : function() {
			narcSprite = PS.spriteSolid(2, 2);
			PS.spritePlane(narcSprite, NARC_PLANE);
			PS.spriteCollide(narcSprite, narcCollide);
			PS.spriteSolidColor(narcSprite, NARC_COLOR);
			PS.spriteMove(narcSprite, narcX, narcY);
		},

		move : function(x, y) {
			step = 0;
			path = PS.line(echoX, echoY, x, y);
			T.onMove();
		},

		lure : function() {
			var valid = true;
			if(lureCooldown == 0) {
				if (isPart2 && !firstTalk) {
					if (firstEnc) {
						clearTutorial();
						PS.statusText("");
						PS.statusColor(ECHO_TEXT_COLOR);
						customStatusText("'Who are you?'");
						firstTalk = true;
						T.index = 25;
						setTimeout(function(){
							incrementTutorial();
						}, 3000);
					} else {
						valid = false;
					}
				}
				if (valid) {
					PS.audioPlay(ECHO_LURE_SOUND, {path: AUDIO_PATH});
					lure = MAX_LURE_TIMER; //num ticks to be lured for
					lureCooldown = 30; //num ticks of lure cooldown (includes lured time)
					PS.spriteSolidAlpha(echoSprite, 125);
				} else {
					PS.audioPlay(ECHO_FAIL_SOUND, {path: AUDIO_PATH});
				}
			}
		},

		restart : function() {
			deleteAllLadies();
			zeusTarget = "";
			girlsEaten = 0;
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
			var x;
			for (x = 0; x < 3; x++) {
				spawnLady();
			}
			incrementTutorial();
			G.restartTimer();
		},

		restartPart2 : function() {
			G.gameOverPart3 = false;

			loadMap(map[mapPos[0]][mapPos[1]]);

			path = [];
			echoX = 14;
			echoY = 20;
			PS.spriteMove(echoGhostSprite, echoX, echoY);
			echoGhostActive = true;

			//change
			var nPath = narcPaths[mapPos[0]][mapPos[1]];
			narcX = nPath[0][0];
			narcY = nPath[0][1];
			PS.spriteMove(narcSprite, narcX, narcY);
			PS.spriteShow(narcSprite, true);

			chattyLadies.forEach(function(maprow){
				maprow.forEach(function(map){
					map.forEach(function(lady){
						PS.spriteMove(lady.sprite,lady.originX,lady.originY);
					});
				});
			});
			nymphs.forEach(function(maprow){
				maprow.forEach(function(map){
					map.forEach(function(lady){
						PS.spriteMove(lady.sprite,lady.originX,lady.originY);
					});
				});
			});
			echoActive = true;

			idMoveTimer = PS.timerStart(5, tick2);
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
		},

		restartTimer : function() {
			idMoveTimer = PS.timerStart(5, tick);
		}
	};
}());


// All of the functions below MUST exist, or the engine will complain!
/**********************************************************************************/

PS.init = function( system, options ) {
	G.init();
};


PS.touch = function( x, y, data, options ) {
	// Add code here for mouse clicks/touches over a bead
//	if(!G.gameover){
//		PS.dbEvent("echoesprototype", "mouseclick", "true");
//		G.move(x, y);
//	}
	G.localClicks += 1;
	if (G.gameOverPart3) {
		PS.dbEvent(DB_NAME, "restartPart2", 1);
		G.restartPart2();
	} else if (!G.gameover) {
		G.move(x, y);
	} else {
		PS.dbEvent(DB_NAME, "restartPart1", 1);
		G.restart();
	}
};

PS.enter = function( x, y, data, options ) {
	if (options.touching) {
		//PS.dbEvent("echoesprototype", "mouseclick", "true");
		G.move(x, y);
	}
};

PS.keyDown = function( key, shift, ctrl, options ) {
	if (key == 32) {
		if (!G.isPart2) {
			if(!G.gameover){
				PS.dbEvent(DB_NAME, "spacebar", "true");
				G.lure();
			} else {
				G.restart();
			}
		} else if (G.gameOverPart3) {
			G.restartPart2();
		} else {
			G.echo(repeatable);
		}
	} else if (key == 80 || key == 112) {
		if (!G.isPart2) {
			G.skipToNarc();
		}
	}
};

PS.shutdown = function( options ) {
	PS.dbEvent(DB_NAME, "endgame", "closed");
	PS.dbSend(DB_NAME, ["nchaput", "bsheridan"], {discard: true});
	//PS.dbErase(DB_NAME);
};

PS.release = function( x, y, data, options ) {
};

PS.keyUp = function( key, shift, ctrl, options ) {
};

PS.input = function( sensors, options ) {
};

PS.exit = function( x, y, data, options ) {
};

PS.exitGrid = function( options ) {
};