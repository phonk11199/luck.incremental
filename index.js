'use strict';

let luckpunishment = 1;

const D = (v) => new Decimal(v);

let game = {
    cloveradd: D(1),
    luck: D(1),
    currentRune: 0,
    currentDraws: 0,
    runetime: 1000,
    money: D(0),
    moneycost: D(10),
    moneytimecost: D(20),
    moneylucklevel: 0,
    moneytimelevel: 0,
    clover: D(0),
    x2luck1: D(1),
    x2luckcost: D(1),
    x2lucklevel: 1,
    morerunes: 1,
    morerunecost: D(50),
    morerunelevel: 0,
    moneyadd: D(1),
    condense :{luck: D(0),luckadd: D(1),money: D(0),moneyadd: D(1),clover: D(0),cloveradd: D(1)},
    opencondensebutton: false,
    morerunebutton1: false,
    condenseinterface: false,
    maxcondenseluck: D(0),
    moneycondense: false,
    clovercondense: false,
    guideText: "达到符文[7]",
    challenge: { cloverchallenge: false,moneychallenge: false, },
    guide: { gcomingsoon: false, g1: false, g2: false, g3: false, g4: false,g5: false,g6: false, }
};

let runechance = 0;
let realrunechance = D(1);
let moneytime = 1000;

let drawTimer = null;

let luckel = document.getElementById('luck');
let runeel = document.getElementById('currentRune');
let drawsel = document.getElementById('currentDraws');
let realrunechanceel = document.getElementById('runeChance');
let moneyel = document.getElementById('currentMoney');
let moneycostel = document.getElementById('moneyCost');
let moneytimecostel = document.getElementById('moneyTimeCost');
let moneylucklevelel = document.getElementById('moneylucklevel');
let moneytimelevelel = document.getElementById('moneytimelevel');
let moneytimemaxel = document.getElementById('moneytimemax');
let cloverel = document.getElementById('clover');
let clover1el = document.getElementById('clover1');
let x2luckcostel = document.getElementById('x2luckCost');
let moneyluck = document.getElementById('moneyluck');
let moneytimeel = document.getElementById('moneytime');
let getcloverel = document.getElementById('getclover');
let getluckel = document.getElementById('getluck');
let cloveraddtext = document.getElementById('cloveraddtext');
let rpsel = document.getElementById('rps');
let x2lucklevelel = document.getElementById('x2lucklevel');
let guide = document.getElementById('guide');
let morecloverinterface = document.getElementById('morecloverinterface');
let morerunecostel = document.getElementById('morerunecost');
let morerunelevelel = document.getElementById('morerunelevel');
let moremoneyinterface = document.getElementById('moremoneyinterface')
let moneyaddtext = document.getElementById('moneyaddtext')

//压缩界面
let condenseinterface = document.getElementById('condenseinterface')
let opencondensebutton = document.getElementById('opencondense')
let luckcondense = document.getElementById('luckcondense')
let condenseluck = document.getElementById('condenseluck')
let condenseluckadd = document.getElementById('condenseluckadd')
let moneycondense = document.getElementById('moneycondense')
let clovercondense = document.getElementById('clovercondense')
let condensemoney = document.getElementById('condensemoney')
let condensemoneyadd = document.getElementById('condensemoneyadd')
let condenseclover = document.getElementById('condenseclover')
let condensecloveradd = document.getElementById('condensecloveradd')

function updateUI() {
    luckel.textContent = fmt(game.luck);
    runeel.textContent = game.currentRune;
    drawsel.textContent = game.currentDraws;
    realrunechanceel.textContent = fmt(realrunechance);
    moneyel.textContent = fmt(game.money);
    moneycostel.textContent = fmt(game.moneycost);
    moneytimecostel.textContent = fmt(game.moneytimecost);
    moneylucklevelel.textContent = game.moneylucklevel;
    moneytimelevelel.textContent = game.moneytimelevel;
    moneyaddtext.textContent = fmt(game.moneyadd)
    cloverel.textContent = fmt(game.clover);
    clover1el.textContent = fmt(game.clover);
    x2luckcostel.textContent = fmt(game.x2luckcost);
    getcloverel.textContent = game.currentRune >= 7
        ? fmt(D((game.currentRune - 7) ** 2).add(1).mul(game.cloveradd))
        : 0;
    getluckel.textContent = fmt(game.x2luck1.mul(luckpunishment).mul(game.condense.luckadd));
    cloveraddtext.textContent = fmt(game.cloveradd);
    rpsel.textContent = ((1 / (game.runetime / 1000)) * game.morerunes).toFixed(3);
    x2lucklevelel.textContent = game.x2lucklevel;
    guide.textContent = game.guideText;
    morerunecostel.textContent = fmt(game.morerunecost);
    morerunelevelel.textContent = game.morerunelevel;
    // 压缩幸运
    condenseluck.textContent = fmt(game.maxcondenseluck);
    condenseluckadd.textContent = fmt(game.condense.luckadd);

    // 压缩金钱
    condensemoney.textContent = fmt(game.condense.money);
    condensemoneyadd.textContent = fmt(game.condense.moneyadd);

    // 压缩四叶草
    condenseclover.textContent = fmt(game.condense.clover);
    condensecloveradd.textContent = fmt(game.condense.cloveradd);

    if (game.challenge.cloverchallenge === true) {
        morecloverinterface.classList.remove('hidden');
    }
    if (game.challenge.moneychallenge === true){
        moremoneyinterface.classList.remove('hidden');
    }
    if (game.morerunebutton1 === true) {
        morerune.classList.remove('hidden');
    }
    if (game.opencondensebutton === true) {
        opencondensebutton.classList.remove('hidden')
    }
    if (game.moneycondense === true) {
        moneycondense.classList.remove('hidden')
    }
    if (game.clovercondense === true) {
        clovercondense.classList.remove('hidden')
    }
}