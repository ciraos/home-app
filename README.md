# home-app · 米葱苓的个人主页

个人主页站点：自我介绍、技术栈整活、最近文章、个人项目、成长足迹与联系方式。
首页数据是实时的——文章列表来自博客 API，顶部那句文案来自「人间凑数」接口。

## 技术栈

- **Next.js 16**（App Router / React Compiler / standalone 输出）
- **React 19** + **Tailwind CSS v4** + **shadcn/ui**（radix-nova 风格）
- **next-themes**：深浅色 + 按日出日落自动切换（`src/lib/sun.ts`）

## 本地开发

```bash
pnpm install
pnpm dev
```

打开 <http://localhost:3011>。端口固定 3011（`next dev -p 3011`），端口被占用时先停掉旧进程。

## 环境变量

复制 `.env.example` 为 `.env` 后填写：

| 变量 | 说明 |
| --- | --- |
| `RENJIAN_API_URL` | 人间凑数接口地址，默认 `https://v1.tqq.me/v1/renjian` |
| `RENJIAN_API_KEY` | 接口密钥，**仅服务端使用**，不要加 `NEXT_PUBLIC_` 前缀 |
| `NEXT_PUBLIC_ARTICLES_API_URL` | 可选，覆盖文章接口地址 |

`.env` 已在 `.gitignore` 中忽略；缺密钥时页面会静默回落兜底文案，不会报错白屏。

## 目录结构

```
src/
├─ app/
│  ├─ (home)/           # 首页路由组：hero + 各内容区块
│  ├─ layout.tsx        # 根布局：主题、metadata
│  ├─ robots.ts         # /robots.txt
│  ├─ sitemap.ts        # /sitemap.xml
│  ├─ error.tsx / global-error.tsx / not-found.tsx
├─ components/          # 顶栏、页脚、悬浮按钮、主题切换
├─ lib/
│  ├─ site.ts           # 站点常量（名字、域名、备案号）
│  ├─ profile.ts        # 首页内容：简介、统计、项目、时间线、联系方式
│  ├─ articles.ts       # 博客文章接口
│  ├─ dujitang.ts       # 人间凑数文案接口
│  └─ sun.ts            # 日出日落计算
```

**改内容只需要动 `src/lib/profile.ts` 和 `src/lib/site.ts`**，不用碰页面代码。

## 构建与部署

```bash
pnpm build      # 生产构建（输出 .next/standalone）
pnpm copy       # 用 cpy-cli 把 public 与 .next/static 复制进 standalone
PORT=3011 node .next/standalone/server.js   # Linux / macOS 启动
```

一条命令走完构建 + 启动（`pnpm deploy`，用的是 bash 的 `export`，适合 Linux 服务器）：

```bash
pnpm deploy
```

Windows 本地不跑 standalone，直接：

```bash
pnpm build && pnpm start:win
```

> `copy` 依赖 `cpy-cli`，两条命令都带了 `--base=cwd` 以保留 `public/` 与
> `.next/static/` 的目录层级。去掉这个参数的话，cpy 7 会把文件拍平到 standalone
> 根目录，启动后 CSS 和图片都会 404。

## 代码检查

```bash
pnpm lint
npx tsc --noEmit
```
