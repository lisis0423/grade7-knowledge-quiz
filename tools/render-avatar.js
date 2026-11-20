/* 把装扮图标与角色立绘渲染成 PNG，方便目检：node tools/render-avatar.js */
const fs = require('fs');
const path = require('path');
const sharp = require(path.join(__dirname, 'node_modules', 'sharp'));

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'shots');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

// 极简 window + GameItems 加载
const sandbox = { window: {} };
const vm = require('vm');
const ctx = vm.createContext(sandbox);
ctx.window = sandbox;
sandbox.GameItems = undefined;
vm.runInContext(fs.readFileSync(path.join(root, 'js/avatar.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'data/items.js'), 'utf8'), ctx);
vm.runInContext(fs.readFileSync(path.join(root, 'js/avatar.js'), 'utf8'), ctx);

const GameAvatar = sandbox.GameAvatar;
const GameItems = sandbox.GameItems;

async function sheet(items, file, cell, cols) {
  const rows = Math.ceil(items.length / cols);
  const W = cols * cell;
  const H = rows * (cell + 16);
  let body = '';
  items.forEach((it, i) => {
    const x = (i % cols) * cell;
    const y = Math.floor(i / cols) * (cell + 16);
    body += `<g transform="translate(${x + (cell - cell * 0.7) / 2},${y + 6}) scale(${(cell * 0.7) / 48})">` +
      (it.svg || '') + '</g>';
    body += `<text x="${x + cell / 2}" y="${y + cell + 12}" font-size="12" fill="#2b3a45" text-anchor="middle">${it.name}</text>`;
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect width="${W}" height="${H}" fill="#f4f8f6"/>${body}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, file));
  console.log('wrote', file, W + 'x' + H);
}

(async () => {
  const ids = ['scanner', 'hoverboard', 'drone', 'plasmapen', 'pulsegun', 'dagger',
    'armor', 'shield', 'cloak', 'wings', 'tailwing', 'helmet',
    'energybar', 'candy', 'ration', 'cola'];

  // 取出每个图标的内部内容（去掉外层 <svg> 包装）
  const items = ids.map((id) => {
    const html = GameAvatar.art(id, 48);
    const inner = html.replace(/^[\s\S]*?>/, '').replace(/<\/svg>$/, '');
    return { name: (GameItems.get(id) || {}).name || id, svg: inner };
  });

  await sheet(items, 'avatar-items.png', 88, 4);

  // 立绘：不同穿戴组合
  const combos = [
    { name: '空装备', equipped: {} },
    { name: '翅膀+隐形斗篷+匕首', equipped: { wings: 'wings', armor: 'cloak', weapon: 'dagger' } },
    { name: '头盔+护甲+手炮+滑板', equipped: { wings: 'helmet', armor: 'armor', weapon: 'pulsegun', tool: 'hoverboard' } },
    { name: '尾翼+能量盾+等离子笔+无人机', equipped: { wings: 'tailwing', armor: 'shield', weapon: 'plasmapen', tool: 'drone' } }
  ];

  const W = 4 * 150;
  const H = 210;
  let body = '';
  combos.forEach((c, i) => {
    const fig = GameAvatar.figure({ equipped: c.equipped }, 120);
    const inner = fig.replace(/^[\s\S]*?>/, '').replace(/<\/svg>$/, '');
    body += `<g transform="translate(${i * 150 + 15},10) scale(1)">${inner}</g>`;
    body += `<text x="${i * 150 + 75}" y="195" font-size="12" fill="#2b3a45" text-anchor="middle">${c.name}</text>`;
  });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<rect width="${W}" height="${H}" fill="#eef6f3"/>${body}</svg>`;
  await sharp(Buffer.from(svg)).png().toFile(path.join(outDir, 'avatar-figure.png'));
  console.log('wrote avatar-figure.png', W + 'x' + H);
})();