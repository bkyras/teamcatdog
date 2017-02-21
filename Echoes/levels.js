//constants
var DEFAULT_COLOR = PS.COLOR_WHITE; //0
var GROUND_COLOR = 0x579532; //1
var PATH_COLOR = 0x883E19; //2
var DIRT_COLOR = 0xAF623B; //3
var TREE_COLOR = PS.COLOR_GREEN; //4
var WATER_COLOR = PS.COLOR_BLUE; //5

var LURE_COLOR = 0xA6F776;

var LURE_PLANE = 1, LADY_PLANE = 2, ZEUS_PLANE = 3, HERA_PLANE = 4, ECHO_PLANE = 5, NARC_PLANE = 6;

var road = [[1,1,1,1,1,4,4,4,4,4,4,4,4,1,1,1,1,1,1,1,1,1,1,1,5,5,5,1,1,1],
[1,1,1,1,1,1,4,4,4,4,4,4,4,1,1,1,1,1,1,1,1,1,5,5,5,5,5,1,1,1],
[1,1,1,1,1,1,4,4,4,4,4,4,1,1,1,1,1,1,1,1,5,5,5,5,5,5,1,1,1,1],
[1,1,1,1,1,1,1,1,4,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,1,1,1,1,1,1],
[5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1],
[5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1],
[5,5,5,1,1,1,1,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,1],
[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
[3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,4,4,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,4,4,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];

var plains = [[1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1],
[3,3,3,3,3,3,1,1,1,1,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,3],
[3,3,3,3,3,3,3,3,3,1,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,3,3,3],
[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,1,1,1,1,3,3,3,3,3,3],
[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,3,3,3,3,3,3,3,3,3],
[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
[1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
[1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
[1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
[1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]];

var pond = [[4,4,4,4,1,4,4,4,4,4,4,4,4,4,4,1,4,4,4,4,4,1,1,4,4,4,4,4,4,4],
[4,4,4,4,4,4,4,4,4,4,4,4,4,1,4,1,4,4,1,4,4,4,4,4,4,4,1,4,4,4],
[4,4,4,4,4,1,4,4,4,4,1,1,4,1,1,4,1,4,1,1,4,1,4,4,4,4,4,4,4,1],
[4,4,4,4,1,4,4,1,1,4,4,1,4,4,1,1,1,4,4,1,1,4,4,4,1,4,4,4,4,4],
[4,1,4,4,4,4,4,4,4,1,4,1,1,1,1,1,1,1,1,1,4,1,4,1,1,4,4,1,1,4],
[4,4,4,4,4,4,4,4,1,1,1,1,5,5,5,5,5,5,5,1,1,1,1,1,4,1,4,4,1,1],
[4,4,4,4,1,1,4,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1,4,1],
[4,4,4,1,4,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,4,1],
[4,4,4,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,4],
[1,4,1,4,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,4],
[4,1,4,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1],
[4,1,4,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,4],
[4,4,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,1],
[4,1,4,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,1,1,1,1,1,4,1],
[4,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,4],
[1,4,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,4],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,4,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1],
[1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1]];

var rock = [[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5],
[1,1,1,1,1,1,1,1,1,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5],
[1,1,1,1,1,1,1,1,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5],
[1,1,1,1,1,1,1,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5],
[1,1,1,1,1,1,1,5,5,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5],
[1,1,1,1,1,1,1,1,5,5,5,5,5,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,1],
[1,1,1,1,1,1,1,1,1,5,5,5,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,2,3,3,3,3,3,2,2,2,2,2,1,1],
[1,1,1,1,1,1,1,1,1,1,1,3,3,3,3,2,2,3,3,3,3,3,3,2,2,2,2,2,2,2],
[1,1,1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2],
[1,1,1,1,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2],
[3,3,3,3,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2],
[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,3,3,3,3,3,2,2,2,2,2,2,2,2],
[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,2,2,2,2,2,2,2],
[3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,1,1,2,2,2,2,2,1],
[3,3,3,3,3,3,3,3,3,2,3,3,3,1,1,1,1,1,1,1,1,1,1,5,5,2,2,2,1,1],
[3,3,3,3,3,3,3,1,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,1,1],
[3,3,3,3,3,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,1,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,4,4],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,4,4],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,4,4],
[1,1,1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,1,1,1,5,5,5,5,5,5,4,4],
[1,1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,4,1,4,5,5,5,5,5,5,4,4],
[1,1,1,1,1,1,1,1,1,1,4,4,4,4,4,4,4,4,4,4,4,4,5,5,5,5,5,5,4,4]];

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
var map = [[horizontalPath, plains, rock]];

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

var narcPath2 = [[1,16],[2,16],[3,16],[4,16],[5,16],[6,16],[7,16],[8,16],[8,17],[9,17],[9,18],[9,19],[8,19],[8,20],[8,21],[8,22],[9,22],[9,23],[9,24],[10,24],[11,24],[12,24],[12,25],[13,25],[14,25],[15,25],[16,25],[17,25],[18,25],[18,24],[19,24],[20,24],[20,23],[21,23],[21,22],[22,22],[22,21],[22,20],[23,20],[23,19],[23,18],[23,17],[23,16],[23,15],[23,14],[23,13],[23,12],[22,12],[22,11],[22,10],[21,9],[21,8],[20,8],[20,7],[19,7],[19,6],[18,6],[18,5],[18,4],[18,3],[19,3],[19,2],[20,2],[20,1]];

var narcPath3 = [[4,26],[5,26],[6,26],[7,26],[8,26],[9,26],[10,26],[10,25],[11,25],[11,24],[11,23],[12,23],[12,22],[12,21],[12,20],[11,20],[11,19],[10,19],[10,18],[9,18],[9,17],[8,17],[7,17],[7,16],[6,15],[5,15],[5,14],[5,13],[4,13],[4,12],[4,11],[4,10],[5,10],[5,9],[5,8],[6,8],[6,7],[7,7],[7,6],[8,6],[9,6],[10,6],[10,5],[11,5],[12,5],[13,5],[14,5],[15,5],[16,5],[17,5],[18,5],[18,6],[19,6],[20,7],[21,8],[21,9],[22,9],[22,10],[22,11],[22,12],[22,13],[21,13],[21,14],[21,15],[20,15],[20,16],[19,17],[19,18],[19,19],[18,19],[18,20],[18,21],[18,22],[18,23],[19,23],[19,24],[20,24],[20,25],[21,25],[22,25],[23,25],[24,25],[25,25],[26,25],[26,24],[27,24],[27,23],[28,23],[28,22]];
var narcPaths = [[narcPath1, narcPath2, narcPath3]];

var repeatable = "";
var chattyLadies = [[[], [], []]];
var narcLadies = [[[], [], []]];

var addPart2Lady = function(row, col, x, y) {
	var a = PS.spriteSolid(2, 2);
	PS.spritePlane(a, LADY_PLANE);
	PS.spriteSolidColor(a, PS.COLOR_BLUE);
	PS.spriteMove(a, x, y);
	PS.spriteShow(a, false);
	narcLadies[row][col].push(a);
};

var changeLadies = function(row, col, appear) {
	for(var key in chattyLadies[row][col]) {
		PS.spriteShow(chattyLadies[row][col][key].sprite, appear);
	}
	for(var spr in narcLadies[row][col]) {
		PS.spriteShow(narcLadies[row][col][spr], appear);
	}
};

var makeChattyLadies = function() {
	addPart2Lady(0, 0, 10, 4);
	addPart2Lady(0, 0, 18, 8);
	var l1 = PS.spriteSolid(2, 2);
	PS.spriteSolidColor(l1, PS.COLOR_YELLOW);
	PS.spritePlane(l1, HERA_PLANE);
	PS.spriteShow(l1, false);
	PS.spriteMove(l1, 5, 15);
	chattyLadies[0][0].push({sprite: l1,
													 phrase: "Come over here."});

	var l2 = PS.spriteSolid(2, 2);
	PS.spriteSolidColor(l2, PS.COLOR_YELLOW);
	PS.spritePlane(l2, HERA_PLANE);
	PS.spriteShow(l2, false);
	PS.spriteMove(l2, 7, 17);
	chattyLadies[0][0].push({sprite: l2,
										 phrase: "Leave me alone!"});

	var l3 = PS.spriteSolid(2, 2);
	PS.spriteSolidColor(l3, PS.COLOR_YELLOW);
	PS.spritePlane(l3, HERA_PLANE);
	PS.spriteShow(l3, false);
	PS.spriteMove(l3, 10, 8);
	chattyLadies[l3] = {mapPos: [0, 0],
										 phrase: "Stop right there!"};
};