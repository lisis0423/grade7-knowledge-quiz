/* 线上页面冒烟测试：node tools/online-smoke.js
   做法：先从线上抓 index.html 与全部脚本，按页面里的顺序在 jsdom 里 eval，
   这样既验证「线上文件是最新的、能访问」，又避免 jsdom 异步加载外部脚本时的乱序问题。 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const { JSDOM, VirtualConsole } = require(path.join(__dirname, 'node_modules', 'jsdom'));
const failList = [];

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
    failList.push(name + (extra !== undefined ? '  → ' + extra : ''));
    console.log('  ✘ ' + name + (extra !== undefined ? '  → ' + extra : ''));
  }
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': 'codearts-smoke', 'Accept-Encoding': 'identity', 'Cache-Control': 'no-cache' }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        res.resume();
        const next = new URL(res.headers.location, url).href;
        return fetchText(next).then(resolve, reject);
      }
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => resolve({ status: res.statusCode, body: Buffer.concat(chunks).toString('utf8') }));
    });
    req.on('error', reject);
    req.setTimeout(20000, () => req.destroy(new Error('timeout ' + url)));
  });
}

(async function main() {
  const vc = new VirtualConsole();
  const errors = [];
  vc.on('jsdomError', (e) => {
    if (!/Not implemented/.test(e.message)) errors.push(e.message.split('\n')[0]);
  });

  console.log('Loading ' + URL);
  const stamp = '?t=' + Date.now();
  const idx = await fetchText(URL + stamp);
  const css = await fetchText(URL + 'css/style.css' + stamp);

  const dom = new JSDOM(idx.body, {
    url: URL,
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    virtualConsole: vc
  });
  const w = dom.window;
  w.scrollTo = () => {};

  const scriptRe = /<script[^>]+src="([^"]+)"/g;
  const scripts = [];
  let hit;
  while ((hit = scriptRe.exec(idx.body))) scripts.push(hit[1]);

  const badScripts = [];
  let loaded = 0;
  for (const rel of scripts) {
    const res = await fetchText(URL + rel + stamp);
    if (res.status !== 200 || !res.body) {
      badScripts.push(rel + ' → HTTP ' + res.status);
      continue;
    }
    try {
      w.eval(res.body);
      loaded += 1;
    } catch (e) {
      badScripts.push(rel + ' → ' + e.message);
      errors.push(rel + ' → ' + e.message);
    }
  }
  await sleep(120);

  const d = w.document;
  const $ = (s) => d.querySelector(s);
  const $$ = (s) => Array.from(d.querySelectorAll(s));
  const txt = (el) => (el ? el.textContent.trim() : '');
  const click = async (el, ms) => {
    if (!el) throw new Error('元素不存在');
    el.click();
    await sleep(ms === undefined ? 80 : ms);
  };
  const go = async (hash) => {
    w.location.hash = hash;
    await sleep(140);
  };

  console.log('\n[0] 线上资源可访问');
  check('首页 HTML 返回 200', idx.status === 200 && idx.body.indexOf('知识闯关') !== -1, idx.status);
  check('CSS 返回 200 且非空', css.status === 200 && css.body.length > 1000, css.status + ' / ' + css.body.length);
  check('index.html 引用了 ' + scripts.length + ' 个脚本', scripts.length >= 20, scripts.length);
  check('全部脚本 200 且可执行（' + loaded + '/' + scripts.length + '）',
    badScripts.length === 0, badScripts.slice(0, 3).join(' | '));

  console.log('\n[1] 加载与首屏');
  check('页面标题正确', d.title.indexOf('知识闯关') !== -1, d.title);
  check('CSS link 已加载', !!$('link[href="css/style.css"]'));
  check('脚本全部执行（GameStore 可用）', typeof w.GameStore === 'object');
  check('题库已注册（7 科 71 任务）', w.GameSubjects.all().length === 7 &&
    w.GameSubjects.get('math').levels.length === 10);
  check('线上题库是七下新版（每科 10 关）',
    ['chinese', 'biology', 'history', 'politics'].every((sid) => w.GameSubjects.get(sid).levels.length === 10),
    ['chinese', 'biology', 'history', 'politics'].map((sid) => sid + ':' + w.GameSubjects.get(sid).levels.length).join(' '));
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
  check('显示 71 个任务', txt($('.hero-stats')).indexOf('0/71') !== -1, txt($('.hero-stats')));
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

  console.log('\n[5] 七下任务可进入');
  for (const sid of ['chinese', 'biology', 'history', 'politics']) {
    await go('#/subject/' + sid);
    check(sid + ' 列出 10 关', $$('.level-card').length === 10, $$('.level-card').length);
    const cards = $$('.level-card');
    await click(cards[cards.length - 1], 140);
    check(sid + ' 最后一关进入简报', w.location.hash.indexOf('#/brief/' + sid) === 0, w.location.hash);
    check(sid + ' 简报有督察台词', txt($('.brief-check')).indexOf('督察') !== -1);
  }

  console.log('\n[6] 知识星图');
  await go('#/');
  check('首页有知识星图入口', !!$('#toolMap'));
  await click($('#toolMap'), 150);
  check('进入知识星图选科页', w.location.hash === '#/map', w.location.hash);
  check('7 科可选', $$('[data-map]').length === 7, $$('[data-map]').length);
  await click($('[data-map="math"]'), 180);
  check('进入数学知识星图', w.location.hash === '#/map/math', w.location.hash);
  check('章节已渲染', $$('.kp-chapter').length >= 10, $$('.kp-chapter').length);
  check('知识点已渲染', $$('.kp-item').length > 0, $$('.kp-item').length);
  check('显示前置知识', txt($('#kpChapters')).indexOf('前置') !== -1);
  check('显示常见错误', txt($('#kpChapters')).indexOf('常见错误') !== -1);

  const onlineSearch = $('#kpSearch');
  onlineSearch.value = '绝对值';
  onlineSearch.dispatchEvent(new w.Event('input', { bubbles: true }));
  await sleep(120);
  check('搜索过滤生效',
    $$('.kp-item:not([hidden])').length > 0 &&
    $$('.kp-item:not([hidden])').length < $$('.kp-item').length,
    $$('.kp-item:not([hidden])').length + '/' + $$('.kp-item').length);

  console.log('\n[7] 运行时错误');
  check('没有未捕获的脚本错误', errors.length === 0, errors.slice(0, 2).join(' | '));

  fs.writeFileSync(path.join(__dirname, 'online-result.txt'), 'pass=' + pass + ' fail=' + fail + '\n' + failList.join('\n'), 'utf8');
  console.log('\n========== 结果 ==========');
  console.log(`通过 ${pass} 项，失败 ${fail} 项`);
  if (fail) process.exitCode = 1;
  dom.window.close();
})().catch((e) => {
  fs.writeFileSync(path.join(__dirname, 'online-result.txt'), 'INTERRUPTED\n' + (e.stack || e.message), 'utf8');
  console.error('测试中断：' + e.stack);
  process.exitCode = 1;
});