// 瑞研达官网 · 链接与资源体检
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const files = [];
const walk = (dir) => {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === 'node_modules' || e.name === '.git' || e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith('.html')) files.push(p);
  }
};
walk(ROOT);

const exists = (urlPath) => {
  const clean = urlPath.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return path.join(ROOT, 'index.html');
  const rel = clean.replace(/^\//, '');
  const cands = [path.join(ROOT, rel), path.join(ROOT, rel + '.html'), path.join(ROOT, rel, 'index.html')];
  const hit = cands.find((c) => fs.existsSync(c));
  return hit || null;
};

let dead = [];
let anchors = [];
let pages = 0;
let missingMeta = [];
let noH1 = [];

const homeHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const homeIds = new Set([...homeHtml.matchAll(/id="([^"]+)"/g)].map((m) => m[1]));

for (const f of files) {
  pages++;
  const html = fs.readFileSync(f, 'utf8');
  const rel = path.relative(ROOT, f);
  // 内部链接
  for (const m of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)) {
    const url = m[1];
    if (!exists(url)) dead.push(`${rel}  →  ${url}`);
    else if (url.startsWith('/#')) {
      const a = url.slice(2);
      if (!homeIds.has(a)) anchors.push(`${rel}  →  ${url}`);
    } else if (url.includes('#') && url.startsWith('/')) {
      const [p, a] = url.split('#');
      const target = exists(p);
      if (target) {
        const th = fs.readFileSync(target, 'utf8');
        if (!new RegExp(`id="${a}"`).test(th)) anchors.push(`${rel}  →  ${url}（目标页无此 id）`);
      }
    }
  }
  if (!/<title>[^<]{10,}<\/title>/.test(html)) missingMeta.push(rel);
  if (!/<h1[ >]/.test(html)) noH1.push(rel);
  // 页面内是否还残留未替换的模板痕迹
  if (/\{\{|\}\}|undefined|NaN/.test(html)) dead.push(`${rel}  →  含模板占位/异常值`);
}

console.log(`扫描页面: ${pages} 个`);
console.log(`死链: ${dead.length}${dead.length ? '\n  ' + dead.join('\n  ') : ''}`);
console.log(`锚点失效: ${anchors.length}${anchors.length ? '\n  ' + anchors.join('\n  ') : ''}`);
console.log(`title 不规范: ${missingMeta.length}${missingMeta.length ? '  ' + missingMeta.join(' ') : ''}`);
console.log(`缺 h1: ${noH1.length}${noH1.length ? '  ' + noH1.join(' ') : ''}`);

// 资源清单
for (const a of ['/assets/site.css', '/assets/logo.jpg', '/assets/qr-440.png', '/assets/bg-b1.jpg', '/assets/bg-b8.jpg']) {
  console.log(`${exists(a) ? '✔' : '✘'} ${a}`);
}
process.exit(dead.length || anchors.length ? 1 : 0);
