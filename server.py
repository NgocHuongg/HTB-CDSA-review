#!/usr/bin/env python3
import argparse
import base64
import io
import json
import mimetypes
import os
import re
import socket
import sys
import threading
import traceback
import urllib.parse
import webbrowser
import zipfile
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
WEB_DIR = BASE_DIR / "web"
LANGS = ("en", "vi")
ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9._-]*$")
H1_RE = re.compile(r"^\s{0,3}#\s+(.+?)\s*#*\s*$")
SKIP_FILES = {"desktop.ini", "thumbs.db", ".ds_store"}

IMPORT_ORIGINS = {"https://academy.hackthebox.com"}
IMPORT_EXTS = {".md", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".json", ".txt"}
IMPORT_MAX_BYTES = 80 * 1024 * 1024

MIME = {
    ".html": "text/html; charset=utf-8",
    ".js": "application/javascript; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".ico": "image/x-icon",
    ".pdf": "application/pdf",
    ".md": "text/markdown; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".zip": "application/zip",
}


def mime_of(path, view=False):
    ext = path.suffix.lower()
    if view and ext in (".md", ".txt", ".log", ".csv", ".yml", ".yaml", ".ps1", ".sh", ".py"):
        return "text/plain; charset=utf-8"
    return MIME.get(ext) or mimetypes.guess_type(str(path))[0] or "application/octet-stream"


def safe_child(root, rel):
    if rel is None or "\x00" in rel:
        return None
    root = Path(root).resolve()
    try:
        p = (root / rel).resolve()
    except (OSError, ValueError):
        return None
    if p != root and root not in p.parents:
        return None
    return p


def content_disposition(kind, name):
    ascii_name = name.encode("ascii", "ignore").decode().replace('"', "").strip() or "download"
    return "%s; filename=\"%s\"; filename*=UTF-8''%s" % (kind, ascii_name, urllib.parse.quote(name))


def safe_filename(name):
    name = re.sub(r'[\\/:*?"<>|]+', "", name).strip()
    return re.sub(r"\s+", "_", name) or "file"


