#!/usr/bin/env python3
"""
loyaltybot_server.py  —  Fixed version
───────────────────────────────────────
Local server on port 8765.
Handles client management and runs one bot process per client simultaneously.

FIX 1: write_cfg now writes ALL client fields (employment, education, SSN, etc.)
FIX 2: Captures bot stderr so the dashboard can show crash errors
"""

import json, os, subprocess, sys, threading, uuid, time
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

BASE_DIR    = Path(__file__).parent
CLIENTS_DB  = BASE_DIR / "clients.json"
PORT        = 8765
_processes  = {}   # cid → subprocess.Popen
_errors     = {}   # cid → last error string
_lock       = threading.Lock()


# ── helpers ──────────────────────────────────────────────────────────────────

def load_clients():
    if CLIENTS_DB.exists():
        try:
            return json.loads(CLIENTS_DB.read_text(encoding="utf-8"))
        except Exception:
            pass
    return []

def save_clients(c):
    CLIENTS_DB.write_text(json.dumps(c, indent=2), encoding="utf-8")

def find_client(cid):
    return next((c for c in load_clients() if c["id"] == cid), None)

def cfg_path(cid):
    return BASE_DIR / f"config_{cid}.json"

def prog_path(cid):
    return BASE_DIR / f"progress_{cid}.json"

def res_path(cid):
    return BASE_DIR / f"signup-results_{cid}.csv"

def global_capsolver():
    p = BASE_DIR / "config.json"
    if p.exists():
        try:
            return json.loads(p.read_text(encoding="utf-8")).get("capsolver_api_key", "")
        except Exception:
            pass
    return ""


def write_cfg(c):
    """
    Build a full config.json for a single client.
    The bot expects nested dicts for address/employment/education,
    but also has flat-field fallbacks — we write BOTH to be safe.
    """
    # Helper to pull from the client record (flat keys)
    g = lambda key, default="": c.get(key, default)

    # Build nested address (bot reads config["address"]["street"] etc.)
    address = {
        "street": g("street"),
        "city":   g("city"),
        "state":  g("state"),
        "zip":    g("zip"),
    }

    # Build nested employment
    employment = {
        "employer":        g("employer"),
        "employer_address": g("employer_address"),
        "employer_phone":  g("employer_phone"),
        "job_title":       g("job_title"),
        "years_at_job":    g("years_at_job"),
        "months_at_job":   g("months_at_job"),
        "employment_status": g("employment_status"),
        "monthly_income":  g("monthly_income"),
        "annual_income":   g("annual_income"),
    }

    # Build nested education
    education = {
        "college":              g("college"),
        "college_short":        g("college_short"),
        "degree":               g("degree"),
        "degree_field":         g("degree_field"),
        "grad_year":            g("grad_year"),
        "high_school":          g("high_school"),
        "high_school_grad_year": g("high_school_grad_year"),
        "education_level":      g("education_level"),
        "work_authorization":   g("work_authorization"),
    }

    data = {
        # identity
        "client_name":    g("client_name"),
        "first_name":     g("first_name"),
        "last_name":      g("last_name"),
        "email":          g("email"),
        "phone":          g("phone"),
        "dob":            g("dob"),
        "password":       g("password", "LoyaltyBot2025!"),
        "username":       g("username", g("email")),
        "ssn":            g("ssn"),

        # nested dicts the bot reads
        "address":        address,
        "employment":     employment,
        "education":      education,

        # flat versions as fallback (bot also tries these)
        "street":         g("street"),
        "city":           g("city"),
        "state":          g("state"),
        "zip":            g("zip"),
        "employer":       g("employer"),
        "employer_phone": g("employer_phone"),
        "job_title":      g("job_title"),
        "annual_income":  g("annual_income"),
        "monthly_income": g("monthly_income"),
        "college":        g("college"),
        "degree":         g("degree"),

        # extra profile fields
        "certifications":  g("certifications"),
        "skills":          g("skills"),
        "linkedin_url":    g("linkedin_url"),

        # system
        "capsolver_api_key": g("capsolver_api_key", global_capsolver()),
        "workers":           int(g("workers", 5)),
        "delay_seconds":     2.0,
        "results_path":      str(res_path(c["id"])),
        "progress_path":     str(prog_path(c["id"])),
    }

    path = cfg_path(c["id"])
    path.write_text(json.dumps(data, indent=2), encoding="utf-8")
    return path


