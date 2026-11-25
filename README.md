# home-app · 米葱苓的个人主页

全栈个人主页：前台展示 + `/admin` 内容后台。除「最近文章」仍来自博客接口外，
页面上的所有内容都存在数据库里，登录后台即可编辑。

- **首次访问**：站点自动跳到 `/setup`，创建的第一个账号就是唯一管理员
- **之后**：注册入口关闭，只有登录能进后台
- **单管理员模型**：没有多用户、没有注册页、没有找回密码邮件（见下方「忘记密码」）

## 技术栈

- **Next.js 16**（App Router / Server Actions / standalone 输出）+ **React 19**
- **Tailwind CSS v4** + **shadcn/ui**（radix-nova 风格）
- **PostgreSQL**（`pg` 驱动）；本地开发可零依赖用 **PGlite**（WASM 版 PostgreSQL）
- **next-themes**：深浅色 + 日出日落自动切换
- 鉴权：`scrypt` 密码哈希 + HMAC 签名的无状态会话 Cookie

## 本地开发

```bash
pnpm install
cp .env.example .env      # Windows: copy .env.example .env
pnpm dev
```

打开 <http://localhost:3011>：如果数据库里还没有管理员，会自动跳到 `/setup`，
填完用户名密码就进入后台。之后所有内容都在 `/admin` 里改。

`.env` 里的 `AUTH_SECRET` 必须换成随机值：

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 环境变量

| 变量 | 说明 |
| --- | --- |
| `DATABASE_URL` | 必填。生产用 `postgresql://user:pass@host:5432/db`；本地没有 Postgres 时用 `pglite://./data/pg` |
| `AUTH_SECRET` | 必填，会话签名密钥。换掉它会让所有已登录会话立即失效 |
| `COOKIE_SECURE` | HTTPS 环境设为 `true`；本地 http 调试用 `false` |
| `UPLOAD_DIR` | 可选，上传目录，默认 `./data/uploads` |
| `NEXT_PUBLIC_ARTICLES_API_URL` | 可选，「最近文章」接口地址 |

`.env` 已被 git 忽略，`.env.example` 可以提交。

## 后台能改什么

| 页面 | 内容 |
| --- | --- |
| `/admin/settings` | 名字、头衔、简介、头像（可上传）、首页大标题与一句话、域名、博客地址、备案号 |
| `/admin/stats` | 「关于我」下面四个数字：文章 / 网站 / 码龄 / 自定义 |
| `/admin/projects` | 「个人网站」卡片（名称、简介、标签、最多 6 个外链、排序） |
| `/admin/timeline` | 「成长足迹」时间线 |
| `/admin/socials` | 「联系我」按钮（图标、链接、是否新窗口） |
| `/admin/account` | 修改登录密码 |

文章列表不在后台维护，仍然读 `NEXT_PUBLIC_ARTICLES_API_URL`。

后台保存后，已经打开的首页会通过 SSE（`/api/events`）收到通知并自动软刷新，
不需要手动刷新页面。这是进程内广播，只对单实例部署即时生效；如果以后用多实例，
需要换成 Redis pub/sub 之类的跨进程通道。

## 数据与上传文件

- 表：`users`、`site_settings`、`stats`、`projects`、`timeline`、`socials`
- 首次连接数据库时自动建表，并写入一份默认内容（见 `src/lib/defaults.ts`），所以空库启动也能直接看到完整页面
- 图片上传走 `/uploads/[file]` 路由，文件落在 `UPLOAD_DIR`。**部署时这个目录要持久化/备份**，不能放在构建产物里
- 用 PGlite 时数据在 `./data/pg`，备份就是拷目录

## 忘记密码

清空管理员表，重新访问站点就会回到 `/setup`（内容不受影响）：

```sql
DELETE FROM users;
```

也可以用 `psql`/面板 SQL 控制台执行；注意之后第一个打开站点的人会成为新管理员。

## 目录结构

```
src/
├─ app/
│  ├─ (home)/            # 首页：hero + 各内容区块（读数据库）
│  ├─ admin/
│  │  ├─ actions.ts      # 登录/退出/改密 + 内容 CRUD 的 Server Actions
│  │  ├─ login/          # 登录页
│  │  └─ (dashboard)/    # 带鉴权的后台页面
│  ├─ setup/             # 首次初始化，创建唯一管理员
│  ├─ uploads/[file]/    # 读取上传图片
│  ├─ layout.tsx         # 主题 + 全站 metadata
│  ├─ robots.ts / sitemap.ts
│  └─ error / global-error / not-found
├─ components/           # 前台组件 + admin/ 后台表单组件
└─ lib/
   ├─ db.ts              # 连接、建表、种子
   ├─ repo.ts            # 数据读写
   ├─ auth.ts            # 密码与会话
   ├─ uploads.ts         # 图片落盘
   ├─ defaults.ts        # 默认内容
   └─ articles.ts / sun.ts
```

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

部署清单：

1. 生产 `DATABASE_URL` 指向真实 PostgreSQL，首次启动会自动建表
2. `COOKIE_SECURE=true`（走 HTTPS），并确保 `AUTH_SECRET` 已换成随机值
3. 持久化 `UPLOAD_DIR`（默认 `data/uploads`）
4. 反向代理把 3011 暴露出去，记得加 HTTPS

> `copy` 依赖 `cpy-cli`，两条命令都带了 `--base=cwd` 以保留目录层级。去掉这个参数的话，
> cpy 7 会把文件拍平到 standalone 根目录，启动后 CSS 和图片都会 404。

## 代码检查

```bash
pnpm lint
npx tsc --noEmit
```