class Store:

    def __init__(self, data_dir):
        self.data = Path(data_dir).resolve()
        self.modules_dir = self.data / "modules"
        self.cheats_dir = self.data / "cheatsheets"
        self.progress_file = self.data / "progress.json"
        self.lock = threading.Lock()
        self.modules_dir.mkdir(parents=True, exist_ok=True)
        self.cheats_dir.mkdir(parents=True, exist_ok=True)

    @staticmethod
    def read_text(path):
        try:
            return Path(path).read_text(encoding="utf-8-sig")
        except (OSError, UnicodeDecodeError):
            return None

    def read_json(self, path, default):
        txt = self.read_text(path)
        if txt is None or not txt.strip():
            return default
        try:
            return json.loads(txt)
        except ValueError as e:
            print("[!] Loi JSON trong %s: %s" % (path, e))
            return default

    @staticmethod
    def loc(value, lang):
        if isinstance(value, dict):
            return value.get(lang) or value.get("en") or value.get("vi") or next(iter(value.values()), "")
        return "" if value is None else str(value)

    @staticmethod
    def pretty(identifier):
        name = re.sub(r"^\d+[-_. ]*", "", identifier)
        name = re.sub(r"[-_]+", " ", name).strip()
        return (name[:1].upper() + name[1:]) if name else identifier

    def module_ids(self):
        items = []
        for d in self.modules_dir.iterdir():
            if d.is_dir() and ID_RE.match(d.name):
                meta = self.read_json(d / "module.json", {})
                order = meta.get("order", 9999) if isinstance(meta, dict) else 9999
                if not isinstance(order, (int, float)):
                    order = 9999
                items.append((order, d.name.lower(), d.name))
        return [mid for _, _, mid in sorted(items)]

    def module_dir(self, mid):
        if not mid or not ID_RE.match(mid):
            return None
        d = self.modules_dir / mid
        return d if d.is_dir() else None

    def module_meta(self, mid, lang):
        meta = self.read_json(self.module_dir(mid) / "module.json", {})
        if not isinstance(meta, dict):
            meta = {}
        return {
            "id": mid,
            "title": self.loc(meta.get("title"), lang) or self.pretty(mid),
            "description": self.loc(meta.get("description"), lang),
        }

    def section_ids(self, mid):
        sd = self.module_dir(mid) / "sections"
        if not sd.is_dir():
            return []
        return sorted((p.name for p in sd.iterdir() if p.is_dir() and ID_RE.match(p.name)), key=str.lower)

    def section_dir(self, mid, sid):
        d = self.module_dir(mid)
        if d is None or not sid or not ID_RE.match(sid):
            return None
        s = d / "sections" / sid
        return s if s.is_dir() else None

    def read_md(self, sdir, lang):
        for code in [lang] + [x for x in LANGS if x != lang]:
            txt = self.read_text(sdir / ("%s.md" % code))
            if txt is not None and txt.strip():
                return txt, code
        return "", None

    @staticmethod
    def split_title(md):
        lines = md.splitlines()
        for i, line in enumerate(lines):
            if not line.strip():
                continue
            m = H1_RE.match(line)
            if m:
                return m.group(1).strip(), "\n".join(lines[i + 1:])
            break
        return None, md

    def section_title(self, mid, sid, lang):
        md, _ = self.read_md(self.section_dir(mid, sid), lang)
        title, _ = self.split_title(md)
        return title or self.pretty(sid)

    def load_questions(self, sdir):
        path = sdir / "questions.json"
        if not path.exists():
            return [], None
        txt = self.read_text(path)
        try:
            raw = json.loads(txt) if txt and txt.strip() else []
        except ValueError as e:
            return [], "questions.json: %s" % e
        if isinstance(raw, dict):
            raw = raw.get("questions", [])
        out = []
        for q in raw if isinstance(raw, list) else []:
            if not isinstance(q, dict):
                continue
            ans = q.get("answer", q.get("answers", ""))
            answers = [str(a).strip() for a in (ans if isinstance(ans, list) else [ans]) if str(a).strip()]
            n = len(out) + 1
            out.append({
                "id": str(q.get("id") or "q%d" % n),
                "n": n,
                "question": q.get("question", ""),
                "hint": q.get("hint"),
                "answers": answers,
                "case_sensitive": bool(q.get("case_sensitive", False)),
            })
        return out, None

    @staticmethod
    def norm(s, case_sensitive):
        s = re.sub(r"\s+", " ", str(s)).strip()
        return s if case_sensitive else s.casefold()

    def is_correct(self, q, given):
        g = self.norm(given, q["case_sensitive"])
        return bool(g) and any(g == self.norm(a, q["case_sensitive"]) for a in q["answers"])

    def load_progress(self):
        data = self.read_json(self.progress_file, {})
        return data if isinstance(data, dict) else {}

    def save_progress(self, data):
        tmp = self.progress_file.with_name("progress.json.tmp")
        tmp.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
        os.replace(str(tmp), str(self.progress_file))

    @staticmethod
    def sec_state(prog, mid, sid):
        st = prog.get("%s/%s" % (mid, sid))
        return st if isinstance(st, dict) else {}

    def section_summary(self, mid, sid, lang, prog):
        qs, _ = self.load_questions(self.section_dir(mid, sid))
        st = self.sec_state(prog, mid, sid)
        solved = st.get("solved") or {}
        return {
            "id": sid,
            "title": self.section_title(mid, sid, lang),
            "completed": bool(st.get("completed")),
            "questions": len(qs),
            "solved": sum(1 for q in qs if q["id"] in solved),
        }

    def module_summary(self, mid, lang, prog, with_sections=False):
        meta = self.module_meta(mid, lang)
        secs = [self.section_summary(mid, s, lang, prog) for s in self.section_ids(mid)]
        meta.update({
            "sections_total": len(secs),
            "sections_completed": sum(1 for s in secs if s["completed"]),
            "questions": sum(s["questions"] for s in secs),
            "solved": sum(s["solved"] for s in secs),
            "path": "data/modules/%s/sections/" % mid,
        })
        if with_sections:
            meta["sections"] = secs
        return meta

    def section_detail(self, mid, sid, lang):
        prog = self.load_progress()
        sids = self.section_ids(mid)
        idx = sids.index(sid)
        sdir = self.section_dir(mid, sid)
        md, served = self.read_md(sdir, lang)
        title, body = self.split_title(md)
        qs, qerr = self.load_questions(sdir)
        st = self.sec_state(prog, mid, sid)
        solved = st.get("solved") or {}
        questions = []
        for q in qs:
            item = {
                "id": q["id"],
                "n": q["n"],
                "text": self.loc(q["question"], lang),
                "hint": self.loc(q["hint"], lang) if q["hint"] else "",
                "solved": q["id"] in solved,
            }
            if item["solved"]:
                given = solved.get(q["id"])
                item["answer"] = given if isinstance(given, str) and given else (q["answers"][0] if q["answers"] else "")
            questions.append(item)

        def nav(j):
            if 0 <= j < len(sids):
                return {"id": sids[j], "title": self.section_title(mid, sids[j], lang)}
            return None

        return {
            "module": self.module_summary(mid, lang, prog, with_sections=True),
            "id": sid,
            "index": idx + 1,
            "total": len(sids),
            "title": title or self.pretty(sid),
            "lang": served,
            "has_content": bool(md.strip()),
            "markdown": body,
            "questions": questions,
            "questions_error": qerr,
            "completed": bool(st.get("completed")),
            "prev": nav(idx - 1),
            "next": nav(idx + 1),
        }

    def submit(self, mid, sid, qid, given):
        qs, _ = self.load_questions(self.section_dir(mid, sid))
        q = next((x for x in qs if x["id"] == qid), None)
        if q is None:
            return None
        ok = self.is_correct(q, given)
        auto_completed = False
        if ok:
            with self.lock:
                prog = self.load_progress()
                st = prog.setdefault("%s/%s" % (mid, sid), {})
                if not isinstance(st.get("solved"), dict):
                    st["solved"] = {}
                st["solved"][qid] = re.sub(r"\s+", " ", str(given)).strip()
                if all(x["id"] in st["solved"] for x in qs) and not st.get("completed"):
                    st["completed"] = True
                    auto_completed = True
                self.save_progress(prog)
        return {"correct": ok, "section_completed": auto_completed}

    def set_completed(self, mid, sid, value):
        with self.lock:
            prog = self.load_progress()
            prog.setdefault("%s/%s" % (mid, sid), {})["completed"] = bool(value)
            self.save_progress(prog)

    def reset_module(self, mid):
        with self.lock:
            prog = self.load_progress()
            for k in [k for k in prog if k.startswith(mid + "/")]:
                del prog[k]
            self.save_progress(prog)

    def answers(self, lang, only=None):
        out = []
        for mid in only or self.module_ids():
            meta = self.module_meta(mid, lang)
            secs = []
            for i, sid in enumerate(self.section_ids(mid)):
                qs, _ = self.load_questions(self.section_dir(mid, sid))
                if not qs:
                    continue
                secs.append({
                    "id": sid,
                    "index": i + 1,
                    "title": self.section_title(mid, sid, lang),
                    "questions": [{
                        "n": q["n"],
                        "text": self.loc(q["question"], lang),
                        "answer": q["answers"][0] if q["answers"] else "",
                        "alternatives": q["answers"][1:],
                    } for q in qs],
                })
            meta["sections"] = secs
            out.append(meta)
        return out

    @staticmethod
    def answers_markdown(mods):
        lines = []
        for m in mods:
            if not m["sections"]:
                continue
            lines += ["# %s" % m["title"], ""]
            for s in m["sections"]:
                lines += ["## %s" % s["title"], ""]
                for q in s["questions"]:
                    lines += ["Question %d: %s" % (q["n"], q["text"]), "==> %s" % q["answer"], ""]
        return "\n".join(lines).rstrip() + "\n"

    def import_files(self, mid, sid, files):
        mdir = self.module_dir(mid)
        if mdir is None or not sid or not ID_RE.match(sid):
            return None
        sdir = mdir / "sections" / sid
        sdir.mkdir(parents=True, exist_ok=True)
        written, errors = [], []
        for f in files if isinstance(files, list) else []:
            if not isinstance(f, dict):
                continue
            rel = str(f.get("path", "")).replace("\\", "/").lstrip("/")
            allowed = rel == "en.md" or rel.startswith("images/") or rel.startswith("_import/")
            p = safe_child(sdir, rel) if allowed else None
            if p is None or p == sdir or p.suffix.lower() not in IMPORT_EXTS:
                errors.append("rejected: %s" % rel)
                continue
            try:
                if "text" in f:
                    data = str(f["text"]).encode("utf-8")
                else:
                    data = base64.b64decode(str(f.get("b64", "")), validate=True)
            except (ValueError, TypeError) as e:
                errors.append("%s: %s" % (rel, e))
                continue
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes(data)
            written.append({"path": rel, "bytes": len(data)})
        return {"ok": True, "written": written, "errors": errors}

    def cheatsheet_files(self):
        files = []
        for p in self.cheats_dir.rglob("*"):
            rel_parts = p.relative_to(self.cheats_dir).parts
            if not p.is_file() or p.name.lower() in SKIP_FILES or any(x.startswith(".") for x in rel_parts):
                continue
            files.append(p)
        return sorted(files, key=lambda x: x.relative_to(self.cheats_dir).as_posix().lower())

    def cheatsheets(self):
        groups = {}
        total = size = 0
        for p in self.cheatsheet_files():
            rel = p.relative_to(self.cheats_dir).as_posix()
            folder = rel.rsplit("/", 1)[0] if "/" in rel else ""
            st = p.stat()
            groups.setdefault(folder, []).append({
                "name": p.name,
                "path": rel,
                "size": st.st_size,
                "ext": p.suffix.lower().lstrip("."),
            })
            total += 1
            size += st.st_size
        ordered = sorted(groups.items(), key=lambda kv: (kv[0] != "", kv[0].lower()))
        return {"groups": [{"folder": k, "files": v} for k, v in ordered], "total": total, "size": size,
                "path": "data/cheatsheets/"}

    def cheatsheets_zip(self):
        buf = io.BytesIO()
        with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as z:
            for p in self.cheatsheet_files():
                z.write(str(p), arcname="HTB_Cheatsheets/" + p.relative_to(self.cheats_dir).as_posix())
        return buf.getvalue()


