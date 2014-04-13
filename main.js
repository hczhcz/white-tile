$(function () {

    ////////////////////////////////////////////////////////////////
    // Storage

    function getlocal(key) {
        return parseInt(localStorage.getItem(key));
    }

    function setlocalmax(key, value) {
        if (getlocal(key) == NaN || value > getlocal(key)) {
            localStorage.setItem(key, value);
        }
    }

    function setlocalmin(key, value) {
        if (getlocal(key) == NaN || value < getlocal(key)) {
            localStorage.setItem(key, value);
        }
    }

    function setlocal(key, value) {
        if (key[0] == "+") setlocalmax(key, value);
        if (key[0] == "-") setlocalmin(key, value);
    }

    ////////////////////////////////////////////////////////////////
    // Rule

    // Setup
    var gamewidth = 4;
    var gameheight = 6;
    var seriestarget = [10, 20, 50, 100, 200, 500, 1000];
    var intervaltarget = [1.0, 0.5, 0.3, 0.2, 0.1];

    // Data
    var posnow = 0;
    var poslist = [];
    var timelist = []; // .length = score
    var itscore = [];

    function getscore() {
        return timelist.length;
    }

    function gettime(len) {
        var score = getscore();

        if (score > len) {
            return timelist[score - 1] - timelist[score - len - 1];
        } else {
            return 9999;
        }
    }

    function getresult() {
        var result = {"+wt-score": getscore()};

        for (i in seriestarget) {
            result["-wt-series-" + seriestarget[i]] = gettime(seriestarget[i]);
        }
        for (i in intervaltarget) {
            result["+wt-interval-" + intervaltarget[i]] = itscore[i];
        }

        return result;
    }

    function getresultwithsto() {
        var result = getresult();
        var resultsto = {};

        for (i in result) {
            setlocal(i, result[i]);
            resultsto[i] = getresult(i);
        }

        return {current: result, best: resultsto};
    }

    function genpos() {
        poslist.push(Math.floor(Math.random() * gamewidth));
    }

    function checkpos(value) {
        return poslist[posnow] == value;
    }

    function updateit(time) {
        var lastscore = getscore();

        for (i in intervaltarget) {
            if (lastscore > 0 && time - timelist[lastscore - 1] < intervaltarget[i]) {
                ++itscore[i];
            } else {
                itscore[i] = 0;
            }
        }
    }

    function goahead(value) {
        var time = getTime();

        if (checkpos(value)) {
            // Go
            updateit(time);
            timelist.push(time);

            ++posnow;
            genpos();

            return true;
        } else {
            // Reset
            timelist = [];
            updateit(time);

            return false;
        }
    }

    function initgame() {
        for (i = 0; i < gameheight; ++i) genpos();
        for (i in intervaltarget) itscore[i] = 0;
    }

    initgame();

    ////////////////////////////////////////////////////////////////
    // Canvas

    var canvaswidth = gamewidth / (gameheight - 1);

    var game = $(".game");
    var track = [];

    function drawsuccess() {
        //
    }

    function drawfail() {
        //
    }

    function input(value) {
        if (goahead(value)) {
            drawsuccess();
        } else {
            drawfail();
        }
    }

    function initcanvas() {
        for (i = 0; i < gamewidth; ++i) {
            track.push(
                $("<div class=\"track\" />")
                    .appendTo(game)
            )
        }
    }

    initcanvas();

    ////////////////////////////////////////////////////////////////
    // Input

    var keymap = {
        49: 0, 50: 1, 51: 2, 52: 3, 53: 4, 54: 5, 55: 6, 56: 7, 57: 8, 48: 9, 173: 10, 61: 11,
        81: 0, 87: 1, 69: 2, 82: 3, 84: 4, 89: 5, 85: 6, 73: 7, 79: 8, 80: 9, 219: 10, 221: 11,
        65: 0, 83: 1, 68: 2, 70: 3, 71: 4, 72: 5, 74: 6, 75: 7, 76: 8, 59: 9, 222: 10,
        90: 0, 88: 1, 67: 2, 86: 3, 66: 4, 78: 5, 77: 6, 188: 7, 190: 8, 191: 9
    }

    $(document).keydown(function(event) {
        var value = keymap[event.which];
        if (value != undefined) input(value);
    });

    ////////////////////////////////////////////////////////////////
});
