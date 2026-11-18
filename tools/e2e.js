/* ============================================================
   端到端测试（RPG 版）
   运行：node tools/e2e.js
   ============================================================ */
const fs = require('fs');
const path = require('path');
const { JSDOM, VirtualConsole } = require(path.join(__dirname, 'node_modules', 'jsdom'));

const root = path.resolve(__dirname, '..');
const SCRIPTS = [
  'js/subjects.js',
  'js/store.js',
  'js/audio.js',
  'data/items.js',
  'data/missions.js',
  'data/missions-more.js',
  'data/intro.js',
  'data/geography-1.js',
  'data/geography-2.js',
  'data/geography-3.js',
  'data/geography-4.js',
  'data/math.js',
  'data/chinese.js',
  'data/english.js',
  'data/biology.js',
  'data/history.js',
  'data/politics.js',
  'data/placeholders.js',
  'js/rpg.js',
  'js/quiz.js',
  'js/app.js'
];

let pass = 0;
let fail = 0;

function check(name, cond, extra) {
  if (cond) {
    pass += 1;
    console.log('  ✔ ' + name);
  } else {
    fail += 1;
    console.log('  ✘ ' + name + (extra !== undefined ? '  → ' + extra : ''));
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async function main() {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', (e) => {
    if (!/Not implemented/.test(e.message)) console.log('   [jsdom] ' + (e.stack || e.message));
  });

  const dom = new JSDOM(html, {
    url: 'https://quiz.local/',
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    virtualConsole
  });
  const w = dom.window;
  w.scrollTo = () => {};

  SCRIPTS.forEach((rel) => {
    const code = fs.readFileSync(path.join(root, rel), 'utf8');
    try {
      w.eval(code);
    } catch (e) {
      console.log('脚本执行失败: ' + rel + ' → ' + e.stack);
      process.exitCode = 1;
    }
  });

  const d = w.document;
  const $ = (sel) => d.querySelector(sel);
  const $$ = (sel) => Array.from(d.querySelectorAll(sel));
  const txt = (el) => (el ? el.textContent.trim() : '');
  const click = async (el, ms) => {
    if (!el) throw new Error('要点击的元素不存在');
    el.click();
    await sleep(ms === undefined ? 50 : ms);
  };
  const go = async (hash) => {
    w.location.hash = hash;
    await sleep(100);
  };

  function findQuestion() {
    const stem = txt($('.qstem'));
    const subjects = w.GameSubjects.all();
    for (let i = 0; i < subjects.length; i++) {
      for (let j = 0; j < subjects[i].levels.length; j++) {
        const qs = subjects[i].levels[j].questions || [];
        for (let k = 0; k < qs.length; k++) {
          if (qs[k].stem === stem) return qs[k];
        }
      }
    }
    return null;
  }

  async function answerCorrectly(q) {
    if (q.type === 'choice') {
      const right = q.options[q.answer];
      const btn = $$('.option').find((b) => txt(b.querySelector('.opt-text')) === right);
      if (!btn) throw new Error('找不到正确选项: ' + right);
      await click(btn, 20);
    } else if (q.type === 'judge') {
      const btn = $$('.option').find((b) => b.getAttribute('data-value') === String(q.answer));
      await click(btn, 20);
    } else if (q.type === 'fill') {
      $('#fillInput').value = q.accept[0];
      await click($('#primaryBtn'), 20);
    } else if (q.type === 'match') {
      for (let i = 0; i < q.left.length; i++) {
        const cols = $$('.match-col');
        await click(cols[0].querySelectorAll('.match-item')[i], 5);
        await click($$('.match-col')[1].querySelectorAll('.match-item')[q.answer[i]], 5);
      }
      await click($('#primaryBtn'), 20);
    }
  }

  let chestSeen = false;

  async function clearChestIfAny() {
    const mask = $('.chest-mask');
    if (!mask) return false;
    chestSeen = true;
    const opt = mask.querySelector('.chest-option');
    if (opt) await click(opt, 80);
    const close = mask.querySelector('#chestClose');
    if (close && !close.hidden) await click(close, 60);
    return true;
  }

  /* ---------- 0. 开场漫画 ---------- */
  console.log('\n[0] 开场漫画');
  check('首次打开自动进入漫画', w.location.hash === '#/intro', w.location.hash);
  check('共 6 个分镜', $$('.comic-dots i').length === 6, $$('.comic-dots i').length);
  check('显示第 1 格标题', txt($('.comic-tag')).indexOf('第 1 格') !== -1, txt($('.comic-tag')));
  check('第 1 格画面已渲染', !!$('#comicArt svg'));
  check('第 1 格说明星图缺口', txt($('#comicCopy')).indexOf('缺失') !== -1);
  check('第一格不能上一格', $('#comicPrev').disabled === true);

  await click($('#comicNext'), 60);
  check('第 2 格讲老家', txt($('.comic-tag')).indexOf('第 2 格') !== -1);
  check('第 2 格交代恒星与第几颗行星',
    txt($('#comicCopy')).indexOf('织女一') !== -1 && txt($('#comicCopy')).indexOf('第三颗') !== -1);

  await click($('#comicNext'), 60);
  check('第 3 格是侦查员档案', txt($('#comicCopy')).indexOf('外勤侦查员') !== -1);
  check('档案交代文明等级与部门',
    txt($('.comic-art')).indexOf('Ⅱ 型文明') !== -1 && txt($('.comic-art')).indexOf('第七观测站') !== -1);

  await click($('#comicNext'), 60);
  check('第 4 格出现上级', txt($('#comicCopy')).indexOf('赫兹督察') !== -1);
  check('第 4 格交代 11 个任务', txt($('#comicCopy')).indexOf('11 个测绘任务') !== -1);

  await click($('#comicNext'), 60);
  check('第 5 格正在降落', txt($('.comic-tag')).indexOf('第 5 格') !== -1);
  check('第 5 格交代伪装身份', txt($('#comicCopy')).indexOf('初一学生') !== -1);

  await click($('#comicNext'), 60);
  check('第 6 格任务开始', txt($('.comic-tag')).indexOf('第 6 格') !== -1);
  check('最后一格按钮变为降落地球', txt($('#comicNext')).indexOf('降落地球') !== -1);

  await click($('#comicNext'), 140);
  check('降落后进入基地', w.location.hash === '#/', w.location.hash);
  check('开场已标记为看过', w.GameStore.introSeen() === true);

  await go('#/intro');
  check('可以从设置重看开场', w.location.hash === '#/intro', w.location.hash);
  await click($('#skipIntro'), 120);
  check('跳过开场回到基地', w.location.hash === '#/');

  /* ---------- 1. 基地首页 ---------- */
  console.log('\n[1] 侦查员基地');
  check('渲染 7 张科目卡', $$('.subject-card').length === 7, $$('.subject-card').length);
  check('六科全部可玩，没有占位卡', $$('.subject-card.placeholder').length === 0,
    $$('.subject-card.placeholder').length);
  check('角色卡出现', !!$('.agent-card'));
  check('初始等级 Lv.1', txt($('.agent-lv')) === 'Lv.1', txt($('.agent-lv')));
  check('装备舱入口存在', !!$('#toBag'));
  check('显示 35 个任务', txt($('.hero-stats')).indexOf('0/35') !== -1, txt($('.hero-stats')));
  check('数学 4 关', w.GameSubjects.get('math').levels.length === 4);
  check('语文 4 关', w.GameSubjects.get('chinese').levels.length === 4);
  check('英语 4 关', w.GameSubjects.get('english').levels.length === 4);
  check('生物 4 关', w.GameSubjects.get('biology').levels.length === 4);
  check('历史 4 关', w.GameSubjects.get('history').levels.length === 4);
  check('道法 4 关', w.GameSubjects.get('politics').levels.length === 4);

  /* ---------- 2. 任务列表 / 简报 / 难度 ---------- */
  console.log('\n[2] 任务简报与三档难度');
  await click($('[data-subject="geography"]'));
  check('进入地理任务列表', w.location.hash === '#/subject/geography', w.location.hash);
  check('列出 11 个任务', $$('.level-card').length === 11);
  check('关卡显示三档标签', $$('.diff-dots .dd').length === 33, $$('.diff-dots .dd').length);

  await click($$('.level-card')[0]);
  check('进入任务简报', w.location.hash === '#/brief/geography/geo-7a-1', w.location.hash);
  check('显示任务代号', txt($('.brief-badge')).indexOf('任务 01') !== -1, txt($('.brief-badge')));
  check('显示督察台词', txt($('.brief-check')).indexOf('督察') !== -1);
  check('三张难度卡', $$('.diff-card').length === 3, $$('.diff-card').length);
  check('默认选中中级', $('.diff-card.selected').getAttribute('data-diff') === 'agent');
  check('显示装备加成', !!$('.gp-body'));

  await click($('[data-diff="legend"]'), 40);
  check('可切到高级', $('.diff-card.selected').getAttribute('data-diff') === 'legend');
  check('按钮跟着切难度', txt($('#startMission')).indexOf('高级') !== -1, txt($('#startMission')));
  await click($('[data-diff="agent"]'), 40);
  check('切回中级', txt($('#startMission')).indexOf('中级') !== -1);

  /* ---------- 3. 组题规则 ---------- */
  console.log('\n[3] 三档组题');
  const setRookie = w.GameRPG.buildQuestionSet('geography', 'geo-7a-1', 'rookie');
  const setAgent = w.GameRPG.buildQuestionSet('geography', 'geo-7a-1', 'agent');
  const setLegend = w.GameRPG.buildQuestionSet('geography', 'geo-7a-1', 'legend');
  check('基础档 6 题', setRookie.questions.length === 6, setRookie.questions.length);
  check('中级档 10 题', setAgent.questions.length === 10, setAgent.questions.length);
  check('高级档在没有已学章节时只考本关', setLegend.questions.length === 10 && setLegend.extraCount === 0,
    setLegend.questions.length + '/' + setLegend.extraCount);
  check('基础档题目全是选择/判断',
    setRookie.questions.every((q) => q.type === 'choice' || q.type === 'judge'));

  w.GameStore.recordMission('geo-7a-1', 'agent', { score: 100, stars: 2 });
  const setLegend2 = w.GameRPG.buildQuestionSet('geography', 'geo-7a-2', 'legend');
  check('高级档会加入已学章节的跨区题',
    setLegend2.questions.length === 12 && setLegend2.extraCount === 2,
    setLegend2.questions.length + '/' + setLegend2.extraCount);

  /* ---------- 4. 章节全对 ---------- */
  console.log('\n[4] 执行任务（中级，全对）');
  await click($('#startMission'), 120);
  check('进入答题页', w.location.hash === '#/play/geography/geo-7a-1/agent', w.location.hash);
  check('题目卡片出现', !!$('.qcard'));
  check('中级不限时，计时器隐藏', $('#quizTimer').hidden === true);

  let answered = 0;
  while (w.location.hash.indexOf('#/result') === -1 && answered < 20) {
    const q = findQuestion();
    if (!q) {
      check('第 ' + (answered + 1) + ' 题能找到题库原题', false, txt($('.qstem')));
      break;
    }
    await answerCorrectly(q);
    const fb = $('.qfeedback');
    check('第 ' + (answered + 1) + ' 题（' + q.type + '）判定正确', fb && fb.classList.contains('ok'),
      fb ? fb.className : '没有反馈');
    answered += 1;

    if (answered === 1) check('得分 100', txt($('#scorePill')) === '100 分', txt($('#scorePill')));
    if (answered === 2) check('连击徽章出现', $('#comboBadge').classList.contains('show'));

    await sleep(400);
    await clearChestIfAny();
    const btn = $('#primaryBtn');
    if (!btn || btn.hidden) {
      check('出现继续按钮', false);
      break;
    }
    await click(btn, 80);
  }

  check('答满 10 题', answered === 10, answered);
  check('出现连击宝箱', chestSeen === true);
  check('进入任务报告', w.location.hash === '#/result', w.location.hash);
  await sleep(120);
  check('报告卡片出现', !!$('.result-card'));
  check('评级为 S', txt($('.rank-badge')) === 'S', txt($('.rank-badge')));
  check('三颗星', $$('.big-stars .on').length === 3);
  check('得分 1700', txt($$('.result-grid b')[0]) === '1700', txt($$('.result-grid b')[0]));
  check('答对 10/10', txt($$('.result-grid b')[1]) === '10/10', txt($$('.result-grid b')[1]));
  check('最高连击 ×10', txt($$('.result-grid b')[3]) === '×10', txt($$('.result-grid b')[3]));
  check('显示任务奖金', !!$('.reward-panel'));
  check('金币已入账', w.GameStore.getProfile().coins >= 130, w.GameStore.getProfile().coins);
  check('经验已入账并升级', w.GameStore.getProfile().level >= 2, w.GameStore.getProfile().level);
  check('成绩写入旧统计', w.GameStore.levelProgress('geography', 'geo-7a-1').best === 1700);
  check('今日情报量 10', w.GameStore.todayCount() === 10);
  check('有再闯一次按钮', !!$('#againBtn'));
  check('有换难度按钮', !!$('#changeDiff'));

  /* ---------- 5. 错题 → 追问 → 重练 ---------- */
  console.log('\n[5] 答错、督察追问与错题重练');
  await go('#/play/geography/geo-7a-2/agent');
  const firstQ = findQuestion();
  const wrongOption = $$('.option').find((b) => txt(b.querySelector('.opt-text')) !== firstQ.options[firstQ.answer]);
  await click(wrongOption, 30);
  check('错误反馈出现', !!$('.qfeedback.bad'));
  check('扣分提示出现', !!$('.fb-penalty'));
  check('错题进入错题本', w.GameStore.wrongCount() === 1, w.GameStore.wrongCount());

  await click($('#primaryBtn'), 80);
  let n = 1;
  while (w.location.hash.indexOf('#/result') === -1 && n < 20) {
    await clearChestIfAny();
    const q = findQuestion();
    await answerCorrectly(q);
    n += 1;
    await sleep(400);
    await clearChestIfAny();
    await click($('#primaryBtn'), 80);
  }
  check('第二章答完 10 题', n === 10, n);
  check('报告列出本次漏洞', $$('.review-item').length === 1, $$('.review-item').length);
  check('有重练按钮', !!$('#practiceWrong'));
  check('正确率 90% 对应 2 星', $$('.big-stars .on').length === 2, $$('.big-stars .on').length);

  await click($('#practiceWrong'), 120);
  check('进入错题重练', w.location.hash === '#/review/geography', w.location.hash);
  const reviewQ = findQuestion();
  check('重练的是错题', reviewQ && reviewQ.id === firstQ.id, reviewQ && reviewQ.id);
  await answerCorrectly(reviewQ);
  check('重练答对', !!$('.qfeedback.ok'));
  await click($('#primaryBtn'), 140);
  check('重练后回到报告', w.location.hash === '#/result', w.location.hash);
  check('错题已被移除', w.GameStore.wrongCount() === 0, w.GameStore.wrongCount());
  await go('#/wrong');
  check('错题本显示空状态', !!$('.empty'));

  /* ---------- 6. 动态场景（独立挂载） ---------- */
  console.log('\n[6] 限时、重答、督察追问');

  // 限时超时
  const timeMount = d.createElement('div');
  d.body.appendChild(timeMount);
  let timeResult = null;
  w.GameQuiz.start({
    mount: timeMount,
    questions: [w.GameSubjects.level('geography', 'geo-7a-1').questions[0]],
    difficulty: { key: 'legend', timeLimit: 1, penalty: 50, retry: 0, starLine: [0.8, 0.9, 1] },
    effects: {},
    onAnswer: () => {},
    onComplete: (s) => { timeResult = s; }
  });
  check('限时题显示倒计时', timeMount.querySelector('#quizTimer').hidden === false);
  await sleep(1400);
  check('超时判为答错', timeMount.querySelector('.qfeedback.bad') !== null);
  check('超时被督察扣分', timeMount.querySelector('.fb-penalty') !== null);
  timeMount.querySelector('#primaryBtn').click();
  await sleep(60);
  check('超时仍可结束', timeResult && timeResult.correct === 0 && timeResult.total === 1,
    timeResult ? JSON.stringify({ c: timeResult.correct, t: timeResult.total }) : 'null');

  // 重答机会
  const retryMount = d.createElement('div');
  d.body.appendChild(retryMount);
  let retryResult = null;
  w.GameQuiz.start({
    mount: retryMount,
    questions: [w.GameSubjects.level('geography', 'geo-7a-1').questions[0]],
    difficulty: { key: 'rookie', timeLimit: 0, penalty: 0, retry: 1, starLine: [0.5, 0.7, 0.9] },
    effects: {},
    onAnswer: () => {},
    onComplete: (s) => { retryResult = s; }
  });
  const rq = w.GameSubjects.level('geography', 'geo-7a-1').questions[0];
  const rqWrong = Array.from(retryMount.querySelectorAll('.option'))
    .find((b) => txt(b.querySelector('.opt-text')) !== rq.options[rq.answer]);
  rqWrong.click();
  await sleep(40);
  check('答错后出现重答提示', retryMount.querySelector('#primaryBtn').textContent.indexOf('再试一次') !== -1,
    retryMount.querySelector('#primaryBtn').textContent);
  retryMount.querySelector('#primaryBtn').click();
  await sleep(60);
  check('重答后题目重新出现', retryMount.querySelectorAll('.option').length >= 2);
  const rqRight = Array.from(retryMount.querySelectorAll('.option'))
    .find((b) => txt(b.querySelector('.opt-text')) === rq.options[rq.answer]);
  rqRight.click();
  await sleep(60);
  check('重答答对得一半分', retryMount.querySelector('#scorePill').textContent === '50 分',
    retryMount.querySelector('#scorePill').textContent);
  retryMount.querySelector('#primaryBtn').click();
  await sleep(60);
  check('重答后正常结束', retryResult && retryResult.correct === 1 && retryResult.score === 50,
    retryResult ? JSON.stringify({ c: retryResult.correct, s: retryResult.score }) : 'null');

  // 督察追问
  const fuMount = d.createElement('div');
  d.body.appendChild(fuMount);
  let fuResult = null;
  const fuQuestion = w.GameSubjects.question('geography', 'geo-7a-2', 'geo7a2-q3');
  w.GameQuiz.start({
    mount: fuMount,
    questions: [fuQuestion],
    difficulty: { key: 'agent', timeLimit: 0, penalty: 20, retry: 0, starLine: [0.6, 0.8, 0.95] },
    effects: {},
    followUps: w.GameMissions.followUps('geo-7a-2'),
    onAnswer: () => {},
    onComplete: (s) => { fuResult = s; }
  });
  const fuWrong = Array.from(fuMount.querySelectorAll('.option'))
    .find((b) => txt(b.querySelector('.opt-text')) !== fuQuestion.options[fuQuestion.answer]);
  fuWrong.click();
  await sleep(60);
  check('答错后督察追问出现', !!fuMount.querySelector('.followup'));
  check('追问期间隐藏下一题按钮', fuMount.querySelector('#primaryBtn').hidden === true);
  fuMount.querySelectorAll('.fu-opt')[0].click();
  await sleep(60);
  check('解释通过获得信任', !!fuMount.querySelector('.fu-pass'));
  check('追问后按钮恢复', fuMount.querySelector('#primaryBtn').hidden === false);
  fuMount.querySelector('#primaryBtn').click();
  await sleep(60);
  check('追问计入任务报告', fuResult && fuResult.trust === 1, fuResult && fuResult.trust);

  // 装备效果：跳过
  const skipMount = d.createElement('div');
  d.body.appendChild(skipMount);
  let skipResult = null;
  w.GameQuiz.start({
    mount: skipMount,
    questions: [w.GameSubjects.level('geography', 'geo-7a-1').questions[0]],
    difficulty: { key: 'agent', timeLimit: 0, penalty: 20, retry: 0, starLine: [0.6, 0.8, 0.95] },
    effects: { skip: 1 },
    onAnswer: () => {},
    onComplete: (s) => { skipResult = s; }
  });
  check('装备技能按钮出现', !!skipMount.querySelector('#skipBtn'));
  skipMount.querySelector('#skipBtn').click();
  await sleep(60);
  check('滑板跳过后显示答案', skipMount.querySelector('.qfeedback.warn') !== null);
  skipMount.querySelector('#primaryBtn').click();
  await sleep(60);
  check('跳过不计分但计入题数', skipResult && skipResult.skipped === 1 && skipResult.score === 0,
    skipResult ? JSON.stringify({ sk: skipResult.skipped, s: skipResult.score }) : 'null');

  /* ---------- 7. 装备舱 ---------- */
  console.log('\n[7] 装备舱与穿戴');
  w.GameStore.addItem('hoverboard', 1);
  w.GameStore.addItem('wings', 1);
  w.GameStore.addItem('candy', 2);
  await go('#/bag');
  check('四个装备槽', $$('.slot-card').length === 4, $$('.slot-card').length);
  check('背包含物品', $$('.bag-item').length >= 3, $$('.bag-item').length);
  check('补给单独分组', $$('.bag-grid').length === 2, $$('.bag-grid').length);

  await click($('[data-item="hoverboard"]'), 60);
  check('物品详情弹窗出现', !!$('.item-modal'));
  await click($('#itemAction'), 120);
  check('点击后完成穿戴', w.GameStore.getProfile().equipped.tool === 'hoverboard',
    w.GameStore.getProfile().equipped.tool);
  check('槽位显示已装备', $$('.slot-card.filled').length === 1, $$('.slot-card.filled').length);

  await click($('[data-item="wings"]'), 60);
  await click($('#itemAction'), 120);
  check('装扮槽也能穿戴', w.GameStore.getProfile().equipped.wings === 'wings');

  const coinsBefore = w.GameStore.getProfile().coins;
  await click($('[data-item="candy"]'), 60);
  await click($('#itemAction'), 120);
  check('使用补给获得经验', w.GameStore.getProfile().exp !== undefined);
  check('补给数量减少', w.GameStore.getProfile().items.candy === 1, w.GameStore.getProfile().items.candy);
  check('金币未被补给扣掉', w.GameStore.getProfile().coins >= coinsBefore);

  /* ---------- 8. 报告与首页 ---------- */
  console.log('\n[8] 学习报告与基地状态');
  await go('#/stats');
  check('8 个统计块', $$('.stat-box').length === 8, $$('.stat-box').length);
  check('累计答题 20', txt($$('.stat-box b')[0]) === '20', txt($$('.stat-box b')[0]));
  check('报告显示等级', txt($('#view')).indexOf('Lv.') !== -1);

  await go('#/');
  check('首页星星 5/105', txt($('.hero-stats')).indexOf('5/105') !== -1, txt($('.hero-stats')));
  check('首页已挑战 2 个任务', txt($('.hero-stats')).indexOf('2/35') !== -1, txt($('.hero-stats')));
  check('角色卡等级已提升', txt($('.agent-lv')) !== 'Lv.1', txt($('.agent-lv')));
  check('角色卡显示金币', txt($('.agent-meta')).indexOf('🪙') !== -1);

  /* ---------- 10. 六科任务冒烟 ---------- */
  console.log('\n[10] 六科任务');
  const extraSubjects = [
    ['math', '数学任务 01'],
    ['chinese', '语文任务 01'],
    ['english', '英语任务 01'],
    ['biology', '生物任务 01'],
    ['history', '历史任务 01'],
    ['politics', '道法任务 01']
  ];
  for (const [sid, code] of extraSubjects) {
    await go('#/subject/' + sid);
    check(sid + ' 任务列表 4 关', $$('.level-card').length === 4, $$('.level-card').length);
    await click($$('.level-card')[0], 130);
    check(sid + ' 进入简报', w.location.hash.indexOf('#/brief/' + sid) === 0, w.location.hash);
    check(sid + ' 简报有任务代号', txt($('.brief-badge')).indexOf(code) !== -1, txt($('.brief-badge')));
    check(sid + ' 简报有督察台词', txt($('.brief-check')).indexOf('督察') !== -1, txt($('.brief-check')));
  }

  await go('#/play/math/math-7a-1/agent');
  const mathQ = findQuestion();
  check('数学题能匹配到题库', !!mathQ);
  await answerCorrectly(mathQ);
  check('数学答对反馈正常', !!$('.qfeedback.ok'));
  check('数学得分正常', parseInt(txt($('#scorePill')), 10) >= 100, txt($('#scorePill')));

  check('数学第 3 关有督察追问',
    Object.keys(w.GameMissions.followUps('math-7a-3')).length === 1);
  check('语文第 2 关有督察追问',
    Object.keys(w.GameMissions.followUps('chn-7a-2')).length === 1);
  check('六科剧情全部注册',
    extraSubjects.every(([sid]) => {
      const firstLevel = w.GameSubjects.get(sid).levels[0];
      return !!w.GameMissions.get(firstLevel.id);
    }));

  /* ---------- 9. 判分函数 ---------- */
  console.log('\n[9] 判分与规则函数');
  const judge = w.GameQuiz.judge;
  check('单选判分', judge({ type: 'choice', options: ['a', 'b'], answer: 1 }, 1) === true);
  check('填空忽略空格与全角', judge({ type: 'fill', accept: ['6371千米'] }, ' ６３７１ 千米 ') === true);
  check('连线全对判对',
    judge({ type: 'match', left: ['a', 'b'], right: ['x', 'y'], answer: [1, 0] }, { 0: 1, 1: 0 }) === true);
  check('高级 100% 才是三星',
    w.GameRPG.starsFor(11, 12, 'legend') === 2 && w.GameRPG.starsFor(12, 12, 'legend') === 3);
  check('基础档门槛更低',
    w.GameRPG.starsFor(9, 10, 'rookie') === 3 && w.GameRPG.starsFor(9, 10, 'agent') === 2);
  check('评级 S 需要满分', w.GameRPG.rankFor(3, 100).key === 'S' && w.GameRPG.rankFor(3, 90).key === 'A');
  check('装备效果叠加', (function () {
    const e = w.GameRPG.effectsOf({
      equipped: { tool: 'hoverboard', weapon: 'pulsegun', armor: 'armor', wings: 'wings' }
    });
    return e.skip === 1 && e.shield === 1 && e.penaltyReduce === 0.5 && e.scoreRate > 0;
  })());

  console.log('\n========== 结果 ==========');
  console.log(`通过 ${pass} 项，失败 ${fail} 项`);
  if (fail) process.exitCode = 1;
})().catch((e) => {
  console.error('\n测试中断：' + e.stack);
  process.exitCode = 1;
});