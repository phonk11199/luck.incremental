'use strict';

let currentcloverel = document.getElementById('currentclover');
let openclover = document.getElementById('openclover');
let backToLuck = document.getElementById('backToLuck');
let x2luck = document.getElementById('x2luck');
let morecloverel = document.getElementById('moreclover');
let morerune = document.getElementById('morerune');
let morerunebutton = document.getElementById('morerunebutton');
let moremoneybutton = document.getElementById('moremoneybutton')

let incloverchallenge = false;
let inmoneychallenge = false;

function reset(){
    game.luck = D(1)
    game.money = D(0);
    game.moneycost = D(10);
    game.moneytimecost = D(20);
    game.moneytimelevel = 0;
    game.moneylucklevel = 0;
    game.currentDraws = 0;
    game.currentRune = 0;
    game.runetime = 1000;
    game.morerunecost = D(50);

}


currentcloverel.onclick = function () {
    if (game.currentRune >= 7 && inmoneychallenge === false) {
        addClover();

        reset();
        updateruneChance();
        restartDrawTimer();
        updateUI();
        SaveSystem.save();

        game.guide.g2 = true;
        if (game.clover.gt(0)) openclover.classList.remove('hidden');
    }
};

x2luck.onclick = function () {
    if (game.clover.gte(game.x2luckcost)) {
        game.clover = game.clover.sub(game.x2luckcost);
        game.x2luckcost = game.x2luckcost.mul(2).floor();
        game.x2luck1 = game.x2luck1.mul(2);
        game.x2lucklevel++;
        if (game.x2lucklevel >= 5) {
            game.guide.g3 = true;
            game.challenge.cloverchallenge = true;
        }
        updateUI();
        SaveSystem.save();
    }
};

morecloverel.onclick = function () {
    if (!incloverchallenge) {
        morecloverel.textContent = '退出';
        incloverchallenge = true;
        reset();
        luckpunishment = 0.1;
        game.luck = game.luck.mul(luckpunishment);

        updateruneChance();
        restartDrawTimer();
        updateUI();
    } else {
        morecloverel.textContent = '更多的四叶草';
        incloverchallenge = false;

        // 本次加成
        const thisCloveradd = D(game.currentRune).pow(2);
        if (thisCloveradd.gt(game.cloveradd)) game.cloveradd = thisCloveradd;

        luckpunishment = 1;
        reset();

        game.guide.g4 = true;
        if (game.cloveradd.gte(81)) {
            game.morerunebutton1 = true;
            game.guide.g5 = true;
        }

        updateruneChance();
        restartDrawTimer();
        updateUI();
        SaveSystem.save();
    }
};

moremoneybutton.onclick = function () {
    if (!inmoneychallenge) {
        moremoneybutton.textContent = "退出";
        inmoneychallenge = true;
        reset();
        updateruneChance();
        restartDrawTimer();
        updateUI();
    } else {
        moremoneybutton.textContent = "更多的金钱";
        inmoneychallenge = false;

        let thismoneyadd = D(0);
        if (game.money.gt(1)) {
            thismoneyadd = D(game.money.log10()).div(D(Math.log10(3)));
        }
        if (thismoneyadd.gt(game.moneyadd)) {
            game.moneyadd = thismoneyadd;
        }

        reset();
        updateruneChance();
        restartDrawTimer();
        updateUI();
        SaveSystem.save();
    }
};

morerunebutton.onclick = function () {
    if (game.money.gte(game.morerunecost)) {
        game.money = game.money.sub(game.morerunecost);
        game.morerunecost = game.morerunecost.mul(1.2).floor();
        game.morerunes++;
        game.morerunelevel++;
        updateUI();
        SaveSystem.save();
        if (game.morerunelevel >= 10){
            game.challenge.moneychallenge = true;
            game.guide.g6 = true;
            game.opencondensebutton = true;
        }
    }
};

openclover.onclick = function () {
    showInterface('clover');
    document.body.style.background = '#91ff00';
    document.body.style.color = '#000';
};

backToLuck.onclick = function () {
    showInterface('luck');
    document.body.style.background = '#fffb00';
    document.body.style.color = '#000';
};