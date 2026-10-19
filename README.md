# ruiyanda-site · 瑞研达官网（占位版）

子域名 **ruiyanda.v-jay.com** → Vercel 静态托管。当前为「建设中」占位页，用于把
「GitHub → Vercel → 自定义域名 → 火山引擎 DNS」整条链路先打通，内容后续替换。

## 已上线（2026-10-19 验收全绿）

| 项 | 值 |
|---|---|
| 正式地址 | **https://ruiyanda.v-jay.com** |
| 临时地址 | https://ruiyanda-site.vercel.app |
| GitHub | github.com/andrewyin15-source/ruiyanda-site（public，main） |
| Vercel 项目 | `ruiyanda-site`（team: test person-15 / Hobby） |
| DNS 记录 | 火山引擎 · `ruiyanda` CNAME → `70010791befd043c.vercel-dns-017.com`（TTL 600） |
| 解析结果 | CNAME → 该串 → A `216.198.79.65` |
| 证书 | Let's Encrypt，`CN=ruiyanda.v-jay.com`，到期 2027-01-17（自动续期） |
| 传输 | 只收 TLS1.3/1.2；HTTP 308 → HTTPS；HSTS max-age=63072000 |
| 页面 | 200 / 6482B；CSP（`script-src 'none'`）、X-Frame-Options DENY、COOP、Permissions-Policy 全部生效 |

> 本地排查注意：这台机 Clash 开 fake-ip，`ruiyanda.v-jay.com` 在**本机**会解析成 `198.18.0.x`，
> 那是占位地址不是真实记录；查真实记录要走 DoH（`dns.alidns.com` / `cloudflare-dns.com`）。
> 阿里 DoH 曾有 300 秒负缓存，刚加完记录它可能仍回 NXDOMAIN，换 Cloudflare/腾讯 DoH 复核。

## 目录

| 文件 | 作用 |
|---|---|
| `index.html` | 唯一页面（占位页）：品牌 / 建设中 / 电话 / 销售二维码 |
| `assets/logo.jpg` | 从 `E:\瑞研达\logo\logo.png` 裁白边后导出的 600px 宽版本 |
| `assets/qr.png` | 销售二维码，等比缩至 420px 宽 |
| `vercel.json` | cleanUrls + 安全头 + 静态资源缓存 |
| `robots.txt` | 占位期禁止收录，上线内容后改成 `Allow: /` |

## 全链路（谁做什么）

| 步骤 | 谁做 | 动作 |
|---|---|---|
| 1 | 用户 | GitHub 新建 **public** 仓库 `ruiyanda-site`（不要勾 README / .gitignore） |
| 2 | 助手 | 本地 `git push` 推上 main |
| 3 | 用户 | Vercel → Add New Project → Import `ruiyanda-site` → Deploy（零配置，自动识别静态站） |
| 4 | 用户 | Vercel 项目 → Settings → Domains → 添加 `ruiyanda.v-jay.com`（显示 Invalid Configuration 属正常，等 DNS） |
| 5 | 用户 | 火山引擎云解析 → v-jay.com → 记录管理 → 新增 **CNAME**：主机记录 `ruiyanda`，记录值 `cname.vercel-dns.com`，TTL 600 |
| 6 | 助手 | DoH 查记录 + curl 线上验收（状态码 / 标题 / 关键元素） |

> 为什么不用 `www.v-jay.com` 同一个 Vercel 项目：一个项目的主域名只能有一个根页面，
> 子域名指向同一项目会落到 marvis 克隆首页。独立项目 + 独立仓库，后续官网长大也不互相干扰。

## 页面内容来源（2026-10-19 正式版 05c8d7d）

| 内容 | 来源 |
|---|---|
| 品牌名 / 英文名 / 定位「多组学 · 一站式 · 精准科研服务」 | `E:\瑞研达\首页.png`、`副业.png` 页眉 |
| 表观组学 9 项、翻译组学 7 项、转录调控 3 项、蛋白 5 项、代谢 6 项、微生物 5 项、基因组 2 项 | `副业.png`「七大类」清单 |
| 单细胞测序 8 项、空间与原位组学 7 项 | `后期加的东西.jpg`（目次页） |
| 表观 × 翻译「双引擎」4+4 张重点卡 | `首页.png` 核心产品线 |
| 服务优势 4 条 | `副业.png` 页脚 |
| 电话 176-8176-2580 / 微信 17681762580 | `副业.png` 页脚（**旧号 192-4305-2423 已剔除**） |
| 销售二维码 | `E:\瑞研达\销售二维码.png` |

