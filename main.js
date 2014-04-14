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

        for (var i in seriestarget) {
            result["-wt-series-" + seriestarget[i]] = gettime(seriestarget[i]);
        }
        for (var i in intervaltarget) {
            result["+wt-interval-" + intervaltarget[i]] = itscore[i];
        }

        return result;
    }

    function getresultwithsto() {
        var result = getresult();
        var resultsto = {};

        for (var i in result) {
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

        for (var i in intervaltarget) {
            if (lastscore > 0 && time - timelist[lastscore - 1] < intervaltarget[i]) {
                ++itscore[i];
            } else {
                itscore[i] = 0;
            }
        }
    }

    function goahead(value) {
        var time = (new Date()).getTime();

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
        for (var i = 0; i < gameheight; ++i) genpos();
        for (var i in intervaltarget) itscore[i] = 0;
    }

    initgame();

    ////////////////////////////////////////////////////////////////
    // Canvas

    var canvaswidth = gamewidth / (gameheight - 1);

    var game = $(".game");
    var tracks = [];
    var tiles = [];

    function drawsuccess() {
        //
    }

    function drawfail() {
        //
    }

    function updatecanvas() {
        var xsize = $(".main").height() - $(".title").outerHeight() - $(".info").outerHeight();
        var unitwidth = Math.floor(xsize * canvaswidth / gamewidth);
        var unitheight = Math.floor(xsize / (gameheight - 1));
        var leftpos = Math.floor((game.width() - xsize * canvaswidth) / 2);

        game.css({
            top: $(".title").outerHeight() + "px",
            height: unitheight * (gameheight - 1) + "px"
        })

        for (var i in tracks) {
            tracks[i].css({
                left: leftpos + unitwidth * parseInt(i) + "px",
                top: "0px",
                width: unitwidth + "px",
                height: unitheight * (gameheight - 1) + "px"
            });
        }

        for (var i in tiles) {
            var unitpos = posnow - parseInt(i) + gameheight - 1;

            tiles[i].stop();
            tiles[i].css({
                left: leftpos + unitwidth * poslist[Math.floor(unitpos / gameheight) * gameheight + parseInt(i)] + "px",
                width: unitwidth + "px",
                height: unitheight + "px"
            });

            var anidata = {top: unitheight * (unitpos % gameheight - 1) + "px"};

            if (unitpos % gameheight > 0) {
                tiles[i].animate(anidata, 100);
            } else {
                tiles[i].css(anidata);
            }
        }
    }

    function input(value) {
        if (goahead(value)) {
            drawsuccess();
        } else {
            drawfail();
        }
        updatecanvas();
    }

    function initcanvas() {
        for (var i = 0; i < gamewidth; ++i) {
            tracks.push(
                $("<div class=\"track\" />")
                    .append("<div class=\"frame\" />")
                    .click(
                        function (j){
                            return function (){input(j);};
                        }(i)
                    )
                    .appendTo(game)
            );
        }

        for (var i = 0; i < gameheight; ++i) {
            tiles.push(
                $("<div class=\"tile\">")
                    .append("<div class=\"fill\">")
                    .appendTo(game)
            );
        }

        $(window).resize(updatecanvas);
        $(window).load(updatecanvas);

        updatecanvas();
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

    $(document).keydown(function (event) {
        var value = keymap[event.which];
        if (value != undefined) input(value);
    });

    ////////////////////////////////////////////////////////////////
});
