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
      desc: '6 道最基础的题 · 不限时 · 答错可再答一次',
      pick: 6, order: [1, 2], timeLimit: 0, penalty: 0, retry: 1,
      coinRate: 1, expRate: 1, drop: 0.45,
      starLine: [0.5, 0.7, 0.9]
    },
    agent: {
      key: 'agent', name: '中级', icon: '🛰️', tag: '标准任务',
      desc: '6 道中等题（不够从已学章节补）· 不限时 · 答错扣 20 分',
      pick: 6, order: [2, 1], cross: true, timeLimit: 0, penalty: 20, retry: 0,
      coinRate: 1.3, expRate: 1.2, drop: 0.7,
      starLine: [0.6, 0.8, 0.95]
    },
    legend: {
      key: 'legend', name: '高级', icon: '🔥', tag: '督察突袭',
      desc: '8 道难题（含已学章节）+ 3 道跨区题 · 每题 15 秒 · 答错扣 80 分 · 三星需全对',
      pick: 8, order: [3, 2], cross: true, baseCap: 4, timeLimit: 15, penalty: 80, retry: 0,
      coinRate: 2.1, expRate: 1.8, drop: 1, extra: 3,
      starLine: [0.85, 0.95, 1]
    }
  };

  /* 题目难度：3 难 / 2 中等 / 1 基础。题库里写了 lv 就用 lv，否则按题型和题干推断 */
  function levelOf(q) {
    if (!q) return 2;
    if (q.lv === 1 || q.lv === 2 || q.lv === 3) return q.lv;
    if (q.type === 'fill' || q.type === 'match') return 3;
    if (q.type === 'judge') return 1;
    var s = String(q.stem || '');
    if (/不包括|不属于|错误的是|有误|排序|正确顺序|为什么|原因|分析|说明|比较|判断下列/.test(s)) return 3;
    if (s.length > 28) return 2;
    return s.length <= 14 ? 1 : 2;
  }

  /* 宝箱等级：白 普通 / 绿 精良 / 蓝 稀有 / 黄 传说 / 红 神话 */
  var CHEST_TIERS = [
    { key: 1, name: '普通', color: '#ffffff', soft: 'rgba(255,255,255,.55)', tag: '补给箱' },
    { key: 2, name: '精良', color: '#43d68a', soft: 'rgba(67,214,138,.55)', tag: '补给箱' },
    { key: 3, name: '稀有', color: '#4a9df8', soft: 'rgba(74,157,248,.55)', tag: '宝箱' },
    { key: 4, name: '传说', color: '#f7c744', soft: 'rgba(247,199,68,.55)', tag: '宝箱' },
    { key: 5, name: '神话', color: '#ff4d4d', soft: 'rgba(255,77,77,.55)', tag: '宝箱' }
  ];

  function chestTierInfo(tier) {
    var t = Math.min(5, Math.max(1, Number(tier) || 1));
    return CHEST_TIERS[t - 1];
  }

  /* 掉出几级箱子：小箱 1—2，大箱 3—5，高级难度整体升一级 */
  function rollChestTier(kind, diffKey) {
    var weights = kind === 'big' ? { 3: 0.58, 4: 0.32, 5: 0.1 } : { 1: 0.7, 2: 0.3 };
    var tier = pickWeighted(weights);
    if (diffKey === 'legend') tier = Math.min(5, tier + 1);
    if (diffKey === 'rookie' && kind === 'big') tier = Math.max(1, tier - 1);
    return tier;
  }

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

  /* 题干归一化：去空白、标点、括号里的提示，用来判重 */
  function stemKey(stem) {
    return String(stem || '')
      .replace(/[（(][^）)]*[）)]/g, '')
      .replace(/[\s，。、；：！？,.;:!?"'“”‘’《》·\-—_/\\|]/g, '')
      .toLowerCase();
  }

  /* 按 id 与题干双重去重，保留第一次出现的题目 */
  function uniqueQuestions(list) {
    var seenId = {};
    var seenStem = {};
    var out = [];
    list.forEach(function (q) {
      if (!q) return;
      var sk = stemKey(q.stem);
      if (q.id) {
        if (seenId[q.id]) return;
      }
      if (sk && seenStem[sk]) return;
      if (q.id) seenId[q.id] = true;
      if (sk) seenStem[sk] = true;
      out.push(q);
    });
    return out;
  }

  /* 按难度顺序取题：每一层先取本关，再取已学章节；不够再放宽 */
  function pickByLevels(base, cross, order, count, capBase) {
    var out = [];
    var taken = {};
    var need = count || 0;
    var fromBase = 0;

    function takeFrom(list, lv, isBase) {
      shuffle(list).forEach(function (q) {
        if (need && out.length >= need) return;
        if (capBase && isBase && fromBase >= capBase) return;
        if (taken[q.id]) return;
        if (levelOf(q) === lv) {
          out.push(q); taken[q.id] = true;
          if (isBase) fromBase += 1;
        }
      });
    }

    order.forEach(function (lv) {
      if (need && out.length >= need) return;
      takeFrom(base, lv, true);
      takeFrom(cross, lv, false);
    });

    if (need && out.length < need) {
      [base, cross].forEach(function (src) {
        shuffle(src).forEach(function (q) {
          if (out.length >= need) return;
          if (taken[q.id]) return;
          out.push(q); taken[q.id] = true;
        });
      });
    }

    return out;
  }

  /* 可用的跨区题：只从已挑战过的任务、或当前任务之前的任务里取 */
  function crossPool(subjectId, levelId) {
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
    return uniqueQuestions(pool);
  }

  /**
   * 按难度组装本关题目，三档的题目集合刻意错开：
   * rookie：只在本关挑最基础的 6 道
   * agent：本关中等题优先，不够就从已学章节补中等题，共 6 道
   * legend：本关与已学章节的难题优先，凑 8 道，再追加 3 道跨区题
   * 无论哪档，同一局里不会出现 id 或题干重复的题目。
   */
  function buildQuestionSet(subjectId, levelId, diffKey) {
    var level = GameSubjects.level(subjectId, levelId);
    if (!level) return { questions: [], extraCount: 0, diff: getDifficulty(diffKey) };
    var diff = getDifficulty(diffKey);
    var base = uniqueQuestions(level.questions.slice());
    var cross = diff.cross ? crossPool(subjectId, levelId) : [];
    var picked = pickByLevels(base, cross, diff.order || [1, 2, 3], diff.pick || (base.length + cross.length), diff.baseCap || 0);

    var extra = [];
    if (diff.extra) {
      var pickedIds = {};
      picked.forEach(function (q) { pickedIds[q.id] = true; });
      var rest = cross.filter(function (q) { return !pickedIds[q.id]; });
      extra = pickByLevels([], rest, [3, 2, 1], diff.extra);
    }

    var merged = uniqueQuestions(picked.concat(extra));
    return {
      questions: shuffle(merged),
      extraCount: Math.max(0, merged.length - picked.length),
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
   * 本关的题目不会出现在宝箱里，避免刚答过的题又冒出来。
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
    var list = uniqueQuestions(pool.length ? pool : fallback);
    if (!list.length) return null;
    return list[Math.floor(Math.random() * list.length)];
  }

  /**
   * 宝箱奖励。tier 可以是 1—5 的等级，也可以是旧的 'small' / 'big'。
   */
  function chestReward(tier, coinRate) {
    var level = tier === 'small' ? 2 : tier === 'big' ? 4 : Math.min(5, Math.max(1, Number(tier) || 1));
    var info = chestTierInfo(level);
    var coins = Math.round((10 + level * 22 + rand(0, 18)) * (1 + (coinRate || 0)));
    var item = null;

    // 箱子等级越高，出好装备的概率与保底稀有度越高
    var chance = [0, 0.3, 0.45, 0.62, 0.78, 0.9][level];
    if (Math.random() < chance) {
      var weights = level <= 2
        ? { 1: 0.6, 2: 0.35, 3: 0.05 }
        : level === 3
          ? { 1: 0.15, 2: 0.55, 3: 0.3 }
          : level === 4
            ? { 2: 0.3, 3: 0.5, 4: 0.2 }
            : { 3: 0.35, 4: 0.65 };
      var rarity = pickWeighted(weights);
      var pool = GameItems.list.filter(function (i) {
        return i.rarity === rarity && i.slot !== 'food';
      });
      if (pool.length) item = pool[Math.floor(Math.random() * pool.length)];
    }
    if (!item) coins += level * 18;
    return { coins: coins, item: item, tier: level, tierInfo: info };
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
    chestTiers: CHEST_TIERS,
    chestTierInfo: chestTierInfo,
    rollChestTier: rollChestTier,
    buildQuestionSet: buildQuestionSet,
    levelOf: levelOf,
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