# ielts-study-tracker

Vue + Vite 学习跟踪应用。个人扩展的学习笔记与外链归档见 **`docs/`**（AI 自媒体与 B2B 外贸英语冲刺计划）。

## 构建与部署

### 本地仅构建前端

```bash
pnpm install && pnpm run build
```

产物在 `dist/`。若只跑后端托管静态页：需在项目根启动 uvicorn，且存在 `dist/`（参见下文 Docker 一体镜像）。

### Docker 一体镜像（前端 build + FastAPI）

```bash
docker build -t ielts-study-tracker .
docker run -p 7860:7860 \
  -e TRACKER_PASSWORD='你的密码' \
  -e TRACKER_COOKIE_SECURE=1 \
  -v tracker_data:/app/data \
  ielts-study-tracker
```

- 默认监听 **7860**；数据库路径由环境变量 **`DB_PATH`** 控制（默认镜像内为相对路径时可不配，持久化请挂载卷并设置 `DB_PATH=/app/data/tracker.db`）。
- 生产环境建议设置 **`TRACKER_COOKIE_SECURE=1`**（HTTPS）；本地 HTTP 不要设或设为 `0`。

### Fly.io

1. 安装 [flyctl](https://fly.io/docs/hands-on/install-flyctl/)，登录：`fly auth login`。
2. 首次：`fly launch`（或已存在应用则跳过），按 `fly.toml` 创建同名应用与 **`tracker_data` 卷**（与 `[mounts]` 一致）。
3. 敏感项用密钥，勿只依赖文件中的默认值：  
   `fly secrets set TRACKER_PASSWORD='强密码' SESSION_SECRET="$(openssl rand -hex 32)"`
4. 发布：`fly deploy`

`fly.toml` 已含 `TRACKER_COOKIE_SECURE`（适配 `force_https`）。

### Render

- 在 Dashboard 选择 **Blueprint**，指向仓库根目录的 `render.yaml`；或手动创建 Web Service（**Docker** 运行时）。
- 将 **`TRACKER_PASSWORD`** 改为强密码；生产 HTTPS 建议在 Environment 增加 **`TRACKER_COOKIE_SECURE=1`**。
- 免费实例磁盘多为**非持久**：SQLite 重启可能丢数据；需要持久化请使用付费磁盘或外置数据库。

### 发布前自检

```bash
pnpm run build
npm run build
```

若 CI（或 Docker）使用 `npm ci`，请确保 **`package-lock.json` 已提交** 且与 `package.json` 一致。