**待用户确认的补充描述**（原文只有平台名，我按行业通识补了一行说明，未经核实）：

- 单细胞：10x 3'「高通量单细胞表达谱」、10x 5' 免疫组「免疫受体库与克隆型分析」、10x ATAC「单细胞染色质可及性」、10x Flex「探针捕获，兼容 FFPE 样本」、墨卓「国产高通量平台方案」、华大 C4「高通量单细胞 RNA 测序」、BD「微孔板单细胞方案」、BD 蛋白组「单细胞水平蛋白标志物检测」
- 空间：空间代谢组「组织原位代谢物空间分布」
- 限时活动条：原文的「192-4305-2423」已换成 176-8176-2580，**活动仍在进行吗？** 若已结束请删除该条

## 页面结构（2026-10-19 改版：8 屏整屏滚动版）

单页、8 个「整屏」区块，滚轮一次滚一屏（`scroll-snap-type: y proximity` + `scroll-snap-stop: always`），
每屏一套渐变主题 + 实验室实拍背景，滚动时背景做缓慢漂移、内容依次上浮（纯 CSS 滚动驱动动画）。

| # | 锚点 | 内容 | 背景 |
|---|---|---|---|
| 1 | `#top` | 首屏：品牌 / 定位 / 9 平台 52 服务 / 咨询入口 / 滚动提示 | `bg-lab-hero.jpg`（实验台实拍） |
| 2 | `#engine` | 核心双引擎：表观 × 翻译，各 4 个重点项目 | `bg-lab-seq.jpg`（测序间实拍） |
| 3 | `#platform` | 九大平台总览：9 张分类卡（名称 / 项数 / 代表项目） | 纯渐变（青蓝紫） |
| 4 | `#line1` | 明细 01：表观 9 + 翻译 7 + 转录调控 3 | 纯渐变 |
| 5 | `#line2` | 明细 02：蛋白 5 + 代谢 6 + 微生物 5 + 基因组 2 | 纯渐变（橙品红） |
| 6 | `#line3` | 明细 03：单细胞 8 + 空间与原位 7 | `bg-lab-hero.jpg`（低透明度） |
| 7 | `#strength` | 服务优势 4 条 + 限时活动条 | `bg-lab-seq.jpg`（低透明度） |
| 8 | `#contact` | 联系方式 + 销售二维码 | 纯渐变 |

### 技术要点

- **明亮科研风**：全站浅色底（`#F8FBFD → #EAF2F8`）+ 白色玻璃卡片 + 深海军蓝文字（`#0C1F2E`），
  品牌深蓝/青绿作为标题渐变与强调色。九大分类色只作**装饰**（卡片色条 / 角标底色），
  角标文字一律用深色，保证小字号对比度 ≥ 4.5:1。
- **每屏一张实拍**：8 屏各配一张实验室实拍（`bg-b1`…`bg-b8`，4 张原图 × 不同取景位置），
  照片 `opacity .58` + 白色柔光幕 + 上下 mask 渐隐，融进浅色底 —— 明亮但文字清晰。
- **每屏一个视觉主角**：超大编号水印（`--no: '01'`…`'08'`，按 `--acc` 主色着色）+ 左上柔光色块 + 各自照片，
  避免每屏长得一样。编号与主色写在 section 的内联 `style` 上。
- **零 JS、零外部请求**：过渡效果全部用 CSS 滚动驱动动画（`animation-timeline: view()` / `scroll()`），
  浏览器不支持时自动降级为静态显示（`@supports` 包裹），CSP 保持 `script-src 'none'`。
- **`prefers-reduced-motion`** 下关闭全部动画与平滑滚动。
- 背景图由 MiniMax image-01 生成（`E:\dsh\daily-report-builder\gen_image.ps1`，带自动 negative_prompt），
  API 只出 1024×1024 方图，故中心裁 16:9 后导出 1920×1080 JPEG（约 140–205KB，平均亮度 190+）。