class Handler(BaseHTTPRequestHandler):
    server_version = "CDSAAcademy/1.0"
    store = None

    def log_message(self, fmt, *args):
        pass

    def send_bytes(self, body, ctype, status=200, headers=None):
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        for k, v in (headers or {}).items():
            self.send_header(k, v)
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def send_json(self, obj, status=200, headers=None):
        self.send_bytes(json.dumps(obj, ensure_ascii=False).encode("utf-8"), "application/json; charset=utf-8", status,
                        headers=headers)

    def import_origin(self):
        origin = self.headers.get("Origin") or ""
        return origin if origin in IMPORT_ORIGINS else None

    def do_OPTIONS(self):
        origin = self.import_origin()
        if not origin or urllib.parse.urlsplit(self.path).path != "/api/import":
            self.send_response(403)
            self.send_header("Content-Length", "0")
            self.end_headers()
            return
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", origin)
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Access-Control-Allow-Private-Network", "true")
        self.send_header("Access-Control-Max-Age", "600")
        self.send_header("Vary", "Origin")
        self.send_header("Content-Length", "0")
        self.end_headers()

    def not_found(self, msg="Not found"):
        self.send_json({"error": msg}, 404)

    def send_file(self, path, download_name=None, view=False):
        if path is None or not path.is_file():
            return self.not_found("File not found")
        headers = {}
        if download_name:
            headers["Content-Disposition"] = content_disposition("inline" if view else "attachment", download_name)
        self.send_bytes(path.read_bytes(), mime_of(path, view=view), headers=headers)

    def do_GET(self):
        self._safe(self.route_get)

    def do_HEAD(self):
        self._safe(self.route_get)

    def do_POST(self):
        self._safe(self.route_post)

    def _safe(self, fn):
        try:
            fn()
        except (BrokenPipeError, ConnectionResetError, ConnectionAbortedError):
            pass
        except Exception as e:
            traceback.print_exc()
            try:
                self.send_json({"error": "Server error: %s" % e}, 500)
            except Exception:
                pass

    def route_get(self):
        st = self.store
        u = urllib.parse.urlsplit(self.path)
        path = urllib.parse.unquote(u.path)
        qs = urllib.parse.parse_qs(u.query)
        lang = qs.get("lang", ["vi"])[0]
        if lang not in LANGS:
            lang = "vi"

        if path in ("/", "/index.html"):
            return self.send_file(WEB_DIR / "index.html")
        if path == "/favicon.ico":
            return self.send_file(WEB_DIR / "favicon.png")
        if path.startswith("/static/"):
            return self.send_file(safe_child(WEB_DIR, path[len("/static/"):]))

        if path == "/api/modules":
            prog = st.load_progress()
            return self.send_json([st.module_summary(m, lang, prog) for m in st.module_ids()])

        m = re.fullmatch(r"/api/modules/([^/]+)", path)
        if m:
            mid = m.group(1)
            if not st.module_dir(mid):
                return self.not_found("Module not found")
            return self.send_json(st.module_summary(mid, lang, st.load_progress(), with_sections=True))

        m = re.fullmatch(r"/api/modules/([^/]+)/sections/([^/]+)", path)
        if m:
            mid, sid = m.groups()
            if not st.section_dir(mid, sid):
                return self.not_found("Section not found")
            return self.send_json(st.section_detail(mid, sid, lang))

        m = re.fullmatch(r"/content/([^/]+)/([^/]+)/(.+)", path)
        if m:
            mid, sid, rel = m.groups()
            sdir = st.section_dir(mid, sid)
            p = safe_child(sdir, rel) if sdir else None
            if p is not None and p.name.lower() == "questions.json":
                p = None
            return self.send_file(p)

        if path == "/api/cheatsheets":
            return self.send_json(st.cheatsheets())
        if path == "/download/cheatsheets.zip":
            return self.send_bytes(st.cheatsheets_zip(), "application/zip",
                                   headers={"Content-Disposition": content_disposition("attachment", "HTB_Cheatsheets.zip")})
        if path.startswith("/download/cheatsheet/"):
            p = safe_child(st.cheats_dir, path[len("/download/cheatsheet/"):])
            return self.send_file(p, download_name=p.name if p else None, view="view" in qs)

        if path == "/api/answers":
            return self.send_json(st.answers(lang))
        m = re.fullmatch(r"/download/answers/([^/]+)\.md", path)
        if m:
            key = m.group(1)
            if key == "_all":
                mods, name = st.answers(lang), "CDSA_Answers_All.md"
            else:
                if not st.module_dir(key):
                    return self.not_found("Module not found")
                mods = st.answers(lang, only=[key])
                name = "Answers_%s.md" % safe_filename(mods[0]["title"])
            body = st.answers_markdown(mods).encode("utf-8")
            return self.send_bytes(body, "text/markdown; charset=utf-8",
                                   headers={"Content-Disposition": content_disposition("attachment", name)})

        return self.not_found()

    def route_post(self):
        st = self.store
        path = urllib.parse.urlsplit(self.path).path
        is_import = path == "/api/import"
        cors = {}
        if is_import:
            origin = self.import_origin()
            if not origin:
                return self.send_json({"error": "Origin not allowed"}, 403)
            cors = {"Access-Control-Allow-Origin": origin, "Vary": "Origin"}
        if "application/json" not in (self.headers.get("Content-Type") or ""):
            return self.send_json({"error": "Content-Type must be application/json"}, 415, headers=cors)
        length = int(self.headers.get("Content-Length") or 0)
        if length > (IMPORT_MAX_BYTES if is_import else 1000000):
            return self.send_json({"error": "Body too large"}, 413, headers=cors)
        try:
            body = json.loads(self.rfile.read(length).decode("utf-8") or "{}") if length else {}
        except ValueError:
            return self.send_json({"error": "Invalid JSON"}, 400)
        if not isinstance(body, dict):
            body = {}
        mid = str(body.get("module", ""))
        sid = str(body.get("section", ""))

        if is_import:
            res = st.import_files(mid, sid, body.get("files"))
            if res is None:
                return self.send_json({"error": "Module not found or bad section id"}, 404, headers=cors)
            print("[import] %s/%s: %d file(s)" % (mid, sid, len(res["written"])))
            return self.send_json(res, headers=cors)

        if path == "/api/answer":
            if not st.section_dir(mid, sid):
                return self.not_found("Section not found")
            res = st.submit(mid, sid, str(body.get("question", "")), str(body.get("answer", "")))
            return self.send_json(res) if res is not None else self.not_found("Question not found")
        if path == "/api/progress/section":
            if not st.section_dir(mid, sid):
                return self.not_found("Section not found")
            st.set_completed(mid, sid, bool(body.get("completed", True)))
            return self.send_json({"ok": True})
        if path == "/api/progress/reset":
            if not st.module_dir(mid):
                return self.not_found("Module not found")
            st.reset_module(mid)
            return self.send_json({"ok": True})
        return self.not_found()