def _watch_process(cid, proc):
    """Background thread to capture stderr when a bot process crashes."""
    try:
        _, stderr = proc.communicate()
        if proc.returncode != 0 and stderr:
            # Keep last 800 chars of error
            _errors[cid] = stderr.decode("utf-8", errors="replace")[-800:]
    except Exception:
        pass


def count_previous_results(cid):
    """Count previous results by status for re-run detection."""
    rp = res_path(cid)
    counts = {"success": 0, "failed": 0, "total": 0}
    if rp.exists():
        import csv as _csv
        try:
            with open(rp, newline="", encoding="utf-8") as f:
                for row in _csv.DictReader(f):
                    counts["total"] += 1
                    s = row.get("status", "").strip()
                    if s == "success":
                        counts["success"] += 1
                    else:
                        counts["failed"] += 1
        except Exception:
            pass
    return counts


def do_launch(cid, mode="live", workers=5, limit=0):
    c = find_client(cid)
    if not c:
        return {"ok": False, "error": "Client not found"}

    with _lock:
        proc = _processes.get(cid)
        if proc and proc.poll() is None:
            return {"ok": False, "error": "Already running"}

        # Clear any previous error
        _errors.pop(cid, None)

        cp = write_cfg(c)

        # ── ENGINE SELECTION ────────────────────────────────────────────────
        # Per-client "engine" field in clients.json/config picks the browser
        # backend. "camofox" routes through the anti-detection Camoufox engine
        # (auto_signup_camofox_parallel.py); anything else keeps the original
        # Playwright bot. Both honor the same --workers/--config/--progress/
        # --results contract, so results_{cid}.csv and progress_{cid}.json stay
        # identical and the dashboard needs no changes.
        engine = str(c.get("engine", "playwright")).strip().lower()

        if engine == "camofox":
            bot = BASE_DIR / "auto_signup_camofox_parallel.py"
            bot_name = "auto_signup_camofox_parallel.py"
        else:
            bot = BASE_DIR / "auto-signup-parallel-FIXED.py"
            bot_name = "auto-signup-parallel-FIXED.py"

        if not bot.exists():
            return {"ok": False, "error": f"Bot script not found: {bot_name}"}

        # V3: Detect re-run — bot now auto-skips successful URLs,
        # so we just launch normally and it figures out what to retry
        prev = count_previous_results(cid)
        is_rerun = prev["total"] > 0

        cmd = [
            sys.executable, str(bot),
            "--workers", str(workers),
            "--config", str(cp),
            "--progress", str(prog_path(cid)),
            "--results", str(res_path(cid)),
        ]
        if mode == "dry-run":
            cmd += ["--dry-run"]

        if engine == "camofox":
            # Camofox engine: shares dead-urls.json with the Playwright bot.
            # It has no --manual/--headless flags (Camoufox visibility is set
            # by the camofox-browser server, e.g. ENABLE_VNC=1), so manual mode
            # falls back to a normal live run here.
            cmd += ["--dead-urls", str(BASE_DIR / "dead-urls.json")]
            if limit > 0:
                cmd += ["--limit", str(limit)]
        else:
            if mode == "manual":
                cmd += ["--manual", "--headless", "false"]
                workers = min(workers, 1)  # Manual mode = 1 worker only
                cmd[cmd.index("--workers") + 1] = "1"
            if limit > 0:
                cmd += ["--limit", str(limit)]
            # Always show browser so user can take over mid-run
            if "--headless" not in cmd:
                cmd += ["--headless", "false"]

        # V3: Clear progress file for fresh tracking
        pp = prog_path(cid)
        if pp.exists():
            try:
                pp.unlink()
            except Exception:
                pass

        try:
            creation_flags = 0
            if sys.platform == "win32":
                creation_flags = subprocess.CREATE_NO_WINDOW

            proc = subprocess.Popen(
                cmd,
                cwd=str(BASE_DIR),
                stderr=subprocess.PIPE,
                creationflags=creation_flags,
            )
            _processes[cid] = proc

            # Start watcher thread for error capture
            t = threading.Thread(target=_watch_process, args=(cid, proc), daemon=True)
            t.start()

            msg = f"Re-run: retrying {prev['failed']} failed sites (skipping {prev['success']} successes)" if is_rerun else "First run"
            return {"ok": True, "pid": proc.pid, "message": msg}
        except Exception as e:
            return {"ok": False, "error": str(e)}


