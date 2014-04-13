var game_w = 4;
var game_h = 6;
var canvas_w_div_h = 0.8;

var keymap = [
    [49, 50, 51, 52, 53, 54, 55, 56, 57, 48, 173, 61],
    [81, 87, 69, 82, 84, 89, 85, 73, 79, 80, 219, 221],
    [65, 83, 68, 70, 71, 72, 74, 75, 76, 59, 222],
    [90, 88, 67, 86, 66, 78, 77, 188, 190, 191]
]

var keymaprev = {
    49: 0, 50: 1, 51: 2, 52: 3, 53: 4, 54: 5, 55: 6, 56: 7, 57: 8, 48: 9, 173: 10, 61: 11,
    81: 0, 87: 1, 69: 2, 82: 3, 84: 4, 89: 5, 85: 6, 73: 7, 79: 8, 80: 9, 219: 10, 221: 11,
    65: 0, 83: 1, 68: 2, 70: 3, 71: 4, 72: 5, 74: 6, 75: 7, 76: 8, 59: 9, 222: 10,
    90: 0, 88: 1, 67: 2, 86: 3, 66: 4, 78: 5, 77: 6, 188: 7, 190: 8, 191: 9
}

var poslist = [];
var pos = 0;

function genpos() {
    poslist.append(Math.floor(Math.random() * game_w));
}

function initpos() {
    pos = 0;
    for (i = 0; i < game_h; ++i) genpos();
}

initpos();

var game = $(".game");

$(document).keydown(function(event) {
    alert(keymaprev[event.which]);
});






function ontick() {
    setTimeout(ontick, tick);
}


