'use strict';





// 界面切换
let luckinterface = document.getElementById('luckinterface');
let cloverinterface = document.getElementById('cloverinterface');
let settingsinterface = document.getElementById('settingsinterface');

function showInterface(name) {
    luckinterface.classList.add('hidden');
    cloverinterface.classList.add('hidden');
    condenseinterface.classList.add('hidden');
    settingsinterface.classList.add('hidden');

    if (name === 'luck') {
        luckinterface.classList.remove('hidden');
        document.body.style.background = '#fffb00';
        document.body.style.color = '#000';
    }
    if (name === 'clover') {
        cloverinterface.classList.remove('hidden');
        document.body.style.background = '#91ff00';
        document.body.style.color = '#000';
    }
    if (name === 'condense') {
        condenseinterface.classList.remove('hidden');
        document.body.style.background = '#3001ffda';
        document.body.style.color = '#fff';
    }
    if (name === 'settings') {
        settingsinterface.classList.remove('hidden');
        document.body.style.background = '#00ffff';
        document.body.style.color = '#000';
    }
}



// ========== 格式化：大于 1e6 才科学计数 ==========
function fmt(d, threshold = 1e6) {
    if (!(d instanceof Decimal)) d = new Decimal(d);

    // 小于阈值，普通数字
    if (d.lt(threshold)) {
        return d.toNumber().toLocaleString('en-US', { maximumFractionDigits: 2 });
    }

    // 大于阈值，科学计数法，保留 2 位小数
    return d.toExponential(2);
}

// ========== 抽奖 ==========
function doDraw() {
    game.currentDraws += game.morerunes;

    // 抽 morerunes 次
    for (let i = 0; i < game.morerunes; i++) {
        while (Math.random() < runechance && game.currentRune < 100) {
            game.currentRune++;
            updateruneChance();
        }
    }

    updateUI();
    if (game.currentRune >= 7) game.guide.g1 = true;
}

// ========== 金钱 ==========
function doMoney() {
    // 基础增长 = currentRune
    // 实际增长 = 基础增长 × moneyadd
    game.money = game.money.add(D(game.currentRune).mul(game.moneyadd).mul(game.condense.moneyadd));
    updateUI();
}

// ========== 增加幸运 ==========
moneyluck.onclick = function () {
    if (game.money.gte(game.moneycost)) {
        game.money = game.money.sub(game.moneycost);
        game.moneycost = game.moneycost.mul(1.3);
        game.luck = game.luck.add(game.x2luck1.mul(game.condense.luckadd).mul(luckpunishment));
        game.moneylucklevel++;
        updateruneChance();
        updateUI();
        SaveSystem.save();
    }
};

// ========== 缩短抽奖时间 ==========
moneytimeel.onclick = function () {
    if (game.runetime <= 10) {
        moneytimemaxel.textContent = "已满级";
    } else if (game.money.gte(game.moneytimecost)) {
        game.money = game.money.sub(game.moneytimecost);
        game.moneytimecost = game.moneytimecost.mul(1.3);
        game.runetime = game.runetime * 0.8;
        if (game.runetime < 10) game.runetime = 10;
        game.moneytimelevel++;
        restartDrawTimer();
        updateUI();
        SaveSystem.save();
    }
};

// ========== 四叶草获取 ==========
function addClover() {
    const base = D((game.currentRune - 7) ** 2).add(1);
    game.clover = game.clover.add(base.mul(game.cloveradd).mul(game.condense.cloveradd));
}

// ========== 定时器重启 ==========
function restartDrawTimer() {
    if (drawTimer !== null) clearInterval(drawTimer);
    drawTimer = setInterval(doDraw, game.runetime);
}

// ========== 更新概率 ==========
function updateruneChance() {
    // 概率 = luck / 2^(currentRune+1)
    const denom = D(2).pow(game.currentRune + 1);
    realrunechance = denom.div(game.luck);
    // 概率封顶 0.95，防止 >= 1
    runechance = Math.min(D(1).div(realrunechance).toNumber(), 0.95);
}



// ========== 指引 ==========
function updateguide() {
    if (game.guide.gcomingsoon) game.guideText = "内容很快更新";
    else if (game.guide.g6) game.guideText = "压缩一次幸运"
    else if (game.guide.g5) game.guideText = "把符文抽取+1升到10级"
    else if (game.guide.g4) game.guideText = "四叶草加成达到81x";
    else if (game.guide.g3) game.guideText = "进行一次四叶草挑战";
    else if (game.guide.g2) game.guideText = "把x2幸运升到5级";
    else if (game.guide.g1) game.guideText = "获取一次四叶草";
}

// ========== 重置存档 ==========
let resetBtn = document.getElementById('resetBtn');
resetBtn.onclick = function () {
    if (confirm('确定要删除存档重新开始吗？')) {
        SaveSystem.reset();
    }
};

// ========== 启动 ==========
SaveSystem.init(game);
showInterface('luck');

if (game.clover.gt(0)) {
    document.getElementById('openclover').classList.remove('hidden');
}
if (game.morerunebutton1) {
    morerune.classList.remove('hidden');
}

updateruneChance();
updateUI();
restartDrawTimer();
setInterval(updateUI, 50);
setInterval(doMoney, moneytime);
setInterval(updateguide, 100);