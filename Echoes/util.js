/**CONSTANTS*****************************************/

var DEFAULT_COLOR = PS.COLOR_WHITE; //0
var GROUND_COLOR = 0x579532; //1
var PATH_COLOR = 0x883E19; //2
var DIRT_COLOR = 0xAF623B; //3
var TREE_COLOR = PS.COLOR_GREEN; //4
var WATER_COLOR = PS.COLOR_BLUE; //5
var LURE_COLOR = 0xA6F776;
var HEART_COLOR = 0xF775E1;

//character color constants
var ECHO_COLOR = PS.COLOR_BLACK;
var HERA_COLOR = PS.COLOR_CYAN;
var ZEUS_COLOR = PS.COLOR_YELLOW;
var NARC_COLOR = PS.COLOR_GREEN;
var LADY_COLOR = PS.COLOR_BLUE;
var CHATTY_LADY_COLOR = PS.COLOR_ORANGE;
var NYMPH_COLOR = PS.COLOR_BLUE;


var CURSE1 = 0xBBBBBB;
var CURSE2 = 0x777777;

var DB_NAME = "ECHOES_V2_db";

var LURE_PLANE = 1, GLYPH_PLANE = 2, LADY_PLANE = 3, ZEUS_PLANE = 4, HERA_PLANE = 5, ECHO_PLANE = 6, NARC_PLANE = 7;

var AUDIO_PATH = "/"; //uncomment for placeholder audio
//var AUDIO PATH = "audio/"; //uncomment for custom audio
var ECHO_LURE_SOUND = "fx_squawk";
//var ECHO_LURE_SOUND = "echomumble";
var ECHO_FAIL_SOUND = "fx_silencer";
var LADY_SOUND = "fx_hoot";

var MAX_LURE_TIMER = 18;
var LURE_RADIUS = 7;
var MAX_LADIES = 6;

/**VARIABLES*****************************************/

var echoSprite = "", echoActive = false;
var echoGhostSprite = "", echoGhostActive = false;
var heraSprite = "", heraActive = false;
var zeusSprite = "", zeusActive = false;
var narcSprite = "";
var ladiesActive = false;

var spawnLadyTimer = 50;
var ladySprites = [];
var forDeletion = [];

var echoX = 14, echoY = 6;
var heraX = 12, heraY = 15;
var zeusX = 10, zeusY = 2;
var narcX = 14, narcY = 9;
var narcMapRow = 0, narcMapCol = 0;
var narcPathPos = 0;

var lure = 0, repel = 0, stop = 0;
var lureCooldown = 0;
var heraTime = 2, zeusTime = 4, ladyTime = 3, narcTime = 5;

var idMoveTimer = "";
var path = [];
var step = 0;

var statusTextTimer = null;
var curStatText = "";
var fullStatText = "";
var repeatable = "";

var girlsEaten = 0;
var timeRemaining = 0;
var curseFlag = false;

var heraCaughtZeus = false;

var isPart2 = false, isPart3 = false;
var firstEnc = false;
var firstTalk = false;
var endGame = false;

/**LEVELDATA AND RELATED FUNCTIONS*****************************************/

var road = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[2,2,2,2,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[2,2,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[2,2,2,2,2,2,2,2,2,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,3,3,3,2,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,3,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,3,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,2,2,2,2,2,2,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,3,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,3,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,3,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2,2,2,2,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,2,2,2,2,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2,2,2,2,3,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2,2,2,2,2,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2,2,2,2,2,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2,2,2,2,2,2,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,3,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2,2,2,2,2,2,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,3,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,3,1]];

var plains = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2,2],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2,2,2],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2,2,2,2,2],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2,2,2,2,2,2],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2,2,2,2,2,2,2,2],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,2,2,2,2,2,2,2,2,2,3],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2,2,2,2,2,2,2,2,2,2,3,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,2,2,2,2,2,2,2,2,2,2,3,3,1,1,1],
[1,1,1,1,1,1,1,1,1,1,3,3,3,2,2,2,2,2,2,2,2,2,2,3,3,1,1,1,1,1],
[1,3,3,3,3,3,3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,1,1,1,1,1,1],
[3,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,1,1,1,1,1,1,1],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,1,1,1,1,1,1,1,1,1],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[2,2,2,2,2,2,2,2,2,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];

var pond = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2,2,2,2,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,2,2,2,2,3,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2,2,2,2,3,3,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,2,2,2,2,2,3,3,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,1,2,2,2,2,2,2,2,2,3,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,2,2,2,2,2,2,2,2,2,3,3,1,1],
[1,1,1,1,1,1,1,1,1,1,3,3,3,2,2,2,2,2,2,2,2,2,2,2,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,3,3,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,3,3,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,2,2,2,2,2,2,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,2,2,2,2,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,3,2,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,3,3,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];

