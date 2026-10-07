'use strict';

const SaveSystem = (function () {
    const SAVE_KEY = 'luckySave';
    let gameRef = null;
    let autoSaveTimer = null;
    let resetting = false;

    // 把 game 里所有 Decimal 转成字符串
    function serialize(game) {
        const out = {};
        for (const key in game) {
            const v = game[key];
            if (v instanceof Decimal) {
                out[key] = { __decimal: v.toString() };
            } else if (v && typeof v === 'object') {
                out[key] = serialize(v);   // 递归嵌套对象
            } else {
                out[key] = v;
            }
        }
        return out;
    }

    // 把字符串还原成 Decimal
    function deserialize(obj) {
        const out = {};
        for (const key in obj) {
            const v = obj[key];
            if (v && typeof v === 'object' && v.__decimal !== undefined) {
                out[key] = new Decimal(v.__decimal);
            } else if (v && typeof v === 'object') {
                out[key] = deserialize(v);
            } else {
                out[key] = v;
            }
        }
        return out;
    }

    function save() {
        if (!gameRef) return false;
        if (resetting) return false;
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify(serialize(gameRef)));
            console.log('[SaveSystem] 已保存');
            return true;
        } catch (err) {
            console.error('[SaveSystem] 保存失败：', err);
            return false;
        }
    }

    function load() {
        if (!gameRef) return false;
        const saved = localStorage.getItem(SAVE_KEY);
        if (!saved) {
            console.log('[SaveSystem] 没有找到存档，使用默认值');
            return false;
        }
        try {
            const data = deserialize(JSON.parse(saved));
            Object.assign(gameRef, data);
            console.log('[SaveSystem] 已读取存档');
            return true;
        } catch (err) {
            console.error('[SaveSystem] 存档解析失败：', err);
            return false;
        }
    }

    function clear() {
        localStorage.removeItem(SAVE_KEY);
    }

    function reset() {
        resetting = true;
        clear();
        location.reload();
    }

    function hasSave() {
        return localStorage.getItem(SAVE_KEY) !== null;
    }

    function startAutoSave(seconds = 10) {
        stopAutoSave();
        autoSaveTimer = setInterval(save, seconds * 1000);
    }

    function stopAutoSave() {
        if (autoSaveTimer !== null) {
            clearInterval(autoSaveTimer);
            autoSaveTimer = null;
        }
    }

    function init(game) {
        gameRef = game;
        resetting = false;
        const loaded = load();
        window.addEventListener('beforeunload', save);
        document.addEventListener('visibilitychange', function () {
            if (document.visibilityState === 'hidden') save();
        });
        return loaded;
    }

    return { init, save, load, clear, reset, hasSave, startAutoSave, stopAutoSave };
})();