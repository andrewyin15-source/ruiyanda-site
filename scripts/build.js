// 瑞研达官网 · 静态页面生成器
// 输入：data/products.js（唯一内容来源）
// 输出：9 个组学页 + 52 个产品详情页 + 首页产品矩阵 + sitemap.xml
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const data = require(path.join(ROOT, 'data', 'products.js'));
const { categories, products } = data;

const catOf = (slug) => categories.find((c) => c.slug === slug);
const productsOf = (catSlug) => products.filter((p) => p.cat === catSlug);
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// 背景图按组学轮换，保证子页也有实验室实拍且互不重复
const BG = ['bg-b1', 'bg-b2', 'bg-b3', 'bg-b4', 'bg-b5', 'bg-b6', 'bg-b7', 'bg-b8'];
const bgFor = (i) => BG[i % BG.length];

const NAV = [
  { href: '/#platform', label: '平台总览' },
  { href: '/#line1', label: '全产品线' },
  { href: '/#strength', label: '服务优势' },
  { href: '/#contact', label: '联系我们' }
];

function nav(active) {
  return `<nav class="nav">
  <div class="wrap nav-in">
    <a class="nav-brand" href="/">
      <img src="/assets/logo.jpg" alt="瑞研达生物" width="600" height="767">
      <span><b>瑞研达生物</b><small>RUIYANDA BIOTECHNOLOGY</small></span>
    </a>
    <div class="nav-links">
      ${NAV.map((n) => `<a href="${n.href}"${n.label === active ? ' aria-current="page"' : ''}>${n.label}</a>`).join('\n      ')}
    </div>
    <a class="nav-tel" href="tel:+8617681762580">176-8176-2580</a>
  </div>
</nav>`;
}

const FOOT = `<footer class="foot">
  <div class="wrap f-in">
    <span class="slogan">解码生命 · 洞见未来 —— 瑞研达生物 一站式多组学科研服务</span>
    <span>© 2026 瑞研达生物 · <a href="tel:+8617681762580">176-8176-2580</a></span>
  </div>
</footer>`;

