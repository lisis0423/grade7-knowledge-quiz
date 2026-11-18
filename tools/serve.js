/* ============================================================
   手机版静态服务器
   运行：node tools/serve.js   （或双击根目录的“启动手机版.bat”）
   手机与电脑连同一个 Wi-Fi，手机浏览器打开打印出来的局域网地址。
   ============================================================ */
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.PORT) || 8000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2'
};

function lanAddresses() {
  const out = [];
  const nets = os.networkInterfaces();
  Object.keys(nets).forEach((name) => {
    (nets[name] || []).forEach((net) => {
      if (net.family === 'IPv4' && !net.internal) out.push(net.address);
    });
  });
  return out;
}

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('400 请求地址不正确');
    return;
  }

  if (pathname === '/') pathname = '/index.html';

  const file = path.join(root, pathname);
  const inside = file === root || file.startsWith(root + path.sep);
  if (!inside) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 不允许访问');
    return;
  }

  fs.stat(file, (err, stat) => {
    if (err || !stat.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 找不到文件');
      return;
    }
    res.writeHead(200, {
      'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    fs.createReadStream(file).pipe(res);
  });
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log('');
    console.log('端口 ' + port + ' 已被占用。');
    console.log('可以换一个端口，例如：');
    console.log('  在“启动手机版.bat”所在的命令行里执行  set PORT=8080 && node tools\\serve.js');
    console.log('');
  } else {
    console.log('启动失败：' + err.message);
  }
  process.exit(1);
});

server.listen(port, '0.0.0.0', () => {
  const ips = lanAddresses();
  const line = '='.repeat(54);
  console.log('');
  console.log(line);
  console.log('  知识闯关 · 手机版已启动');
  console.log(line);
  console.log('  电脑本机访问： http://localhost:' + port);
  console.log('');
  if (ips.length) {
    console.log('  手机访问（手机与电脑连同一个 Wi-Fi）：');
    ips.forEach((ip) => console.log('      http://' + ip + ':' + port));
  } else {
    console.log('  没有检测到局域网地址，请检查电脑是否已连接 Wi-Fi 或网线。');
  }
  console.log('');
  console.log('  · 第一次运行时，Windows 可能弹出防火墙提示，');
  console.log('    请勾选“专用网络”并点击“允许访问”。');
  console.log('  · 这个窗口不要关，关掉服务就停了。按 Ctrl+C 停止。');
  console.log(line);
  console.log('');

  if (process.platform === 'win32') {
    exec('start "" "http://localhost:' + port + '"', () => {});
  }
});