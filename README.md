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