var horizontalPath = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[3,3,3,3,3,3,3,1,1,1,1,3,3,1,3,3,3,3,3,3,1,3,3,3,3,3,1,1,1,1],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
[1,1,3,3,3,1,1,3,3,3,3,3,3,3,3,3,1,1,1,1,1,3,3,3,3,3,3,3,3,3],
[1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,1,1,1,1,1,1,1,1,1,3,3,3,3,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];

var mapPos = [0, 0]; //row, col
var map = [[horizontalPath, plains, road],
					 [null, null, pond]];

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

var narcPath1 = [[1,15],[2,15],[3,15],[4,15],[5,15],[6,15],[7,15],[8,15],[9,15],[10,15],[11,15],[12,15],[13,15],[14,15],[15,15],[16,15],[17,15],[18,15],[19,15],[20,15],[21,15],[22,15],[23,15],[24,15],[25,15],[26,15],[27,15],[28,15],[29,15]];

var narcPath2 = [[0,17],[1,17],[1,16],[2,16],[3,16],[4,16],[5,16],[6,16],[7,16],[8,16],[9,16],[10,16],[11,16],[12,16],[13,16],[13,15],[14,15],[15,15],[16,15],[16,14],[17,14],[18,14],[18,13],[19,13],[20,13],[20,12],[21,12],[22,12],[22,11],[23,11],[24,11],[24,10],[25,10],[26,9],[27,9],[27,8],[28,8],[28,7],[29,7],[29,6],[29,6]];

var narcPath3 = [[0,7],[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[5,9],[6,9],[7,9],[8,9],[8,10],[9,10],[10,10],[10,11],[11,11],[12,11],[12,12],[13,13],[13,14],[14,14],[14,15],[15,15],[15,16],[16,16],[16,17],[16,18],[17,18],[17,19],[18,19],[18,20],[18,21],[19,21],[19,22],[19,23],[20,23],[20,24],[20,25],[21,25],[21,26],[21,27],[22,27],[22,28],[23,28],[23,29],[24,29]];

var narcPath4 = [[25,0],[25,1],[24,1],[24,2],[24,3],[23,3],[23,4],[22,4],[21,4],[21,5],[20,5],[19,5],[19,6],[18,6],[17,6],[16,6],[15,6],[15,7],[14,7],[13,7],[12,7],[11,7],[10,7],[9,7],[8,7],[8,8],[8,9],[7,9],[8,10],[8,11]];

var narcPaths = [[narcPath1, narcPath2, narcPath3],
								 [null, null, narcPath4]];


/**VISUAL UTILITY FUNCTIONS*****************************************/

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

	PS.gridRefresh();
};

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

var initLurePlane = function() {
	var plane = PS.gridPlane();
	PS.gridPlane(LURE_PLANE);

	PS.color(PS.ALL,PS.ALL,LURE_COLOR);
	PS.alpha(PS.ALL,PS.ALL,0);

	PS.gridPlane(plane);
};

var initGlyphPlace = function() {
	var plane = PS.gridPlane();
	PS.gridPlane(GLYPH_PLANE);

	PS.glyph(PS.ALL,PS.ALL,10084);
	PS.glyphColor(PS.ALL,PS.ALL,HEART_COLOR);
	PS.glyphAlpha(PS.ALL,PS.ALL,0);

	PS.gridPlane(plane);
};

var eraseGlyphs = function() {
	var plane = PS.gridPlane();
	PS.gridPlane(GLYPH_PLANE);
	PS.alpha(PS.ALL,PS.ALL,0);
	PS.gridPlane(plane);
};

var fadeGlyphs = function() {
	var x,y;
	var plane = PS.gridPlane();
	PS.gridPlane(GLYPH_PLANE);
	var RATE = 30;

	for (x = 0; x < G.GRID_WIDTH; x++) {
		for (y = 0; y < G.GRID_HEIGHT; y++) {
			PS.glyphAlpha(x,y,PS.glyphAlpha(x,y) - RATE);
		}
	}

	PS.gridPlane(plane);
};

var showGlyphs = function(x,y) {
	var x,y;
	var plane = PS.gridPlane();
	PS.gridPlane(GLYPH_PLANE);

	PS.glyphAlpha(x,y,255);

	PS.gridPlane(plane);
};

var eraseLure = function() {
	var plane = PS.gridPlane();
	PS.gridPlane(LURE_PLANE);
	PS.alpha(PS.ALL,PS.ALL,0);
	PS.gridPlane(plane);
};

