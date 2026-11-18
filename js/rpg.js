/* ============================================================
   RPG 规则引擎
   ------------------------------------------------------------
   三档难度、组题、星级、奖金、装备掉落、宝箱、等级称号。
   只负责算，不碰 DOM。
   ============================================================ */
(function (global) {
  'use strict';

  var DIFFS = {
    rookie: {
      key: 'rookie', name: '基础', icon: '🌱', tag: '轻松复习',
      desc: '6 道基础题 · 不限时 · 答错可再答一次',
      pick: 6, timeLimit: 0, penalty: 0, retry: 1,
      coinRate: 1, expRate: 1, drop: 0.45,
      starLine: [0.5, 0.7, 0.9]
    },
    agent: {
      key: 'agent', name: '中级', icon: '🛰️', tag: '标准任务',
      desc: '全部题目 · 不限时 · 答错扣 20 分',
      pick: 0, timeLimit: 0, penalty: 20, retry: 0,
      coinRate: 1.3, expRate: 1.2, drop: 0.7,
      starLine: [0.6, 0.8, 0.95]
    },
    legend: {
      key: 'legend', name: '高级', icon: '🔥', tag: '督察突袭',
      desc: '全部题目 + 已学章节跨区题 · 每题 20 秒 · 答错扣 50 分',
      pick: 0, timeLimit: 20, penalty: 50, retry: 0,
      coinRate: 1.8, expRate: 1.6, drop: 1,
      starLine: [0.8, 0.9, 1]
    }
  };

  function difficultyList() {
    return [DIFFS.rookie, DIFFS.agent, DIFFS.legend];
  }

  function getDifficulty(key) {
    return DIFFS[key] || DIFFS.agent;
  }

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pickWeighted(weights) {
    var total = 0;
    Object.keys(weights).forEach(function (k) { total += weights[k]; });
    var roll = Math.random() * total;
    var keys = Object.keys(weights);
    for (var i = 0; i < keys.length; i++) {
      roll -= weights[keys[i]];
      if (roll <= 0) return Number(keys[i]);
    }
    return Number(keys[keys.length - 1]);
  }

  /**
   * 按难度组装本关题目。
   * rookie：优先选题干较短的选择/判断题，共 6 道
   * agent：本关全部题目
   * legend：本关全部 + 其他关随机 2 道跨区题
   */
  function buildQuestionSet(subjectId, levelId, diffKey) {
    var level = GameSubjects.level(subjectId, levelId);
    if (!level) return { questions: [], extraCount: 0, diff: getDifficulty(diffKey) };
    var diff = getDifficulty(diffKey);
    var all = level.questions.slice();
    var picked;

    if (diff.pick && all.length > diff.pick) {
      var easyIds = {};
      var easy = shuffle(all.filter(function (q) {
        return q.type === 'choice' || q.type === 'judge';
      }));
      picked = easy.slice(0, diff.pick);
      picked.forEach(function (q) { easyIds[q.id] = true; });
      if (picked.length < diff.pick) {
        var rest = shuffle(all.filter(function (q) { return !easyIds[q.id]; }));
        picked = picked.concat(rest.slice(0, diff.pick - picked.length));
      }
    } else {
      picked = shuffle(all);
    }

    var extra = [];
    if (diffKey === 'legend') {
      // 跨区题只从“已挑战过的任务”或“当前任务之前的任务”里抽，
      // 避免第一次玩就抽到后面还没学的章节。
      var allLevels = GameSubjects.levels(subjectId);
      var currentIndex = -1;
      allLevels.forEach(function (lv, idx) {
        if (lv.id === levelId) currentIndex = idx;
      });
      var seen = (GameStore.getProfile().missions) || {};
      var pool = [];
      allLevels.forEach(function (lv, idx) {
        if (lv.id === levelId) return;
        var practiced = seen[lv.id] && Object.keys(seen[lv.id]).length > 0;
        if (practiced || idx < currentIndex) {
          lv.questions.forEach(function (q) { pool.push(q); });
        }
      });
      extra = shuffle(pool).slice(0, 2);
    }

    return {
      questions: shuffle(picked.concat(extra)),
      extraCount: extra.length,
      diff: diff
    };
  }

  function starsFor(correct, total, diffKey) {
    var line = getDifficulty(diffKey).starLine;
    var acc = total ? correct / total : 0;
    if (acc >= line[2]) return 3;
    if (acc >= line[1]) return 2;
    if (acc >= line[0]) return 1;
    return 0;
  }

  function rankFor(stars, accuracy) {
    if (stars >= 3 && accuracy >= 100) return { key: 'S', name: '完美侦查', color: '#f0a03c' };
    if (stars >= 3) return { key: 'A', name: '优秀侦查', color: '#2f9e6e' };
    if (stars === 2) return { key: 'B', name: '合格侦查', color: '#3b7fd4' };
    if (stars === 1) return { key: 'C', name: '勉强交差', color: '#8b95a0' };
    return { key: 'D', name: '行动失败', color: '#c9453a' };
  }

  function rewardFor(diffKey, stars, correct, coinRate) {
    var diff = getDifficulty(diffKey);
    var coins = Math.round((stars * 20 + correct * 4) * diff.coinRate * (1 + (coinRate || 0)));
    var exp = Math.round((correct * 10 + stars * 15) * diff.expRate);
    return { coins: coins, exp: exp };
  }

  function rollDrop(diffKey, stars) {
    if (!stars) return null;
    var diff = getDifficulty(diffKey);
    var chance = diff.drop * (stars >= 3 ? 1 : stars === 2 ? 0.6 : 0.3);
    if (Math.random() > chance) return null;

    var weights = diffKey === 'legend'
      ? { 1: 0.2, 2: 0.35, 3: 0.3, 4: 0.15 }
      : diffKey === 'agent'
        ? { 1: 0.4, 2: 0.35, 3: 0.2, 4: 0.05 }
        : { 1: 0.6, 2: 0.3, 3: 0.1 };

    var rarity = pickWeighted(weights);
    var pool = GameItems.list.filter(function (item) {
      return item.rarity === rarity && item.slot !== 'food';
    });
    if (!pool.length) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }

  /**
   * 宝箱题目：优先从本科目其他关卡抽一道选择/判断题，跨章节复习。
   */
  function chestQuestion(subjectId, excludeLevelId) {
    var pool = [];
    var fallback = [];
    GameSubjects.levels(subjectId).forEach(function (lv) {
      lv.questions.forEach(function (q) {
        if (q.type === 'choice' || q.type === 'judge') {
          if (lv.id !== excludeLevelId) pool.push(q);
          else fallback.push(q);
        }
      });
    });
    var list = pool.length ? pool : fallback;
    if (!list.length) return null;
    return list[Math.floor(Math.random() * list.length)];
  }

  function chestReward(tier, coinRate) {
    var big = tier === 'big';
    var coins = Math.round((big ? rand(80, 150) : rand(30, 60)) * (1 + (coinRate || 0)));
    var item = null;

    if (Math.random() < (big ? 0.7 : 0.35)) {
      var rarity = pickWeighted(big
        ? { 2: 0.45, 3: 0.4, 4: 0.15 }
        : { 1: 0.55, 2: 0.35, 3: 0.1 });
      var pool = GameItems.list.filter(function (i) {
        return i.rarity === rarity && i.slot !== 'food';
      });
      if (pool.length) item = pool[Math.floor(Math.random() * pool.length)];
    }
    if (!item) coins += big ? 60 : 25;
    return { coins: coins, item: item, tier: tier };
  }

  /**
   * 汇总当前穿戴装备的效果。
   */
  function effectsOf(profile) {
    var totals = {
      skip: 0, hint: 0, retry: 0, shield: 0, comboGuard: 0,
      timeBonus: 0, scoreRate: 0, coinRate: 0, penaltyReduce: 0
    };
    if (!profile || !profile.equipped) return totals;
    ['tool', 'weapon', 'armor', 'wings'].forEach(function (slot) {
      var id = profile.equipped[slot];
      var item = id ? GameItems.get(id) : null;
      if (!item) return;
      Object.keys(item.effect || {}).forEach(function (key) {
        var value = item.effect[key];
        if (key === 'penaltyReduce') totals[key] = Math.max(totals[key], value);
        else totals[key] += value;
      });
    });
    return totals;
  }

  function equippedList(profile) {
    var out = [];
    ['tool', 'weapon', 'armor', 'wings'].forEach(function (slot) {
      var id = profile && profile.equipped ? profile.equipped[slot] : null;
      var item = id ? GameItems.get(id) : null;
      out.push({ slot: slot, item: item });
    });
    return out;
  }

  function levelTitle(level) {
    if (level >= 9) return '星图大师';
    if (level >= 7) return '高级侦查员';
    if (level >= 5) return '正式侦查员';
    if (level >= 3) return '初级侦查员';
    return '实习侦查员';
  }

  global.GameRPG = {
    difficultyList: difficultyList,
    getDifficulty: getDifficulty,
    buildQuestionSet: buildQuestionSet,
    starsFor: starsFor,
    rankFor: rankFor,
    rewardFor: rewardFor,
    rollDrop: rollDrop,
    chestQuestion: chestQuestion,
    chestReward: chestReward,
    effectsOf: effectsOf,
    equippedList: equippedList,
    levelTitle: levelTitle
  };
})(window);