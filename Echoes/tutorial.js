/**TUTORIAL UTIL FUNCTIONS AND VARIABLES*****************************************/	

var T; //variable containing tutorial functions. 
	T = {
		index : 0,
		numMoves : 0,
		timer : null,
		onMove : function(){}
	};

var clearTutorial = function() {
	T.numMoves = 0;
	clearTimeout(T.timer);
	T.timer = null;
	T.onMove = function(){};
};

var incrementTutorial = function() {
    if (T.index !== 0 && !endGame) {
			PS.dbEvent(DB_NAME, "Index", T.index, "Clicks", G.localClicks);
    }
    G.localClicks = 0;
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
				eraseLure();
				eraseGlyphs();

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
				deleteEcho();
				deleteHera();
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
			    path = [];
				customStatusText("You encounter Narcissus.");

				G.initNarcissus();
				G.restartTimer();

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
						if (narcSprite !== "") {
							PS.spriteShow(narcSprite, false);
						}
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
				customStatusText("You want him for yourself...");

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 30:
				customStatusText("Keep those nymphs away!");
				isPart3 = true;

				activateBeads(30,30);
				G.initPart2();
				
				break;
			case 31:
				PS.statusColor(PS.COLOR_BLACK);
				customStatusText("Narcissus looks at himself...");

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 32:
				customStatusText("Wow, he really is hot.");

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 33:
				customStatusText("So hot he dies staring.");

				T.timer = setTimeout(function(){
					incrementTutorial();
				}, SMALL_WAIT);
				break;
			case 34:
				activateBeads(0, 0);
				customStatusText("At least you're together now.");
				break;
		}
	};