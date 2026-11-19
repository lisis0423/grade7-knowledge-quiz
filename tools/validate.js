/* 题库自检脚本：node tools/validate.js */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');

const sandbox = { console };
sandbox.window = sandbox;
sandbox.globalThis = sandbox;
sandbox.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {}
};
sandbox.location = { hash: '' };
sandbox.document = {
  getElementById: () => null,
  addEventListener: () => {},
  removeEventListener: () => {}
};
vm.createContext(sandbox);

function run(rel) {
  const file = path.join(root, rel);
  const code = fs.readFileSync(file, 'utf8');
  vm.runInContext(code, sandbox, { filename: rel });
}

run('js/subjects.js');
sandbox.GameSubjects = sandbox.window.GameSubjects;
['data/missions.js', 'data/missions-more.js', 'data/missions-extra.js', 'data/intro.js',
  'data/geography-1.js', 'data/geography-2.js', 'data/geography-3.js', 'data/geography-4.js',
  'data/math.js', 'data/chinese.js', 'data/english.js',
  'data/biology.js', 'data/history.js', 'data/politics.js',
  'data/placeholders.js'].forEach(run);
run('js/quiz.js');

const GS = sandbox.GameSubjects;
const Quiz = sandbox.GameQuiz;
const issues = [];
const ids = new Set();
const typeCount = {};

let totalQuestions = 0;
let totalLevels = 0;

GS.all().forEach((subject) => {
  console.log(`\n[${subject.id}] ${subject.icon} ${subject.name}  order=${subject.order}  available=${subject.available}`);

  if (!subject.available) {
    if (subject.levels.length) issues.push(`${subject.id} 是占位科目但带了关卡`);
    return;
  }
  if (!subject.levels.length) issues.push(`${subject.id} 没有关卡`);

  subject.levels.forEach((level, li) => {
    totalLevels += 1;
    if (!level.questions.length) issues.push(`${subject.id}/${level.id} 没有题目`);
    console.log(`  ${li + 1}. ${level.title} —— ${level.questions.length} 题`);

    level.questions.forEach((q) => {
      totalQuestions += 1;
      typeCount[q.type] = (typeCount[q.type] || 0) + 1;

      if (!q.id) issues.push(`${level.id} 有题目缺少 id`);
      if (ids.has(q.id)) issues.push(`重复题目 id: ${q.id}`);
      ids.add(q.id);

      if (!q.stem || !String(q.stem).trim()) issues.push(`${q.id} 题干为空`);
      if (!q.explain) issues.push(`${q.id} 没有解析`);

      if (!Quiz.isUsable(q)) {
        issues.push(`${q.id} 结构不可用：${JSON.stringify({
          type: q.type, answer: q.answer, options: q.options && q.options.length,
          accept: q.accept, left: q.left && q.left.length, right: q.right && q.right.length
        })}`);
      }

      if (q.type === 'choice') {
        if (new Set(q.options).size !== q.options.length) issues.push(`${q.id} 选项有重复`);
        q.options.forEach((opt, i) => {
          if (!String(opt).trim()) issues.push(`${q.id} 第 ${i + 1} 个选项为空`);
        });
      }

      if (q.type === 'fill') {
        (q.accept || []).forEach((a) => {
          if (!String(a).trim()) issues.push(`${q.id} 有空白填空答案`);
        });
      }

      if (q.type === 'match') {
        if (new Set(q.right).size !== q.right.length) issues.push(`${q.id} 右栏有重复项`);
        if (q.left.length < 2) issues.push(`${q.id} 连线题左栏少于 2 项`);
      }

      if (q.svg) {
        if (!/^<svg[\s>]/.test(q.svg)) issues.push(`${q.id} 的 svg 不是以 <svg 开头`);
        if (q.svg.indexOf('</svg>') === -1) issues.push(`${q.id} 的 svg 没有闭合`);
        if (q.svg.indexOf('viewBox') === -1) issues.push(`${q.id} 的 svg 缺少 viewBox`);
      }
    });
  });
});

console.log('\n========== 汇总 ==========');
console.log(`科目：${GS.all().length} 个（可玩 ${GS.playable().length} 个）`);
console.log(`关卡：${totalLevels} 关`);
console.log(`题目：${totalQuestions} 题`);
console.log('题型分布：', typeCount);

if (issues.length) {
  console.log(`\n发现 ${issues.length} 个问题：`);
  issues.forEach((i) => console.log(' - ' + i));
  process.exitCode = 1;
} else {
  console.log('\n全部检查通过 ✔');
}