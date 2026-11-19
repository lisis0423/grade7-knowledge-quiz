/* 线上页面冒烟测试：node tools/online-smoke.js */
const path = require('path');
const { JSDOM, VirtualConsole } = require(path.join(__dirname, 'node_modules', 'jsdom'));

const URL = 'https://lisis0423.github.io/grade7-knowledge-quiz/';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
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

(async function main() {
  const vc = new VirtualConsole();
  const errors = [];
  vc.on('jsdomError', (e) => {
    if (!/Not implemented/.test(e.message)) errors.push(e.message);
  });

  console.log('Loading ' + URL);
  const dom = await JSDOM.fromURL(URL, {
    resources: 'usable',
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    virtualConsole: vc
  });
  const w = dom.window;

  await new Promise((resolve) => {
    if (w.document.readyState === 'complete') return resolve();
    w.addEventListener('load', resolve);
    setTimeout(resolve, 10000);
  });
  await sleep(800);

  const d = w.document;
  const $ = (s) => d.querySelector(s);
  const $$ = (s) => Array.from(d.querySelectorAll(s));
  const txt = (el) => (el ? el.textContent.trim() : '');
  const click = async (el, ms) => {
    if (!el) throw new Error('元素不存在');
    el.click();
    await sleep(ms === undefined ? 80 : ms);
  };

  console.log('\n[1] 加载与首屏');
  check('页面标题正确', d.title.indexOf('知识闯关') !== -1, d.title);
  check('CSS link 已加载', !!$('link[href="css/style.css"]'));
  check('脚本全部执行（GameStore 可用）', typeof w.GameStore === 'object');
  check('题库已注册（7 科 47 任务）', w.GameSubjects.all().length === 7 &&
    w.GameSubjects.get('math').levels.length === 10);
  check('开场漫画自动进入', w.location.hash === '#/intro', w.location.hash);
  check('6 个分镜圆点', $$('.comic-dots i').length === 6, $$('.comic-dots i').length);
  check('第 1 格画面渲染', !!$('#comicArt svg'));
  check('第 1 格文字出现', txt($('#comicCopy')).indexOf('缺失') !== -1);

  console.log('\n[2] 漫画翻页与跳过');
  await click($('#comicNext'), 80);
  check('翻到第 2 格', txt($('.comic-tag')).indexOf('第 2 格') !== -1, txt($('.comic-tag')));
  check('第 2 格讲织女一与第三颗行星',
    txt($('#comicCopy')).indexOf('织女一') !== -1 && txt($('#comicCopy')).indexOf('第三颗') !== -1);
  await click($('#skipIntro'), 150);
  check('跳过后进入基地', w.location.hash === '#/', w.location.hash);

  console.log('\n[3] 首页与科目');
  check('7 张科目卡', $$('.subject-card').length === 7, $$('.subject-card').length);
  check('角色卡出现', !!$('.agent-card'));
  check('显示 47 个任务', txt($('.hero-stats')).indexOf('0/47') !== -1, txt($('.hero-stats')));
  check('六科全部可玩', w.GameSubjects.playable().length === 7);
  await click($('[data-subject="geography"]'), 150);
  check('进入地理任务列表', w.location.hash === '#/subject/geography', w.location.hash);
  check('11 个任务卡', $$('.level-card').length === 11, $$('.level-card').length);

  console.log('\n[4] 任务简报与答题');
  await click($$('.level-card')[0], 150);
  check('进入任务简报', w.location.hash === '#/brief/geography/geo-7a-1', w.location.hash);
  check('三档难度卡', $$('.diff-card').length === 3, $$('.diff-card').length);
  check('默认中级', $('.diff-card.selected').getAttribute('data-diff') === 'agent');
  await click($('#startMission'), 180);
  check('进入答题页', w.location.hash.indexOf('#/play/geography/geo-7a-1/agent') === 0, w.location.hash);
  check('题目卡片渲染', !!$('.qcard'));

  const stem = txt($('.qstem'));
  const level = w.GameSubjects.level('geography', 'geo-7a-1');
  const q = level.questions.find((x) => x.stem === stem);
  check('线上题库与页面题干匹配', !!q);
  if (q && q.type === 'choice') {
    const right = q.options[q.answer];
    const btn = $$('.option').find((b) => txt(b.querySelector('.opt-text')) === right);
    await click(btn, 120);
    check('答对反馈出现', !!$('.qfeedback.ok'));
    check('得分增加', txt($('#scorePill')).indexOf('100') !== -1, txt($('#scorePill')));
  }

  console.log('\n[5] 运行时错误');
  check('没有未捕获的脚本错误', errors.length === 0, errors.slice(0, 2).join(' | '));

  console.log('\n========== 结果 ==========');
  console.log(`通过 ${pass} 项，失败 ${fail} 项`);
  if (fail) process.exitCode = 1;
  dom.window.close();
})().catch((e) => {
  console.error('测试中断：' + e.stack);
  process.exitCode = 1;
});