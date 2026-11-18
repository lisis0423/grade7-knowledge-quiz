/* ============================================================
   答题组件（RPG 版）
   ------------------------------------------------------------
   GameQuiz.start({
     questions, difficulty, effects, followUps, onChest,
     onAnswer, onComplete
   })
   返回 { destroy() }。

   difficulty: { key, timeLimit, penalty, retry, starLine }
   effects: { skip, hint, retry, shield, comboGuard, timeBonus,
              scoreRate, coinRate, penaltyReduce }
   followUps: { [questionId]: { prompt, options, answer, reply } }
   onChest: function ({ tier }) {}   // tier: 'small' | 'big'
   ============================================================ */
(function (global) {
  'use strict';

  var LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  var TYPE_LABEL = {
    choice: '单选题',
    judge: '判断题',
    fill: '填空题',
    match: '连线题'
  };

  var DEFAULT_DIFF = {
    key: 'agent', timeLimit: 0, penalty: 20, retry: 0,
    starLine: [0.6, 0.8, 0.95]
  };

  /* ---------- 文本 ---------- */

  function escapeHTML(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  function stemHTML(str) {
    return escapeHTML(str).replace(/\n/g, '<br>');
  }

  function toHalfWidth(str) {
    return String(str)
      .replace(/[\uFF01-\uFF5E]/g, function (ch) {
        return String.fromCharCode(ch.charCodeAt(0) - 0xFEE0);
      })
      .replace(/\u3000/g, ' ');
  }

  function normalizeText(str) {
    return toHalfWidth(str)
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[，。；：、！？“”‘’（）【】《》〈〉·,.;:!?"'`~\-—_/\\|]/g, '');
  }

  /* ---------- 判分 ---------- */

  function isUsable(q) {
    if (!q || !q.stem) return false;
    if (q.type === 'choice') {
      return Array.isArray(q.options) && q.options.length >= 2 &&
        Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length;
    }
    if (q.type === 'judge') return typeof q.answer === 'boolean';
    if (q.type === 'fill') return !!(q.accept && q.accept.length) || q.answer !== undefined;
    if (q.type === 'match') {
      return Array.isArray(q.left) && Array.isArray(q.right) &&
        Array.isArray(q.answer) && q.answer.length === q.left.length &&
        q.answer.every(function (i) { return i >= 0 && i < q.right.length; });
    }
    return false;
  }

  function judge(q, response) {
    if (q.type === 'choice') return Number(response) === Number(q.answer);
    if (q.type === 'judge') return Boolean(response) === Boolean(q.answer);
    if (q.type === 'fill') {
      var accepts = q.accept && q.accept.length ? q.accept : [q.answer];
      var value = normalizeText(response);
      if (!value) return false;
      for (var i = 0; i < accepts.length; i++) {
        var target = normalizeText(accepts[i]);
        if (target && value === target) return true;
      }
      return false;
    }
    if (q.type === 'match') {
      if (!response || typeof response !== 'object') return false;
      for (var k = 0; k < q.answer.length; k++) {
        if (Number(response[k]) !== Number(q.answer[k])) return false;
      }
      return true;
    }
    return false;
  }

  function answerText(q) {
    if (q.type === 'choice') return LETTERS[q.answer] + '. ' + q.options[q.answer];
    if (q.type === 'judge') return q.answer ? '正确' : '错误';
    if (q.type === 'fill') return (q.accept && q.accept[0]) || String(q.answer || '');
    if (q.type === 'match') {
      return q.left.map(function (text, i) {
        return text + ' → ' + q.right[q.answer[i]];
      }).join('；');
    }
    return '';
  }

  function shuffleChoice(q) {
    var order = q.options.map(function (_, i) { return i; });
    for (var i = order.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = order[i]; order[i] = order[j]; order[j] = tmp;
    }
    var copy = Object.assign({}, q);
    copy.options = order.map(function (i) { return q.options[i]; });
    copy.answer = order.indexOf(q.answer);
    return copy;
  }

  /* ---------- 作答区 ---------- */

  function bodyHTML(q) {
    if (q.type === 'choice') {
      return q.options.map(function (text, i) {
        return '<button class="option" data-index="' + i + '" type="button">' +
          '<span class="opt-key">' + LETTERS[i] + '</span>' +
          '<span class="opt-text">' + escapeHTML(text) + '</span>' +
          '<span class="opt-mark" hidden></span>' +
          '</button>';
      }).join('');
    }
    if (q.type === 'judge') {
      return '<div class="judge-row">' +
        '<button class="option" data-value="true" type="button"><span class="opt-text">✔ 正确</span><span class="opt-mark" hidden></span></button>' +
        '<button class="option" data-value="false" type="button"><span class="opt-text">✘ 错误</span><span class="opt-mark" hidden></span></button>' +
        '</div>';
    }
    if (q.type === 'fill') {
      return '<input class="fill-input" id="fillInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="在这里输入答案">' +
        (q.hint ? '<div class="fill-hint">提示：' + escapeHTML(q.hint) + '</div>' : '');
    }
    if (q.type === 'match') {
      return '<div class="match-cols">' +
        '<div class="match-col"><div class="col-label">左栏</div><div id="matchLeft"></div></div>' +
        '<div class="match-col"><div class="col-label">右栏</div><div id="matchRight"></div></div>' +
        '</div>' +
        '<div class="fill-hint">先点左栏一项，再点右栏与它对应的项；点已配对的项可取消。</div>';
    }
    return '';
  }

  /* ---------- 主流程 ---------- */

  function start(opts) {
    var mount = opts.mount;
    var difficulty = Object.assign({}, DEFAULT_DIFF, opts.difficulty || {});
    var effects = Object.assign({
      skip: 0, hint: 0, retry: 0, shield: 0, comboGuard: 0,
      timeBonus: 0, scoreRate: 0, coinRate: 0, penaltyReduce: 0
    }, opts.effects || {});
    var followUps = opts.followUps || {};
    var onChest = opts.onChest || null;
    var onAnswer = opts.onAnswer || function () {};
    var onComplete = opts.onComplete || function () {};

    var questions = (opts.questions || []).filter(isUsable).map(function (q) {
      return (q.type === 'choice' && q.shuffle !== false) ? shuffleChoice(q) : q;
    });

    var total = questions.length;
    var destroyed = false;
    var timer = null;
    var chestFired = {};
    var followUsed = {};
    var uses = {
      skip: effects.skip | 0,
      hint: effects.hint | 0,
      retry: (difficulty.retry | 0) + (effects.retry | 0),
      shield: effects.shield | 0,
      comboGuard: effects.comboGuard | 0
    };

    if (!total) {
      mount.innerHTML = '<div class="empty"><span class="big">🛰️</span>这里还没有可用的任务数据。</div>';
      return { destroy: function () {} };
    }

    var state = {
      index: 0,
      score: 0,
      combo: 0,
      maxCombo: 0,
      correct: 0,
      locked: false,
      answers: [],
      startedAt: Date.now(),
      trust: 0,
      skipped: 0,
      attempt: 1,
      retryPrompt: false,
      followPending: false,
      timeLeft: 0
    };

    mount.innerHTML =
      '<div class="quiz-progress"><i id="quizProgress" style="width:0%"></i></div>' +
      '<div class="quiz-meta">' +
        '<span id="quizCounter">第 1 / ' + total + ' 题</span>' +
        '<span class="combo-badge" id="comboBadge">🔥 连击 ×1</span>' +
        '<span class="spacer"></span>' +
        '<span class="quiz-timer" id="quizTimer" hidden>⏱ 20s</span>' +
        '<span class="score-pill" id="scorePill">0 分</span>' +
      '</div>' +
      '<div class="qcard" id="qcard"></div>';

    var qcard = mount.querySelector('#qcard');
    var progressEl = mount.querySelector('#quizProgress');
    var counterEl = mount.querySelector('#quizCounter');
    var comboEl = mount.querySelector('#comboBadge');
    var scoreEl = mount.querySelector('#scorePill');
    var timerEl = mount.querySelector('#quizTimer');

    /* ----- HUD ----- */

    function updateHud() {
      var shown = state.locked ? state.index + 1 : state.index;
      progressEl.style.width = (shown / total * 100) + '%';
      counterEl.textContent = '第 ' + Math.min(state.index + 1, total) + ' / ' + total + ' 题';
      scoreEl.textContent = state.score + ' 分';
      if (state.combo >= 2) {
        comboEl.textContent = '🔥 连击 ×' + state.combo;
        comboEl.classList.add('show');
        comboEl.classList.remove('bump');
        void comboEl.offsetWidth;
        comboEl.classList.add('bump');
      } else {
        comboEl.classList.remove('show');
      }
    }

    function stopTimer() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    function renderTimer() {
      if (!difficulty.timeLimit) {
        timerEl.hidden = true;
        return;
      }
      timerEl.hidden = false;
      timerEl.textContent = '⏱ ' + Math.max(0, state.timeLeft) + 's';
      timerEl.classList.toggle('urgent', state.timeLeft <= 5);
    }

    function startTimer() {
      stopTimer();
      if (!difficulty.timeLimit) {
        renderTimer();
        return;
      }
      state.timeLeft = difficulty.timeLimit + (effects.timeBonus || 0);
      renderTimer();
      timer = setInterval(function () {
        if (state.locked) return;
        state.timeLeft -= 1;
        renderTimer();
        if (state.timeLeft <= 0) {
          stopTimer();
          respond(questions[state.index], null, { timeout: true });
        }
      }, 1000);
    }

    /* ----- 技能条 ----- */

    function skillsHTML(q) {
      var parts = [];
      if (uses.skip > 0) {
        parts.push('<button class="skill-btn" id="skipBtn" type="button">🛹 跳过 <b>' + uses.skip + '</b></button>');
      }
      if (uses.hint > 0 && q.type === 'choice') {
        parts.push('<button class="skill-btn" id="hintBtn" type="button">📡 扫描 <b>' + uses.hint + '</b></button>');
      }
      return parts.length ? parts.join('') : '';
    }

    function bindSkills(q) {
      var skipBtn = qcard.querySelector('#skipBtn');
      var hintBtn = qcard.querySelector('#hintBtn');
      if (skipBtn) skipBtn.addEventListener('click', function () { skipQuestion(q); });
      if (hintBtn) hintBtn.addEventListener('click', function () { useHint(q); });
    }

    function useHint(q) {
      if (state.locked || state.followPending || uses.hint <= 0) return;
      var candidates = Array.prototype.slice.call(qcard.querySelectorAll('.option'))
        .filter(function (btn) {
          return Number(btn.getAttribute('data-index')) !== Number(q.answer) && !btn.disabled;
        });
      if (!candidates.length) return;
      uses.hint -= 1;
      var target = candidates[0];
      target.disabled = true;
      target.classList.add('dim', 'hinted');
      var mark = target.querySelector('.opt-mark');
      if (mark) {
        mark.hidden = false;
        mark.textContent = '×';
      }
      var row = qcard.querySelector('#skillRow');
      if (row) row.innerHTML = skillsHTML(q);
      bindSkills(q);
      global.GameAudio.play('click');
    }

    function skipQuestion(q) {
      if (state.locked || state.followPending || uses.skip <= 0) return;
      uses.skip -= 1;
      state.locked = true;
      stopTimer();
      state.skipped += 1;
      state.answers.push({
        question: q, response: '__skip__', correct: true,
        gain: 0, skipped: true
      });
      disableBody(q);
      setPrimaryLabel(state.index >= total - 1 ? '查看任务报告' : '下一题', false);
      var box = qcard.querySelector('#feedback');
      box.innerHTML = '<div class="qfeedback warn">' +
        '<div class="fb-title">🛹 已使用飞行滑板跳过</div>' +
        '<div class="fb-explain">本题不计错，也不加分。正确答案：' + escapeHTML(answerText(q)) + '</div>' +
        '</div>';
      updateHud();
      onAnswer({ question: q, correct: true, skipped: true, gain: 0 });
      global.GameAudio.play('click');
    }

    /* ----- 渲染题目 ----- */

    function paint() {
      var q = questions[state.index];
      var isChoiceLike = (q.type === 'choice' || q.type === 'judge');
      var skills = skillsHTML(q);

      qcard.innerHTML =
        '<div class="qhead">' +
          '<span class="qtype">' + (TYPE_LABEL[q.type] || '题目') + '</span>' +
          '<span class="qno">' + (state.index + 1) + ' / ' + total + '</span>' +
        '</div>' +
        '<div class="qstem">' + stemHTML(q.stem) + '</div>' +
        (q.svg
          ? '<figure class="qvisual">' + q.svg +
            (q.caption ? '<figcaption>' + escapeHTML(q.caption) + '</figcaption>' : '') +
            '</figure>'
          : '') +
        '<div class="qbody" id="qbody">' + bodyHTML(q) + '</div>' +
        (skills ? '<div class="skill-row" id="skillRow">' + skills + '</div>' : '') +
        '<div id="feedback"></div>' +
        '<div class="qactions">' +
          '<button class="btn primary" id="primaryBtn" type="button"' +
            (isChoiceLike ? ' hidden' : '') + '>' +
            (q.type === 'match' ? '确认连线' : '确认答案') +
          '</button>' +
        '</div>';

      state.locked = false;
      state.retryPrompt = false;
      state.followPending = false;
      bindBody(q);
      bindSkills(q);
      startTimer();
      updateHud();
      renderTimer();
    }

    function currentPrimary() {
      return qcard.querySelector('#primaryBtn');
    }

    function setPrimaryLabel(text, disabled) {
      var btn = currentPrimary();
      if (!btn) return;
      btn.textContent = text;
      btn.hidden = false;
      btn.disabled = !!disabled;
    }

    function allMatched(q, pairs) {
      for (var i = 0; i < q.left.length; i++) {
        if (pairs[i] === undefined) return false;
      }
      return true;
    }

    function disableBody(q) {
      var body = qcard.querySelector('#qbody');
      if (!body) return;
      if (q.type === 'choice' || q.type === 'judge') {
        body.querySelectorAll('.option').forEach(function (btn) { btn.disabled = true; });
      } else if (q.type === 'fill') {
        var input = body.querySelector('#fillInput');
        if (input) input.disabled = true;
      } else if (q.type === 'match') {
        body.querySelectorAll('.match-item').forEach(function (btn) { btn.disabled = true; });
      }
    }

    function bindBody(q) {
      var body = qcard.querySelector('#qbody');
      var primary = currentPrimary();

      if (q.type === 'choice' || q.type === 'judge') {
        body.querySelectorAll('.option').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (state.locked || state.followPending) return;
            var response = q.type === 'choice'
              ? Number(btn.getAttribute('data-index'))
              : btn.getAttribute('data-value') === 'true';
            respond(q, response);
          });
        });
      }

      if (q.type === 'fill') {
        var input = body.querySelector('#fillInput');
        input.addEventListener('keydown', function (ev) {
          if (ev.key !== 'Enter') return;
          ev.preventDefault();
          if (state.retryPrompt) { retryPaint(q); return; }
          if (state.locked) { next(); return; }
          submitFill(q);
        });
        input.focus();
      }

      if (q.type === 'match') {
        var pairs = {};
        var activeLeft = null;
        var leftBox = body.querySelector('#matchLeft');
        var rightBox = body.querySelector('#matchRight');
        var paintMatch = function () {
          leftBox.innerHTML = q.left.map(function (text, i) {
            var pairedTo = pairs[i];
            var paired = pairedTo !== undefined;
            return '<button class="match-item' + (paired ? ' paired' : '') +
              (activeLeft === i ? ' active' : '') +
              '" type="button" data-side="left" data-i="' + i + '">' +
              '<span class="match-text">' + escapeHTML(text) + '</span>' +
              (paired ? '<span class="match-tag">' + (LETTERS[pairedTo] || '?') + '</span>' : '') +
              '</button>';
          }).join('');

          rightBox.innerHTML = q.right.map(function (text, i) {
            var fromLeft = -1;
            Object.keys(pairs).forEach(function (l) {
              if (Number(pairs[l]) === i) fromLeft = Number(l);
            });
            return '<button class="match-item' + (fromLeft >= 0 ? ' paired' : '') +
              '" type="button" data-side="right" data-i="' + i + '">' +
              '<span class="match-text">' + escapeHTML(text) + '</span>' +
              (fromLeft >= 0 ? '<span class="match-tag">' + (fromLeft + 1) + '</span>' : '') +
              '</button>';
          }).join('');

          setPrimaryLabel('确认连线', !allMatched(q, pairs));

          leftBox.querySelectorAll('.match-item').forEach(function (btn) {
            btn.addEventListener('click', function () {
              if (state.locked) return;
              var i = Number(btn.getAttribute('data-i'));
              if (pairs[i] !== undefined) {
                delete pairs[i];
                activeLeft = null;
              } else {
                activeLeft = activeLeft === i ? null : i;
              }
              paintMatch();
            });
          });

          rightBox.querySelectorAll('.match-item').forEach(function (btn) {
            btn.addEventListener('click', function () {
              if (state.locked) return;
              var i = Number(btn.getAttribute('data-i'));
              if (activeLeft === null) {
                var ownedBy = null;
                Object.keys(pairs).forEach(function (l) {
                  if (Number(pairs[l]) === i) ownedBy = Number(l);
                });
                if (ownedBy !== null) delete pairs[ownedBy];
                paintMatch();
                return;
              }
              Object.keys(pairs).forEach(function (l) {
                if (Number(pairs[l]) === i) delete pairs[l];
              });
              pairs[activeLeft] = i;
              activeLeft = null;
              paintMatch();
            });
          });
        };

        paintMatch();
        qcard._confirmMatch = function () {
          if (state.locked || !allMatched(q, pairs)) return;
          respond(q, Object.assign({}, pairs));
        };
      }

      primary.addEventListener('click', function () {
        if (state.retryPrompt) { retryPaint(q); return; }
        if (state.locked) { next(); return; }
        if (q.type === 'fill') submitFill(q);
        else if (q.type === 'match' && qcard._confirmMatch) qcard._confirmMatch();
      });
    }

    function submitFill(q) {
      if (state.locked || state.followPending) return;
      var input = qcard.querySelector('#fillInput');
      var value = input.value.trim();
      if (!value) {
        input.focus();
        input.placeholder = '先输入答案再确认哦';
        return;
      }
      respond(q, value);
    }

    function retryPaint(q) {
      state.retryPrompt = false;
      state.attempt = 2;
      state.locked = false;
      paint();
    }

    /* ----- 判定 ----- */

    function respond(q, response, meta) {
      if (state.locked) return;
      meta = meta || {};
      stopTimer();

      var correct = !meta.timeout && judge(q, response);

      if (!correct && !meta.timeout && uses.retry > 0) {
        uses.retry -= 1;
        state.locked = true;
        state.retryPrompt = true;
        disableBody(q);
        var box = qcard.querySelector('#feedback');
        box.innerHTML = '<div class="qfeedback warn">' +
          '<div class="fb-title">答错了，但无人机还能带你回去看一眼</div>' +
          '<div class="fb-explain">还有 1 次重答机会，答对得一半分。</div>' +
          '</div>';
        setPrimaryLabel('再试一次', false);
        global.GameAudio.play('wrong');
        return;
      }

      if (correct) {
        if (state.attempt === 2) {
          var halfBase = 100 + Math.min(Math.max(state.combo - 1, 0), 5) * 20;
          var gainHalf = Math.round(halfBase * 0.5 * (1 + effects.scoreRate));
          state.score += gainHalf;
          state.correct += 1;
          state.answers.push({
            question: q, response: response, correct: true,
            gain: gainHalf, retried: true
          });
          showFeedback(q, true, gainHalf, { retried: true });
          global.GameAudio.play('correct');
        } else {
          state.combo += 1;
          state.maxCombo = Math.max(state.maxCombo, state.combo);
          var gain = Math.round((100 + Math.min(Math.max(state.combo - 1, 0), 5) * 20) * (1 + effects.scoreRate));
          state.score += gain;
          state.correct += 1;
          state.answers.push({
            question: q, response: response, correct: true, gain: gain
          });
          showFeedback(q, true, gain, {});
          global.GameAudio.play(state.combo >= 3 ? 'combo' : 'correct');
          if (!chestFired.small && state.combo === 3) {
            chestFired.small = true;
            if (onChest) setTimeout(function () { onChest({ tier: 'small' }); }, 350);
          }
          if (!chestFired.big && state.combo === 6) {
            chestFired.big = true;
            if (onChest) setTimeout(function () { onChest({ tier: 'big' }); }, 350);
          }
        }
        onAnswer({ question: q, correct: true, gain: state.answers[state.answers.length - 1].gain });
      } else {
        var penalty = difficulty.penalty || 0;
        var notes = [];
        if (penalty > 0 && uses.shield > 0) {
          uses.shield -= 1;
          penalty = 0;
          notes.push('能量护盾抵消了这次扣分。');
        } else if (penalty > 0 && effects.penaltyReduce > 0) {
          var reduced = Math.round(penalty * (1 - effects.penaltyReduce));
          notes.push('侦查护甲让扣分从 ' + penalty + ' 降到 ' + reduced + '。');
          penalty = reduced;
        }
        if (penalty > 0) state.score = Math.max(0, state.score - penalty);

        if (uses.comboGuard > 0) {
          uses.comboGuard -= 1;
          notes.push('等离子笔护住了连击。');
        } else {
          state.combo = 0;
        }

        state.answers.push({
          question: q, response: response, correct: false,
          gain: 0, penalty: penalty, timeout: !!meta.timeout
        });
        showFeedback(q, false, 0, {
          timeout: !!meta.timeout,
          penalty: penalty,
          notes: notes
        });
        global.GameAudio.play('wrong');
        onAnswer({ question: q, correct: false, gain: 0 });
      }

      state.locked = true;
      disableBody(q);
      setPrimaryLabel(state.index >= total - 1 ? '查看任务报告' : '下一题', false);

      if (!correct) {
        var fu = followUps[q.id];
        if (fu && !followUsed[q.id]) {
          followUsed[q.id] = true;
          renderFollowUp(q, fu);
        }
      }

      updateHud();
    }

    function showFeedback(q, correct, gain, extra) {
      extra = extra || {};
      var box = qcard.querySelector('#feedback');
      var title;
      if (extra.timeout) {
        title = '⏰ 时间到，督察记下了一次失误';
      } else if (correct) {
        var comboLine = (state.combo >= 2 && !extra.retried) ? ' · 连击 ×' + state.combo : '';
        title = '✔ 答对了！ +' + gain + ' 分' + comboLine;
      } else {
        title = '✘ 答错了';
      }

      var lines = [];
      if (!correct) {
        lines.push('<div class="fb-answer">正确答案：' + escapeHTML(answerText(q)) + '</div>');
        if (extra.penalty > 0) {
          lines.push('<div class="fb-penalty">督察扣了 ' + extra.penalty + ' 分。</div>');
        }
      }
      (extra.notes || []).forEach(function (note) {
        lines.push('<div class="fb-note">' + escapeHTML(note) + '</div>');
      });
      if (q.explain) {
        lines.push('<div class="fb-explain">' + stemHTML(q.explain) + '</div>');
      }

      box.innerHTML = '<div class="qfeedback ' + (correct ? 'ok' : 'bad') + '">' +
        '<div class="fb-title">' + title + '</div>' +
        lines.join('') +
        '</div>';
    }

    /* ----- 督察追问 ----- */

    function renderFollowUp(q, fu) {
      state.followPending = true;
      var box = qcard.querySelector('#feedback');
      var html = '<div class="followup">' +
        '<div class="fu-head">🧑‍✈️ 督察的追问</div>' +
        '<div class="fu-prompt">' + stemHTML(fu.prompt) + '</div>' +
        '<div class="fu-options">' +
        fu.options.map(function (opt, i) {
          return '<button class="fu-opt" type="button" data-fu="' + i + '">' +
            '<span class="fu-key">' + LETTERS[i] + '</span>' +
            '<span>' + escapeHTML(opt) + '</span></button>';
        }).join('') +
        '</div>' +
        '<div class="fu-result"></div>' +
        '</div>';
      box.insertAdjacentHTML('beforeend', html);
      currentPrimary().hidden = true;

      box.querySelectorAll('.fu-opt').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (!state.followPending) return;
          var pick = Number(btn.getAttribute('data-fu'));
          submitFollowUp(box, fu, pick);
        });
      });
    }

    function submitFollowUp(box, fu, pick) {
      var correct = pick === Number(fu.answer);
      box.querySelectorAll('.fu-opt').forEach(function (btn, i) {
        btn.disabled = true;
        if (i === Number(fu.answer)) btn.classList.add('correct');
        if (i === pick && !correct) btn.classList.add('wrong');
      });

      if (correct) {
        state.trust += 1;
        var bonus = 20;
        state.score += bonus;
        box.querySelector('.fu-result').innerHTML =
          '<div class="fu-pass">✔ 解释通过，督察信任 +1，奖金 +' + bonus +
          '<br><span>' + escapeHTML(fu.reply) + '</span></div>';
        global.GameAudio.play('correct');
      } else {
        box.querySelector('.fu-result').innerHTML =
          '<div class="fu-fail">✘ 解释没对上，督察在记录本上画了一个叉。' +
          '<br><span>正确答案：' + escapeHTML(fu.options[fu.answer]) + '</span></div>';
        global.GameAudio.play('wrong');
      }

      state.followPending = false;
      setPrimaryLabel(state.index >= total - 1 ? '查看任务报告' : '下一题', false);
      updateHud();
    }

    /* ----- 下一题 / 结束 ----- */

    function next() {
      if (!state.locked) return;
      if (state.followPending) return;
      if (state.index >= total - 1) {
        finish();
        return;
      }
      state.index += 1;
      state.attempt = 1;
      state.locked = false;
      paint();
      var cardTop = qcard.getBoundingClientRect().top + global.scrollY - 88;
      if (global.scrollY > cardTop) {
        global.scrollTo({ top: cardTop, behavior: 'smooth' });
      }
    }

    function finish() {
      stopTimer();
      var accuracy = total ? Math.round(state.correct / total * 100) : 0;
      var stars = global.GameRPG
        ? global.GameRPG.starsFor(state.correct, total, difficulty.key)
        : (state.correct / total >= 0.9 ? 3 : state.correct / total >= 0.7 ? 2 : state.correct / total >= 0.5 ? 1 : 0);

      var session = {
        questions: questions,
        answers: state.answers,
        score: state.score,
        correct: state.correct,
        total: total,
        maxCombo: state.maxCombo,
        accuracy: accuracy,
        stars: stars,
        trust: state.trust,
        skipped: state.skipped,
        difficulty: difficulty.key,
        duration: Math.max(1, Math.round((Date.now() - state.startedAt) / 1000))
      };
      progressEl.style.width = '100%';
      counterEl.textContent = '已完成 ' + total + ' 题';
      onComplete(session);
    }

    function onKeydown(ev) {
      if (destroyed) return;
      var tag = ev.target && ev.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (ev.key === 'Enter' && state.locked && !state.followPending) {
        ev.preventDefault();
        next();
      }
    }

    global.document.addEventListener('keydown', onKeydown);
    paint();

    return {
      destroy: function () {
        destroyed = true;
        stopTimer();
        global.document.removeEventListener('keydown', onKeydown);
      }
    };
  }

  global.GameQuiz = {
    start: start,
    judge: judge,
    answerText: answerText,
    isUsable: isUsable,
    normalizeText: normalizeText
  };
})(window);