var drawLure = function(count) {
	var x,y;
	var plane = PS.gridPlane();
	PS.gridPlane(LURE_PLANE);

	var lure_transition = Math.floor(255 * (count / MAX_LURE_TIMER));

	for (x = 0; x < G.GRID_WIDTH; x++) {
		for (y = 0; y < G.GRID_HEIGHT; y++) {
			var closePos = getClosePos(x,y,echoX,echoY);
			if ((x-closePos.x)*(x-closePos.x) + (y-closePos.y)*(y-closePos.y) < LURE_RADIUS * LURE_RADIUS) {
				PS.alpha(x,y,lure_transition);
			}
		}
	}

	PS.gridPlane(plane);
};

/**PART 2 UTILITY FUNCTIONS*****************************************/

var chattyLadies = [[[], [], []],
									  [[], [], []]];
var nymphs = [[[], [], []],
								  [[], [], []]];

var drawNarc = function(row, col) {
	if(row == narcMapRow && col == narcMapCol) {
		PS.spriteShow(narcSprite, true);
	} else {
		PS.spriteShow(narcSprite, false);
	}
};

var addPart2Lady = function(row, col, x, y) {
	var a = PS.spriteSolid(2, 2);
	PS.spritePlane(a, LADY_PLANE);
	PS.spriteSolidColor(a, PS.COLOR_BLUE);
	PS.spriteMove(a, x, y);
	PS.spriteShow(a, false);
	nymphs[row][col].push({sprite: a, originX: x, originY: y});
};

var addChatter = function(row, col, x, y, phrase) {
	var a = PS.spriteSolid(2, 2);
	PS.spriteSolidColor(a, PS.COLOR_YELLOW);
	PS.spritePlane(a, HERA_PLANE);
	PS.spriteShow(a, false);
	PS.spriteMove(a, x, y);
	chattyLadies[row][col].push({sprite: a, phrase: phrase, originX: x, originY: y});
};

var changeLadies = function(row, col, appear) {
	for(var key in chattyLadies[row][col]) {
		PS.spriteShow(chattyLadies[row][col][key].sprite, appear);
	}
	for(var spr in nymphs[row][col]) {
		PS.spriteShow(nymphs[row][col][spr].sprite, appear);
	}
};

var makeChattyLadies = function() {
	addPart2Lady(0, 0, 10, 4);
	addPart2Lady(0, 0, 18, 8);
	addPart2Lady(0, 1, 16, 19);
	addPart2Lady(0, 1, 20, 22);
	addPart2Lady(0, 2, 18, 5);
	addPart2Lady(0, 2, 5, 22);
	addChatter(0, 0, 5, 23, "Come over here.");
	addChatter(0, 0, 9, 23, "Leave me alone!");
	addChatter(0, 1, 8, 8, "Stop right there!");
	addChatter(0, 1, 11, 6, "Leave me alone!");
	addChatter(0, 2, 11, 8, "Stop right there!");
	addChatter(0, 2, 15, 5, "Come over here!");
};


/**GENERAL UTILITY FUNCTIONS*****************************************/

var hasCoord = function(pathArray, coord) {
	for(var i = 0; i < pathArray.length; i++) {
		if(pathArray[i][0] == coord[0] && pathArray[i][1] == coord[1])
			return {found: true, coord: i};
	}
	return {found: false, coord: -1};
};

var dirMove = function(mapX, mapY) {
	if(map[mapX][mapY] != null) {
		loadMap(map[mapX][mapY]);
		changeLadies(mapPos[0], mapPos[1], false);
		mapPos = [mapX, mapY];
		changeLadies(mapPos[0], mapPos[1], true);
		drawNarc(mapPos[0], mapPos[1]);
		return true;
	}
	return false;
};

//pass in x,y location and the x,y, location of a 2x2 sprite, return an object with the position
//of the closest tile of the sprite to the give location
var getClosePos = function(x,y,sprX,sprY) {
	var closeX = sprX;
	var closeY = sprY;

	if (Math.abs((sprX + 1) - x) < Math.abs(sprX - x)) {
		closeX = sprX + 1;
	}
	if (Math.abs((sprY + 1) - y) < Math.abs(sprY - y)) {
		closeY = sprY + 1;
	}

	return {x : closeX, y : closeY};
};

var checkWithinLure = function(x1, y1, x2, y2) {
	var thePath = PS.line(x1, y1, x2, y2);
	var closePos1 = getClosePos(x2,y2,x1,y1);
	var closePos2 = getClosePos(x1,y1,x2,y2);
	var distance = (closePos1.x-closePos2.x)*(closePos1.x-closePos2.x) + (closePos1.y-closePos2.y)*(closePos1.y-closePos2.y);
	var isWithinDist = thePath.length > 1 && distance <= LURE_RADIUS * LURE_RADIUS;
	return {nPath: thePath, isWithinDist: isWithinDist};
};

/**WRAPPER UTILITY FUNCTIONS*****************************************/

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