- 顶部进度条 `animation-timeline: scroll(root)`；首屏底部有滚动提示箭头。
- 移动端（≤900px）关闭 scroll-snap，改为自然长页滚动。

## 多页架构（2026-10-19 第二轮：可交互子页面）

### 目录结构

```
index.html            首页（8 屏整屏滚动）
assets/site.css       共享样式（首页与全部子页共用，改样式只改这一处）
assets/bg-b1..b4.jpg  实验室实拍（4 张原图，8 屏不同取景）
data/products.js      ★ 唯一内容来源：9 个组学 + 52 个产品
scripts/build.js      页面生成器
scripts/check.js      全站链接/锚点/资源体检
platform/*.html       9 个组学页      → /platform/<slug>
product/*.html        52 个产品详情页 → /product/<slug>
sitemap.xml           62 条 URL（自动生成）
```

### 构建与体检

```powershell
node scripts/build.js   # 生成 61 个子页 + 注入首页产品矩阵 + 重写 sitemap
node scripts/check.js   # 扫描全部页面：死链 / 锚点失效 / title / h1 / 资源存在性
```

**内容只在 `data/products.js` 里改**，改完跑一次 build 即可全站同步，首页与子页不会出现口径不一致。

### 页面能力

| 能力 | 实现 | 约束 |
|---|---|---|
| 首页 9 张平台卡 | `<a>` 链到对应组学页 | 悬停抬升 + 「查看全部 N 项 →」 |
| 首页 52 条产品明细 | 每条带技术简介 + 右侧「→」链到产品详情页 | 悬停箭头右移 |
| 组学页 | 组学简介 + 适用课题/样本要求/交付内容 + 全部服务卡 | 面包屑导航 |
| 产品详情页 | 技术简介 / 适用研究问题 / 样本要求 / 交付内容 四块 + 同组学其他服务 | 面包屑三级导航 |
| 站内返回 | 全站绝对路径 + 顶部导航锚点回首页对应屏 | 无 JS 依赖 |
| FAQ 手风琴 | 原生 `<details>/<summary>` | 不需要 JS |

**仍然零 JS、零外部请求**，CSP `script-src 'none'` 不变，交互全部由 HTML 语义元素 + CSS 完成。

### 内容口径（红线）

- 只写**业内通用技术描述**：技术原理、适用研究问题、样本类型、交付内容。
- **不写未经业务确认的具体参数**：起始量、周期、单价、承诺指标一律不出现。
  写脚本 `node scripts/check.js` 会对数字/价格类表述做正则扫描，出现即需人工确认。
- 客户看到的每个产品都有完整描述，不靠关键词堆砌。

### 改样式/改内容

- 改样式 → 只改 `assets/site.css`（首页 + 61 个子页共享）。
- 改文案 → 只改 `data/products.js`，然后 `node scripts/build.js`。
- 新增产品 → 在 `data/products.js` 的 `products` 里加一条（`slug` 用小写英文短横线），
  同时把所属组学的 `count` 改成实际数量，然后重跑 build。
- 新增组学 → 在 `categories` 里加一条（`slug` / `name` / `en` / `color` / `count`），
  组学页与导航会自动出现。

## 换成正式官网时

1. 先确定内容与版式（产品/服务、案例、资质、联系方式），再动代码——占位页只负责链路。
2. 替换 `index.html`；图片压缩到 ≤200KB/张（当前 logo 90KB、二维码 112KB）。
3. **删掉 `<meta name="robots" content="noindex, nofollow">`**，并把 `robots.txt` 改成 `Allow: /`。
4. push 即生效（Vercel 自动部署，约 30 秒）。

## 待确认

- [ ] 对外主体全称（是否写「杭州瑞研达…」这类注册名，需与营业执照一致）
- [ ] 电话口径：本文用 **176-8176-2580**（业务文档最新号）；`E:\瑞研达\首页.png` 上印的是旧号 192-4305-2423
- [ ] 是否放公司地址 / 邮箱 / 公众号二维码
- [ ] 是否需要 ICP 备案（当前托管在 Vercel 海外，不需要；若改国内云则必须）
