/* ============================================================
   本地存档：关卡成绩 / 错题本 / 设置 / 每日练习
   使用 localStorage，键名固定，换浏览器或清缓存会丢失。
   ============================================================ */
(function (global) {
  'use strict';

  var KEY = 'knowledge-quiz.grade7.v1';

  var DEFAULTS = {
    version: 2,
    settings: { sound: true },
    subjects: {},
    wrong: [],
    daily: {},
    profile: {
      level: 1,
      exp: 0,
      coins: 0,
      trust: 0,
      items: {},
      equipped: { tool: null, weapon: null, armor: null, wings: null },
      chests: 0,
      missions: {},
      seen: {},
      introSeen: false
    }
  };

  var data = null;

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function load() {
    if (data) return data;
    data = clone(DEFAULTS);
    try {
      var raw = global.localStorage ? global.localStorage.getItem(KEY) : null;
      if (raw) {
        var parsed = JSON.parse(raw);
        if (parsed && typeof parsed === 'object') {
          data.settings = Object.assign({}, DEFAULTS.settings, parsed.settings || {});
          data.subjects = parsed.subjects || {};
          data.wrong = Array.isArray(parsed.wrong) ? parsed.wrong : [];
          data.daily = parsed.daily || {};
          var profile = parsed.profile || {};
          data.profile = Object.assign({}, DEFAULTS.profile, profile);
          data.profile.items = profile.items || {};
          data.profile.equipped = Object.assign({}, DEFAULTS.profile.equipped, profile.equipped || {});
          data.profile.missions = profile.missions || {};
          data.profile.seen = profile.seen || {};
        }
      }
    } catch (e) {
      /* 隐私模式或不允许本地存储时，退回内存存档 */
      data = clone(DEFAULTS);
    }
    return data;
  }

  function save() {
    try {
      global.localStorage.setItem(KEY, JSON.stringify(load()));
    } catch (e) { /* 忽略写入失败 */ }
  }

  function today() {
    var d = new Date();
    var m = d.getMonth() + 1;
    var day = d.getDate();
    return d.getFullYear() + '-' + (m < 10 ? '0' + m : m) + '-' + (day < 10 ? '0' + day : day);
  }

  /* ---------- 关卡成绩 ---------- */

  function levelProgress(subjectId, levelId) {
    var store = load();
    if (!store.subjects[subjectId]) store.subjects[subjectId] = { levels: {} };
    var sub = store.subjects[subjectId];
    if (!sub.levels) sub.levels = {};
    if (!sub.levels[levelId]) {
      sub.levels[levelId] = { best: 0, stars: 0, plays: 0, correct: 0, answered: 0, lastAt: 0 };
    }
    return sub.levels[levelId];
  }

  /**
   * 记录一次闯关成绩。
   * result: { score, stars, correct, total, maxCombo, duration }
   */
  function recordResult(subjectId, levelId, result) {
    var p = levelProgress(subjectId, levelId);
    var isNewBest = result.score > p.best;
    p.plays += 1;
    p.answered += result.total;
    p.correct += result.correct;
    if (isNewBest) p.best = result.score;
    if (result.stars > p.stars) p.stars = result.stars;
    p.lastAt = Date.now();
    p.bestCombo = Math.max(p.bestCombo || 0, result.maxCombo || 0);
    save();
    return { isNewBest: isNewBest, progress: p };
  }

  function subjectStars(subjectId) {
    var sub = load().subjects[subjectId];
    if (!sub || !sub.levels) return 0;
    var total = 0;
    Object.keys(sub.levels).forEach(function (k) {
      total += sub.levels[k].stars || 0;
    });
    return total;
  }

  function subjectBest(subjectId) {
    var sub = load().subjects[subjectId];
    if (!sub || !sub.levels) return 0;
    var total = 0;
    Object.keys(sub.levels).forEach(function (k) {
      total += sub.levels[k].best || 0;
    });
    return total;
  }

  /* ---------- 错题本 ---------- */

  function wrongKey(subjectId, levelId, questionId) {
    return subjectId + '|' + levelId + '|' + questionId;
  }

  function snapshot(q) {
    return {
      id: q.id,
      type: q.type,
      stem: q.stem,
      options: q.options || null,
      answer: q.answer,
      accept: q.accept || null,
      left: q.left || null,
      right: q.right || null,
      svg: q.svg || null,
      caption: q.caption || null,
      explain: q.explain || '',
      hint: q.hint || ''
    };
  }

  function addWrong(subjectId, levelId, question) {
    var store = load();
    var key = wrongKey(subjectId, levelId, question.id);
    var hit = null;
    store.wrong.forEach(function (item) {
      if (item.key === key) hit = item;
    });
    if (hit) {
      hit.tries += 1;
      hit.lastAt = Date.now();
      hit.snapshot = snapshot(question);
    } else {
      store.wrong.push({
        key: key,
        subjectId: subjectId,
        levelId: levelId,
        questionId: question.id,
        tries: 1,
        lastAt: Date.now(),
        snapshot: snapshot(question)
      });
    }
    save();
  }

  function removeWrong(subjectId, levelId, questionId) {
    var store = load();
    var key = wrongKey(subjectId, levelId, questionId);
    store.wrong = store.wrong.filter(function (item) { return item.key !== key; });
    save();
  }

  function wrongItems(subjectId) {
    var list = load().wrong.slice();
    if (subjectId) {
      list = list.filter(function (item) { return item.subjectId === subjectId; });
    }
    list.sort(function (a, b) { return b.lastAt - a.lastAt; });
    return list;
  }

  function wrongCount(subjectId) {
    return wrongItems(subjectId).length;
  }

  function clearWrong(subjectId) {
    var store = load();
    if (!subjectId) {
      store.wrong = [];
    } else {
      store.wrong = store.wrong.filter(function (item) { return item.subjectId !== subjectId; });
    }
    save();
  }

  /* ---------- 每日练习 ---------- */

  function addDaily(count) {
    var store = load();
    var key = today();
    store.daily[key] = (store.daily[key] || 0) + count;
    save();
  }

  function todayCount() {
    return load().daily[today()] || 0;
  }

  /* ---------- 汇总统计 ---------- */

  function totals() {
    var store = load();
    var answered = 0;
    var correct = 0;
    var stars = 0;
    var best = 0;
    Object.keys(store.subjects).forEach(function (sid) {
      var levels = (store.subjects[sid] && store.subjects[sid].levels) || {};
      Object.keys(levels).forEach(function (lid) {
        var p = levels[lid];
        answered += p.answered || 0;
        correct += p.correct || 0;
        stars += p.stars || 0;
        best += p.best || 0;
      });
    });
    return {
      answered: answered,
      correct: correct,
      accuracy: answered ? Math.round(correct / answered * 100) : 0,
      stars: stars,
      best: best,
      wrong: store.wrong.length
    };
  }

  /* ---------- 侦查员档案（角色成长） ---------- */

  function expNeeded(level) {
    return 100 + (level - 1) * 60;
  }

  function getProfile() {
    return load().profile;
  }

  function addCoins(n) {
    var p = getProfile();
    p.coins = Math.max(0, (p.coins || 0) + Math.round(n));
    save();
    return p.coins;
  }

  function addExp(n) {
    var p = getProfile();
    p.exp = (p.exp || 0) + Math.round(n);
    var ups = 0;
    while (p.exp >= expNeeded(p.level)) {
      p.exp -= expNeeded(p.level);
      p.level += 1;
      ups += 1;
    }
    save();
    return { level: p.level, ups: ups, exp: p.exp, need: expNeeded(p.level) };
  }

  function addTrust(n) {
    var p = getProfile();
    p.trust = Math.max(0, (p.trust || 0) + n);
    save();
    return p.trust;
  }

  function addItem(id, count) {
    var p = getProfile();
    p.items[id] = (p.items[id] || 0) + (count || 1);
    save();
    return p.items[id];
  }

  function removeItem(id, count) {
    var p = getProfile();
    var left = (p.items[id] || 0) - (count || 1);
    if (left > 0) p.items[id] = left;
    else delete p.items[id];
    save();
    return left > 0 ? left : 0;
  }

  function equip(slot, id) {
    var p = getProfile();
    p.equipped[slot] = id;
    save();
  }

  function unequip(slot) {
    var p = getProfile();
    p.equipped[slot] = null;
    save();
  }

  function missionRecord(levelId, diffKey) {
    var p = getProfile();
    if (!p.missions[levelId]) p.missions[levelId] = {};
    if (!p.missions[levelId][diffKey]) {
      p.missions[levelId][diffKey] = { stars: 0, best: 0, plays: 0, lastAt: 0 };
    }
    return p.missions[levelId][diffKey];
  }

  function recordMission(levelId, diffKey, result) {
    var p = getProfile();
    if (!p.missions[levelId]) p.missions[levelId] = {};
    if (!p.missions[levelId][diffKey]) {
      p.missions[levelId][diffKey] = { stars: 0, best: 0, plays: 0, lastAt: 0 };
    }
    var rec = p.missions[levelId][diffKey];
    var isNewBest = result.score > rec.best;
    rec.plays += 1;
    rec.best = Math.max(rec.best, result.score);
    rec.stars = Math.max(rec.stars, result.stars);
    rec.lastAt = Date.now();
    save();
    return { isNewBest: isNewBest, record: rec };
  }

  function bestMissionStars(levelId) {
    var p = getProfile();
    var set = p.missions[levelId] || {};
    var best = 0;
    Object.keys(set).forEach(function (k) {
      best = Math.max(best, set[k].stars || 0);
    });
    return best;
  }

  function seenStory(levelId) {
    return !!getProfile().seen[levelId];
  }

  function markStory(levelId) {
    getProfile().seen[levelId] = true;
    save();
  }

  function introSeen() {
    return !!getProfile().introSeen;
  }

  function markIntroSeen() {
    getProfile().introSeen = true;
    save();
  }

  /* ---------- 设置 ---------- */

  function getSettings() {
    return load().settings;
  }

  function setSetting(key, value) {
    load().settings[key] = value;
    save();
  }

  function resetAll() {
    data = clone(DEFAULTS);
    save();
  }

  global.GameStore = {
    load: load,
    todayCount: todayCount,
    levelProgress: levelProgress,
    recordResult: recordResult,
    subjectStars: subjectStars,
    subjectBest: subjectBest,
    addWrong: addWrong,
    removeWrong: removeWrong,
    wrongItems: wrongItems,
    wrongCount: wrongCount,
    clearWrong: clearWrong,
    addDaily: addDaily,
    totals: totals,
    getSettings: getSettings,
    setSetting: setSetting,
    resetAll: resetAll,
    wrongKey: wrongKey,
    expNeeded: expNeeded,
    getProfile: getProfile,
    addCoins: addCoins,
    addExp: addExp,
    addTrust: addTrust,
    addItem: addItem,
    removeItem: removeItem,
    equip: equip,
    unequip: unequip,
    missionRecord: missionRecord,
    recordMission: recordMission,
    bestMissionStars: bestMissionStars,
    seenStory: seenStory,
    markStory: markStory,
    introSeen: introSeen,
    markIntroSeen: markIntroSeen
  };
})(window);