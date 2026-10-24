<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## 本地开发约定（用户长期偏好）

- 启动 dev（`pnpm dev`，端口 3011）后，**用默认浏览器打开 http://localhost:3011/**，让用户直接看到页面；不需要用户再提醒。
- 3011 端口由 agent 统一管理：重启前先停掉占用 3011 的旧进程树，再以受管后台任务启动，不要重复起第二个实例。
- 判断是否就绪请用 `Invoke-WebRequest http://127.0.0.1:3011/` 看是否真的返回 200；本机 `Get-NetTCPConnection -LocalPort 3011` 有时报 0 监听但实际在服务，不可作为唯一依据。
