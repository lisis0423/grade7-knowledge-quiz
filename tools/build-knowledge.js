/* 从 k12-knowledge-points 的初中拆分数据中提取七年级知识点
   输出 data/knowledge.js（供游戏内“知识星图”使用）
   运行：node tools/build-knowledge.js
*/
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const refs = path.join(root, 'refs');

const SUBJECTS = [
  { id: 'math', file: 'math-kp.json', name: '数学' },
  { id: 'chinese', file: 'chinese-kp.json', name: '语文' },
  { id: 'english', file: 'english-kp.json', name: '英语' },
  { id: 'biology', file: 'bio-kp.json', name: '生物' },
  { id: 'history', file: 'history-kp.json', name: '历史' },
  { id: 'politics', file: 'politics-kp.json', name: '道德与法治' },
  { id: 'geography', file: 'geo-kp.json', name: '地理' }
];

function chapterKey(title) {
  return String(title || '')
    .replace(/^第[一二三四五六七八九十百]+章\s*/, '')
    .replace(/[\s　]/g, '')
    .replace(/[（(].*?[)）]/g, '')
    .trim();
}

function parseAnnotations(kp) {
  try {
    return JSON.parse(kp.annotations || '{}');
  } catch (e) {
    return {};
  }
}

const out = {};
const report = [];

SUBJECTS.forEach((sub) => {
  const file = path.join(refs, sub.file);
  if (!fs.existsSync(file)) {
    console.log('missing ' + sub.file);
    return;
  }
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const points = (data.knowledge_points || []).filter((kp) => {
    if ((kp.grades || []).includes('七年级')) return true;
    return (kp.textbooks || []).some((t) => (t.grade || '').includes('七年级'));
  });

  const byChapter = {};
  points.forEach((kp) => {
    if ((kp.confidence || 0) < 0.85) return;
    const tb = (kp.textbooks || []).find((t) => (t.grade || '').includes('七年级')) ||
      (kp.textbooks || [])[0] || {};
    const cp = tb.chapter_path;
    const chapterTitle = Array.isArray(cp) ? cp[0] : String(cp || '').split(/[>＞/]/)[0];
    if (!chapterTitle) return;
    const key = chapterKey(chapterTitle);
    if (!key) return;
    if (/^(复习题|小结|习题|阅读与思考|数学活动|单元|期中|期末)/.test(key)) return;

    const ann = parseAnnotations(kp);
    const a = ann.assessability && typeof ann.assessability.value === 'number'
      ? ann.assessability.value : 0.5;
    const pre = (ann.prerequisites && ann.prerequisites.value) || [];
    const mis = (ann.misconceptions && ann.misconceptions.value) || [];
    const type = (ann.knowledgeType && ann.knowledgeType.value) || '';
    const diff = ann.difficulty && typeof ann.difficulty.value === 'number'
      ? Math.round(ann.difficulty.value * 100) / 100 : 0.5;

    if (!byChapter[key]) byChapter[key] = { t: chapterTitle.replace(/[\s　]+/g, ' ').trim(), k: key, pts: [] };
    if (byChapter[key].pts.some((p) => p.n === kp.canonical_name)) return;
    byChapter[key].pts.push({
      n: kp.canonical_name,
      p: pre.slice(0, 3).map(String),
      m: mis.slice(0, 2).map(String),
      d: diff,
      t: type,
      _a: a
    });
  });

  const chapters = Object.keys(byChapter).map((k) => {
    const ch = byChapter[k];
    ch.pts.sort((x, y) => {
      if (y._a !== x._a) return y._a - x._a;
      return x.d - y.d;
    });
    ch.pts = ch.pts.slice(0, 15).map((p) => {
      delete p._a;
      return p;
    });
    return ch;
  });

  out[sub.id] = { name: sub.name, chapters: chapters };
  report.push({
    id: sub.id,
    name: sub.name,
    grade7: points.length,
    chapters: chapters.length,
    points: chapters.reduce((n, c) => n + c.pts.length, 0)
  });

  console.log('\n[' + sub.name + '] 七年级 ' + points.length + ' 个知识点，保留 ' +
    chapters.length + ' 章 / ' + report[report.length - 1].points + ' 个');
  chapters.forEach((c) => console.log('  ' + c.t + '  (' + c.pts.length + ')'));
});

const body = '/* 由 tools/build-knowledge.js 从 k12-knowledge-points 生成，请勿手改 */\n' +
  'window.GameKnowledge = ' + JSON.stringify(out, null, 0) + ';\n';
fs.writeFileSync(path.join(root, 'data', 'knowledge.js'), body, 'utf8');
console.log('\nwrote data/knowledge.js  ' + Math.round(body.length / 1024) + ' KB');
console.log(JSON.stringify(report, null, 2));