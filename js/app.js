/* ============================================================
   页面路由与界面
   ------------------------------------------------------------
   #/                         侦查员基地（首页）
   #/subject/:sid             任务列表（按章节）
   #/brief/:sid/:lid          任务简报 + 选择难度
   #/play/:sid/:lid/:diff     执行任务（答题）
   #/review/:sid              错题重练
   #/result                   任务报告
   #/bag                      装备舱
   #/wrong                    错题本
   #/stats                    学习报告
   ============================================================ */
(function (global) {
  'use strict';

  var view = document.getElementById('view');
  var backBtn = document.getElementById('backBtn');
  var soundBtn = document.getElementById('soundBtn');
  var wrongBtn = document.getElementById('wrongBtn');
  var brandText = document.getElementById('brandText');

  var lastResult = null;
  var currentQuiz = null;
  var reviewQueue = null;
  var selectedDiff = 'agent';
  var modalEl = null;
  var introIndex = 0;
  var introKeyHandler = null;

  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];

  /* ---------- 工具 ---------- */

  function esc(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function starsHTML(stars, max) {
    var out = '';
    for (var i = 0; i < (max || 3); i++) {
      out += i < stars ? '<span class="on">★</span>' : '<span>★</span>';
    }
    return out;
  }

  function progressOf(subjectId, levelId) {
    var sub = GameStore.load().subjects[subjectId];
    return (sub && sub.levels && sub.levels[levelId]) || null;
  }

  function starsOf(subjectId, levelId) {
    var p = progressOf(subjectId, levelId);
    return p ? p.stars || 0 : 0;
  }

  function go(hash) {
    var next = hash.charAt(0) === '#' ? hash : '#' + hash;
    if (location.hash === next) render();
    else location.hash = next;
  }

  function refreshWrongBadge() {
    var count = GameStore.wrongCount();
    wrongBtn.title = count ? '错题本（' + count + ' 题）' : '错题本';
  }

  function setChrome(opts) {
    opts = opts || {};
    brandText.innerHTML = esc(opts.title || '知识闯关') +
      '<small>' + esc(opts.sub || '七年级 · 复习与预习') + '</small>';
    if (opts.back) {
      backBtn.hidden = false;
      backBtn.onclick = function () { go(opts.back); };
    } else {
      backBtn.hidden = true;
      backBtn.onclick = null;
    }
    soundBtn.textContent = GameStore.getSettings().sound !== false ? '🔊' : '🔇';
    refreshWrongBadge();
  }

  function notFound(message) {
    view.innerHTML = '<div class="empty" style="margin-top:20px"><span class="big">🛰️</span>' +
      esc(message || '这条航线上什么都没有。') +
      '<div style="margin-top:16px"><button class="btn primary" id="homeBtn">返回基地</button></div></div>';
    document.getElementById('homeBtn').onclick = function () { go('#/'); };
  }

  function colorOfRarity(rarity) {
    var r = GameItems.rarity[rarity];
    return r ? r.color : '#8b95a0';
  }

  function itemChip(item) {
    if (!item) return '';
    return '<span class="item-chip r' + item.rarity + '">' + item.icon + ' ' + esc(item.name) + '</span>';
  }

  function effectsSummary(effects) {
    var parts = [];
    if (effects.skip) parts.push('跳过 ×' + effects.skip);
    if (effects.hint) parts.push('扫描 ×' + effects.hint);
    if (effects.retry) parts.push('重答 ×' + effects.retry);
    if (effects.shield) parts.push('护盾 ×' + effects.shield);
    if (effects.comboGuard) parts.push('连击保护 ×' + effects.comboGuard);
    if (effects.timeBonus) parts.push('每题 +' + effects.timeBonus + ' 秒');
    if (effects.scoreRate) parts.push('得分 +' + Math.round(effects.scoreRate * 100) + '%');
    if (effects.coinRate) parts.push('金币 +' + Math.round(effects.coinRate * 100) + '%');
    if (effects.penaltyReduce) parts.push('扣分 −' + Math.round(effects.penaltyReduce * 100) + '%');
    return parts.length ? parts.join(' · ') : '暂无装备加成';
  }

  /* ---------- 弹窗 ---------- */

  function closeModal() {
    if (modalEl && modalEl.parentNode) modalEl.parentNode.removeChild(modalEl);
    modalEl = null;
    document.removeEventListener('keydown', onModalKey);
  }

  function onModalKey(ev) {
    if (ev.key === 'Escape') closeModal();
  }

  function openModal(innerHTML, onMount) {
    closeModal();
    modalEl = document.createElement('div');
    modalEl.className = 'modal-mask';
    modalEl.innerHTML = '<div class="modal" role="dialog" aria-modal="true">' + innerHTML + '</div>';
    document.body.appendChild(modalEl);
    modalEl.addEventListener('click', function (ev) {
      if (ev.target === modalEl) closeModal();
    });
    document.addEventListener('keydown', onModalKey);
    if (onMount) onMount(modalEl);
  }

  /* ---------- 开场漫画 ---------- */

  function renderIntro() {
    introIndex = 0;

    view.innerHTML =
      '<div class="comic">' +
        '<div class="comic-top">' +
          '<span class="comic-label">开场漫画 · K-7 的来历</span>' +
          '<button class="btn ghost small" id="skipIntro" type="button">跳过</button>' +
        '</div>' +
        '<div class="comic-page" id="comicPage">' +
          '<div class="comic-art" id="comicArt"></div>' +
          '<div class="comic-copy" id="comicCopy"></div>' +
        '</div>' +
        '<div class="comic-nav">' +
          '<button class="btn ghost small" id="comicPrev" type="button">上一格</button>' +
          '<div class="comic-dots" id="comicDots"></div>' +
          '<button class="btn primary" id="comicNext" type="button">下一格</button>' +
        '</div>' +
      '</div>';

    var art = document.getElementById('comicArt');
    var copy = document.getElementById('comicCopy');
    var dots = document.getElementById('comicDots');
    var prev = document.getElementById('comicPrev');
    var next = document.getElementById('comicNext');
    var pageEl = document.getElementById('comicPage');
    var pages = GameIntro.pages;

    dots.innerHTML = pages.map(function (_, i) {
      return '<i data-dot="' + i + '"></i>';
    }).join('');

    function paint() {
      var page = pages[introIndex];
      art.innerHTML = page.art;
      copy.innerHTML =
        '<span class="comic-tag">' + esc(page.tag) + '</span>' +
        '<p class="comic-narration">' + esc(page.narration) + '</p>' +
        (page.quote
          ? '<div class="comic-quote"><b>' + esc(page.quote.who) + '：</b>' + esc(page.quote.text) + '</div>'
          : '') +
        (page.note ? '<div class="comic-note">' + esc(page.note) + '</div>' : '');
      prev.disabled = introIndex === 0;
      next.textContent = introIndex >= pages.length - 1 ? '降落地球' : '下一格';
      Array.prototype.forEach.call(dots.children, function (dot, i) {
        dot.className = i === introIndex ? 'on' : '';
      });
    }

    function finishIntro() {
      GameStore.markIntroSeen();
      GameAudio.play('finish');
      go('#/');
    }

    next.addEventListener('click', function () {
      if (introIndex >= pages.length - 1) {
        finishIntro();
        return;
      }
      introIndex += 1;
      GameAudio.play('click');
      paint();
    });

    prev.addEventListener('click', function () {
      if (introIndex <= 0) return;
      introIndex -= 1;
      GameAudio.play('click');
      paint();
    });

    dots.addEventListener('click', function (ev) {
      var dot = ev.target && ev.target.getAttribute ? ev.target.getAttribute('data-dot') : null;
      if (dot === null || dot === undefined) return;
      introIndex = Number(dot);
      paint();
    });

    document.getElementById('skipIntro').addEventListener('click', finishIntro);

    var touchStartX = null;
    pageEl.addEventListener('touchstart', function (ev) {
      touchStartX = ev.touches[0].clientX;
    }, { passive: true });
    pageEl.addEventListener('touchend', function (ev) {
      if (touchStartX === null) return;
      var dx = ev.changedTouches[0].clientX - touchStartX;
      touchStartX = null;
      if (Math.abs(dx) < 44) return;
      if (dx < 0 && introIndex < pages.length - 1) {
        introIndex += 1;
        paint();
      } else if (dx > 0 && introIndex > 0) {
        introIndex -= 1;
        paint();
      }
    }, { passive: true });

    if (introKeyHandler) document.removeEventListener('keydown', introKeyHandler);
    introKeyHandler = function (ev) {
      if (location.hash !== '#/intro') return;
      if (ev.key === 'ArrowRight') next.click();
      else if (ev.key === 'ArrowLeft' && !prev.disabled) prev.click();
    };
    document.addEventListener('keydown', introKeyHandler);

    paint();
  }

  /* ---------- 首页 ---------- */

  function agentCardHTML() {
    var p = GameStore.getProfile();
    var need = GameStore.expNeeded(p.level);
    var pct = Math.min(100, Math.round((p.exp || 0) / need * 100));
    var gear = GameRPG.equippedList(p).filter(function (x) { return x.item; })
      .map(function (x) { return x.item.icon; }).join(' ');
    return '<section class="agent-card">' +
      '<div class="agent-avatar">👽<span class="agent-lv">Lv.' + p.level + '</span></div>' +
      '<div class="agent-main">' +
        '<div class="agent-top"><b>K-7</b><span class="agent-title">' + esc(GameRPG.levelTitle(p.level)) + '</span></div>' +
        '<div class="exp-bar"><i style="width:' + pct + '%"></i></div>' +
        '<div class="agent-meta">' +
          '<span>EXP ' + (p.exp || 0) + '/' + need + '</span>' +
          '<span>🪙 ' + (p.coins || 0) + '</span>' +
          '<span>🛡 信任 ' + (p.trust || 0) + '</span>' +
          '<span class="agent-gear">' + (gear || '装备舱空着') + '</span>' +
        '</div>' +
      '</div>' +
      '<button class="icon-btn" id="toBag" title="装备舱" type="button">🎒</button>' +
      '</section>';
  }

  function renderHome() {
    var subjects = GameSubjects.all();
    var playable = GameSubjects.playable();
    var totals = GameStore.totals();

    var levelTotal = playable.reduce(function (n, s) { return n + s.levels.length; }, 0);
    var levelDone = playable.reduce(function (n, s) {
      return n + s.levels.filter(function (lv) { return starsOf(s.id, lv.id) > 0; }).length;
    }, 0);
    var starMax = levelTotal * 3;

    var cards = subjects.map(function (s) {
      if (s.available === false) {
        return '<div class="subject-card placeholder">' +
          '<span class="s-tag">接口已预留</span>' +
          '<span class="s-top"><span class="s-icon">' + esc(s.icon) + '</span>' +
          '<span class="s-name">' + esc(s.name) + '</span></span>' +
          '<span class="s-desc">' + esc(s.desc || '题库制作中，欢迎继续补充。') + '</span>' +
          '<span class="s-meta">新增 data/' + esc(s.id) + '.js 并注册即可开玩</span>' +
          '</div>';
      }
      var done = s.levels.filter(function (lv) { return starsOf(s.id, lv.id) > 0; }).length;
      var stars = GameStore.subjectStars(s.id);
      var pct = s.levels.length ? Math.round(done / s.levels.length * 100) : 0;
      return '<button class="subject-card" type="button" data-subject="' + esc(s.id) + '">' +
        '<span class="s-tag">' + (done ? '继续任务' : '接受任务') + '</span>' +
        '<span class="s-top"><span class="s-icon">' + esc(s.icon) + '</span>' +
        '<span class="s-name">' + esc(s.name) + '</span></span>' +
        '<span class="s-desc">' + esc(s.desc) + '</span>' +
        '<span class="s-meta"><span>' + done + '/' + s.levels.length + ' 任务</span>' +
        '<span>★ ' + stars + '/' + s.levels.length * 3 + '</span></span>' +
        '<span class="mini-bar"><i style="width:' + pct + '%"></i></span>' +
        '</button>';
    }).join('');

    var wrongCount = GameStore.wrongCount();
    var p = GameStore.getProfile();

    view.innerHTML =
      agentCardHTML() +
      '<section class="hero">' +
        '<h1>总部正在等你的汇报</h1>' +
        '<p class="hero-sub">完成任务、应付突击检查，把地球星图一点点补全。答错会被督察追问，连续答对能截获补给箱。</p>' +
        '<div class="hero-stats">' +
          '<div class="hs"><b>' + levelDone + '/' + levelTotal + '</b><span>已完成任务</span></div>' +
          '<div class="hs"><b>' + totals.stars + '/' + starMax + '</b><span>获得星星</span></div>' +
          '<div class="hs"><b>' + GameStore.todayCount() + '</b><span>今日情报量</span></div>' +
          '<div class="hs"><b>' + totals.accuracy + '%</b><span>累计正确率</span></div>' +
        '</div>' +
      '</section>' +
      '<div class="section-head"><h2>选择侦查区域</h2><span class="hint">地理已上线，其余科目接口已就绪</span></div>' +
      '<div class="subject-grid">' + cards + '</div>' +
      '<div class="section-head"><h2>基地终端</h2></div>' +
      '<div class="tools">' +
        '<button class="tool-card" type="button" id="toolBag">' +
          '<span class="t-ico">🎒</span>' +
          '<span><span class="t-title">装备舱</span><br><span class="t-sub">穿戴装备 · 使用补给</span></span>' +
          '<span class="t-badge ghost-badge">' + Object.keys(p.items || {}).length + '</span>' +
        '</button>' +
        '<button class="tool-card" type="button" id="toolWrong">' +
          '<span class="t-ico">📕</span>' +
          '<span><span class="t-title">错题本</span><br><span class="t-sub">被督察抓到的漏洞</span></span>' +
          (wrongCount ? '<span class="t-badge">' + wrongCount + '</span>' : '') +
        '</button>' +
        '<button class="tool-card" type="button" id="toolStats">' +
          '<span class="t-ico">📊</span>' +
          '<span><span class="t-title">学习报告</span><br><span class="t-sub">看看这周练了多少</span></span>' +
        '</button>' +
        '<button class="tool-card" type="button" id="toolSettings">' +
          '<span class="t-ico">⚙️</span>' +
          '<span><span class="t-title">设置</span><br><span class="t-sub">音效 · 清空进度</span></span>' +
        '</button>' +
      '</div>';

    view.querySelectorAll('[data-subject]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        GameAudio.play('click');
        go('#/subject/' + btn.getAttribute('data-subject'));
      });
    });
    document.getElementById('toBag').onclick = function () { go('#/bag'); };
    document.getElementById('toolBag').onclick = function () { go('#/bag'); };
    document.getElementById('toolWrong').onclick = function () { go('#/wrong'); };
    document.getElementById('toolStats').onclick = function () { go('#/stats'); };
    document.getElementById('toolSettings').onclick = openSettings;
  }

  /* ---------- 任务列表 ---------- */

  function renderSubject(subjectId) {
    var subject = GameSubjects.get(subjectId);
    if (!subject || subject.available === false) {
      notFound('这个区域还没有任务数据。');
      return;
    }
    var profile = GameStore.getProfile();

    var cards = subject.levels.map(function (lv, i) {
      var best = GameStore.bestMissionStars(lv.id);
      var p = progressOf(subject.id, lv.id);
      var recs = (profile.missions && profile.missions[lv.id]) || {};
      var dots = ['rookie', 'agent', 'legend'].map(function (key) {
        var d = GameRPG.getDifficulty(key);
        var rec = recs[key];
        return '<span class="dd' + (rec ? ' done' : '') + '">' + d.icon +
          (rec ? '<b>' + rec.stars + '★</b>' : '<i>·</i>') + '</span>';
      }).join('');

      return '<button class="level-card" type="button" data-level="' + esc(lv.id) + '">' +
        '<span class="level-idx">' + (i + 1) + '</span>' +
        '<span class="level-main">' +
          '<span class="level-title">' + esc(lv.title) + '</span>' +
          '<span class="level-sub">' + esc(lv.subtitle || '') +
            (lv.questions.length ? ' · ' + lv.questions.length + ' 题' : '') +
          '</span>' +
          '<span class="diff-dots">' + dots + '</span>' +
        '</span>' +
        '<span class="level-side">' +
          '<span class="stars">' + starsHTML(best) + '</span>' +
          '<span class="level-best">' + (p && p.best ? '最高 ' + p.best + ' 分' : '未执行') + '</span>' +
        '</span>' +
        '</button>';
    }).join('');

    view.innerHTML =
      '<div class="page-head">' +
        '<h1>' + esc(subject.icon) + ' ' + esc(subject.name) + '任务列表</h1>' +
        '<p>' + esc(subject.desc || '') + ' 共 ' + subject.levels.length + ' 个任务，每个任务可选基础 / 中级 / 高级。</p>' +
      '</div>' +
      '<div class="level-list">' + cards + '</div>' +
      '<div class="legend">🌱 基础：6 题，不限时，可重答一次；🛰️ 中级：全题，答错扣分；🔥 高级：全题 + 跨区题，每题限时 20 秒。' +
      '难度越高，奖金、经验和装备品质越好。</div>';

    view.querySelectorAll('[data-level]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        GameAudio.play('click');
        go('#/brief/' + subject.id + '/' + btn.getAttribute('data-level'));
      });
    });
  }

  /* ---------- 任务简报 ---------- */

  function renderBrief(subjectId, levelId) {
    var subject = GameSubjects.get(subjectId);
    var level = GameSubjects.level(subjectId, levelId);
    if (!subject || !level) {
      notFound('找不到这个任务。');
      return;
    }
    var mission = GameMissions.get(levelId) || {
      code: level.title,
      brief: level.subtitle || '',
      check: '督察：开始吧，别让我失望。',
      pass: '',
      fail: ''
    };
    var profile = GameStore.getProfile();
    var effects = GameRPG.effectsOf(profile);
    var best = GameStore.bestMissionStars(levelId);

    var diffCards = GameRPG.difficultyList().map(function (d) {
      return '<button class="diff-card' + (d.key === selectedDiff ? ' selected' : '') +
        '" type="button" data-diff="' + d.key + '">' +
        '<span class="dc-head"><span class="dc-icon">' + d.icon + '</span>' +
        '<b>' + d.name + '</b><span class="dc-tag">' + d.tag + '</span></span>' +
        '<span class="dc-desc">' + esc(d.desc) + '</span>' +
        '<span class="dc-rate">奖金 ×' + d.coinRate + ' · 经验 ×' + d.expRate + '</span>' +
        '</button>';
    }).join('');

    view.innerHTML =
      '<div class="brief-card">' +
        '<div class="brief-top"><span class="brief-badge">' + esc(mission.code) + '</span>' +
          (best ? '<span class="brief-clear stars">' + starsHTML(best) + '</span>' : '') +
        '</div>' +
        '<p class="brief-text">' + esc(mission.brief) + '</p>' +
        '<p class="brief-check">' + esc(mission.check) + '</p>' +
      '</div>' +
      '<div class="section-head"><h2>选择任务难度</h2><span class="hint">难度越高，回报越好</span></div>' +
      '<div class="diff-grid">' + diffCards + '</div>' +
      '<div class="gear-panel">' +
        '<div class="gp-title">当前装备加成</div>' +
        '<div class="gp-body">' + esc(effectsSummary(effects)) + '</div>' +
        '<button class="btn ghost small" id="briefBag" type="button">去装备舱调整</button>' +
      '</div>' +
      '<div class="brief-actions"><button class="btn primary" id="startMission" type="button">' +
        '接受任务 · ' + GameRPG.getDifficulty(selectedDiff).name + '</button></div>';

    view.querySelectorAll('[data-diff]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        selectedDiff = btn.getAttribute('data-diff');
        GameAudio.play('click');
        view.querySelectorAll('[data-diff]').forEach(function (b) {
          b.classList.toggle('selected', b.getAttribute('data-diff') === selectedDiff);
        });
        document.getElementById('startMission').textContent =
          '接受任务 · ' + GameRPG.getDifficulty(selectedDiff).name;
      });
    });
    document.getElementById('briefBag').onclick = function () { go('#/bag'); };
    document.getElementById('startMission').onclick = function () {
      var diff = GameRPG.getDifficulty(selectedDiff);
      GameStore.markStory(levelId);
      go('#/play/' + subjectId + '/' + levelId + '/' + (diff.key || 'agent'));
    };
  }

  /* ---------- 执行任务 ---------- */

  function renderPlay(subjectId, levelId, diffKey) {
    var subject = GameSubjects.get(subjectId);
    var level = GameSubjects.level(subjectId, levelId);
    if (!subject || !level) {
      notFound('找不到这个任务。');
      return;
    }
    var diff = GameRPG.getDifficulty(diffKey);
    var built = GameRPG.buildQuestionSet(subjectId, levelId, diff.key);
    var effects = GameRPG.effectsOf(GameStore.getProfile());
    var mission = GameMissions.get(levelId) || {};

    view.innerHTML = '<div class="play-wrap"><div id="quizMount"></div></div>';

    currentQuiz = GameQuiz.start({
      mount: document.getElementById('quizMount'),
      questions: built.questions,
      difficulty: diff,
      effects: effects,
      followUps: GameMissions.followUps(levelId),
      onChest: function (info) {
        openChest(info.tier, subjectId, levelId, effects.coinRate);
      },
      onAnswer: function (info) {
        if (!info.correct && !info.skipped) {
          GameStore.addWrong(subjectId, levelId, info.question);
          refreshWrongBadge();
        }
      },
      onComplete: function (session) {
        var rec = GameStore.recordMission(levelId, diff.key, {
          score: session.score,
          stars: session.stars
        });
        GameStore.recordResult(subjectId, levelId, session);
        GameStore.addDaily(session.total);

        var reward = GameRPG.rewardFor(diff.key, session.stars, session.correct, effects.coinRate);
        var coinsAfter = GameStore.addCoins(reward.coins);
        var expResult = GameStore.addExp(reward.exp);
        var drop = GameRPG.rollDrop(diff.key, session.stars);
        if (drop) GameStore.addItem(drop.id, 1);
        if (session.trust) GameStore.addTrust(session.trust);

        lastResult = {
          mode: 'level',
          subjectId: subjectId,
          subjectName: subject.name,
          levelId: levelId,
          levelTitle: mission.code || level.title,
          diffKey: diff.key,
          diffName: diff.name,
          session: session,
          isNewBest: rec.isNewBest && session.score > 0,
          reward: reward,
          coinsAfter: coinsAfter,
          expResult: expResult,
          drop: drop,
          rank: GameRPG.rankFor(session.stars, session.accuracy)
        };
        go('#/result');
      }
    });
  }

  function renderReview(subjectId) {
    var subject = GameSubjects.get(subjectId);
    if (!subject) {
      notFound();
      return;
    }
    var questions = [];
    if (reviewQueue && reviewQueue.subjectId === subjectId && reviewQueue.questions.length) {
      questions = reviewQueue.questions.slice();
    } else {
      questions = GameStore.wrongItems(subjectId).map(function (item) {
        var q = Object.assign({}, item.snapshot);
        q.subjectId = item.subjectId;
        q.levelId = item.levelId;
        return q;
      });
    }

    if (!questions.length) {
      view.innerHTML = '<div class="empty"><span class="big">🎉</span>本科目错题已经练完了！' +
        '<div style="margin-top:16px"><button class="btn primary" id="backWrong">回错题本</button></div></div>';
      document.getElementById('backWrong').onclick = function () { go('#/wrong'); };
      return;
    }

    view.innerHTML = '<div class="play-wrap"><div id="quizMount"></div></div>';

    currentQuiz = GameQuiz.start({
      mount: document.getElementById('quizMount'),
      questions: questions,
      difficulty: { key: 'review', timeLimit: 0, penalty: 0, retry: 0, starLine: [0.5, 0.7, 0.9] },
      effects: GameRPG.effectsOf(GameStore.getProfile()),
      followUps: {},
      onAnswer: function (info) {
        var sid = info.question.subjectId || subjectId;
        var lid = info.question.levelId;
        if (info.correct) GameStore.removeWrong(sid, lid, info.question.id);
        else GameStore.addWrong(sid, lid, info.question);
        refreshWrongBadge();
      },
      onComplete: function (session) {
        GameStore.addDaily(session.total);
        lastResult = {
          mode: 'review',
          subjectId: subject.id,
          subjectName: subject.name,
          levelId: null,
          levelTitle: reviewQueue && reviewQueue.label ? reviewQueue.label : '错题重练',
          diffKey: 'review',
          diffName: '复习',
          session: session,
          isNewBest: false,
          reward: { coins: 0, exp: 0 },
          expResult: { ups: 0, level: GameStore.getProfile().level },
          drop: null,
          rank: GameRPG.rankFor(session.stars, session.accuracy)
        };
        reviewQueue = null;
        go('#/result');
      }
    });
  }

  /* ---------- 宝箱 ---------- */

  function openChest(tier, subjectId, excludeLevelId, coinRate) {
    var q = GameRPG.chestQuestion(subjectId, excludeLevelId);
    if (!q) return;
    var big = tier === 'big';
    var mask = document.createElement('div');
    mask.className = 'chest-mask';
    mask.innerHTML = '<div class="chest-box' + (big ? ' big' : '') + '">' +
      '<div class="chest-orb">' + (big ? '🎁' : '📦') + '</div>' +
      '<h2>' + (big ? '截获大宝箱' : '发现补给箱') + '</h2>' +
      '<p class="chest-sub">督察给箱子上了锁：答对这道题才能打开。</p>' +
      '<div class="chest-q">' +
        '<div class="qstem">' + esc(q.stem) + '</div>' +
        '<div class="chest-options">' +
          (q.type === 'choice'
            ? q.options.map(function (t, i) {
                return '<button class="chest-option" type="button" data-i="' + i + '">' +
                  '<b>' + LETTERS[i] + '</b> ' + esc(t) + '</button>';
              }).join('')
            : '<button class="chest-option" type="button" data-v="true"><b>✔</b> 正确</button>' +
              '<button class="chest-option" type="button" data-v="false"><b>✘</b> 错误</button>') +
        '</div>' +
      '</div>' +
      '<div class="chest-result"></div>' +
      '<button class="btn primary" id="chestClose" type="button" hidden>继续侦查</button>' +
      '</div>';
    document.body.appendChild(mask);

    var options = mask.querySelectorAll('.chest-option');
    var result = mask.querySelector('.chest-result');
    var close = mask.querySelector('#chestClose');
    var done = false;

    options.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (done) return;
        done = true;
        var correct = q.type === 'choice'
          ? Number(btn.getAttribute('data-i')) === Number(q.answer)
          : btn.getAttribute('data-v') === String(q.answer);
        options.forEach(function (b) {
          b.disabled = true;
          var isRight = q.type === 'choice'
            ? Number(b.getAttribute('data-i')) === Number(q.answer)
            : b.getAttribute('data-v') === String(q.answer);
          if (isRight) b.classList.add('correct');
        });
        if (!correct) btn.classList.add('wrong');

        if (correct) {
          var reward = GameRPG.chestReward(tier, coinRate);
          GameStore.addCoins(reward.coins);
          if (reward.item) GameStore.addItem(reward.item.id, 1);
          result.innerHTML = '<div class="chest-win">箱子开了！🪙 +' + reward.coins +
            (reward.item ? '<br>获得 ' + itemChip(reward.item) : '') + '</div>';
          close.textContent = '收下奖励';
          GameAudio.play('finish');
        } else {
          GameStore.addCoins(10);
          result.innerHTML = '<div class="chest-lose">箱子溜走了……督察留给你 10 金币作为安慰。</div>';
          close.textContent = '继续侦查';
          GameAudio.play('wrong');
        }
        close.hidden = false;
        close.focus();
      });
    });

    close.addEventListener('click', function () {
      if (mask.parentNode) mask.parentNode.removeChild(mask);
    });
  }

  /* ---------- 任务报告 ---------- */

  function formatDuration(seconds) {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    return m ? m + ' 分 ' + s + ' 秒' : s + ' 秒';
  }

  function renderResult() {
    if (!lastResult) {
      go('#/');
      return;
    }
    var r = lastResult;
    var session = r.session;
    var wrongAnswers = session.answers.filter(function (a) { return !a.correct; });
    var p = GameStore.getProfile();
    var need = GameStore.expNeeded(p.level);
    var expPct = Math.min(100, Math.round((p.exp || 0) / need * 100));

    var rank = r.rank || GameRPG.rankFor(session.stars, session.accuracy);
    var wrongHTML = wrongAnswers.map(function (a) {
      var q = a.question;
      return '<div class="review-item">' +
        '<div class="review-stem">' + esc(q.stem) + '</div>' +
        (q.svg ? '<figure class="qvisual">' + q.svg + '</figure>' : '') +
        '<div class="review-line">正确答案：<b>' + esc(GameQuiz.answerText(q)) + '</b></div>' +
        (q.explain ? '<div class="review-line">' + esc(q.explain) + '</div>' : '') +
        '</div>';
    }).join('');

    var rewardHTML = r.mode === 'level'
      ? '<div class="reward-panel">' +
          '<div class="reward-line"><span>🪙 任务奖金</span><b>+' + r.reward.coins + '</b></div>' +
          '<div class="reward-line"><span>⚡ 经验</span><b>+' + r.reward.exp + '</b></div>' +
          (session.trust ? '<div class="reward-line"><span>🛡 督察信任</span><b>+' + session.trust + '</b></div>' : '') +
          (r.drop ? '<div class="drop-card">发现装备 ' + itemChip(r.drop) + '</div>' : '') +
          (r.expResult && r.expResult.ups ? '<div class="levelup">等级提升！现在是 Lv.' + r.expResult.level + ' · ' + GameRPG.levelTitle(r.expResult.level) + '</div>' : '') +
          '<div class="exp-line"><span>EXP</span><div class="exp-bar"><i style="width:' + expPct + '%"></i></div><em>' + (p.exp || 0) + '/' + need + '</em></div>' +
        '</div>'
      : '<div class="reward-panel review-panel">错题重练不发放任务奖金，但答对就会从错题本里移除。</div>';

    var actions = r.mode === 'level'
      ? '<button class="btn primary" id="againBtn">再闯一次</button>' +
        '<button class="btn ghost" id="changeDiff">换个难度</button>' +
        '<button class="btn ghost" id="toBag">装备舱</button>'
      : '<button class="btn primary" id="againReview">再练一遍</button>';

    if (r.mode === 'level' && wrongAnswers.length) {
      actions += '<button class="btn accent" id="practiceWrong">重练本次错题</button>';
    }
    if (r.mode === 'review') {
      var remain = GameStore.wrongCount(r.subjectId);
      actions += remain
        ? '<button class="btn accent" id="practiceWrong">继续练剩余错题（' + remain + '）</button>'
        : '<button class="btn ghost" id="toWrongBook">错题本已清空，去看看</button>';
    }
    actions += '<button class="btn ghost" id="toLevels">返回任务列表</button>';

    view.innerHTML =
      '<div class="result-wrap">' +
        '<div class="result-card report-card">' +
          '<div class="rank-badge rank-' + rank.key + '">' + rank.key + '</div>' +
          '<div class="rank-name">' + esc(rank.name) + '</div>' +
          '<h2>' + (r.mode === 'review' ? '重练完成' : (session.stars ? '任务完成' : '任务失败')) + '</h2>' +
          '<p class="result-sub">' + esc(r.levelTitle) + ' · ' + esc(r.diffName) +
            ' · 用时 ' + formatDuration(session.duration) + '</p>' +
          '<div class="big-stars">' + starsHTML(session.stars) + '</div>' +
          (r.isNewBest ? '<span class="new-record">新纪录</span>' : '') +
          '<div class="result-grid">' +
            '<div><b>' + session.score + '</b><span>得分</span></div>' +
            '<div><b>' + session.correct + '/' + session.total + '</b><span>答对</span></div>' +
            '<div><b>' + session.accuracy + '%</b><span>正确率</span></div>' +
            '<div><b>×' + session.maxCombo + '</b><span>最高连击</span></div>' +
          '</div>' +
          (session.skipped ? '<p class="result-sub">使用滑板跳过 ' + session.skipped + ' 题</p>' : '') +
          rewardHTML +
          '<div class="result-actions">' + actions + '</div>' +
          (wrongHTML
            ? '<div class="review-box"><h3>本次漏洞 <span class="count">' + wrongAnswers.length + '</span></h3>' +
              wrongHTML + '</div>'
            : '') +
        '</div>' +
      '</div>';

    var again = document.getElementById('againBtn');
    if (again) {
      again.onclick = function () { go('#/play/' + r.subjectId + '/' + r.levelId + '/' + r.diffKey); };
    }
    var changeDiff = document.getElementById('changeDiff');
    if (changeDiff) {
      changeDiff.onclick = function () { go('#/brief/' + r.subjectId + '/' + r.levelId); };
    }
    var bag = document.getElementById('toBag');
    if (bag) bag.onclick = function () { go('#/bag'); };
    var againReview = document.getElementById('againReview');
    if (againReview) {
      againReview.onclick = function () {
        reviewQueue = { subjectId: r.subjectId, questions: session.questions, label: '再次重练' };
        go('#/review/' + r.subjectId);
      };
    }
    var practiceWrong = document.getElementById('practiceWrong');
    if (practiceWrong) {
      practiceWrong.onclick = function () {
        var list = r.mode === 'level'
          ? wrongAnswers.map(function (a) { return a.question; })
          : GameStore.wrongItems(r.subjectId).map(function (item) {
              var q = Object.assign({}, item.snapshot);
              q.subjectId = item.subjectId;
              q.levelId = item.levelId;
              return q;
            });
        if (!list.length) return;
        reviewQueue = { subjectId: r.subjectId, questions: list, label: '错题重练' };
        go('#/review/' + r.subjectId);
      };
    }
    var toWrongBook = document.getElementById('toWrongBook');
    if (toWrongBook) toWrongBook.onclick = function () { go('#/wrong'); };
    document.getElementById('toLevels').onclick = function () {
      go(r.levelId ? '#/subject/' + r.subjectId : '#/');
    };
  }

  /* ---------- 装备舱 ---------- */

  function renderBag() {
    var p = GameStore.getProfile();
    var slotNames = ['tool', 'weapon', 'armor', 'wings'];

    var slotsHTML = slotNames.map(function (slot) {
      var id = p.equipped[slot];
      var item = id ? GameItems.get(id) : null;
      return '<button class="slot-card' + (item ? ' filled' : '') + '" type="button" data-slot="' + slot + '">' +
        '<span class="slot-name">' + GameItems.slots[slot].icon + ' ' + GameItems.slots[slot].name + '</span>' +
        (item
          ? '<span class="slot-item r' + item.rarity + '">' + item.icon + '<b>' + esc(item.name) + '</b></span>'
          : '<span class="slot-empty">未装备</span>') +
        '</button>';
    }).join('');

    var owned = Object.keys(p.items || {}).map(function (id) {
      return { item: GameItems.get(id), count: p.items[id] };
    }).filter(function (x) { return x.item; });

    var equipables = owned.filter(function (x) { return x.item.slot !== 'food'; });
    var foods = owned.filter(function (x) { return x.item.slot === 'food'; });

    function itemCard(entry) {
      var item = entry.item;
      var equipped = p.equipped[item.slot] === item.id;
      return '<button class="bag-item r' + item.rarity + '" type="button" data-item="' + item.id + '">' +
        '<span class="bi-icon">' + item.icon + '</span>' +
        '<span class="bi-name">' + esc(item.name) + '</span>' +
        '<span class="bi-meta">' + GameItems.rarity[item.rarity].name +
          (entry.count > 1 ? ' ×' + entry.count : '') + '</span>' +
        (equipped ? '<span class="bi-eq">已装备</span>' : '') +
        '</button>';
    }

    view.innerHTML =
      '<div class="page-head"><h1>🎒 装备舱</h1>' +
      '<p>装备会改变任务中的规则；补给使用后立即生效。</p></div>' +
      '<div class="slot-grid">' + slotsHTML + '</div>' +
      '<div class="bag-summary">' +
        '<span>🪙 ' + (p.coins || 0) + ' 金币</span>' +
        '<span>Lv.' + p.level + ' · ' + esc(GameRPG.levelTitle(p.level)) + '</span>' +
      '</div>' +
      '<div class="section-head"><h2>装备</h2><span class="hint">' + equipables.length + ' 件</span></div>' +
      (equipables.length
        ? '<div class="bag-grid">' + equipables.map(itemCard).join('') + '</div>'
        : '<div class="empty small-empty">还没有装备。完成任务或打开补给箱有机会获得。</div>') +
      '<div class="section-head"><h2>补给</h2><span class="hint">' + foods.length + ' 件</span></div>' +
      (foods.length
        ? '<div class="bag-grid">' + foods.map(itemCard).join('') + '</div>'
        : '<div class="empty small-empty">背包里没有吃的。</div>') +
      '<div class="legend">稀有度：普通 · 精良 · 稀有 · 传说。高级任务和宝箱更容易出稀有装备。</div>';

    view.querySelectorAll('[data-item]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        openItem(btn.getAttribute('data-item'));
      });
    });
  }

  function openItem(id) {
    var item = GameItems.get(id);
    if (!item) return;
    var p = GameStore.getProfile();
    var equipped = item.slot !== 'food' && p.equipped[item.slot] === item.id;
    var actionText = item.slot === 'food' ? '使用' : (equipped ? '卸下' : '穿戴');

    openModal(
      '<div class="item-modal r' + item.rarity + '">' +
        '<div class="im-icon">' + item.icon + '</div>' +
        '<h2>' + esc(item.name) + '</h2>' +
        '<div class="im-rarity">' + GameItems.rarity[item.rarity].name +
          ' · ' + (GameItems.slots[item.slot] ? GameItems.slots[item.slot].name : '物品') + '</div>' +
        '<p class="im-desc">' + esc(item.desc) + '</p>' +
        '<div class="im-effect">效果：' + esc(effectsSummary(item.effect || {})) + '</div>' +
        '<div class="modal-actions">' +
          '<button class="btn ghost" id="itemCancel" type="button">关闭</button>' +
          '<button class="btn primary" id="itemAction" type="button">' + actionText + '</button>' +
        '</div>' +
      '</div>',
      function (root) {
        root.querySelector('#itemCancel').onclick = closeModal;
        root.querySelector('#itemAction').onclick = function () {
          if (item.slot === 'food') {
            if (!p.items[id]) { closeModal(); return; }
            GameStore.removeItem(id, 1);
            var gain = [];
            if (item.effect.exp) {
              var r = GameStore.addExp(item.effect.exp);
              gain.push('经验 +' + item.effect.exp);
              if (r.ups) gain.push('等级提升到 Lv.' + r.level);
            }
            if (item.effect.coins) {
              GameStore.addCoins(item.effect.coins);
              gain.push('金币 +' + item.effect.coins);
            }
            closeModal();
            render();
            toast(gain.join('，'));
            return;
          }
          if (equipped) GameStore.unequip(item.slot);
          else GameStore.equip(item.slot, id);
          closeModal();
          render();
        };
      }
    );
  }

  function toast(message) {
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(function () {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 2200);
  }

  /* ---------- 错题本 ---------- */

  function renderWrong() {
    var items = GameStore.wrongItems();
    if (!items.length) {
      view.innerHTML = '<div class="empty" style="margin-top:12px"><span class="big">📭</span>错题本是空的。' +
        '去执行任务吧，被督察抓到的漏洞会自动出现在这里。' +
        '<div style="margin-top:16px"><button class="btn primary" id="goPlay">去执行任务</button></div></div>';
      document.getElementById('goPlay').onclick = function () {
        var first = GameSubjects.playable()[0];
        go(first ? '#/subject/' + first.id : '#/');
      };
      return;
    }

    var bySubject = {};
    items.forEach(function (item) {
      if (!bySubject[item.subjectId]) bySubject[item.subjectId] = [];
      bySubject[item.subjectId].push(item);
    });

    var groups = Object.keys(bySubject).map(function (sid) {
      var subject = GameSubjects.get(sid);
      var name = subject ? subject.icon + ' ' + subject.name : sid;
      var cards = bySubject[sid].map(function (item) {
        var q = item.snapshot;
        var lv = GameSubjects.level(sid, item.levelId);
        var typeLabel = { choice: '单选题', judge: '判断题', fill: '填空题', match: '连线题' }[q.type] || '题目';
        return '<div class="wrong-card">' +
          '<div class="wc-head"><span class="wc-tag">' + typeLabel + '</span>' +
            '<span>' + esc(lv ? lv.title : item.levelId) + '</span>' +
            (item.tries > 1 ? '<span style="margin-left:auto;color:#c9453a">已错 ' + item.tries + ' 次</span>' : '') +
          '</div>' +
          '<div class="wc-stem">' + esc(q.stem) + '</div>' +
          (q.svg ? '<figure class="qvisual">' + q.svg + '</figure>' : '') +
          '<div class="wc-line">正确答案：<b>' + esc(GameQuiz.answerText(q)) + '</b></div>' +
          (q.explain ? '<div class="wc-line">' + esc(q.explain) + '</div>' : '') +
          '<div class="wc-foot">' +
            '<button class="btn ghost small" type="button" data-practice="' + esc(item.key) + '">练这题</button>' +
            '<button class="btn ghost small" type="button" data-remove="' + esc(item.key) + '">已掌握，移出</button>' +
          '</div>' +
          '</div>';
      }).join('');

      return '<section class="wrong-group">' +
        '<div class="wrong-group-head">' +
          '<h2>' + esc(name) + ' · ' + bySubject[sid].length + ' 题</h2>' +
          '<button class="btn primary small" type="button" data-practice-all="' + esc(sid) + '">重练全部</button>' +
        '</div>' + cards +
        '</section>';
    }).join('');

    view.innerHTML =
      '<div class="page-head"><h1>📕 错题本</h1>' +
      '<p>答错的题会一直被记着；在重练里答对，就会自动移出。</p></div>' +
      groups;

    view.querySelectorAll('[data-practice]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-practice');
        var item = items.filter(function (x) { return x.key === key; })[0];
        if (!item) return;
        var q = Object.assign({}, item.snapshot);
        q.subjectId = item.subjectId;
        q.levelId = item.levelId;
        reviewQueue = { subjectId: item.subjectId, questions: [q], label: '单题重练' };
        go('#/review/' + item.subjectId);
      });
    });

    view.querySelectorAll('[data-remove]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var key = btn.getAttribute('data-remove');
        var item = items.filter(function (x) { return x.key === key; })[0];
        if (!item) return;
        GameStore.removeWrong(item.subjectId, item.levelId, item.questionId);
        GameAudio.play('click');
        render();
      });
    });

    view.querySelectorAll('[data-practice-all]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var sid = btn.getAttribute('data-practice-all');
        var list = GameStore.wrongItems(sid).map(function (item) {
          var q = Object.assign({}, item.snapshot);
          q.subjectId = item.subjectId;
          q.levelId = item.levelId;
          return q;
        });
        if (!list.length) return;
        reviewQueue = { subjectId: sid, questions: list, label: '错题重练' };
        go('#/review/' + sid);
      });
    });
  }

  /* ---------- 学习报告 ---------- */

  function renderStats() {
    var totals = GameStore.totals();
    var subjects = GameSubjects.playable();
    var p = GameStore.getProfile();

    var rows = subjects.map(function (s) {
      var done = s.levels.filter(function (lv) { return starsOf(s.id, lv.id) > 0; }).length;
      var stars = GameStore.subjectStars(s.id);
      var answered = 0;
      var correct = 0;
      s.levels.forEach(function (lv) {
        var rec = progressOf(s.id, lv.id);
        if (rec) {
          answered += rec.answered || 0;
          correct += rec.correct || 0;
        }
      });
      return '<div class="stat-row">' +
        '<span>' + esc(s.icon + ' ' + s.name) + '</span>' +
        '<span>' + done + ' / ' + s.levels.length + ' 关</span>' +
        '<span>' + stars + ' / ' + s.levels.length * 3 + ' ★ · ' +
          (answered ? Math.round(correct / answered * 100) + '%' : '—') + '</span>' +
        '</div>';
    }).join('');

    view.innerHTML =
      '<div class="page-head"><h1>📊 学习报告</h1>' +
      '<p>数据只保存在这台设备的浏览器里。</p></div>' +
      '<div class="stat-grid">' +
        '<div class="stat-box"><b>' + totals.answered + '</b><span>累计答题</span></div>' +
        '<div class="stat-box"><b>' + totals.accuracy + '%</b><span>累计正确率</span></div>' +
        '<div class="stat-box"><b>' + totals.stars + '</b><span>获得星星</span></div>' +
        '<div class="stat-box"><b>' + totals.wrong + '</b><span>待攻克错题</span></div>' +
      '</div>' +
      '<div class="stat-grid">' +
        '<div class="stat-box"><b>Lv.' + p.level + '</b><span>' + esc(GameRPG.levelTitle(p.level)) + '</span></div>' +
        '<div class="stat-box"><b>🪙 ' + (p.coins || 0) + '</b><span>任务奖金</span></div>' +
        '<div class="stat-box"><b>🛡 ' + (p.trust || 0) + '</b><span>督察信任</span></div>' +
        '<div class="stat-box"><b>' + Object.keys(p.items || {}).length + '</b><span>收藏装备</span></div>' +
      '</div>' +
      '<div class="stat-table"><div class="stat-row"><span>科目</span><span>闯关进度</span><span>星星 / 正确率</span></div>' +
        rows +
      '</div>' +
      '<div class="legend">小建议：每天 10 分钟，先做新任务，再花 2 分钟清空错题本。想冲装备就去高级任务。</div>';
  }

  /* ---------- 设置 ---------- */

  function openSettings() {
    var soundOn = GameStore.getSettings().sound !== false;
    openModal(
      '<h2>设置</h2>' +
      '<p>随时可以调整，进度保存在本机。</p>' +
      '<div class="switch-row"><span class="label">游戏音效</span>' +
        '<button class="switch' + (soundOn ? ' on' : '') + '" id="soundSwitch" type="button" aria-label="音效开关"></button></div>' +
      '<div class="switch-row"><span class="label">开场漫画</span>' +
        '<button class="btn ghost small" id="replayIntro" type="button">重看</button></div>' +
      '<div class="switch-row"><span class="label">清空全部进度与装备</span>' +
        '<button class="btn ghost small" id="resetBtn" type="button">清空</button></div>' +
      '<div class="modal-actions"><button class="btn primary" id="modalClose" type="button">完成</button></div>',
      function (root) {
        var sw = root.querySelector('#soundSwitch');
        sw.addEventListener('click', function () {
          var next = !(GameStore.getSettings().sound !== false);
          GameStore.setSetting('sound', next);
          GameAudio.setEnabled(next);
          sw.classList.toggle('on', next);
          soundBtn.textContent = next ? '🔊' : '🔇';
          if (next) GameAudio.play('click');
        });
        root.querySelector('#replayIntro').addEventListener('click', function () {
          closeModal();
          go('#/intro');
        });
        root.querySelector('#resetBtn').addEventListener('click', function () {
          if (global.confirm('确定要清空所有任务成绩、错题本、金币和装备吗？此操作无法撤销。')) {
            GameStore.resetAll();
            GameAudio.setEnabled(true);
            closeModal();
            go('#/');
          }
        });
        root.querySelector('#modalClose').addEventListener('click', closeModal);
      }
    );
  }

  /* ---------- 路由 ---------- */

  function parseHash() {
    var raw = location.hash.replace(/^#\/?/, '');
    if (!raw) return [];
    return raw.split('/').filter(function (s) { return s !== ''; }).map(decodeURIComponent);
  }

  function render() {
    if (currentQuiz && currentQuiz.destroy) currentQuiz.destroy();
    currentQuiz = null;
    if (introKeyHandler) {
      document.removeEventListener('keydown', introKeyHandler);
      introKeyHandler = null;
    }

    var parts = parseHash();
    var route = parts[0] || 'home';
    window.scrollTo(0, 0);

    if (route === 'intro') {
      setChrome({ title: '开场漫画', sub: 'K-7 的来历', back: null });
      renderIntro();
    } else if (route === 'subject') {
      var subject = GameSubjects.get(parts[1]);
      setChrome({
        title: subject ? subject.name : '区域',
        sub: subject ? subject.desc : '任务列表',
        back: '#/'
      });
      renderSubject(parts[1]);
    } else if (route === 'brief') {
      var s1 = GameSubjects.get(parts[1]);
      var lv1 = GameSubjects.level(parts[1], parts[2]);
      setChrome({
        title: lv1 ? lv1.title : '任务简报',
        sub: s1 ? s1.name + ' · 选择难度' : '选择难度',
        back: '#/subject/' + (parts[1] || '')
      });
      renderBrief(parts[1], parts[2]);
    } else if (route === 'play') {
      var s2 = GameSubjects.get(parts[1]);
      var lv2 = GameSubjects.level(parts[1], parts[2]);
      var mission = GameMissions.get(parts[2]) || {};
      var diff = GameRPG.getDifficulty(parts[3]);
      setChrome({
        title: mission.code || (lv2 ? lv2.title : '执行任务'),
        sub: (s2 ? s2.name + ' · ' : '') + diff.name + (diff.timeLimit ? ' · 限时 ' + diff.timeLimit + ' 秒' : ''),
        back: '#/brief/' + (parts[1] || '') + '/' + (parts[2] || '')
      });
      renderPlay(parts[1], parts[2], parts[3]);
    } else if (route === 'review') {
      var s3 = GameSubjects.get(parts[1]);
      setChrome({
        title: '错题重练',
        sub: s3 ? s3.name + ' · 答对即移出' : '答对即移出',
        back: '#/wrong'
      });
      renderReview(parts[1]);
    } else if (route === 'result') {
      setChrome({ title: '任务报告', sub: '看看这次的表现', back: null });
      renderResult();
    } else if (route === 'bag') {
      setChrome({ title: '装备舱', sub: '装备与补给', back: '#/' });
      renderBag();
    } else if (route === 'wrong') {
      setChrome({ title: '错题本', sub: '被督察抓到的漏洞', back: '#/' });
      renderWrong();
    } else if (route === 'stats') {
      setChrome({ title: '学习报告', sub: '累计练习数据', back: '#/' });
      renderStats();
    } else {
      setChrome({ title: '知识闯关', sub: '外星侦查员 K-7 · 地球测绘任务', back: null });
      renderHome();
    }
  }

  function init() {
    GameAudio.setEnabled(GameStore.getSettings().sound !== false);

    soundBtn.addEventListener('click', function () {
      var next = !(GameStore.getSettings().sound !== false);
      GameStore.setSetting('sound', next);
      GameAudio.setEnabled(next);
      soundBtn.textContent = next ? '🔊' : '🔇';
      if (next) GameAudio.play('click');
    });
    wrongBtn.addEventListener('click', function () { go('#/wrong'); });

    // 第一次打开，先播开场漫画
    if (!location.hash && !GameStore.introSeen()) {
      try {
        global.history.replaceState(null, '', '#/intro');
      } catch (e) {
        location.hash = '#/intro';
      }
    }

    window.addEventListener('hashchange', render);
    render();
  }

  init();
})(window);