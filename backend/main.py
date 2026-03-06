import os
import sys
import secrets
import hashlib

sys.path.insert(0, os.path.dirname(__file__))

from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from database import init_db, load_full_state, save_full_state

AUTH_PASSWORD = os.environ.get("TRACKER_PASSWORD", "ielts7")
SESSION_SECRET = os.environ.get("SESSION_SECRET", secrets.token_hex(32))


def make_token(password: str) -> str:
    return hashlib.sha256(f"{password}:{SESSION_SECRET}".encode()).hexdigest()


VALID_TOKEN = make_token(AUTH_PASSWORD)

LOGIN_HTML = """<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>登录 - 雅思学习打卡</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{min-height:100vh;display:flex;align-items:center;justify-content:center;
     background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);font-family:system-ui,sans-serif}
.card{background:#fff;border-radius:16px;padding:48px 40px;width:360px;box-shadow:0 20px 60px rgba(0,0,0,.3);text-align:center}
h1{font-size:28px;margin-bottom:8px}
p{color:#666;margin-bottom:32px}
input{width:100%;padding:14px 16px;border:2px solid #e2e8f0;border-radius:10px;font-size:16px;outline:none;transition:.2s}
input:focus{border-color:#667eea}
button{width:100%;padding:14px;border:none;border-radius:10px;background:linear-gradient(135deg,#667eea,#764ba2);
       color:#fff;font-size:16px;cursor:pointer;margin-top:16px;transition:.2s}
button:hover{transform:translateY(-1px);box-shadow:0 4px 12px rgba(102,126,234,.4)}
.err{color:#e53e3e;margin-top:12px;font-size:14px;display:none}
</style></head><body>
<div class="card">
<h1>📚 雅思打卡</h1><p>输入密码继续</p>
<form onsubmit="return login(event)">
<input type="password" id="pw" placeholder="密码" autofocus>
<button type="submit">登 录</button>
</form>
<div class="err" id="err">密码错误</div>
</div>
<script>
async function login(e){
  e.preventDefault();
  const r=await fetch('/api/login',{method:'POST',headers:{'Content-Type':'application/json'},
    body:JSON.stringify({password:document.getElementById('pw').value}),credentials:'include'});
  if(r.ok){location.reload()}else{document.getElementById('err').style.display='block'}
  return false;
}
</script></body></html>"""


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(title="IELTS Study Tracker API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


def check_auth(request: Request) -> bool:
    token = request.cookies.get("tracker_token")
    return token == VALID_TOKEN


@app.post("/api/login")
async def login(request: Request):
    data = await request.json()
    if data.get("password") == AUTH_PASSWORD:
        resp = JSONResponse({"ok": True})
        resp.set_cookie(
            "tracker_token", VALID_TOKEN,
            httponly=True, max_age=86400 * 30, samesite="lax",
        )
        return resp
    return JSONResponse({"error": "wrong password"}, status_code=401)


@app.get("/api/logout")
def logout():
    resp = JSONResponse({"ok": True})
    resp.delete_cookie("tracker_token")
    return resp


@app.get("/api/state")
def get_state(request: Request):
    if not check_auth(request):
        return JSONResponse({"error": "unauthorized"}, status_code=401)
    return load_full_state()


@app.put("/api/state")
async def put_state(request: Request):
    if not check_auth(request):
        return JSONResponse({"error": "unauthorized"}, status_code=401)
    data = await request.json()
    save_full_state(data)
    return {"ok": True}


@app.get("/api/health")
def health():
    return {"status": "ok"}


dist_dir = os.path.join(os.path.dirname(__file__), "..", "dist")
if os.path.isdir(dist_dir):
    from starlette.types import ASGIApp, Receive, Scope, Send

    class AuthStaticFiles:
        def __init__(self, static_app: ASGIApp):
            self.static_app = static_app

        async def __call__(self, scope: Scope, receive: Receive, send: Send):
            if scope["type"] == "http":
                from starlette.requests import Request as SRequest
                req = SRequest(scope, receive)
                if not check_auth(req):
                    resp = HTMLResponse(LOGIN_HTML)
                    await resp(scope, receive, send)
                    return
            await self.static_app(scope, receive, send)

    static_app = StaticFiles(directory=dist_dir, html=True)
    app.mount("/", AuthStaticFiles(static_app), name="static")
else:
    @app.get("/")
    def index(request: Request):
        if not check_auth(request):
            return HTMLResponse(LOGIN_HTML)
        return HTMLResponse("<h1>Run npm run build first</h1>")