function shell({ title, desc, active, body, style = '' }) {
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="https://ruiyanda.v-jay.com/">
<meta name="theme-color" content="#0A1F33">
<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230A1F33'/%3E%3Cpath d='M24 14c8 6 8 12 0 18s-8 12 0 18' stroke='%230E9C86' stroke-width='5' fill='none' stroke-linecap='round'/%3E%3Cpath d='M40 14c-8 6-8 12 0 18s8 12 0 18' stroke='%232A62CC' stroke-width='5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E">
<link rel="stylesheet" href="/assets/site.css">
${style}
</head>
<body class="sub">
${nav(active)}
${body}
${FOOT}
</body>
</html>
`;
}

// ---------- 产品卡片（首页平台总览用） ----------
function platformCard(c) {
  const sample = productsOf(c.slug).slice(0, 4).map((p) => p.name).join(' / ');
  return `        <a class="pcard reveal" style="--c:${c.color}" href="/platform/${c.slug}">
          <div class="t"><h3>${esc(c.name)}</h3><span class="en">${esc(c.en)}</span><span class="n">${c.count} 项</span></div>
          <p>${esc(c.intro.split('。')[0])}。</p>
          <ul class="sample">${productsOf(c.slug).slice(0, 4).map((p) => `<li>${esc(p.name)}</li>`).join('')}</ul>
          <span class="more">查看全部 ${c.count} 项 →</span>
        </a>`;
}

// ---------- 产品列表卡（组学页用） ----------
function productCard(p) {
  return `        <a class="pcard reveal" style="--c:${catOf(p.cat).color}" href="/product/${p.slug}">
          <div class="t"><h3>${esc(p.name)}</h3><span class="en">${esc(p.en)}</span></div>
          <p>${esc(p.tech.split('。').slice(0, 2).join('。'))}。</p>
          <ul class="sample">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
          <span class="more">查看详情 →</span>
        </a>`;
}

// ---------- 首页产品明细条目（链接到详情页） ----------
function matrixCat(c) {
  const items = productsOf(c.slug)
    .map(
      (p) => `            <li><div><b>${esc(p.name)}</b><span class="d">${esc(p.tech.split('。')[0])}。</span></div>
              <a class="go" href="/product/${p.slug}" aria-label="查看 ${esc(p.name)} 详情">→</a></li>`
    )
    .join('\n');
  return `        <article class="cat reveal" style="--c:${c.color}">
          <div class="cat-head"><h3>${esc(c.name)}</h3><span class="en">${esc(c.en)}</span><span class="count">${c.count} 项</span></div>
          <ol>
${items}
          </ol>
        </article>`;
}

// ---------- 页面：组学 ----------
function buildCategory(c, idx) {
  const list = productsOf(c.slug);
  const body = `<header class="sub-hero" style="--acc:${c.color}">
  <div class="bg ${bgFor(idx)}" aria-hidden="true"></div>
  <div class="veil" aria-hidden="true"></div>
  <div class="sub-hero-in wrap">
    <div class="sub-hero-grid">
    <div class="sub-hero-text">
    <nav class="crumb"><a href="/">首页</a><span>/</span><span>${esc(c.name)}</span></nav>
    <p class="eyebrow">${esc(c.en)}</p>
    <h1>${esc(c.name)}</h1>
    <p class="sub-lede">${esc(c.intro)}</p>
    <div class="chips">
      <span class="chip"><b>${c.count}</b> 项服务</span>
      <span class="chip">全流程质控</span>
      <span class="chip">低起始量方案可定制</span>
    </div>
    <a class="btn btn-p" href="/#contact">咨询该组学方案</a>
    </div>
    <figure class="sub-shot shot-b${(idx % 8) + 1}" aria-hidden="true"></figure>
    </div>
  </div>
</header>

<section class="sub-body">
  <div class="wrap">
    <div class="detail-grid">
      <article class="dcard"><h3>适用研究问题</h3><p>${esc(c.scenarios)}</p></article>
      <article class="dcard"><h3>样本要求</h3><p>${esc(c.sample)}</p></article>
      <article class="dcard"><h3>交付内容</h3><p>${esc(c.deliver)}</p></article>
    </div>

    <div class="sec-head" style="margin-top:clamp(34px,5vw,60px)">
      <p class="eyebrow">Services · ${c.count} 项</p>
      <h2>${esc(c.name)}全部服务</h2>
      <p class="lede">点击任一项目查看技术原理、适用课题、样本要求与交付内容。</p>
    </div>
    <div class="grid9">
${list.map(productCard).join('\n')}
    </div>

    <div class="cta-band">
      <div>
        <h3>不确定该选哪项？告诉我们课题方向与样本类型</h3>
        <p>我们提供技术路线建议与报价单，样本兼容性、低起始量方案与联合设计均可评估。</p>
      </div>
      <div class="cta-band-btns">
        <a class="btn btn-p" href="tel:+8617681762580">176-8176-2580</a>
        <a class="btn btn-g" href="/#contact">扫码联系销售</a>
      </div>
    </div>
  </div>
</section>`;
  return shell({
    title: `${c.name} · 瑞研达生物`,
    desc: `${c.intro} 瑞研达生物提供${c.name}共 ${c.count} 项科研服务，咨询电话 176-8176-2580。`,
    active: '全产品线',
    body
  });
}

// ---------- 页面：产品详情 ----------
function buildProduct(p, idx) {
  const c = catOf(p.cat);
  const rel = productsOf(p.cat).filter((x) => x.slug !== p.slug);
  const body = `<header class="sub-hero" style="--acc:${c.color}">
  <div class="bg ${bgFor(idx + 3)}" aria-hidden="true"></div>
  <div class="veil" aria-hidden="true"></div>
  <div class="sub-hero-in wrap">
    <div class="sub-hero-grid">
    <div class="sub-hero-text">
    <nav class="crumb"><a href="/">首页</a><span>/</span><a href="/platform/${c.slug}">${esc(c.name)}</a><span>/</span><span>${esc(p.name)}</span></nav>
    <p class="eyebrow">${esc(c.name)} · ${esc(c.en)}</p>
    <h1>${esc(p.name)}</h1>
    <p class="sub-lede">${esc(p.tech.split('。')[0])}。</p>
    <ul class="taglist">${p.tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
    <a class="btn btn-p" href="/#contact">咨询该方案</a>
    </div>
    <figure class="sub-shot shot-b${((idx + 4) % 8) + 1}" aria-hidden="true"></figure>
    </div>
  </div>
</header>

<section class="sub-body">
  <div class="wrap">
    <div class="detail-grid detail-4">
      <article class="dcard"><h3>技术简介</h3><p>${esc(p.tech)}</p></article>
      <article class="dcard"><h3>适用研究问题</h3><p>${esc(p.use)}</p></article>
      <article class="dcard"><h3>样本要求</h3><p>${esc(p.sample)}</p></article>
      <article class="dcard"><h3>交付内容</h3><p>${esc(p.deliver)}</p></article>
    </div>

    <div class="sec-head" style="margin-top:clamp(30px,4vw,48px)">
      <p class="eyebrow">Related</p>
      <h2>${esc(c.name)}其他服务</h2>
      <p class="lede">同组学的其他 ${rel.length} 项服务，可按课题组合设计。</p>
    </div>
    <div class="grid9">
${rel.map(productCard).join('\n')}
    </div>

    <div class="cta-band">
      <div>
        <h3>需要 ${esc(p.name)} 的方案与报价？</h3>
        <p>提供课题背景与样本信息，我们给出技术路线建议、样本要求确认与交付清单。</p>
      </div>
      <div class="cta-band-btns">
        <a class="btn btn-p" href="tel:+8617681762580">176-8176-2580</a>
        <a class="btn btn-g" href="/#contact">扫码联系销售</a>
      </div>
    </div>
  </div>
</section>`;
  return shell({
    title: `${p.name} · ${c.name} · 瑞研达生物`,
    desc: `${p.name}（${p.en}）：${p.tech.slice(0, 80)} 瑞研达生物提供表观、翻译等多组学一站式科研服务，电话 176-8176-2580。`,
    active: '全产品线',
    body
  });
}

// ---------- 首页补充内容块 ----------
const FLOW_HTML = `      <div class="flow reveal reveal-3">
        <div class="flow-t">从咨询到交付 · 标准服务流程</div>
        <ol class="flow-list">
          <li><b>需求沟通</b><span>明确课题问题、样本类型与预期结论</span></li>
          <li><b>方案设计</b><span>推荐技术路线，必要时给出多组学组合</span></li>
          <li><b>样本评估</b><span>确认样本形态、量级与质控标准</span></li>
          <li><b>建库测序</b><span>标准化实验流程，关键节点全程质控</span></li>
          <li><b>生信分析</b><span>按课题定制分析路径与图表</span></li>
          <li><b>结果交付</b><span>原始数据、分析结果与解读报告</span></li>
        </ol>
      </div>`;

const GUIDE_HTML = `      <div class="guide reveal reveal-2">
        <ul class="guide-list">
          <li><b>① 先定科学问题</b><span>是要看调控机制、比较表型差异，还是定位候选标志物</span></li>
          <li><b>② 再定样本</b><span>细胞、组织、体液、FFPE 还是单细胞悬液</span></li>
          <li><b>③ 匹配平台</b><span>从九个平台中选取对应技术，必要时做多组学组合</span></li>
          <li><b>④ 定制交付</b><span>确认分析深度、图表口径与交付清单</span></li>
        </ul>
      </div>`;

const FAQ_HTML = `      <div class="faq reveal reveal-2">
        <h3>常见问题</h3>
        <details><summary>样本量不够时还能做吗？</summary><p class="faq-a">可以。我们提供低起始量方案，并可先对样本做评估，给出可行性判断与替代技术路线（如探针捕获、核内转录组等），再确定方案。</p></details>
        <details><summary>能否多种组学联合设计？</summary><p class="faq-a">可以，这也是我们的主要服务方式之一。多组学联合方案会围绕同一个科学问题设计，用一次取样回答多个层面的问题，减少重复消耗。</p></details>
        <details><summary>数据交付包含哪些内容？</summary><p class="faq-a">包含原始数据、标准分析结果、图表与解读报告。分析深度可按课题需求定制，报告会以能直接用于组会与投稿的格式组织。</p></details>
        <details><summary>保密与数据归属如何处理？</summary><p class="faq-a">可按需签署保密协议。项目数据与样本信息仅用于本课题的方案与分析，交付后按约定归档或销毁。</p></details>
        <details><summary>费用如何计算？</summary><p class="faq-a">费用与所选技术、样本量、样本类型以及分析深度相关。建议先沟通课题与样本情况，我们给出方案与报价单后再推进。</p></details>
        <details><summary>周期一般多久？</summary><p class="faq-a">周期取决于方案、样本状态与分析深度。建议在启动前确认关键时间节点，我们会给出排期说明；急件可提前沟通评估。</p></details>
      </div>`;

const COOP_HTML = `      <div class="coop reveal reveal-2">
        <article class="dcard"><h3>直接咨询</h3><p>电话或微信说明课题方向与样本类型，我们先判断技术路线是否可行，再进入方案环节。</p></article>
        <article class="dcard"><h3>定制方案</h3><p>提供课题背景与样本信息，获取技术路线建议、样本要求确认与正式报价单。</p></article>
        <article class="dcard"><h3>长期合作</h3><p>课题组或企业可建立稳定的服务方案，约定交付口径与沟通流程，减少每次启动的沟通成本。</p></article>
      </div>`;

// ---------- 首页注入 ----------
function buildHome() {
  const idxPath = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(idxPath, 'utf8');

  // 1) 九大平台总览 → 链接到组学页 + 追加「怎么选」指引
  const gridRx = /<div class="grid9">[\s\S]*?\n      <\/div>/;
  if (!gridRx.test(html)) throw new Error('首页 grid9 区块未找到');
  html = html.replace(gridRx, `<div class="grid9">\n${categories.map(platformCard).join('\n')}\n      </div>\n${GUIDE_HTML}`);

  // 2) 三屏产品明细 → 链接到产品页 + 追加该组说明
  const groups = [
    {
      cats: ['epigenomics', 'translatomics', 'transcriptomics'],
      note: [
        '表观调控、翻译效率与转录本丰度三层证据可互相印证：先用转录组定位差异表达，再用表观组学追溯调控元件，最后用翻译组学验证是否真的影响到蛋白产出。',
        '总 RNA、总染色质与单细胞核悬液；细胞系与组织均可，低起始量与 FFPE 方案可评估。',
        '各组学标准数据集 + 联合分析图表（差异基因、开放性峰与翻译效率的对应关系）+ 解读报告。'
      ]
    },
    {
      cats: ['proteomics', 'metabolomics', 'microbiomics', 'genomics'],
      note: [
        '蛋白与代谢给出细胞表型的即时读数，微生物与基因组提供环境与遗传背景，四个层面组合可把「表型差异」一路追到「机制来源」。',
        '细胞与组织裂解液、血清血浆、尿液、粪便与拭子、外周血与口腔拭子等，按方案要求制备。',
        '定量矩阵与差异统计、功能富集与通路分析、关键分子靶向确证，以及跨组学的关联分析与解读报告。'
      ]
    },
    {
      cats: ['singlecell', 'spatial'],
      note: [
        '单细胞把分辨率推进到细胞水平，空间与原位把信息放回组织坐标。两者结合可回答「哪一群细胞、位于何处、与谁相邻」。',
        '新鲜单细胞悬液、冻存样本、FFPE 样本（探针捕获方案）、新鲜冷冻与 FFPE 组织切片。',
        '细胞类型注释与空间域识别、细胞邻域与微环境分析、影像配准结果、原始矩阵与解读报告。'
      ]
    }
  ];
  let gi = 0;
  html = html.replace(/<div class="line-grid">[\s\S]*?\n      <\/div>/g, () => {
    const g = groups[gi++];
    const notes = `      <div class="line-note">
${g.note
  .map((t, i) => `        <article class="dcard"><h3>${['本组怎么用', '样本要求', '交付内容'][i]}</h3><p>${esc(t)}</p></article>`)
  .join('\n')}
      </div>`;
    return `<div class="line-grid">\n${g.cats.map((s) => matrixCat(catOf(s))).join('\n')}\n      </div>\n${notes}`;
  });
  if (gi !== 3) throw new Error('首页产品明细区块数量异常: ' + gi);

  // 3) 双引擎后追加服务流程
  const dualRx = /<div class="dual">[\s\S]*?\n        <\/div>/;
  if (!dualRx.test(html)) throw new Error('首页 dual 区块未找到');
  html = html.replace(dualRx, (m) => m + '\n' + FLOW_HTML);

  // 4) 活动条后追加 FAQ
  const promoRx = /<div class="promo reveal reveal-2" style="margin-top:22px">[\s\S]*?\n      <\/div>/;
  if (!promoRx.test(html)) throw new Error('首页 promo 区块未找到');
  html = html.replace(promoRx, (m) => m + '\n' + FAQ_HTML);

  // 5) 联系屏后追加合作方式
  const cgRx = /<div class="contact-grid">[\s\S]*?\n      <\/div>/;
  if (!cgRx.test(html)) throw new Error('首页 contact-grid 区块未找到');
  html = html.replace(cgRx, (m) => m + '\n' + COOP_HTML);

  fs.writeFileSync(idxPath, html, 'utf8');
  return html;
}

// ---------- sitemap ----------
function buildSitemap() {
  const urls = ['/', ...categories.map((c) => `/platform/${c.slug}`), ...products.map((p) => `/product/${p.slug}`)];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map((u) => `  <url>\n    <loc>https://ruiyanda.v-jay.com${u === '/' ? '/' : u}</loc>\n    <lastmod>2026-10-19</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${u === '/' ? '1.0' : '0.7'}</priority>\n  </url>`)
  .join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
  return urls.length;
}

// ---------- 主流程 ----------
function main() {
  // 清掉旧的生成目录
  for (const dir of ['platform', 'product']) {
    const p = path.join(ROOT, dir);
    if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
    fs.mkdirSync(p, { recursive: true });
  }

  categories.forEach((c, i) => {
    const html = buildCategory(c, i);
    fs.writeFileSync(path.join(ROOT, 'platform', `${c.slug}.html`), html, 'utf8');
  });

  products.forEach((p, i) => {
    const html = buildProduct(p, i);
    fs.writeFileSync(path.join(ROOT, 'product', `${p.slug}.html`), html, 'utf8');
  });

  buildHome();
  const n = buildSitemap();

  console.log(`✔ 组学页 ${categories.length} 个 → platform/`);
  console.log(`✔ 产品详情页 ${products.length} 个 → product/`);
  console.log(`✔ 首页产品矩阵已注入（9 张平台卡 + 52 条明细，均为链接）`);
  console.log(`✔ sitemap.xml 共 ${n} 条 URL`);
}

main();