def find_port(host, start, tries=30):
    for port in range(start, start + tries):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind((host, port))
                return port
            except OSError:
                continue
    raise SystemExit("Khong tim duoc cong trong tu %d den %d." % (start, start + tries - 1))


def main():
    ap = argparse.ArgumentParser(description="HTB Certified Defensive Security Analyst - web on tap")
    ap.add_argument("--port", type=int, default=8765, help="cong (mac dinh 8765, ban se tu tim cong trong neu bi chiem)")
    ap.add_argument("--host", default="127.0.0.1", help="dia chi lang nghe (mac dinh 127.0.0.1)")
    ap.add_argument("--data", default=str(BASE_DIR / "data"), help="thu muc du lieu (mac dinh ./data)")
    ap.add_argument("--no-browser", action="store_true", help="khong tu mo trinh duyet")
    args = ap.parse_args()

    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

    Handler.store = Store(args.data)
    port = find_port(args.host, args.port)

    class Server(ThreadingHTTPServer):
        allow_reuse_address = os.name != "nt"
        daemon_threads = True

    httpd = Server((args.host, port), Handler)
    url = "http://127.0.0.1:%d/" % port
    print("=" * 60)
    print("  HTB Certified Defensive Security Analyst dang chay tai: %s" % url)
    print("  Du lieu: %s" % Handler.store.data)
    print("  Nhan Ctrl+C de dung server.")
    print("=" * 60)
    if not args.no_browser:
        threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nDa dung server.")
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