def cors(h):
    h.send_header("Access-Control-Allow-Origin", "*")
    h.send_header("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    h.send_header("Access-Control-Allow-Headers", "Content-Type")


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def do_OPTIONS(self):
        self.send_response(200)
        cors(self)
        self.end_headers()

    def do_GET(self):
        if self.path == "/" or self.path == "/dashboard":
            # Serve the dashboard HTML
            dash = BASE_DIR / "dashboard.html"
            if dash.exists():
                body = dash.read_bytes()
                self.send_response(200)
                self.send_header("Content-Type", "text/html; charset=utf-8")
                self.send_header("Content-Length", len(body))
                self.end_headers()
                self.wfile.write(body)
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b"dashboard.html not found")

        elif self.path == "/ping":
            self._json({"ok": True})

        elif self.path == "/startup/check":
            # Check all dependencies so dashboard can show system health
            checks = {}
            # Python version
            checks["python"] = sys.version.split()[0]
            # Bot file
            checks["bot_file"] = (BASE_DIR / "auto-signup-parallel-FIXED.py").exists()
            # Dashboard file
            checks["dashboard_file"] = (BASE_DIR / "dashboard.html").exists()
            # Master CSV
            csv_path = BASE_DIR / "loyalty-rewards-MASTER.csv"
            checks["master_csv"] = csv_path.exists()
            if csv_path.exists():
                try:
                    checks["master_csv_rows"] = sum(1 for _ in open(csv_path, encoding="utf-8")) - 1
                except Exception:
                    checks["master_csv_rows"] = 0
            # Dead URLs count
            dead_path = BASE_DIR / "dead-urls.json"
            if dead_path.exists():
                try:
                    checks["dead_urls"] = len(json.loads(dead_path.read_text(encoding="utf-8")).get("urls", []))
                except Exception:
                    checks["dead_urls"] = 0
            else:
                checks["dead_urls"] = 0
            # Playwright
            try:
                import importlib
                importlib.import_module("playwright")
                checks["playwright"] = True
            except ImportError:
                checks["playwright"] = False
            # Pandas
            try:
                importlib.import_module("pandas")
                checks["pandas"] = True
            except ImportError:
                checks["pandas"] = False
            # Clients count
            checks["clients"] = len(load_clients())
            # Any running?
            checks["running"] = any(p.poll() is None for p in _processes.values() if p)
            self._json({"ok": True, "checks": checks})

        elif self.path == "/clients":
            cl = load_clients()
            for c in cl:
                proc = _processes.get(c["id"])
                c["running"] = proc is not None and proc.poll() is None
                # Attach last error if bot crashed
                err = _errors.get(c["id"])
                if err and not c["running"]:
                    c["last_error"] = err
            self._json(cl)

        elif self.path.startswith("/status/"):
            cid = self.path.split("/status/")[-1]
            proc = _processes.get(cid)
            running = proc is not None and proc.poll() is None
            prog = {}
            pp = prog_path(cid)
            if pp.exists():
                try:
                    prog = json.loads(pp.read_text(encoding="utf-8"))
                except Exception:
                    pass
            result = {"running": running, "progress": prog}
            # Include error if bot crashed
            err = _errors.get(cid)
            if err and not running:
                result["error"] = err
            self._json(result)

        elif self.path.startswith("/results/"):
            cid = self.path.split("/results/")[-1]
            rp = res_path(cid)
            if rp.exists():
                import csv as _csv
                rows = []
                try:
                    with open(rp, newline="", encoding="utf-8") as f:
                        reader = _csv.DictReader(f)
                        for row in reader:
                            rows.append(dict(row))
                except Exception:
                    pass
                self._json({"ok": True, "rows": rows})
            else:
                self._json({"ok": False, "rows": [], "error": "No results yet. Run the bot first."})

        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        n = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(n)
        try:
            p = json.loads(body) if body else {}
        except Exception:
            p = {}

        routes = {
            "/clients/add":    self._add,
            "/clients/import": self._imp,
            "/clients/delete": self._del,
            "/launch":         self._launch,
            "/launch_all":     self._launch_all,
            "/stop":           self._stop,
            "/stop_all":       self._stop_all,
            "/reset":          self._reset,
            "/manual/pause":   self._manual_pause,
            "/manual/resume":  self._manual_resume,
            "/startup/install": self._install_deps,
        }
        fn = routes.get(self.path)
        if fn:
            fn(p)
        else:
            self.send_response(404)
            self.end_headers()

    # ── client CRUD ──────────────────────────────────────────────────────

    def _add(self, p):
        cl = load_clients()
        email = p.get("email", "").strip().lower()
        for c in cl:
            if c.get("email", "").lower() == email:
                self._json({"ok": False, "error": "Email already exists"})
                return
        p["id"] = str(uuid.uuid4())[:8]
        cl.append(p)
        save_clients(cl)
        write_cfg(p)
        self._json({"ok": True, "id": p["id"]})

    def _imp(self, p):
        rows = p.get("rows", [])
        cl = load_clients()
        existing_emails = {c.get("email", "").lower() for c in cl}
        added = 0
        for row in rows:
            email = row.get("email", "").strip().lower()
            if not email or email in existing_emails:
                continue
            row["id"] = str(uuid.uuid4())[:8]
            cl.append(row)
            existing_emails.add(email)
            write_cfg(row)
            added += 1
        save_clients(cl)
        self._json({"ok": True, "added": added})

    def _del(self, p):
        cid = p.get("id")
        save_clients([c for c in load_clients() if c["id"] != cid])
        for path in [cfg_path(cid), prog_path(cid), res_path(cid)]:
            if path.exists():
                try:
                    path.unlink()
                except Exception:
                    pass
        self._json({"ok": True})

    # ── launch / stop ────────────────────────────────────────────────────

    def _launch(self, p):
        self._json(do_launch(
            p.get("id"),
            p.get("mode", "live"),
            int(p.get("workers", 5)),
            int(p.get("limit", 0)),
        ))

    def _launch_all(self, p):
        results = []
        for c in load_clients():
            results.append(do_launch(
                c["id"],
                p.get("mode", "live"),
                int(p.get("workers", 5)),
                int(p.get("limit", 0)),
            ))
        self._json({"ok": True, "results": results})

    def _stop(self, p):
        cid = p.get("id")
        proc = _processes.get(cid)
        if proc and proc.poll() is None:
            proc.terminate()
            self._json({"ok": True})
        else:
            self._json({"ok": False, "error": "Not running"})

    def _manual_pause(self, p):
        """Pause a worker so user can manually navigate the browser."""
        cid = p.get("id")
        wid = str(p.get("worker", 1))
        if not cid:
            self._json({"ok": False, "error": "No client id"})
            return
        override_file = BASE_DIR / f"manual_override_{cid}.json"
        overrides = {}
        if override_file.exists():
            try:
                overrides = json.loads(override_file.read_text(encoding="utf-8"))
            except Exception:
                overrides = {}
        overrides[wid] = "paused"
        override_file.write_text(json.dumps(overrides), encoding="utf-8")
        self._json({"ok": True, "worker": wid, "state": "paused"})

    def _manual_resume(self, p):
        """Resume a paused worker — bot will fill+submit whatever page user navigated to."""
        cid = p.get("id")
        wid = str(p.get("worker", 1))
        if not cid:
            self._json({"ok": False, "error": "No client id"})
            return
        override_file = BASE_DIR / f"manual_override_{cid}.json"
        overrides = {}
        if override_file.exists():
            try:
                overrides = json.loads(override_file.read_text(encoding="utf-8"))
            except Exception:
                overrides = {}
        overrides[wid] = "resume"
        override_file.write_text(json.dumps(overrides), encoding="utf-8")
        self._json({"ok": True, "worker": wid, "state": "resume"})

    def _stop_all(self, p=None):
        with _lock:
            for proc in _processes.values():
                if proc and proc.poll() is None:
                    proc.terminate()
        self._json({"ok": True})

    def _reset(self, p):
        cid = p.get("id")
        if cid:
            pp = prog_path(cid)
            if pp.exists():
                pp.unlink()
            _errors.pop(cid, None)
        self._json({"ok": True})

    def _install_deps(self, p):
        """Install Python dependencies from the dashboard."""
        try:
            result = subprocess.run(
                [sys.executable, "-m", "pip", "install", "playwright", "pandas", "aiohttp", "--quiet"],
                capture_output=True, text=True, timeout=120
            )
            if result.returncode != 0:
                self._json({"ok": False, "error": f"pip failed: {result.stderr[-300:]}"})
                return
            # Install Chromium browser
            result2 = subprocess.run(
                [sys.executable, "-m", "playwright", "install", "chromium"],
                capture_output=True, text=True, timeout=180
            )
            if result2.returncode != 0:
                self._json({"ok": False, "error": f"Chromium install failed: {result2.stderr[-300:]}"})
                return
            self._json({"ok": True, "message": "All dependencies installed"})
        except subprocess.TimeoutExpired:
            self._json({"ok": False, "error": "Install timed out — try running manually"})
        except Exception as e:
            self._json({"ok": False, "error": str(e)})

    # ── response ─────────────────────────────────────────────────────────

    def _json(self, obj):
        body = json.dumps(obj).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", len(body))
        cors(self)
        self.end_headers()
        self.wfile.write(body)


# ── entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    # Auto-seed clients.json from config.json on first run
    if not CLIENTS_DB.exists():
        p = BASE_DIR / "config.json"
        if p.exists():
            try:
                cfg = json.loads(p.read_text(encoding="utf-8"))
                addr = cfg.get("address", {})
                if not isinstance(addr, dict):
                    addr = {}
                emp = cfg.get("employment", {})
                if not isinstance(emp, dict):
                    emp = {}
                edu = cfg.get("education", {})
                if not isinstance(edu, dict):
                    edu = {}

                c = {
                    "id":                    "client01",
                    "client_name":           cfg.get("client_name", "Client Name"),
                    "first_name":            cfg.get("first_name", "First"),
                    "last_name":             cfg.get("last_name", "Last"),
                    "email":                 cfg.get("email", ""),
                    "phone":                 cfg.get("phone", ""),
                    "dob":                   cfg.get("dob", ""),
                    "password":              cfg.get("password", "LoyaltyBot2025!"),
                    "username":              cfg.get("username", cfg.get("email", "")),
                    "ssn":                   cfg.get("ssn", ""),
                    # address (flat)
                    "street":                addr.get("street", ""),
                    "city":                  addr.get("city", ""),
                    "state":                 addr.get("state", ""),
                    "zip":                   addr.get("zip", ""),
                    # employment (flat)
                    "employer":              emp.get("employer", ""),
                    "employer_address":      emp.get("employer_address", ""),
                    "employer_phone":        emp.get("employer_phone", ""),
                    "job_title":             emp.get("job_title", ""),
                    "years_at_job":          emp.get("years_at_job", ""),
                    "months_at_job":         emp.get("months_at_job", ""),
                    "employment_status":     emp.get("employment_status", ""),
                    "monthly_income":        emp.get("monthly_income", ""),
                    "annual_income":         emp.get("annual_income", ""),
                    # education (flat)
                    "college":               edu.get("college", ""),
                    "college_short":         edu.get("college_short", ""),
                    "degree":                edu.get("degree", ""),
                    "degree_field":          edu.get("degree_field", ""),
                    "grad_year":             edu.get("grad_year", ""),
                    "high_school":           edu.get("high_school", ""),
                    "high_school_grad_year": edu.get("high_school_grad_year", ""),
                    "education_level":       edu.get("education_level", ""),
                    "work_authorization":    edu.get("work_authorization", ""),
                    # extras
                    "certifications":        cfg.get("certifications", ""),
                    "skills":                cfg.get("skills", ""),
                    "linkedin_url":          cfg.get("linkedin_url", ""),
                    "capsolver_api_key":     cfg.get("capsolver_api_key", ""),
                    "workers":               cfg.get("workers", 5),
                }
                save_clients([c])
                write_cfg(c)
                print(f"Loaded {c['client_name']} from config.json")
            except Exception as e:
                print(f"Could not load config: {e}")

    print(f"LoyaltyBot server running on http://localhost:{PORT}")
    print("Dashboard will open automatically. Press Ctrl+C to stop.")
    server = HTTPServer(("localhost", PORT), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
