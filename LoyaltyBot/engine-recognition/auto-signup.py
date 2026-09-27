#!/usr/bin/env python3
"""
auto-signup-parallel.py
───────────────────────
Parallel loyalty program auto-signup with smart queue, auto-retry,
site health check, and AUTOMATIC CAPTCHA solving via CapSolver.

FEATURES:
  • Parallel browsers (N workers filling different sites simultaneously)
  • Smart queue: no-barrier sites first, CAPTCHA/SSN sites last
  • Auto-retry: re-run only failed sites from previous run
  • Site health check: pre-scan URLs and flag dead links
  • CapSolver integration: auto-solves reCAPTCHA v2/v3, hCaptcha, Turnstile
  • Fallback: manual CAPTCHA solve if CapSolver fails or no API key

Requirements:
    pip install playwright pandas aiohttp playwright-stealth
    playwright install chromium

Usage:
    # Standard run — 5 workers, 50 sites, auto-solves CAPTCHAs
    python auto-signup-parallel.py --workers 5 --limit 50

    # Auto-retry only failed/timed-out sites
    python auto-signup-parallel.py --retry --workers 5

    # Site health check — scan URLs without signing up
    python auto-signup-parallel.py --health-check --workers 10

    # Run without CapSolver (manual CAPTCHA mode)
    python auto-signup-parallel.py --workers 5 --limit 50 --no-capsolver

    # Full blast
    python auto-signup-parallel.py --workers 10 --limit 200
"""

import asyncio
import argparse
import csv
import json
import logging
import os
import socket
import sys
import time
import threading
from datetime import datetime
from pathlib import Path
from collections import Counter

import aiohttp
import pandas as pd
from playwright.async_api import async_playwright, TimeoutError as PlaywrightTimeoutError

# ── UNIVERSAL LABEL-AWARE RECOGNITION ENGINE ─────────────────────────────────
# recognition.py resolves each field's <label> text plus every attribute, so it
# recognizes the catalog / loyalty / sweepstakes / soft-pull-credit forms whose
# only signal is the label (opaque ids like q_0001), and it cleanly classifies
# junk pages (phone-only, app-only, non-signup) so they SKIP instead of failing.
# Falls back to the legacy static-selector engine if the module isn't present.
try:
    from recognition import scan_page, classify_page, smart_fill
    _SMART_ENGINE = True
except Exception as _smart_err:  # pragma: no cover
    _SMART_ENGINE = False
    _SMART_IMPORT_ERROR = _smart_err

# Dead domain cache — skip DNS lookup if we already know it's dead this session
_dead_domains: set = set()

# ── PERSISTENT DEAD URL CACHE ────────────────────────────────────────────────
# URLs that permanently fail (connection refused, 403, 404, 410, etc.) are
# written to dead-urls.json so they're skipped instantly on every future run.
DEAD_URLS_PATH = Path(__file__).parent / "dead-urls.json"
_dead_urls: set = set()
_dead_urls_lock = threading.Lock()

MAX_STRIKES = 3  # After this many failures with zero successes, URL is permanently retired

def load_dead_urls() -> None:
    """Load permanently-failed URLs from disk, then auto-retire any URL that
    has failed MAX_STRIKES times across all runs without a single success."""
    global _dead_urls
    if DEAD_URLS_PATH.exists():
        try:
            data = json.loads(DEAD_URLS_PATH.read_text(encoding="utf-8"))
            _dead_urls = set(data.get("urls", []))
        except Exception:
            _dead_urls = set()

    # ── 3-STRIKE AUTO-RETIREMENT ────────────────────────────────────────────
    # Scan results CSV and retire URLs that have failed 3+ times but never succeeded.
    results_path = Path(__file__).parent / f"signup-results_{_active_client_id}.csv" if '_active_client_id' in dir() else None
    # Fallback: look for any signup-results file
    if not results_path or not results_path.exists():
        candidates = list(Path(__file__).parent.glob("signup-results_*.csv"))
        results_path = candidates[0] if candidates else None
    if results_path and results_path.exists():
        try:
            from collections import defaultdict
            url_stats = defaultdict(lambda: {"failures": 0, "successes": 0})
            with open(results_path, newline="", encoding="utf-8") as f:
                for row in csv.DictReader(f):
                    url = row.get("url", "").strip()
                    status = row.get("status", "").strip()
                    if not url:
                        continue
                    if status == "success":
                        url_stats[url]["successes"] += 1
                    elif status in ("failed", "timeout", "navigation_error",
                                    "captcha_failed", "captcha_skipped"):
                        url_stats[url]["failures"] += 1
            newly_retired = 0
            for url, stats in url_stats.items():
                if stats["failures"] >= MAX_STRIKES and stats["successes"] == 0 and url not in _dead_urls:
                    _dead_urls.add(url)
                    newly_retired += 1
            if newly_retired:
                logger.info(f"⚡ 3-strike retirement: {newly_retired} URLs auto-retired (failed {MAX_STRIKES}+ times, 0 successes)")
                try:
                    DEAD_URLS_PATH.write_text(
                        json.dumps({"urls": sorted(_dead_urls)}, indent=2),
                        encoding="utf-8"
                    )
                except Exception:
                    pass
        except Exception as e:
            logger.warning(f"Could not run 3-strike scan: {e}")

def mark_url_dead(url: str) -> None:
    """Add a URL to the permanent dead list and flush to disk."""
    with _dead_urls_lock:
        if url in _dead_urls:
            return
        _dead_urls.add(url)
        try:
            DEAD_URLS_PATH.write_text(
                json.dumps({"urls": sorted(_dead_urls)}, indent=2),
                encoding="utf-8"
            )
        except Exception:
            pass

# ── NO-FORM STRIKE TRACKER ──────────────────────────────────────────────────
# If a URL has "no form fields" twice in THIS session, retire it permanently.
_no_form_strikes: dict = {}  # {url: count}
NO_FORM_MAX_STRIKES = 2

def _check_no_form_strike(url: str, brand: str, worker: int) -> None:
    """Track no-form-fields failures. After NO_FORM_MAX_STRIKES in one session,
    mark the URL dead so it's never tried again."""
    _no_form_strikes[url] = _no_form_strikes.get(url, 0) + 1
    if _no_form_strikes[url] >= NO_FORM_MAX_STRIKES:
        mark_url_dead(url)
        logger.info(f"  [W{worker}] 🚫 No-form 2-strike retirement: {brand} → {url}")

# ── USER-AGENT ROTATION POOL ─────────────────────────────────────────────────
# 8 realistic Chrome UAs across different versions and OS combos.
# Workers are assigned UAs by index so each browser looks like a different machine.
_UA_POOL = [
    ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
     '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"'),
    ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
     '"Chromium";v="123", "Google Chrome";v="123", "Not-A.Brand";v="99"'),
    ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
     '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"'),
    ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
     '"Chromium";v="122", "Google Chrome";v="122", "Not-A.Brand";v="99"'),
    ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.82 Safari/537.36",
     '"Chromium";v="124", "Google Chrome";v="124", "Not-A.Brand";v="99"'),
    ("Mozilla/5.0 (Macintosh; Intel Mac OS X 14_4_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
     '"Chromium";v="123", "Google Chrome";v="123", "Not-A.Brand";v="99"'),
    ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 Edg/124.0.0.0",
     '"Chromium";v="124", "Microsoft Edge";v="124", "Not-A.Brand";v="99"'),
    ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36",
     '"Chromium";v="121", "Google Chrome";v="121", "Not-A.Brand";v="99"'),
]

def get_ua_for_worker(worker_id: int) -> tuple:
    """Return (user_agent, sec_ch_ua) for a given worker, cycling through the pool."""
    return _UA_POOL[(worker_id - 1) % len(_UA_POOL)]

def domain_is_live(url: str) -> bool:
    """Quick DNS lookup — returns False instantly if domain doesn't resolve.
    Results are cached per session so each dead domain only costs one lookup."""
    try:
        from urllib.parse import urlparse
        host = urlparse(url).hostname
        if not host:
            return False
        if host in _dead_domains:
            return False
        socket.setdefaulttimeout(3)
        socket.getaddrinfo(host, None)
        return True
    except (socket.gaierror, socket.timeout, OSError):
        try:
            from urllib.parse import urlparse
            host = urlparse(url).hostname
            if host:
                _dead_domains.add(host)
        except Exception:
            pass
        return False
    except Exception:
        return True  # Unknown error — let the browser try

# playwright-stealth makes browsers look like real humans to anti-bot systems.
# Install: pip install playwright-stealth
try:
    from playwright_stealth import stealth_async as _stealth_async
    STEALTH_AVAILABLE = True
except ImportError:
    STEALTH_AVAILABLE = False

# ─────────────────────────────────────────────
#  PATHS & CONFIG
# ─────────────────────────────────────────────
CSV_INPUT_PATH    = Path(__file__).parent / "loyalty-rewards-MASTER.csv"
CONFIG_PATH       = Path(__file__).parent / "config.json"
RESULTS_LOG_PATH  = Path(__file__).parent / "signup-results-playwright.csv"
HEALTH_LOG_PATH   = Path(__file__).parent / "site-health-results.csv"
PROGRESS_PATH     = Path(__file__).parent / "progress.json"
STOP_FLAG_PATH    = Path(__file__).parent / "stop.flag"  # Server writes this; workers check it

DEFAULT_WORKERS       = 5
DEFAULT_DELAY_SECONDS = 1.5
NAVIGATION_TIMEOUT_MS = 25_000   # LOW-POWER: 25s nav cap (was 40s) — N6000 physics
FILL_TIMEOUT_MS       = 4_000
CAPTCHA_TIMEOUT_SEC   = 120      # manual fallback timeout (interactive modes only)
HEALTH_TIMEOUT_MS     = 15_000
CAPSOLVER_TIMEOUT_SEC = 40       # max wait for CapSolver — raised 20→40 so hard
                                 # reCAPTCHA v2 image challenges have time to solve
                                 # (biggest lever on the captcha_failed bucket)

# ── PER-SITE HARD CAP ─────────────────────────────────────────────────────────
# The outer watchdog that kills a frozen site so the worker moves on. This MUST
# exceed the worst-case successful path: nav (25s) + fill/hydrate (~20s) +
# CapSolver (~40s) + submit & detect (~15s) ≈ 100s. The old value was 60s, which
# guaranteed that every captcha site and every merely-slow-but-valid site was
# killed as a "timeout" before it could finish — the single largest cause of the
# 19.8% timeout bucket. 110s recovers them without letting truly-hung sites hang
# forever. Non-captcha sites finish in 30–50s and are unaffected.
PER_SITE_HARD_CAP_SEC = 110
# In headless batch mode there is no human to solve a captcha CapSolver couldn't,
# so the 120s manual fallback would just burn the cap and fail anyway. Cap the
# manual wait short unless we're in an interactive (MANUAL) mode.
BATCH_MANUAL_CAPTCHA_WAIT_SEC = 12

# ── LOW-POWER MODE ────────────────────────────────────────────────────────────
# Optimized for Intel Pentium Silver N6000 (2 workers).
# Sites that won't load in 25s won't load in 40s on this chip — skip them fast.
# Set to False to restore full crawl behavior on a faster machine.
LOW_POWER_MODE = True

# ── MANUAL MODE ───────────────────────────────────────────────────────────────
# When True: bot opens the site URL, then STOPS and waits up to 120 seconds.
# You click through to the signup form yourself.
# The instant the bot sees any real input field on screen it fills everything
# and submits — no other action needed from you.
# Activate with --manual flag from server/CLI.
MANUAL_MODE         = False
MANUAL_WAIT_SECONDS = 120

# ─────────────────────────────────────────────
#  CAPSOLVER CONFIG
# ─────────────────────────────────────────────
CAPSOLVER_API_URL = "https://api.capsolver.com"

# ─────────────────────────────────────────────
#  STEALTH JS — injected into every page context
#  Patches the 15+ signals anti-bot systems check.
# ─────────────────────────────────────────────
STEALTH_JS = """
// ── STEALTH PATCH v2 ─────────────────────────────────────────────────────────
// Covers all signals checked by Akamai Bot Manager, Cloudflare, DataDome,
// PerimeterX, and standard fingerprinting libraries (FingerprintJS, CreepJS).

// 1. Kill the #1 bot tell — navigator.webdriver
Object.defineProperty(navigator, 'webdriver', { get: () => undefined });

// 2. Restore realistic Chrome runtime object
window.chrome = {
    app: { isInstalled: false,
        InstallState: { DISABLED:'disabled',INSTALLED:'installed',NOT_INSTALLED:'not_installed' },
        RunningState: { CANNOT_RUN:'cannot_run',READY_TO_RUN:'ready_to_run',RUNNING:'running' } },
    csi: function(){},
    loadTimes: function(){ return {
        commitLoadTime: Date.now()/1000 - 0.4, connectionInfo:'h2',
        finishDocumentLoadTime: Date.now()/1000 - 0.1, finishLoadTime: Date.now()/1000,
        firstPaintAfterLoadTime: 0, firstPaintTime: Date.now()/1000 - 0.3,
        navigationType:'Other', npnNegotiatedProtocol:'h2',
        requestTime: Date.now()/1000 - 0.5, startLoadTime: Date.now()/1000 - 0.45,
        wasAlternateProtocolAvailable: false, wasFetchedViaSpdy: true, wasNpnNegotiated: true
    }; },
    runtime: { PlatformOs: { WIN:'win',MAC:'mac',LINUX:'linux' } },
};

// 3. Realistic plugin list (0 plugins = instant bot flag)
const pluginData = [
    { name:'Chrome PDF Plugin',  filename:'internal-pdf-viewer',        description:'Portable Document Format' },
    { name:'Chrome PDF Viewer',  filename:'mhjfbmdgcfjbbpaeojofohoefgiehjai', description:'' },
    { name:'Native Client',      filename:'internal-nacl-plugin',       description:'' },
];
const fakePlugins = Object.create(PluginArray.prototype);
pluginData.forEach((p, i) => {
    const plugin = Object.create(Plugin.prototype);
    Object.defineProperties(plugin, {
        name:{value:p.name}, filename:{value:p.filename},
        description:{value:p.description}, length:{value:0}
    });
    Object.defineProperty(fakePlugins, i, { value: plugin });
});
Object.defineProperty(fakePlugins, 'length', { value: pluginData.length });
Object.defineProperty(navigator, 'plugins',   { get: () => fakePlugins });
Object.defineProperty(navigator, 'mimeTypes', { get: () => { const m = Object.create(MimeTypeArray.prototype); Object.defineProperty(m,'length',{value:0}); return m; } });

// 4. Core navigator properties
Object.defineProperty(navigator, 'languages',          { get: () => ['en-US','en'] });
Object.defineProperty(navigator, 'platform',           { get: () => 'Win32' });
Object.defineProperty(navigator, 'vendor',             { get: () => 'Google Inc.' });
Object.defineProperty(navigator, 'vendorSub',          { get: () => '' });
Object.defineProperty(navigator, 'productSub',         { get: () => '20030107' });
Object.defineProperty(navigator, 'hardwareConcurrency',{ get: () => 8 });
Object.defineProperty(navigator, 'deviceMemory',       { get: () => 8 });
Object.defineProperty(navigator, 'maxTouchPoints',     { get: () => 0 });
Object.defineProperty(navigator, 'cookieEnabled',      { get: () => true });
Object.defineProperty(navigator, 'doNotTrack',         { get: () => null });
Object.defineProperty(navigator, 'onLine',             { get: () => true });

// 5. Fix permissions — headless returns 'denied', real Chrome returns 'default'
const origQuery = window.Permissions && window.Permissions.prototype.query;
if (origQuery) {
    window.Permissions.prototype.query = function(params) {
        if (params && params.name === 'notifications') {
            return Promise.resolve({ state: Notification.permission, onchange: null });
        }
        return origQuery.call(this, params);
    };
}

// 6. WebGL — SwiftShader = instant bot flag on luxury/airline sites
try {
    const getParam = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function(param) {
        if (param === 37445) return 'Intel Inc.';
        if (param === 37446) return 'Intel Iris Pro OpenGL Engine';
        return getParam.call(this, param);
    };
    const getParam2 = WebGL2RenderingContext.prototype.getParameter;
    WebGL2RenderingContext.prototype.getParameter = function(param) {
        if (param === 37445) return 'Intel Inc.';
        if (param === 37446) return 'Intel Iris Pro OpenGL Engine';
        return getParam2.call(this, param);
    };
} catch(e) {}

// 7. Canvas fingerprint — add imperceptible noise so hash differs per session
const origToDataURL = HTMLCanvasElement.prototype.toDataURL;
HTMLCanvasElement.prototype.toDataURL = function(type) {
    const ctx = this.getContext('2d');
    if (ctx) {
        const imgData = ctx.getImageData(0, 0, this.width || 1, this.height || 1);
        imgData.data[0] ^= 1;  // Flip one bit — invisible, changes hash
        ctx.putImageData(imgData, 0, 0);
    }
    return origToDataURL.apply(this, arguments);
};
const origGetImageData = CanvasRenderingContext2D.prototype.getImageData;
CanvasRenderingContext2D.prototype.getImageData = function(x, y, w, h) {
    const data = origGetImageData.call(this, x, y, w, h);
    data.data[0] ^= 1;
    return data;
};

// 8. Realistic screen / window dimensions
Object.defineProperty(screen, 'width',       { get: () => 1920 });
Object.defineProperty(screen, 'height',      { get: () => 1080 });
Object.defineProperty(screen, 'availWidth',  { get: () => 1920 });
Object.defineProperty(screen, 'availHeight', { get: () => 1040 });
Object.defineProperty(screen, 'colorDepth',  { get: () => 24 });
Object.defineProperty(screen, 'pixelDepth',  { get: () => 24 });

// 9. Realistic network connection info
try {
    Object.defineProperty(navigator, 'connection', { get: () => ({
        downlink: 10, effectiveType: '4g', rtt: 50,
        saveData: false, type: 'wifi',
        addEventListener: ()=>{}, removeEventListener: ()=>{}
    })});
} catch(e) {}

// 10. Iframe contentWindow.navigator also needs webdriver patched
try {
    Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', {
        get: function() {
            const cw = Object.getOwnPropertyDescriptor(HTMLIFrameElement.prototype, 'contentWindow').get.call(this);
            if (cw && cw.navigator) {
                try { Object.defineProperty(cw.navigator, 'webdriver', { get: () => undefined }); } catch(e) {}
            }
            return cw;
        }
    });
} catch(e) {}

// 11. AudioContext fingerprint noise
try {
    const origGetChannelData = AudioBuffer.prototype.getChannelData;
    AudioBuffer.prototype.getChannelData = function() {
        const arr = origGetChannelData.apply(this, arguments);
        if (arr.length > 0) arr[0] += 0.0000001;
        return arr;
    };
} catch(e) {}

// 12. Wipe all Selenium/WebDriver automation artifacts
['__driver_evaluate','__webdriver_evaluate','__selenium_evaluate',
 '__fxdriver_evaluate','__driver_unwrapped','__webdriver_unwrapped',
 '__selenium_unwrapped','__fxdriver_unwrapped','_Selenium_IDE_Recorder',
 '_selenium','calledSelenium','_WEBDRIVER_ELEM_CACHE','ChromeDriverw',
 'driver-evaluate','webdriver-evaluate','selenium-evaluate',
 'webdriverCommand','webdriver-evaluate-response','__webdriverFunc',
 '__webdriver_script_fn','__$webdriverAsyncExecutor','__lastWatirAlert',
 '__lastWatirConfirm','__lastWatirPrompt','$chrome_asyncScriptInfo',
 '$cdc_asdjflasutopfhvcZLmcfl_'].forEach(k => {
    try { if (k in window) { Object.defineProperty(window, k, { get: () => undefined }); } } catch(e) {}
});

// 13. Spoof battery API (absence = bot signal on some systems)
try {
    navigator.getBattery = () => Promise.resolve({
        charging: true, chargingTime: 0, dischargingTime: Infinity, level: 1.0,
        addEventListener: ()=>{}, removeEventListener: ()=>{}
    });
} catch(e) {}

// 14. document.hidden should be false (headless sets it true)
try {
    Object.defineProperty(document, 'hidden',           { get: () => false });
    Object.defineProperty(document, 'visibilityState',  { get: () => 'visible' });
    document.dispatchEvent(new Event('visibilitychange'));
} catch(e) {}
"""

def load_capsolver_key() -> str:
    """Load CapSolver API key from config.json or environment."""
    # Check config.json first
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH, encoding="utf-8") as f:
            data = json.load(f)
        key = data.get("capsolver_api_key", "")
        if key:
            return key
    # Then check environment
    return os.environ.get("CAPSOLVER_API_KEY", "")


# ─────────────────────────────────────────────
#  SMART QUEUE — barrier-based priority
# ─────────────────────────────────────────────
BARRIER_PRIORITY = {
    "none noted":                       0,
    "":                                 0,
    "payment required":                 90,
    "ssn required; soft pull only":     80,
    "ssn required; soft pull":          80,
    "ssn and income info required":     85,
    "financing application required":   90,
    "in-store signup only":             99,
    "income verification required":     85,
    "rent-to-own application required": 90,
}

def get_priority(barriers: str) -> int:
    b = barriers.strip().lower()
    if b in BARRIER_PRIORITY:
        return BARRIER_PRIORITY[b]
    if "captcha" in b: return 70
    if "ssn" in b: return 80
    if "payment" in b or "pay" in b: return 90
    if "in-store" in b or "in store" in b: return 99
    return 10


# ─────────────────────────────────────────────
#  FIELD SELECTORS
# ─────────────────────────────────────────────
FIELD_SELECTORS = {
    "first_name": [
        'input[name*="first" i]', 'input[id*="first" i]',
        'input[placeholder*="first" i]', 'input[aria-label*="first" i]',
        'input[autocomplete="given-name"]', 'input[name="fname"]',
        'input[name="firstName"]', 'input[name="first_name"]',
    ],
    "last_name": [
        'input[name*="last" i]', 'input[id*="last" i]',
        'input[placeholder*="last" i]', 'input[aria-label*="last" i]',
        'input[autocomplete="family-name"]', 'input[name="lname"]',
        'input[name="lastName"]', 'input[name="last_name"]',
    ],
    "full_name": [
        'input[name*="fullname" i]', 'input[id*="fullname" i]',
        'input[placeholder*="full name" i]', 'input[name*="full_name" i]',
        'input[autocomplete="name"]',
        'input[name="name"]:not([type="hidden"])',
    ],
    "email": [
        'input[type="email"]', 'input[name*="email" i]',
        'input[id*="email" i]', 'input[placeholder*="email" i]',
        'input[aria-label*="email" i]', 'input[autocomplete="email"]',
    ],
    "email_confirm": [
        'input[name*="confirm" i][type="email"]', 'input[id*="confirm" i][type="email"]',
        'input[name*="reenter" i]', 'input[placeholder*="confirm" i][type="email"]',
        'input[id*="email2" i]', 'input[id*="emailConfirm" i]',
    ],
    "phone": [
        'input[type="tel"]', 'input[name*="phone" i]',
        'input[id*="phone" i]', 'input[placeholder*="phone" i]',
        'input[aria-label*="phone" i]', 'input[autocomplete="tel"]',
        'input[name*="mobile" i]',
    ],
    "password": [
        'input[type="password"][name*="password" i]',
        'input[type="password"][id*="password" i]',
        'input[type="password"]:not([name*="confirm" i]):not([id*="confirm" i]):not([name*="current" i])',
        'input[type="password"]',
    ],
    "password_confirm": [
        'input[type="password"][name*="confirm" i]',
        'input[type="password"][id*="confirm" i]',
        'input[type="password"][placeholder*="confirm" i]',
    ],
    "zip": [
        'input[name*="zip" i]', 'input[id*="zip" i]',
        'input[name*="postal" i]', 'input[placeholder*="zip" i]',
        'input[autocomplete="postal-code"]',
    ],
    "address": [
        'input[name*="address" i]:not([name*="2" i]):not([name*="email" i]):not([type="email"])',
        'input[id*="address" i]:not([id*="2" i]):not([id*="email" i]):not([type="email"])',
        'input[placeholder*="street" i]',
        'input[placeholder*="address" i]:not([placeholder*="email" i]):not([type="email"])',
        'input[autocomplete="street-address"]',
        'input[name*="street" i]', 'input[id*="street" i]',
        'input[name*="addr1" i]', 'input[name*="address1" i]',
    ],
    "city": [
        'input[name*="city" i]', 'input[id*="city" i]',
        'input[placeholder*="city" i]', 'input[autocomplete="address-level2"]',
    ],
    "state": [
        'select[name*="state" i]', 'select[id*="state" i]',
        'input[name*="state" i]', 'input[id*="state" i]',
        'input[autocomplete="address-level1"]', 'select[autocomplete="address-level1"]',
    ],
    "birthday": [
        'input[name*="birth" i]', 'input[id*="birth" i]',
        'input[name*="dob" i]', 'input[id*="dob" i]',
        'input[placeholder*="birth" i]', 'input[autocomplete="bday"]',
    ],
    "username": [
        'input[name*="username" i]', 'input[id*="username" i]',
        'input[placeholder*="username" i]', 'input[name*="user_name" i]',
    ],
    "ssn": [
        'input[name*="ssn" i]', 'input[id*="ssn" i]',
        'input[name*="social" i]', 'input[id*="social" i]',
        'input[placeholder*="social security" i]', 'input[name*="tax_id" i]',
    ],
    "employer": [
        'input[name*="employer" i]', 'input[id*="employer" i]',
        'input[placeholder*="employer" i]', 'input[name*="company" i]',
        'input[id*="company" i]', 'input[name*="organization" i]',
    ],
    "job_title": [
        'input[name*="job_title" i]', 'input[id*="job_title" i]',
        'input[name*="jobtitle" i]', 'input[id*="jobtitle" i]',
        'input[name*="occupation" i]', 'input[id*="occupation" i]',
        'input[placeholder*="job title" i]', 'input[placeholder*="occupation" i]',
        'input[name*="position" i]:not([name*="lat" i]):not([name*="lon" i])',
    ],
    "income": [
        'input[name*="income" i]', 'input[id*="income" i]',
        'input[placeholder*="income" i]', 'input[name*="salary" i]',
        'input[name*="annual_income" i]', 'input[name*="monthly_income" i]',
    ],
    "college": [
        'input[name*="college" i]', 'input[id*="college" i]',
        'input[name*="university" i]', 'input[name*="school" i]',
        'input[placeholder*="college" i]', 'input[placeholder*="university" i]',
    ],
    "degree": [
        'select[name*="degree" i]', 'select[id*="degree" i]',
        'input[name*="degree" i]', 'input[id*="degree" i]',
        'select[name*="education" i]', 'select[id*="education" i]',
    ],
    "employer_phone": [
        'input[name*="work_phone" i]', 'input[id*="work_phone" i]',
        'input[name*="business_phone" i]', 'input[name*="employer_phone" i]',
        'input[placeholder*="work phone" i]', 'input[placeholder*="business phone" i]',
    ],
}

SUBMIT_SELECTORS = [
    'button[type="submit"]', 'input[type="submit"]',
    # Loyalty / rewards specific
    'button:has-text("Sign Up")', 'button:has-text("Register")',
    'button:has-text("Join")', 'button:has-text("Create Account")',
    'button:has-text("Create My Account")', 'button:has-text("Get Started")',
    'button:has-text("Sign Me Up")', 'button:has-text("Join Now")',
    'button:has-text("Enroll")', 'button:has-text("Enroll Now")',
    'button:has-text("Become a Member")',
    # Plain account creation — equally valid as a win
    'button:has-text("Create")', 'button:has-text("Submit")',
    'button:has-text("Continue")', 'button:has-text("Next")',
    'button:has-text("Save")', 'button:has-text("Done")',
    'button:has-text("Confirm")', 'button:has-text("Finish")',
    'button:has-text("Complete")', 'button:has-text("Activate")',
    'button:has-text("Start")', 'button:has-text("Let\'s Go")',
    'button:has-text("I\'m In")', 'button:has-text("Sign in")',
    # Job / education / hospitality site patterns
    'button:has-text("Apply")', 'button:has-text("Post Resume")',
    'button:has-text("Create Profile")', 'button:has-text("Build Profile")',
    'button:has-text("Find Jobs")', 'button:has-text("Search Jobs")',
    'button:has-text("Post a Job")', 'button:has-text("Get Access")',
    'button:has-text("Access")', 'button:has-text("Agree")',
    'button:has-text("Accept")', 'button:has-text("I Agree")',
    'button:has-text("Let me in")', 'button:has-text("Take me in")',
    'button:has-text("Go")', 'button:has-text("Send")',
    # Role/aria based
    '[role="button"][aria-label*="submit" i]',
    '[role="button"][aria-label*="register" i]',
    '[role="button"][aria-label*="sign up" i]',
    '[role="button"][aria-label*="create" i]',
    # Data attribute patterns
    '[data-testid*="submit" i]', '[data-testid*="register" i]',
    '[data-testid*="create" i]', '[data-testid*="continue" i]',
    '[data-action*="submit" i]', '[data-action*="register" i]',
    # Input buttons with value text
    'input[type="button"][value*="submit" i]',
    'input[type="button"][value*="register" i]',
    'input[type="button"][value*="sign up" i]',
    'input[type="button"][value*="create" i]',
    'input[type="button"][value*="join" i]',
]

CAPTCHA_INDICATORS = [
    ".g-recaptcha", "#g-recaptcha", 'iframe[src*="recaptcha"]',
    'iframe[src*="hcaptcha"]', ".h-captcha", '[data-sitekey]',
    'iframe[title*="captcha" i]', 'iframe[title*="challenge" i]',
    ".cf-turnstile",
]

# ─────────────────────────────────────────────
#  COOKIE / CONSENT BANNER DISMISSAL
# ─────────────────────────────────────────────
CONSENT_SELECTORS = [
    # Text-based accept buttons (most common)
    'button:has-text("Accept All")', 'button:has-text("Accept Cookies")',
    'button:has-text("Accept all cookies")', 'button:has-text("I Accept")',
    'button:has-text("Allow All")', 'button:has-text("Allow all cookies")',
    'button:has-text("Agree")', 'button:has-text("I Agree")',
    'button:has-text("Got it")', 'button:has-text("OK")',
    'button:has-text("Close")', 'button:has-text("Dismiss")',
    'button:has-text("Continue")', 'button:has-text("Confirm")',
    # ID/class patterns
    '#onetrust-accept-btn-handler', '.onetrust-accept-btn-handler',
    '#acceptBtn', '#accept-cookies', '#cookie-accept',
    '[data-testid*="accept" i]', '[data-testid*="cookie" i]',
    '[aria-label*="accept" i][aria-label*="cookie" i]',
    '[id*="cookie" i][id*="accept" i]', '[class*="cookie" i][class*="accept" i]',
    '[id*="consent" i] button', '[class*="consent" i] button',
    '.cc-accept', '.cc-btn.cc-allow', '#cookieConsentOK',
    'button[id*="cookie"]', 'button[class*="cookie"]',
]

async def dismiss_cookie_banner(page) -> None:
    """Try to dismiss cookie/consent banners that block form interaction."""
    for sel in CONSENT_SELECTORS:
        try:
            loc = page.locator(sel).first
            if await loc.count() > 0 and await loc.is_visible():
                await loc.click(timeout=2000)
                await page.wait_for_timeout(500)
                return  # One dismiss is enough
        except Exception:
            continue


# ─────────────────────────────────────────────
#  LOGGING
# ─────────────────────────────────────────────
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(message)s",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler(Path(__file__).parent / "signup-parallel.log"),
    ],
)
logger = logging.getLogger(__name__)
# Suppress noisy debug output from third-party libs
logging.getLogger("asyncio").setLevel(logging.WARNING)
logging.getLogger("playwright").setLevel(logging.WARNING)
logging.getLogger("aiohttp").setLevel(logging.WARNING)

_results_lock = threading.Lock()
_health_lock  = threading.Lock()
_progress_lock = threading.Lock()
_progress_log = []
_start_time = None
_current_workers = {}
_aiohttp_session = None
_playwright_instance = None  # stored for browser relaunch on crash
_headless_mode = False        # stored for browser relaunch on crash


# ─────────────────────────────────────────────
#  PROGRESS TRACKING
# ─────────────────────────────────────────────

def write_progress(running: bool, stats: dict) -> None:
    """Write progress.json for the dashboard to read."""
    global _progress_log, _start_time, _current_workers
    with _progress_lock:
        eta_seconds = 0
        if running and stats.get("processed", 0) > 0 and _start_time:
            elapsed = time.time() - _start_time
            remaining = stats["total"] - stats["processed"]
            eta_seconds = int((elapsed / stats["processed"]) * remaining)

        workers_list = []
        for wid, winfo in dict(_current_workers).items():
            workers_list.append({"id": wid, "brand": winfo.get("brand", ""), "status": winfo.get("status", "idle")})

        data = {
            "running": running,
            "start_time": datetime.utcfromtimestamp(_start_time).strftime("%Y-%m-%dT%H:%M:%SZ") if _start_time else None,
            "stats": {
                "total": stats.get("total", 0),
                "processed": stats.get("processed", 0),
                "success": stats.get("success", 0),
                "failed": stats.get("failed", 0),
                "captcha": stats.get("captcha", 0),
                "skipped": stats.get("skipped", 0),
            },
            "current_workers": workers_list,
            "log": list(_progress_log),
            "eta_seconds": eta_seconds,
        }

        try:
            with open(PROGRESS_PATH, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2)
        except Exception as exc:
            logger.warning(f"Failed to write progress.json: {exc}")


def append_progress_log(worker: int, brand: str, program: str, status: str, message: str = "") -> None:
    """Append an entry to the rolling progress log (max 50 entries)."""
    global _progress_log
    with _progress_lock:
        entry = {
            "time": datetime.utcnow().strftime("%H:%M:%S"),
            "worker": worker,
            "brand": brand,
            "program": program,
            "status": status,
            "message": message,
        }
        _progress_log.append(entry)
        if len(_progress_log) > 50:
            _progress_log = _progress_log[-50:]


# ─────────────────────────────────────────────
#  CORE HELPERS
# ─────────────────────────────────────────────

def load_config() -> dict:
    if CONFIG_PATH.exists():
        with open(CONFIG_PATH, encoding="utf-8") as f:
            return json.load(f)
    logger.error("config.json not found. Create it with your client info.")
    sys.exit(1)


def load_csv(smart_sort: bool = True) -> pd.DataFrame:
    df = pd.read_csv(CSV_INPUT_PATH, dtype=str).fillna("")
    total = len(df)
    df = df[df["Auto_Signup_Feasible"].str.strip().str.lower() == "yes"].reset_index(drop=True)
    logger.info(f"CSV: {total} total, {len(df)} auto-feasible")
    if smart_sort:
        df["_priority"] = df["Barriers"].apply(get_priority)
        df = df.sort_values("_priority").reset_index(drop=True)
        easy = len(df[df["_priority"] == 0])
        logger.info(f"Smart queue: {easy} easy sites first, {len(df) - easy} harder sites after")
    return df


def load_already_processed() -> set:
    """Only skip URLs that were successfully signed up."""
    processed = set()
    if RESULTS_LOG_PATH.exists():
        with open(RESULTS_LOG_PATH, newline="", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                url = row.get("url", "").strip()
                status = row.get("status", "").strip()
                if url and status == "success":
                    processed.add(url)
    if processed:
        logger.info(f"Skipping {len(processed)} already-successful URLs")
    return processed


def load_failed_urls() -> set:
    failed = set()
    if not RESULTS_LOG_PATH.exists():
        logger.error("No results log found. Run signups first before retrying.")
        sys.exit(1)
    with open(RESULTS_LOG_PATH, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            status = row.get("status", "").strip()
            url = row.get("url", "").strip()
            if status in ("failed", "timeout", "navigation_error", "captcha_skipped", "captcha_timeout", "captcha_failed"):
                failed.add(url)
            if status == "success" and url in failed:
                failed.discard(url)
    logger.info(f"Retry mode: {len(failed)} failed URLs to re-attempt")
    return failed


def append_result(url: str, brand: str, program: str, status: str, worker: int, error: str = "") -> None:
    with _results_lock:
        write_header = not RESULTS_LOG_PATH.exists() or RESULTS_LOG_PATH.stat().st_size == 0
        with open(RESULTS_LOG_PATH, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            if write_header:
                writer.writerow(["url", "brand", "program", "status", "worker", "error", "timestamp"])
            writer.writerow([
                url, brand, program, status, worker, error,
                datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            ])


def append_health(url: str, brand: str, status: str, http_code: int, has_captcha: bool, has_form: bool, error: str = "") -> None:
    with _health_lock:
        write_header = not HEALTH_LOG_PATH.exists() or HEALTH_LOG_PATH.stat().st_size == 0
        with open(HEALTH_LOG_PATH, "a", newline="", encoding="utf-8") as f:
            writer = csv.writer(f)
            if write_header:
                writer.writerow(["url", "brand", "status", "http_code", "has_captcha", "has_form", "error", "timestamp"])
            writer.writerow([
                url, brand, status, http_code, has_captcha, has_form, error,
                datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ"),
            ])


# ─────────────────────────────────────────────
#  CAPSOLVER — AUTO CAPTCHA SOLVING
# ─────────────────────────────────────────────

async def extract_captcha_info(page, url: str) -> dict:
    """
    Detect what kind of CAPTCHA is on the page and extract sitekey.
    Returns: {"type": "recaptcha_v2"|"recaptcha_v3"|"hcaptcha"|"turnstile"|"none", "sitekey": "..."}
    """
    info = {"type": "none", "sitekey": ""}

    # reCAPTCHA v2 — look for data-sitekey on .g-recaptcha or iframe
    try:
        sitekey = await page.evaluate("""() => {
            // Check .g-recaptcha element
            const el = document.querySelector('.g-recaptcha[data-sitekey]');
            if (el) return el.getAttribute('data-sitekey');
            // Check any element with data-sitekey
            const any = document.querySelector('[data-sitekey]');
            if (any) return any.getAttribute('data-sitekey');
            // Check recaptcha iframe src for sitekey
            const iframe = document.querySelector('iframe[src*="recaptcha"]');
            if (iframe) {
                const m = iframe.src.match(/[?&]k=([^&]+)/);
                if (m) return m[1];
            }
            return null;
        }""")
        if sitekey:
            # Determine if v2 or v3
            is_v3 = await page.evaluate("""() => {
                const scripts = Array.from(document.querySelectorAll('script[src*="recaptcha"]'));
                return scripts.some(s => s.src.includes('render=') && !s.src.includes('render=explicit'));
            }""")
            info["type"] = "recaptcha_v3" if is_v3 else "recaptcha_v2"
            info["sitekey"] = sitekey
            return info
    except Exception:
        pass

    # hCaptcha
    try:
        hkey = await page.evaluate("""() => {
            const el = document.querySelector('.h-captcha[data-sitekey]');
            if (el) return el.getAttribute('data-sitekey');
            const iframe = document.querySelector('iframe[src*="hcaptcha"]');
            if (iframe) {
                const m = iframe.src.match(/sitekey=([^&]+)/);
                if (m) return m[1];
            }
            return null;
        }""")
        if hkey:
            info["type"] = "hcaptcha"
            info["sitekey"] = hkey
            return info
    except Exception:
        pass

    # Cloudflare Turnstile
    try:
        tkey = await page.evaluate("""() => {
            const el = document.querySelector('.cf-turnstile[data-sitekey]');
            return el ? el.getAttribute('data-sitekey') : null;
        }""")
        if tkey:
            info["type"] = "turnstile"
            info["sitekey"] = tkey
            return info
    except Exception:
        pass

    return info


_aiohttp_session: aiohttp.ClientSession | None = None

async def get_aiohttp_session() -> aiohttp.ClientSession:
    global _aiohttp_session
    if _aiohttp_session is None or _aiohttp_session.closed:
        _aiohttp_session = aiohttp.ClientSession()
    return _aiohttp_session


async def solve_captcha_capsolver(api_key: str, captcha_info: dict, page_url: str) -> str:
    """
    Send CAPTCHA to CapSolver API and return the solution token.
    Returns empty string on failure.
    """
    captcha_type = captcha_info["type"]
    sitekey = captcha_info["sitekey"]

    if not sitekey or captcha_type == "none":
        return ""

    task_type_map = {
        "recaptcha_v2": "ReCaptchaV2TaskProxyLess",
        "recaptcha_v3": "ReCaptchaV3TaskProxyLess",
        "hcaptcha":     "HCaptchaTaskProxyLess",
        "turnstile":    "AntiTurnstileTaskProxyLess",
    }

    task_type = task_type_map.get(captcha_type)
    if not task_type:
        return ""

    task = {
        "type": task_type,
        "websiteURL": page_url,
        "websiteKey": sitekey,
    }

    if captcha_type == "recaptcha_v3":
        task["pageAction"] = "submit"
        task["minScore"] = 0.5

    try:
        session = await get_aiohttp_session()
        async with session.post(f"{CAPSOLVER_API_URL}/createTask", json={
            "clientKey": api_key,
            "task": task,
        }, timeout=aiohttp.ClientTimeout(total=15)) as resp:
            data = await resp.json()

        if data.get("errorId", 0) != 0:
            logger.warning(f"  CapSolver createTask error: {data.get('errorDescription', 'unknown')}")
            return ""

        task_id = data.get("taskId")
        if not task_id:
            logger.warning(f"  CapSolver: no taskId returned")
            return ""

        start = time.time()
        while (time.time() - start) < CAPSOLVER_TIMEOUT_SEC:
            await asyncio.sleep(2)
            async with session.post(f"{CAPSOLVER_API_URL}/getTaskResult", json={
                "clientKey": api_key,
                "taskId": task_id,
            }, timeout=aiohttp.ClientTimeout(total=15)) as resp:
                result = await resp.json()

            status = result.get("status")
            if status == "ready":
                solution = result.get("solution", {})
                token = (
                    solution.get("gRecaptchaResponse") or
                    solution.get("token") or
                    solution.get("text") or
                    ""
                )
                return token

            if status == "failed" or result.get("errorId", 0) != 0:
                logger.warning(f"  CapSolver solve failed: {result.get('errorDescription', 'unknown')}")
                return ""

        logger.warning(f"  CapSolver timeout after {CAPSOLVER_TIMEOUT_SEC}s")
        return ""

    except Exception as exc:
        logger.warning(f"  CapSolver error: {exc}")
        return ""


async def inject_captcha_token(page, captcha_type: str, token: str) -> bool:
    """Inject the solved CAPTCHA token into the page."""
    try:
        if captcha_type in ("recaptcha_v2", "recaptcha_v3"):
            await page.evaluate("""(token) => {
                const textarea = document.getElementById('g-recaptcha-response');
                if (textarea) {
                    textarea.style.display = 'block';
                    textarea.value = token;
                    textarea.dispatchEvent(new Event('change', { bubbles: true }));
                }
                const input = document.querySelector('input[name="g-recaptcha-response"]');
                if (input) {
                    input.value = token;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
                try {
                    if (typeof ___grecaptcha_cfg !== 'undefined') {
                        const clients = ___grecaptcha_cfg.clients;
                        const widgetId = Object.keys(clients)[0];
                        if (widgetId !== null && widgetId !== undefined) {
                            const client = clients[widgetId];
                            // Walk the object tree to find and call the callback
                            const findAndCall = (obj, depth) => {
                                if (depth > 5) return false;
                                for (const key in obj) {
                                    try {
                                        if (typeof obj[key] === 'function' && key !== 'error') {
                                            obj[key](token);
                                            return true;
                                        }
                                        if (typeof obj[key] === 'object' && obj[key] !== null) {
                                            if (findAndCall(obj[key], depth + 1)) return true;
                                        }
                                    } catch(e) {}
                                }
                                return false;
                            };
                            findAndCall(client, 0);
                        }
                    }
                } catch(e) {}
            }""", token)
            return True

        elif captcha_type == "hcaptcha":
            await page.evaluate(f"""(token) => {{
                const textarea = document.querySelector('textarea[name="h-captcha-response"]');
                if (textarea) textarea.value = token;
                const input = document.querySelector('input[name="h-captcha-response"]');
                if (input) input.value = token;
                // Also set in iframe parent
                const iframes = document.querySelectorAll('iframe[data-hcaptcha-response]');
                iframes.forEach(f => f.setAttribute('data-hcaptcha-response', token));
            }}""", token)
            return True

        elif captcha_type == "turnstile":
            await page.evaluate(f"""(token) => {{
                const input = document.querySelector('input[name="cf-turnstile-response"]');
                if (input) input.value = token;
            }}""", token)
            return True

    except Exception as exc:
        logger.warning(f"  Token injection error: {exc}")
    return False


# ─────────────────────────────────────────────
#  CAPTCHA DETECTION (for fallback/health)
# ─────────────────────────────────────────────

async def detect_captcha(page) -> bool:
    for selector in CAPTCHA_INDICATORS:
        try:
            if await page.locator(selector).first.count() > 0:
                return True
        except Exception:
            pass
    try:
        content = await page.content()
        low = content.lower()
        if any(kw in low for kw in ["g-recaptcha", "hcaptcha", "cf-turnstile", "data-sitekey"]):
            return True
    except Exception:
        pass
    return False


async def detect_captcha_solved(page) -> bool:
    for sel in [
        'textarea[id="g-recaptcha-response"]',
        'textarea[name="g-recaptcha-response"]',
        'textarea[name="h-captcha-response"]',
        'input[name="cf-turnstile-response"]',
    ]:
        try:
            el = page.locator(sel).first
            if await el.count() > 0:
                val = await el.input_value()
                if val and len(val) > 10:
                    return True
        except Exception:
            pass
    try:
        if await page.locator('.recaptcha-checkbox-checked').count() > 0:
            return True
    except Exception:
        pass
    if not await detect_captcha(page):
        return True
    return False


async def wait_for_manual_captcha(page, brand: str, worker: int, timeout_sec: int) -> bool:
    """Fallback: wait for manual CAPTCHA solve."""
    logger.info(f"  [W{worker}] 🔒 CAPTCHA (manual) — {brand}")
    print(f"\n{'='*50}")
    print(f"  🔒 CAPTCHA — Window #{worker} — {brand}")
    print(f"  CapSolver couldn't solve this one.")
    print(f"  Solve it manually in browser window #{worker}")
    print(f"{'='*50}\n")

    start = time.time()
    while (time.time() - start) < timeout_sec:
        try:
            if await detect_captcha_solved(page):
                logger.info(f"  [W{worker}] ✅ CAPTCHA solved manually — {brand}")
                return True
        except Exception:
            pass
        await asyncio.sleep(2)
    return False


# ─────────────────────────────────────────────
#  FORM INTERACTION
# ─────────────────────────────────────────────

async def fill_field(page, field_key: str, value: str, filled_elements: set = None) -> bool:
    if filled_elements is None:
        filled_elements = set()
    # Try main page first, then each iframe
    frames = [page] + list(page.frames)
    for frame_idx, frame in enumerate(frames):
        for selector in FIELD_SELECTORS.get(field_key, []):
            try:
                locator = frame.locator(selector).first
                count = await locator.count()
                if count == 0: continue

                enabled = await locator.is_enabled()
                if not enabled:
                    logger.debug(f"    [{field_key}] found but disabled — {selector}")
                    continue

                # Scroll into view BEFORE checking visibility —
                # many sites only make fields visible once they're in the viewport
                try:
                    await locator.scroll_into_view_if_needed(timeout=2000)
                    await page.wait_for_timeout(100)
                except Exception:
                    pass

                elem_id = await locator.evaluate("el => el.name + '|' + el.id + '|' + el.type + '|' + (el.placeholder || '')")
                if elem_id in filled_elements:
                    logger.debug(f"    [{field_key}] already filled: {elem_id}")
                    continue
                tag = await locator.evaluate("el => el.tagName.toLowerCase()")

                if tag == "select":
                    try:
                        await locator.select_option(value=value, timeout=FILL_TIMEOUT_MS)
                    except Exception:
                        try:
                            await locator.select_option(label=value, timeout=FILL_TIMEOUT_MS)
                        except Exception:
                            continue
                else:
                    filled = False

                    # Pass 1 — normal fill
                    try:
                        await locator.click(timeout=FILL_TIMEOUT_MS)
                        await locator.fill("", timeout=FILL_TIMEOUT_MS)
                        await locator.fill(value, timeout=FILL_TIMEOUT_MS)
                        filled = True
                        logger.debug(f"    [{field_key}] ✅ filled (normal) frame={frame_idx}: {selector}")
                    except Exception as e:
                        logger.debug(f"    [{field_key}] normal fill failed ({e}) — trying force: {selector}")

                    # Pass 2 — force=True bypass for CSS-animated / partially visible fields
                    if not filled:
                        try:
                            await locator.fill(value, timeout=FILL_TIMEOUT_MS, force=True)
                            filled = True
                            logger.debug(f"    [{field_key}] ✅ filled (force) frame={frame_idx}: {selector}")
                        except Exception as e:
                            logger.debug(f"    [{field_key}] force fill also failed ({e}): {selector}")

                    if not filled:
                        continue

                    # Fire framework events so React/Vue/Angular detect the change
                    try:
                        await locator.dispatch_event("input")
                        await locator.dispatch_event("change")
                    except Exception:
                        pass

                    # Dismiss autocomplete dropdowns (Google Places, etc.)
                    if field_key in ("address", "city", "zip"):
                        try:
                            await page.keyboard.press("Escape")
                            await page.wait_for_timeout(150)
                        except Exception:
                            pass

                filled_elements.add(elem_id)
                return True
            except Exception as e:
                logger.debug(f"    [{field_key}] exception on {selector}: {e}")
                continue
    logger.debug(f"    [{field_key}] ❌ no selector matched across {len(frames)} frames")
    return False


async def detect_form_fields(page) -> int:
    count = 0
    # Limit to main page + first 2 iframes to avoid slow scanning on
    # iframe-heavy sites (ad networks, chat widgets, etc.)
    frames = ([page] + list(page.frames))[:3]
    for frame in frames:
        for selectors in FIELD_SELECTORS.values():
            for selector in selectors:
                try:
                    if await frame.locator(selector).first.count() > 0:
                        count += 1
                        break
                except Exception:
                    continue
        if count >= 2:
            break  # Found enough in this frame, no need to keep scanning
    return count


async def click_submit(page) -> bool:
    for selector in SUBMIT_SELECTORS:
        try:
            locator = page.locator(selector).first
            if await locator.count() == 0: continue
            if not await locator.is_visible(): continue
            try:
                await locator.click(timeout=FILL_TIMEOUT_MS)
                return True
            except Exception:
                pass
            try:
                async with page.expect_navigation(timeout=15000, wait_until="domcontentloaded"):
                    await locator.click(timeout=FILL_TIMEOUT_MS)
                return True
            except PlaywrightTimeoutError:
                return True
            except Exception:
                continue
        except Exception:
            continue

    # JS fallback 1 — find any submit-type button/input not caught by selectors
    try:
        clicked = await page.evaluate("""() => {
            // Try submit inputs/buttons first
            const submitEls = [...document.querySelectorAll(
                'button[type="submit"], input[type="submit"], button:not([type="button"]):not([type="reset"])'
            )].filter(el => {
                const r = el.getBoundingClientRect();
                return r.width > 0 && r.height > 0 && el.offsetParent !== null;
            });
            if (submitEls.length > 0) { submitEls[0].click(); return true; }
            return false;
        }""")
        if clicked:
            return True
    except Exception:
        pass

    # JS fallback 2 — submit the form directly via form.submit()
    try:
        submitted = await page.evaluate("""() => {
            const forms = document.querySelectorAll('form');
            for (const form of forms) {
                const inputs = form.querySelectorAll('input, select, textarea');
                if (inputs.length > 0) {
                    try { form.submit(); return true; } catch(e) {}
                    // For React/Vue forms that intercept submit
                    try { form.dispatchEvent(new Event('submit', {bubbles: true, cancelable: true})); return true; } catch(e) {}
                }
            }
            return false;
        }""")
        if submitted:
            return True
    except Exception:
        pass

    # JS fallback 3 — submit a form that lives inside an open shadow root
    # (web-component signup widgets). page.locator CSS pierces shadow DOM for
    # matching, but form.submit() must be called on the element itself.
    try:
        shadow_submitted = await page.evaluate("""() => {
            function tryRoot(root) {
                const btn = root.querySelector('button[type="submit"], input[type="submit"]');
                if (btn) { btn.click(); return true; }
                const form = root.querySelector('form');
                if (form) {
                    try { form.requestSubmit ? form.requestSubmit() : form.submit(); return true; } catch(e) {}
                }
                for (const el of root.querySelectorAll('*')) {
                    if (el.shadowRoot && tryRoot(el.shadowRoot)) return true;
                }
                return false;
            }
            return tryRoot(document);
        }""")
        if shadow_submitted:
            return True
    except Exception:
        pass

    # Last resort — many single-field (email-only) loyalty joins submit on Enter.
    try:
        await page.keyboard.press("Enter")
        return True
    except Exception:
        pass

    return False


# ─────────────────────────────────────────────
#  SIGNUP PROCESSING
# ─────────────────────────────────────────────

async def process_entry(page, row: dict, config: dict, worker: int, dry_run: bool,
                        capsolver_key: str, captcha_timeout: int) -> tuple[str, str]:
    url     = str(row.get("Direct Sign-Up URL", "")).strip()
    brand   = str(row.get("Brand Name", "")).strip()

    if not url or not url.startswith("http"):
        return "skipped", "invalid URL"

    # ── DNS PREFLIGHT ─────────────────────────────────────────────────────
    # Check the domain resolves before opening a browser tab.
    # Saves ~15-40 seconds per dead URL (Primitive, DC Shoes, Element etc.)
    if not domain_is_live(url):
        logger.info(f"  [W{worker}] 💀 Dead domain — skipping {url}")
        mark_url_dead(url)
        return "skipped", "domain does not resolve (dead URL)"

    # ── PERSISTENT DEAD URL CHECK ──────────────────────────────────────────
    # Skip URLs that permanently failed in a previous run (connection refused,
    # 403/404/410 blocked, etc.) — no point retrying them every session.
    if url in _dead_urls:
        logger.info(f"  [W{worker}] 🚫 Permanently dead — skipping {url}")
        return "skipped", "permanently failed in previous run"
    # redirects to App Store / Google Play with no signup form at all.
    # Attempting them wastes ~90s per site hitting the hard timeout.
    APP_ONLY_BRANDS = {
        "dunkin'", "dunkin", "burger king", "arby's", "arby's",
        "chili's", "chilis", "tgi fridays", "tgi friday's",
        "tim hortons", "popeyes", "jack in the box", "sonic",
        "whataburger", "wingstop", "raising cane's", "raising canes",
        "shake shack", "five guys", "in-n-out", "in n out",
    }
    if brand.lower().strip() in APP_ONLY_BRANDS:
        return "skipped", "app-only loyalty program — no web signup"
    # "domcontentloaded" hangs on analytics-heavy sites (Snagajob, airlines,
    # luxury brands) whose DOMContentLoaded fires very late or never.
    try:
        await page.goto(url, wait_until="commit", timeout=NAVIGATION_TIMEOUT_MS)
    except PlaywrightTimeoutError:
        # Track timeout strikes — 2 timeouts means the site is consistently too slow
        _no_form_strikes[url] = _no_form_strikes.get(url, 0) + 1
        if _no_form_strikes[url] >= NO_FORM_MAX_STRIKES:
            mark_url_dead(url)
            logger.info(f"  [W{worker}] 🚫 Timeout 2-strike retirement: {brand} → {url}")
        return "timeout", "page load timed out"
    except Exception as exc:
        err_str = str(exc)
        if "interrupted by another navigation" in err_str or "ERR_ABORTED" in err_str:
            pass
        else:
            # Permanent failures — no point retrying ever. Mark and skip next run.
            PERMANENT_ERRORS = [
                "ERR_CONNECTION_REFUSED", "ERR_CONNECTION_CLOSED",
                "ERR_NAME_NOT_RESOLVED", "ERR_ADDRESS_UNREACHABLE",
                "ERR_CERT_", "ERR_SSL_", "ERR_EMPTY_RESPONSE",
                "net::ERR_HTTP_RESPONSE_CODE_FAILURE",
            ]
            if any(e in err_str for e in PERMANENT_ERRORS):
                mark_url_dead(url)
                logger.info(f"  [W{worker}] 🚫 Permanent failure — marking dead: {url}")
            return "navigation_error", err_str[:150]

    # Wait for the visible part of the page to render (not networkidle).
    # "domcontentloaded" is a better signal than networkidle here.
    try:
        await asyncio.wait_for(
            page.wait_for_load_state("domcontentloaded"),
            timeout=5.0
        )
    except Exception:
        pass

    # Hard 1-second settle — let above-the-fold elements paint
    await page.wait_for_timeout(1000)

    # Fast check: if the page is just an app-store redirect wall, skip it.
    # These pages have no form and never will — don't waste 90 seconds.
    try:
        body_text = await page.inner_text("body", timeout=2000)
        low_body = body_text.lower()
        app_redirect_signals = [
            "download the app", "download our app", "get the app",
            "available on the app store", "get it on google play",
            "app store", "google play", "scan the qr code",
        ]
        if sum(1 for s in app_redirect_signals if s in low_body) >= 2:
            return "skipped", "app-only page — no web signup form"
    except Exception:
        pass

    # ── MANUAL MODE ───────────────────────────────────────────────────────────
    # Skip ALL auto-navigation. Just wait for you to navigate to the form,
    # then fill and submit the moment fields appear.
    if MANUAL_MODE:
        logger.info(f"  [W{worker}] 🙋 WAITING — {brand} — navigate to signup form ({MANUAL_WAIT_SECONDS}s)")

        # Build fill data once up front
        _addr = config.get("address", {}) or {}
        _emp  = config.get("employment", {}) or {}
        _edu  = config.get("education", {}) or {}
        _full = f"{config.get('first_name','')} {config.get('last_name','')}".strip()
        _fill_map = {
            "first_name":    config.get("first_name", ""),
            "last_name":     config.get("last_name", ""),
            "full_name":     _full,
            "email":         config.get("email", ""),
            "email_confirm": config.get("email", ""),
            "phone":         config.get("phone", ""),
            "password":      config.get("password", ""),
            "password_confirm": config.get("password", ""),
            "username":      config.get("username", config.get("email", "")),
            "birthday":      config.get("dob", config.get("birthday", "")),
            "zip":           _addr.get("zip",    config.get("zip", "")),
            "address":       _addr.get("street", config.get("street", "")),
            "city":          _addr.get("city",   config.get("city", "")),
            "state":         _addr.get("state",  config.get("state", "")),
            "employer":      _emp.get("employer",      config.get("employer", "")),
            "job_title":     _emp.get("job_title",     config.get("job_title", "")),
            "income":        _emp.get("annual_income", config.get("annual_income", "")),
            "college":       _edu.get("college",       config.get("college", "")),
            "degree":        _edu.get("degree",        config.get("degree", "")),
        }

        _deadline      = time.time() + MANUAL_WAIT_SECONDS
        _filled_els    = set()
        _filled_n      = 0
        _origin_url    = page.url          # URL the bot loaded originally
        _last_heartbeat = time.time()

        while time.time() < _deadline:
            await asyncio.sleep(0.5)

            # Heartbeat every 10s so user knows bot is alive and watching
            if time.time() - _last_heartbeat >= 10:
                _secs_left = int(_deadline - time.time())
                logger.info(f"  [W{worker}] 👁  MANUAL MODE watching — {_secs_left}s left — navigate to the signup form now")
                _last_heartbeat = time.time()

            try:
                _current_url = page.url

                # Look for ANY visible text/email/password/tel input on the page
                _inputs = await page.query_selector_all(
                    'input[type="email"], input[type="password"], '
                    'input[type="text"]:not([type="hidden"]), '
                    'input[type="tel"], input:not([type])'
                )
                _visible = []
                for _inp in _inputs:
                    try:
                        if await _inp.is_visible():
                            _visible.append(_inp)
                    except Exception:
                        pass

                # Only trigger if URL changed (user actually navigated) OR
                # we have a real form (email field present) — not just a search bar
                _has_email_field = any(True for _inp in _visible
                    if await _inp.get_attribute("type") == "email"
                    or (await _inp.get_attribute("placeholder") or "").lower() in ("email", "e-mail", "email address")
                    or (await _inp.get_attribute("name") or "").lower() in ("email", "email_address", "emailaddress")
                    or (await _inp.get_attribute("id") or "").lower() in ("email", "email_address", "emailaddress")
                )
                _url_changed = (_current_url != _origin_url)

                if len(_visible) >= 1 and (_url_changed or _has_email_field):
                    logger.info(f"  [W{worker}] ⚡ {len(_visible)} field(s) on {page.url} — URL changed={_url_changed} — filling now")
                    await page.wait_for_timeout(300)
                    await dismiss_cookie_banner(page)

                    # Standard fill pass
                    for _fk, _fv in _fill_map.items():
                        if not _fv:
                            continue
                        if await fill_field(page, _fk, _fv, _filled_els):
                            _filled_n += 1

                    # Shadow DOM pass if nothing filled yet
                    if _filled_n == 0:
                        try:
                            _sf = await page.evaluate("""(d) => {
                                let n=0;
                                function go(root){
                                    root.querySelectorAll('input[type="email"],input[type="password"],input[type="text"],input[type="tel"],input:not([type])').forEach(inp=>{
                                        if(inp.offsetParent===null&&inp.type!=='email'&&inp.type!=='password')return;
                                        const h=((inp.name||'')+(inp.placeholder||'')+(inp.id||'')+(inp.getAttribute('aria-label')||'')).toLowerCase();
                                        let v='';
                                        if(inp.type==='email'||h.includes('email'))v=d.email;
                                        else if(inp.type==='password')v=d.password;
                                        else if(h.includes('first')||h.includes('fname'))v=d.first;
                                        else if(h.includes('last')||h.includes('lname'))v=d.last;
                                        else if(h.includes('phone')||h.includes('mobile')||h.includes('tel'))v=d.phone;
                                        else if(h.includes('zip')||h.includes('postal'))v=d.zip;
                                        else if(h.includes('name'))v=d.full;
                                        if(!v)return;
                                        try{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(inp,v);inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}));n++;}catch(e){}
                                    });
                                    root.querySelectorAll('*').forEach(el=>{if(el.shadowRoot)go(el.shadowRoot);});
                                }
                                go(document);return n;
                            }""", {"email": config.get("email",""), "password": config.get("password",""),
                                   "first": config.get("first_name",""), "last": config.get("last_name",""),
                                   "phone": config.get("phone",""), "zip": _addr.get("zip", config.get("zip","")),
                                   "full": _full})
                            _filled_n += (_sf or 0)
                        except Exception:
                            pass

                    if _filled_n > 0:
                        break   # filled something — move on to submit

                    # Visible inputs but couldn't fill anything (e.g. search bar only)
                    # — reset and keep watching
                    logger.warning(f"  [W{worker}] ⚠️  Saw {len(_visible)} input(s) on {page.url} but filled 0 fields — waiting for real form (URL changed={_url_changed})")
                    _filled_els.clear()
                    _origin_url = _current_url  # update origin so next nav triggers again

            except Exception as _me:
                logger.debug(f"  [W{worker}] manual loop error: {_me}")

        if _filled_n == 0:
            return "failed", "manual mode: timed out waiting for form"

        # ── CAPTCHA then SUBMIT (same path as normal mode) ────────────────
        if await detect_captcha(page):
            _ci = await extract_captcha_info(page, url)
            if capsolver_key and _ci["sitekey"]:
                _tok = await solve_captcha_capsolver(capsolver_key, _ci, url)
                if _tok:
                    await inject_captcha_token(page, _ci["type"], _tok)
                else:
                    if not await wait_for_manual_captcha(page, brand, worker, captcha_timeout):
                        return "captcha_failed", "captcha not solved"
            else:
                if not await wait_for_manual_captcha(page, brand, worker, captcha_timeout):
                    return "captcha_skipped", "captcha not solved"

        if dry_run:
            return "dry_run", f"{_filled_n} fields filled (manual mode)"

        _url_before = page.url
        if not await click_submit(page):
            return "failed", "manual mode: submit button not found"

        await page.wait_for_timeout(1200)
        try:
            _pt  = await page.inner_text("body", timeout=3000)
            _low = _pt.lower()
            for kw in ["already registered","already have an account","already exists","already a member"]:
                if kw in _low:
                    return "success", "account already exists"
            for kw in ["thank you for","successfully registered","successfully created",
                       "account created","check your email","verify your email",
                       "you're now a member","you are now a member","enrollment complete",
                       "registration complete","you're all set","you are all set",
                       "confirmation email","verification email sent"]:
                if kw in _low:
                    return "success", "manual mode"
            for kw in ["invalid email","invalid password","something went wrong",
                       "unable to create","registration failed","this field is required"]:
                if kw in _low:
                    return "failed", f"manual mode: {kw}"
            if page.url != _url_before:
                return "success", "manual mode (redirect)"
            if await detect_form_fields(page) >= 2:
                return "failed", "manual mode: form still showing after submit"
        except Exception:
            pass
        return "success", "manual mode"
    # ── END MANUAL MODE ───────────────────────────────────────────────────────

    # ── FAST PATH: Click obvious nav-level signup buttons immediately ──────
    # Sites like Snagajob, Craigslist, job boards, and many SaaS products
    # put a "Sign up" or "Get Started" button right in the top nav.
    # Click it NOW before any deep scanning — don't wait for full page load.
    fast_path_selectors = [
        'a:has-text("Sign up")', 'a:has-text("Sign Up")', 'a:has-text("Sign Up Free")',
        'button:has-text("Sign up")', 'button:has-text("Sign Up")',
        'a:has-text("Get Started")', 'button:has-text("Get Started")',
        'a:has-text("Create Account")', 'button:has-text("Create Account")',
        'a:has-text("Register")', 'button:has-text("Register")',
        'a:has-text("Join Free")', 'a:has-text("Join for Free")',
        'a:has-text("Try for Free")', 'a:has-text("Start Free")',
    ]
    fast_clicked = False
    for fsel in fast_path_selectors:
        try:
            floc = page.locator(fsel).first
            if await floc.count() > 0 and await floc.is_visible():
                logger.info(f"  [W{worker}] ⚡ Fast-path click — {fsel} — {brand}")
                url_before_fast = page.url
                await floc.click(timeout=3000)
                await page.wait_for_timeout(800)
                fast_clicked = True
                break
        except Exception:
            continue

    # Dismiss any cookie/consent banners BEFORE trying to interact with forms.
    # These banners intercept clicks silently and make the bot appear frozen.
    await dismiss_cookie_banner(page)

    # Remove invisible overlay divs that silently eat clicks (anti-bot glass panes).
    try:
        await page.evaluate("""() => {
            document.querySelectorAll('div, section').forEach(el => {
                const s = window.getComputedStyle(el);
                const r = el.getBoundingClientRect();
                // Large, fixed/absolute, z-index > 100, no visible background = overlay
                if (
                    (s.position === 'fixed' || s.position === 'absolute') &&
                    parseFloat(s.zIndex) > 100 &&
                    r.width > 400 && r.height > 400 &&
                    (s.backgroundColor === 'rgba(0, 0, 0, 0)' || s.backgroundColor === 'transparent') &&
                    el.children.length === 0
                ) {
                    el.style.pointerEvents = 'none';
                }
            });
        }""")
    except Exception:
        pass

    # ── TRY TO FIND THE ACTUAL SIGNUP FORM ──
    # Many sites hide signup behind a "Sign In" icon, person silhouette,
    # or "Create Account" link. Try clicking through to the real form.
    # Also scroll down to trigger lazy-loaded form elements.
    try:
        await page.evaluate("window.scrollTo(0, document.body.scrollHeight / 3)")
        await page.wait_for_timeout(400)
        await page.evaluate("window.scrollTo(0, 0)")
    except Exception:
        pass
    initial_fields = await detect_form_fields(page)
    logger.info(f"  [W{worker}] 🔍 {brand} — initial field scan: {initial_fields} fields detected on {page.url}")

    # Only hunt for a signup link/modal if fewer than 2 fields are visible.
    # Plain account-signup pages (no loyalty branding) already have the form
    # on-screen — skip the link search and go straight to filling.
    if initial_fields < 2:
        # Not enough fields visible — look for signup/register triggers.
        # Two patterns to handle:
        #   A) Link/button that NAVIGATES to a new signup page
        #   B) Button that OPENS A MODAL — clicking it doesn't navigate,
        #      it reveals a popup with Sign In / Create Account tabs
        signup_link_selectors = [
            'a:has-text("Create Account")', 'a:has-text("Create an Account")',
            'a:has-text("Sign Up")', 'a:has-text("Register")',
            'a:has-text("Join")', 'a:has-text("Join Now")',
            'a:has-text("Join Free")', 'a:has-text("Join for Free")',
            'a:has-text("Create Profile")', 'a:has-text("Get Started")',
            'a:has-text("Become a Member")', 'a:has-text("Enroll")',
            'a:has-text("Enroll Now")', 'a:has-text("Sign up")',
            'button:has-text("Create Account")', 'button:has-text("Sign Up")',
            'button:has-text("Register")', 'button:has-text("Join")',
            'button:has-text("Join Now")', 'button:has-text("Get Started")',
            'button:has-text("Enroll")', 'button:has-text("Enroll Now")',
            # Person icon / silhouette links (common on retail sites)
            'a[href*="register" i]', 'a[href*="signup" i]', 'a[href*="sign-up" i]',
            'a[href*="create-account" i]', 'a[href*="create_account" i]',
            'a[href*="join" i]:not([href*="login"])',
            'a[href*="enroll" i]', 'a[href*="account/create" i]',
            '[data-testid*="signup" i]', '[data-testid*="register" i]',
            '[aria-label*="Sign Up" i]', '[aria-label*="Create Account" i]',
            '[aria-label*="Register" i]', '[aria-label*="Join" i]',
            # ── Sign In triggers ──────────────────────────────────────────
            # Many sites route through Sign In first, then offer Create Account
            # inside the modal or on the sign-in page.
            'a:has-text("Sign In")', 'a:has-text("Log In")', 'a:has-text("Login")',
            'button:has-text("Sign In")', 'button:has-text("Log In")',
            'a[href*="login" i]', 'a[href*="sign-in" i]', 'a[href*="signin" i]',
            '[data-testid*="signin" i]', '[data-testid*="login" i]',
            '[aria-label*="Sign In" i]', '[aria-label*="Account" i]',
            # Account icon (person silhouette) — opens sign-in modal on many retail sites
            'a[href*="account" i]:not([href*="logout" i]):not([href*="order" i])',
            '[class*="account" i][class*="icon" i]',
            '[class*="user" i][class*="icon" i]',
        ]

        # Selectors for the "Create Account" TAB inside a modal/popup or
        # on a sign-in page. Many retail sites (GameStop, Walgreens, PetSmart,
        # Home Depot...) open a sign-in modal first — you have to click a tab
        # or a "Don't have an account?" link to reach the registration form.
        modal_register_tab_selectors = [
            '[role="tab"]:has-text("Create")',
            '[role="tab"]:has-text("Register")',
            '[role="tab"]:has-text("Sign Up")',
            '[role="tab"]:has-text("New")',
            'a:has-text("Create Account"):visible',
            'a:has-text("Sign Up"):visible',
            'button:has-text("Create Account"):visible',
            'button:has-text("New Customer"):visible',
            'button:has-text("New User"):visible',
            'li:has-text("Create Account") a',
            'li:has-text("Register") a',
            '[class*="register" i]:has-text("Create")',
            '[class*="tab" i]:has-text("Create")',
            '[class*="tab" i]:has-text("Sign Up")',
            # "Don't have an account?" patterns — appear on sign-in pages/modals
            'a:has-text("Don\'t have an account")',
            'a:has-text("Need an account")',
            'a:has-text("New here")',
            'a:has-text("Not a member")',
            'a:has-text("Create one")',
            'button:has-text("Create one")',
            'a:has-text("No account")',
            'a:has-text("First time")',
            'a:has-text("New to")',
            'a:has-text("Sign up here")',
            'a:has-text("Register here")',
            'a:has-text("Join now")',
            'span:has-text("Sign Up"):visible',
            # Generic "register" link that appears after sign-in modal opens
            'a[href*="register" i]:visible',
            'a[href*="signup" i]:visible',
            'a[href*="create" i]:visible',
        ]

        for sel in signup_link_selectors:
            try:
                loc = page.locator(sel).first
                if await loc.count() == 0: continue
                if not await loc.is_visible(): continue

                logger.info(f"  [W{worker}] 🖱️  {brand} — clicking: {sel}")

                # Plain click — NO expect_navigation wrapper.
                # expect_navigation wastes 10s on every modal trigger (no nav happens).
                # Instead just click, then detect what happened.
                url_before_click = page.url
                try:
                    await loc.click(timeout=4000)
                except Exception:
                    pass

                # Brief wait for either: page navigation OR modal animation
                await page.wait_for_timeout(600)

                # If page navigated, wait for it to settle
                if page.url != url_before_click:
                    try:
                        await asyncio.wait_for(
                            page.wait_for_load_state("networkidle"),
                            timeout=2.0
                        )
                    except Exception:
                        pass

                # ── MODAL TAB STEP ──────────────────────────────────────────
                # If a modal just opened (no navigation) check if it has a
                # "Create Account" tab that needs to be clicked to show the
                # registration form (vs the default Sign In form).
                if page.url == url_before_click:
                    for tab_sel in modal_register_tab_selectors:
                        try:
                            tab = page.locator(tab_sel).first
                            if await tab.count() > 0 and await tab.is_visible():
                                logger.info(f"  [W{worker}] 📋 {brand} — clicking modal tab: {tab_sel}")
                                await tab.click(timeout=3000)
                                await page.wait_for_timeout(500)
                                break
                        except Exception:
                            continue

                # Wait up to 4s for a key input to appear (navigation or modal)
                try:
                    await page.wait_for_selector(
                        'input[type="email"], input[type="password"], '
                        'input[name*="first" i], input[name*="email" i], '
                        'input[placeholder*="email" i], input[placeholder*="first" i]',
                        timeout=4000, state="attached"
                    )
                except Exception:
                    await page.wait_for_timeout(800)

                new_fields = await detect_form_fields(page)
                logger.info(f"  [W{worker}] 🔍 {brand} — after click: {new_fields} fields, url={page.url}")
                if new_fields >= 2:
                    break  # Found the signup form
            except Exception:
                continue

    # Build fill map from full client profile
    addr = config.get("address", {})
    if not isinstance(addr, dict): addr = {}
    emp  = config.get("employment", {})
    if not isinstance(emp, dict): emp = {}
    edu  = config.get("education", {})
    if not isinstance(edu, dict): edu = {}

    full_name = f"{config.get('first_name', '')} {config.get('last_name', '')}".strip()

    fill_map = {
        # personal
        "first_name":       config.get("first_name", ""),
        "last_name":        config.get("last_name", ""),
        "full_name":        full_name,
        "email":            config.get("email", ""),
        "email_confirm":    config.get("email", ""),
        "phone":            config.get("phone", ""),
        "password":         config.get("password", ""),
        "password_confirm": config.get("password", ""),
        "username":         config.get("username", config.get("email", "")),
        "birthday":         config.get("dob", config.get("birthday", "")),
        "ssn":              config.get("ssn", ""),
        # address
        "zip":              addr.get("zip",    config.get("zip", "")),
        "address":          addr.get("street", config.get("street", "")),
        "city":             addr.get("city",   config.get("city", "")),
        "state":            addr.get("state",  config.get("state", "")),
        # employment
        "employer":         emp.get("employer",      config.get("employer", "")),
        "job_title":        emp.get("job_title",     config.get("job_title", "")),
        "income":           emp.get("annual_income", config.get("annual_income",
                            emp.get("monthly_income", config.get("monthly_income", "")))),
        "employer_phone":   emp.get("employer_phone", config.get("employer_phone",
                            emp.get("business_phone", config.get("business_phone", "")))),
        # education
        "college":          edu.get("college",       config.get("college", "")),
        "degree":           edu.get("degree",        config.get("degree", "")),
    }

    fields_filled = 0
    filled_elements = set()  # Track which DOM elements are already filled

    # Wait up to 8s for at least one key form field — luxury/airline sites
    # (BMW, Mercedes, Qatar Airways, Qantas etc.) have heavy JS portals that
    # take longer to hydrate than standard retail sites.
    try:
        await page.wait_for_selector(
            'input[type="email"], input[type="password"], '
            'input[name*="email" i], input[name*="first" i], '
            'input[placeholder*="email" i], input[placeholder*="first" i]',
            state="attached",
            timeout=8000
        )
    except Exception:
        pass

    # ── SMART PASS — label-aware recognition + junk-skip (runs FIRST) ──────────
    # This is the fix for "it just sits there and does nothing on all but the
    # most basic forms." It reads each field's <label> text and every attribute,
    # so catalog/loyalty/sweepstakes/soft-pull forms that only label their fields
    # (no clean name=) get filled — and genuine junk pages (phone-only, app-only,
    # non-signup) are SKIPPED cleanly so they don't count against the rate.
    if _SMART_ENGINE:
        try:
            scan = await scan_page(page)
            # Give a slow SPA one more chance before judging a page as junk.
            if not any(f["visible"] for f in scan["fields"]):
                await page.wait_for_timeout(1500)
                scan = await scan_page(page)
            verdict, plan = classify_page(scan)
            if verdict == "skip":
                logger.info(f"  [W{worker}] ⏭️  {brand} — not a fillable signup ({plan}); skipping")
                return "skipped", f"not a fillable signup form ({plan})"
            smart_filled = await smart_fill(page, fill_map, plan, filled_elements)
            if smart_filled:
                fields_filled += len(smart_filled)
                logger.info(f"  [W{worker}] 🧠 {brand} — smart pass filled {sorted(smart_filled)}")
        except Exception as e:
            logger.debug(f"  [W{worker}] smart pass error ({e}) — falling back to legacy selectors")

    for field_key, value in fill_map.items():
        if not value: continue
        if await fill_field(page, field_key, value, filled_elements):
            fields_filled += 1

    # Second-chance retry: wait 2s and try again for slow SPAs
    if fields_filled == 0:
        logger.info(f"  [W{worker}] ⏳ 0 fields — waiting 2s for late-hydrating form — {brand}")
        await page.wait_for_timeout(2000)
        filled_elements.clear()
        for field_key, value in fill_map.items():
            if not value: continue
            if await fill_field(page, field_key, value, filled_elements):
                fields_filled += 1

    if fields_filled == 0:
        # Pass 3 — Shadow DOM pierce. BMW, Mercedes, Tesla, Porsche and many
        # airline sites render their forms inside web components / shadow roots
        # which regular Playwright selectors can't reach. Use JS to walk all
        # shadow roots and fill inputs directly.
        logger.info(f"  [W{worker}] 🔦 {brand} — shadow DOM scan")
        try:
            shadow_filled = await page.evaluate("""(fillData) => {
                let filled = 0;
                function fillInputs(root) {
                    const inputs = root.querySelectorAll(
                        'input[type="email"], input[type="password"], input[type="text"], input[type="tel"], input:not([type])'
                    );
                    inputs.forEach(inp => {
                        if (inp.offsetParent === null && inp.type !== 'email' && inp.type !== 'password') return;
                        const hint = ((inp.name||'') + (inp.placeholder||'') + (inp.id||'') + (inp.getAttribute('aria-label')||'')).toLowerCase();
                        let val = '';
                        if (inp.type === 'email' || hint.includes('email')) val = fillData.email;
                        else if (inp.type === 'password') val = fillData.password;
                        else if (hint.includes('first') || hint.includes('fname') || hint.includes('given')) val = fillData.first_name;
                        else if (hint.includes('last') || hint.includes('lname') || hint.includes('family') || hint.includes('surname')) val = fillData.last_name;
                        else if (hint.includes('phone') || hint.includes('mobile') || hint.includes('tel')) val = fillData.phone;
                        else if (hint.includes('zip') || hint.includes('postal')) val = fillData.zip;
                        else if (hint.includes('name') && !hint.includes('user')) val = fillData.full_name;
                        if (!val) return;
                        try {
                            const nativeInputSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                            nativeInputSetter.call(inp, val);
                            inp.dispatchEvent(new Event('input', { bubbles: true }));
                            inp.dispatchEvent(new Event('change', { bubbles: true }));
                            filled++;
                        } catch(e) {}
                    });
                    // Recurse into any shadow roots on this level
                    root.querySelectorAll('*').forEach(el => {
                        if (el.shadowRoot) fillInputs(el.shadowRoot);
                    });
                }
                fillInputs(document);
                return filled;
            }""", {
                "email":      config.get("email", ""),
                "password":   config.get("password", ""),
                "first_name": config.get("first_name", ""),
                "last_name":  config.get("last_name", ""),
                "phone":      config.get("phone", ""),
                "zip":        (config.get("address") or {}).get("zip", config.get("zip", "")),
                "full_name":  f"{config.get('first_name','')} {config.get('last_name','')}".strip(),
            })
            if shadow_filled:
                fields_filled += shadow_filled
                logger.info(f"  [W{worker}] ✅ Shadow DOM filled {shadow_filled} fields — {brand}")
        except Exception as e:
            logger.debug(f"  [W{worker}] Shadow DOM scan error: {e}")

    if fields_filled == 0:
        # Pass 4 — brute-force scan for ANY visible input on the page.
        # Plain account-signup pages with non-standard field names get caught here.
        logger.info(f"  [W{worker}] 🔎 {brand} — brute-force field scan")
        try:
            all_inputs = await page.query_selector_all(
                'input[type="text"]:not([type="hidden"]), '
                'input[type="email"], input[type="password"], '
                'input[type="tel"], input:not([type])'
            )
            brute_fill_map = [
                ("email",      config.get("email", "")),
                ("password",   config.get("password", "")),
                ("first_name", config.get("first_name", "")),
                ("last_name",  config.get("last_name", "")),
                ("phone",      config.get("phone", "")),
            ]
            for inp in all_inputs:
                try:
                    if not await inp.is_visible(): continue
                    itype  = (await inp.get_attribute("type") or "text").lower()
                    iname  = (await inp.get_attribute("name") or "").lower()
                    iph    = (await inp.get_attribute("placeholder") or "").lower()
                    ilabel = (await inp.get_attribute("aria-label") or "").lower()
                    hint   = iname + iph + ilabel

                    if itype == "email" or "email" in hint:
                        val = config.get("email", "")
                    elif itype == "password":
                        val = config.get("password", "")
                    elif any(k in hint for k in ["first", "fname", "given"]):
                        val = config.get("first_name", "")
                    elif any(k in hint for k in ["last", "lname", "family", "surname"]):
                        val = config.get("last_name", "")
                    elif any(k in hint for k in ["phone", "mobile", "tel"]):
                        val = config.get("phone", "")
                    elif any(k in hint for k in ["zip", "postal"]):
                        val = config.get("zip", config.get("address", {}).get("zip", ""))
                    elif any(k in hint for k in ["name", "full"]):
                        val = f"{config.get('first_name','')} {config.get('last_name','')}".strip()
                    else:
                        continue  # Skip unknown fields

                    if not val: continue
                    try:
                        await inp.fill(val, timeout=3000)
                        await inp.dispatch_event("input")
                        await inp.dispatch_event("change")
                        fields_filled += 1
                    except Exception:
                        try:
                            await inp.fill(val, timeout=3000, force=True)
                            fields_filled += 1
                        except Exception:
                            pass
                except Exception:
                    continue
        except Exception:
            pass

    if fields_filled == 0 and not LOW_POWER_MODE:
        # Last ditch — try common signup URL paths directly.
        # LOW_POWER_MODE skips this: 20 paths × 15s each = up to 5 wasted
        # minutes per doomed site on the N6000. Not worth it.
        # Set LOW_POWER_MODE = False at the top to re-enable on faster hardware.
        base = url.split("?")[0].rstrip("/")
        domain = "/".join(base.split("/")[:3])  # https://example.com
        fallback_paths = [
            "/account/create", "/account/register", "/account/signup",
            "/create-account", "/register", "/signup", "/sign-up",
            "/join", "/enroll", "/loyalty/register", "/rewards/register",
            "/loyalty/signup", "/rewards/signup", "/membership/register",
            "/loyalty", "/rewards", "/rewards-program",
            "/account", "/my-account", "/profile/create",
        ]
        for path in fallback_paths:
            try:
                test_url = domain + path
                if test_url == url: continue
                logger.info(f"  [W{worker}] 🔗 Trying fallback URL: {test_url} — {brand}")
                await page.goto(test_url, wait_until="commit", timeout=15000)
                try:
                    await asyncio.wait_for(page.wait_for_load_state("domcontentloaded"), timeout=4.0)
                except Exception:
                    pass
                await page.wait_for_timeout(800)
                await dismiss_cookie_banner(page)
                filled_elements.clear()
                for field_key, value in fill_map.items():
                    if not value: continue
                    if await fill_field(page, field_key, value, filled_elements):
                        fields_filled += 1
                if fields_filled > 0:
                    logger.info(f"  [W{worker}] ✅ Fallback URL worked: {test_url} — {brand}")
                    break
            except Exception:
                continue

    if fields_filled == 0:
        # ── WATCH MODE ────────────────────────────────────────────────────
        # Bot exhausted all automatic strategies. If the browser is visible
        # (not headless), enter a 45-second watch window.
        # The user can click around in the browser to navigate to the signup
        # page — the moment the bot detects a URL change OR form fields
        # appear in the DOM, it auto-fills and submits without any dashboard
        # interaction needed.
        is_headless = False
        try:
            is_headless = await page.evaluate("() => navigator.webdriver === undefined || window.outerWidth === 0")
        except Exception:
            pass

        if not is_headless:
            url_at_watch_start = page.url
            logger.info(f"  [W{worker}] 👁  WATCH MODE — {brand} — navigate browser window to signup page (45s)")
            _current_workers[worker] = {"brand": brand, "status": "watch_mode"}

            watch_start = time.time()
            watch_timeout = 45  # seconds to watch before giving up

            while (time.time() - watch_start) < watch_timeout:
                await asyncio.sleep(0.5)
                try:
                    current_url = page.url
                    url_changed = current_url != url_at_watch_start

                    # Count visible form fields on current page
                    field_count = await detect_form_fields(page)

                    if url_changed or field_count >= 1:
                        logger.info(f"  [W{worker}] ⚡ Watch Mode triggered — URL changed: {url_changed}, fields: {field_count} — auto-filling now")
                        await page.wait_for_timeout(600)  # brief settle

                        # Run full fill pass on whatever page is now showing
                        filled_elements.clear()
                        for field_key, value in fill_map.items():
                            if not value: continue
                            if await fill_field(page, field_key, value, filled_elements):
                                fields_filled += 1

                        # If still nothing, try brute-force on the new page
                        if fields_filled == 0:
                            try:
                                all_inputs = await page.query_selector_all(
                                    'input[type="text"]:not([type="hidden"]), '
                                    'input[type="email"], input[type="password"], '
                                    'input[type="tel"], input:not([type])'
                                )
                                for inp in all_inputs:
                                    try:
                                        if not await inp.is_visible(): continue
                                        itype = (await inp.get_attribute("type") or "text").lower()
                                        hint  = ((await inp.get_attribute("name") or "") +
                                                 (await inp.get_attribute("placeholder") or "") +
                                                 (await inp.get_attribute("aria-label") or "")).lower()
                                        if itype == "email" or "email" in hint:
                                            val = config.get("email", "")
                                        elif itype == "password":
                                            val = config.get("password", "")
                                        elif any(k in hint for k in ["first","fname"]):
                                            val = config.get("first_name", "")
                                        elif any(k in hint for k in ["last","lname"]):
                                            val = config.get("last_name", "")
                                        elif any(k in hint for k in ["phone","mobile","tel"]):
                                            val = config.get("phone", "")
                                        else: continue
                                        if not val: continue
                                        await inp.fill(val, timeout=3000)
                                        fields_filled += 1
                                    except Exception:
                                        continue
                            except Exception:
                                pass

                        if fields_filled > 0:
                            break  # Got fields — proceed to submit

                except Exception:
                    pass

            if fields_filled == 0:
                # 2-strike no-form retirement
                _check_no_form_strike(url, brand, worker)
                return "failed", "no form fields found (watch mode expired)"
        else:
            # 2-strike no-form retirement
            _check_no_form_strike(url, brand, worker)
            return "failed", "no form fields found"

    # CAPTCHA handling
    has_captcha = await detect_captcha(page)

    if has_captcha:
        captcha_info = await extract_captcha_info(page, url)

        if capsolver_key and captcha_info["sitekey"]:
            # Auto-solve with CapSolver
            logger.info(f"  [W{worker}] 🤖 Solving {captcha_info['type']} via CapSolver — {brand}")
            token = await solve_captcha_capsolver(capsolver_key, captcha_info, url)

            if token:
                injected = await inject_captcha_token(page, captcha_info["type"], token)
                if injected:
                    logger.info(f"  [W{worker}] ✅ CAPTCHA auto-solved — {brand}")
                    await page.wait_for_timeout(500)
                else:
                    logger.warning(f"  [W{worker}] Token injection failed — {brand}")
                    return "captcha_failed", "token injection failed"
            else:
                # CapSolver failed — fall back to manual if browser is visible.
                # In headless batch mode no human is watching, so a long wait just
                # burns the per-site cap; keep it short there.
                manual_wait = captcha_timeout if MANUAL_MODE else BATCH_MANUAL_CAPTCHA_WAIT_SEC
                logger.warning(f"  [W{worker}] CapSolver failed, trying manual — {brand}")
                solved = await wait_for_manual_captcha(page, brand, worker, manual_wait)
                if not solved:
                    return "captcha_failed", f"CapSolver + manual both failed"
        else:
            # No CapSolver key or couldn't extract sitekey — manual mode
            manual_wait = captcha_timeout if MANUAL_MODE else BATCH_MANUAL_CAPTCHA_WAIT_SEC
            solved = await wait_for_manual_captcha(page, brand, worker, manual_wait)
            if not solved:
                return "captcha_skipped", f"CAPTCHA not solved ({fields_filled} fields filled)"

    if dry_run:
        return "dry_run", f"{fields_filled} fields filled"

    url_before = page.url

    if not await click_submit(page):
        return "failed", "submit button not found"

    await page.wait_for_timeout(1000)

    try:
        page_text = await page.inner_text("body", timeout=3000)
        low = page_text.lower()

        # ── ALREADY EXISTS — counts as a win ──────────────────────────────
        # Account already registered = client can still use it.
        for kw in ["already registered", "already have an account",
                   "already exists", "already a member", "already signed up",
                   "account already", "email already", "email is already"]:
            if kw in low:
                return "success", "account already exists"

        # ── SUCCESS signals ───────────────────────────────────────────────
        # Covers loyalty enrollments AND plain account creation equally.
        for kw in [
            # Post-submit confirmation text
            "welcome", "thank you", "thanks for", "successfully",
            "you're in", "you are in", "you're all set", "you are all set",
            # Account-specific
            "account created", "account has been created", "account is ready",
            "account activated", "registration complete", "registration successful",
            "successfully created", "successfully registered",
            # Email confirmation prompts (very reliable success signal)
            "check your email", "verify your email", "verification email",
            "confirmation email", "confirm your email", "email sent",
            "link has been sent", "we sent you",
            # Loyalty/rewards specific
            "enrollment complete", "you're now a member", "you are now a member",
            "joined", "signed up", "you've joined", "welcome to the family",
            "welcome to the club", "welcome aboard",
            # Generic membership
            "member", "congratulations", "congrats",
        ]:
            if kw in low:
                return "success", ""

        # ── FAILURE signals — be specific, not broad ──────────────────────
        # "error" alone is too broad — many pages have unrelated error text.
        for kw in ["invalid email", "invalid password", "password is invalid",
                   "email is invalid", "please try again", "something went wrong",
                   "unable to create", "could not create", "could not register",
                   "registration failed", "signup failed", "sign up failed",
                   "this field is required", "please fill", "please correct"]:
            if kw in low:
                return "failed", f"error text on form: '{kw}'"

        # ── URL changed = redirect after successful submit ────────────────
        if page.url != url_before:
            return "success", ""

        # ── Form still showing = maybe rejected — give it ONE more shot ────
        # Many forms need a second submit after client-side validation, or an
        # Enter keypress, or the button only enables once fields blur. Retry
        # once and re-check before calling it a failure.
        fields_still_present = await detect_form_fields(page)
        if fields_still_present >= 2:
            try:
                await page.keyboard.press("Enter")
            except Exception:
                pass
            try:
                await click_submit(page)
            except Exception:
                pass
            await page.wait_for_timeout(1200)
            try:
                low2 = (await page.inner_text("body", timeout=3000)).lower()
                retry_success = [
                    "welcome", "thank you", "thanks for", "successfully",
                    "you're in", "you are in", "you're all set", "account created",
                    "registration complete", "registration successful",
                    "check your email", "verify your email", "confirmation email",
                    "email sent", "we sent you", "enrollment complete",
                    "you've joined", "congratulations", "already",
                ]
                if any(k in low2 for k in retry_success):
                    return "success", "success after retry submit"
                if page.url != url_before:
                    return "success", ""
                if await detect_form_fields(page) >= 2:
                    return "failed", "form still present after submit (likely rejected)"
            except Exception:
                pass

    except Exception:
        pass

    # No strong signal either way — assume ok
    return "success", ""


# ─────────────────────────────────────────────
#  HEALTH CHECK
# ─────────────────────────────────────────────

async def health_check_entry(page, row: dict, worker: int) -> None:
    url   = str(row.get("Direct Sign-Up URL", "")).strip()
    brand = str(row.get("Brand Name", "")).strip()

    if not url or not url.startswith("http"):
        append_health(url, brand, "invalid", 0, False, False, "invalid URL")
        return

    try:
        response = await page.goto(url, wait_until="domcontentloaded", timeout=HEALTH_TIMEOUT_MS)
        http_code = response.status if response else 0
    except PlaywrightTimeoutError:
        append_health(url, brand, "timeout", 0, False, False, "page load timed out")
        return
    except Exception as exc:
        append_health(url, brand, "error", 0, False, False, str(exc)[:150])
        return

    await page.wait_for_timeout(800)

    has_captcha = await detect_captcha(page)
    form_fields = await detect_form_fields(page)
    has_form = form_fields > 0

    if http_code >= 400:
        status = "dead"
    elif not has_form:
        status = "no_form"
    elif has_captcha:
        status = "captcha"
    else:
        status = "healthy"

    append_health(url, brand, status, http_code, has_captcha, has_form)
    icon = {"healthy": "✅", "captcha": "🔒", "no_form": "⚠️", "dead": "💀"}.get(status, "?")
    logger.info(f"  [W{worker}] {icon} {brand} — {status}")


# ─────────────────────────────────────────────
#  CONTEXT RESURRECTION
# ─────────────────────────────────────────────

_BROWSER_LAUNCH_ARGS = [
    "--disable-blink-features=AutomationControlled",
    "--disable-infobars",
    "--exclude-switches=enable-automation",
    "--disable-automation",
    "--disable-dev-shm-usage",
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--no-first-run",
    "--no-zygote",
    "--disable-gpu",
    "--window-size=1920,1080",
    "--start-maximized",
    "--disable-extensions",
    "--disable-popup-blocking",
    "--ignore-certificate-errors",
    "--lang=en-US",
]

def _make_context_opts(worker_id: int = 1) -> dict:
    """Build browser context options with per-worker UA rotation."""
    ua, sec_ch_ua = get_ua_for_worker(worker_id)
    # Timezone rotates slightly per worker to look like different locations
    timezones = ["America/Chicago", "America/New_York", "America/Los_Angeles", "America/Denver"]
    tz = timezones[(worker_id - 1) % len(timezones)]
    return dict(
        user_agent=ua,
        viewport={"width": 1920, "height": 1080},
        screen={"width": 1920, "height": 1080},
        locale="en-US",
        timezone_id=tz,
        permissions=["geolocation", "notifications"],
        color_scheme="light",
        device_scale_factor=1.0,
        has_touch=False,
        is_mobile=False,
        java_script_enabled=True,
        ignore_https_errors=True,
        extra_http_headers={
            "Accept-Language": "en-US,en;q=0.9",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "sec-ch-ua": sec_ch_ua,
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "Upgrade-Insecure-Requests": "1",
        },
    )

# Keep _CONTEXT_OPTS as a default (used by health worker and resurrection)
_CONTEXT_OPTS = _make_context_opts(1)


async def _resurrect_context(worker_id: int, browser, context, page):
    """
    Rebuild a dead browser context/page.  Returns (page, context, browser)
    on success, or (None, None, browser) if all attempts fail.

    Three-phase escalation:
      1. New context on existing browser  +  validate with about:blank
      2. Relaunch browser process         +  new context  +  validate
      3. Give up — return None so the worker can exit cleanly
    """
    logger.warning(f"[W{worker_id}] 🔄 Context dead — rebuilding")

    # Clean up old context (ignore errors — it may already be gone)
    try:
        await context.close()
    except Exception:
        pass

    # ── Phase 1: New context on existing browser ──────────────────────
    try:
        context = await browser.new_context(**_make_context_opts(worker_id))
        await context.add_init_script(STEALTH_JS)
        page = await context.new_page()
        page.set_default_timeout(15000)
        if STEALTH_AVAILABLE:
            await _stealth_async(page)
        # CRITICAL: Validate the new page actually works.
        # browser.new_context() can return a "valid" object even when the
        # underlying browser process is dead — producing a zombie page that
        # instantly fails on any real operation.
        await page.goto("about:blank", timeout=5000)
        logger.info(f"[W{worker_id}] ✅ Context rebuilt (phase 1) — resuming")
        return page, context, browser
    except Exception as e1:
        logger.warning(f"[W{worker_id}] Phase 1 failed: {e1}")

    # ── Phase 2: Full browser relaunch ────────────────────────────────
    try:
        try:
            await browser.close()
        except Exception:
            pass
        browser = await _playwright_instance.chromium.launch(
            headless=_headless_mode,
            args=_BROWSER_LAUNCH_ARGS,
        )
        context = await browser.new_context(**_make_context_opts(worker_id))
        await context.add_init_script(STEALTH_JS)
        page = await context.new_page()
        page.set_default_timeout(15000)
        if STEALTH_AVAILABLE:
            await _stealth_async(page)
        await page.goto("about:blank", timeout=5000)
        logger.info(f"[W{worker_id}] ✅ Browser relaunched (phase 2) — resuming")
        return page, context, browser
    except Exception as e2:
        logger.error(f"[W{worker_id}] Phase 2 failed: {e2}")

    # ── Phase 3: Give up ──────────────────────────────────────────────
    return None, None, browser


# ─────────────────────────────────────────────
#  WORKERS
# ─────────────────────────────────────────────

async def signup_worker(worker_id: int, queue: asyncio.Queue, config: dict, browser, stats: dict,
                        dry_run: bool, delay: float, capsolver_key: str, captcha_timeout: int):
    global _current_workers
    # Each worker gets its own UA from the rotation pool — looks like different machines
    ua, sec_ch_ua = get_ua_for_worker(worker_id)
    logger.info(f"[W{worker_id}] 🌐 UA: {ua[:60]}...")
    context = await browser.new_context(**_make_context_opts(worker_id))

    # Inject stealth patches into EVERY page before any script runs
    await context.add_init_script(STEALTH_JS)

    page = await context.new_page()
    page.set_default_timeout(15000)

    # Apply playwright-stealth library on top if available
    if STEALTH_AVAILABLE:
        await _stealth_async(page)
        logger.debug(f"[W{worker_id}] playwright-stealth applied")

    while True:
        # ── STOP FLAG CHECK ───────────────────────────────────────────────
        # loyaltybot_server.py writes stop.flag when "Stop All" is clicked.
        # Check it FIRST — before pulling the next site — so the worker exits
        # cleanly without starting work it will never finish.
        if STOP_FLAG_PATH.exists():
            logger.info(f"[W{worker_id}] 🛑 Stop flag detected — worker exiting cleanly")
            break
        # ─────────────────────────────────────────────────────────────────

        try:
            row = queue.get_nowait()
        except asyncio.QueueEmpty:
            break

        url     = str(row.get("Direct Sign-Up URL", "")).strip()
        brand   = str(row.get("Brand Name", "")).strip()
        program = str(row.get("Program Name", "")).strip()

        # ── MANUAL OVERRIDE (TAKE OVER) ───────────────────────────────────
        # Dashboard writes "paused" → bot loads the site, then WATCHES the
        # page. The instant you navigate to a form (email/password fields
        # appear), it auto-fills everything and submits. No Hand Back needed.
        try:
            _cid = PROGRESS_PATH.stem.replace("progress_", "")
            override_file = PROGRESS_PATH.parent / f"manual_override_{_cid}.json"
            if override_file.exists():
                overrides = json.loads(override_file.read_text())
                if overrides.get(str(worker_id)) == "paused":
                    # Clear the override file immediately so it doesn't re-trigger
                    overrides.pop(str(worker_id), None)
                    if overrides:
                        override_file.write_text(json.dumps(overrides))
                    else:
                        override_file.unlink(missing_ok=True)

                    logger.info(f"[W{worker_id}] TAKE OVER: {brand} — loading site, will auto-fill when you reach the signup form")
                    _current_workers[worker_id] = {"brand": brand, "status": "manual_watching"}
                    write_progress(True, stats)

                    # Load the site so user has a starting point
                    try:
                        await page.goto(url, wait_until="commit", timeout=NAVIGATION_TIMEOUT_MS)
                        await asyncio.sleep(1)
                    except Exception:
                        pass

                    # Build fill map
                    _addr = config.get("address", {}) or {}
                    _emp  = config.get("employment", {}) or {}
                    _edu  = config.get("education", {}) or {}
                    _full = (config.get('first_name', '') + ' ' + config.get('last_name', '')).strip()
                    _fill_map = {
                        "first_name":       config.get("first_name", ""),
                        "last_name":        config.get("last_name", ""),
                        "full_name":        _full,
                        "email":            config.get("email", ""),
                        "email_confirm":    config.get("email", ""),
                        "phone":            config.get("phone", ""),
                        "password":         config.get("password", ""),
                        "password_confirm": config.get("password", ""),
                        "username":         config.get("username", config.get("email", "")),
                        "birthday":         config.get("dob", config.get("birthday", "")),
                        "zip":              _addr.get("zip",    config.get("zip", "")),
                        "address":          _addr.get("street", config.get("street", "")),
                        "city":             _addr.get("city",   config.get("city", "")),
                        "state":            _addr.get("state",  config.get("state", "")),
                    }

                    # ── WATCH LOOP: poll every 0.5s for up to 180s ──────────────
                    _deadline = time.time() + 180
                    _origin_url = page.url
                    _last_hb = time.time()
                    _filled_n = 0
                    status, error = "failed", "take over: timed out waiting for form"

                    while time.time() < _deadline:
                        await asyncio.sleep(0.5)

                        # Heartbeat every 10s
                        if time.time() - _last_hb >= 10:
                            _secs = int(_deadline - time.time())
                            logger.info(f"[W{worker_id}] WATCHING — {_secs}s left — navigate to the signup form")
                            _current_workers[worker_id] = {"brand": brand, "status": f"watching ({_secs}s)"}
                            write_progress(True, stats)
                            _last_hb = time.time()

                        try:
                            # Check which page is active (handle new tabs)
                            all_pages = context.pages
                            active_page = all_pages[-1] if len(all_pages) > 1 else page

                            # Look for visible form inputs
                            _inputs = await active_page.query_selector_all(
                                'input[type="email"], input[type="password"], '
                                'input[type="text"]:not([type="hidden"]), '
                                'input[type="tel"], input:not([type])'
                            )
                            _visible = []
                            for _inp in _inputs:
                                try:
                                    if await _inp.is_visible():
                                        _visible.append(_inp)
                                except Exception:
                                    pass

                            # Check if there's a REAL form (email or password field)
                            _has_signup_field = False
                            for _inp in _visible:
                                try:
                                    _t = (await _inp.get_attribute("type") or "").lower()
                                    _n = ((await _inp.get_attribute("name") or "") +
                                          (await _inp.get_attribute("placeholder") or "") +
                                          (await _inp.get_attribute("id") or "")).lower()
                                    if _t == "email" or _t == "password" or "email" in _n or "password" in _n:
                                        _has_signup_field = True
                                        break
                                except Exception:
                                    pass

                            _url_changed = (active_page.url != _origin_url)

                            # Trigger fill if: real signup field found, OR URL changed AND 2+ visible inputs
                            if _has_signup_field or (_url_changed and len(_visible) >= 2):
                                logger.info(f"[W{worker_id}] FORM DETECTED on {active_page.url} — {len(_visible)} fields — FILLING NOW")
                                _current_workers[worker_id] = {"brand": brand, "status": "filling"}
                                write_progress(True, stats)
                                await active_page.wait_for_timeout(300)
                                await dismiss_cookie_banner(active_page)

                                _filled_els = set()

                                # Pass 1: Standard selectors
                                for _fk, _fv in _fill_map.items():
                                    if not _fv: continue
                                    try:
                                        if await fill_field(active_page, _fk, _fv, _filled_els):
                                            _filled_n += 1
                                    except Exception:
                                        pass
                                logger.info(f"[W{worker_id}] Pass 1: {_filled_n} fields via selectors")

                                # Pass 2: Brute-force all visible inputs
                                if _filled_n == 0:
                                    for inp in _visible:
                                        try:
                                            itype = (await inp.get_attribute("type") or "text").lower()
                                            hint  = ((await inp.get_attribute("name") or "") +
                                                     (await inp.get_attribute("placeholder") or "") +
                                                     (await inp.get_attribute("id") or "") +
                                                     (await inp.get_attribute("aria-label") or "")).lower()
                                            val = ""
                                            if itype == "email" or "email" in hint: val = config.get("email", "")
                                            elif itype == "password": val = config.get("password", "")
                                            elif any(k in hint for k in ["first","fname"]): val = config.get("first_name", "")
                                            elif any(k in hint for k in ["last","lname","surname"]): val = config.get("last_name", "")
                                            elif any(k in hint for k in ["phone","mobile","tel"]): val = config.get("phone", "")
                                            elif any(k in hint for k in ["zip","postal"]): val = _addr.get("zip", config.get("zip", ""))
                                            elif any(k in hint for k in ["city"]): val = _addr.get("city", config.get("city", ""))
                                            elif any(k in hint for k in ["address","street"]): val = _addr.get("street", config.get("street", ""))
                                            elif "name" in hint and "user" not in hint: val = _full
                                            elif "user" in hint: val = config.get("username", config.get("email", ""))
                                            if not val: continue
                                            await inp.click()
                                            await inp.fill("")
                                            await inp.type(val, delay=15)
                                            _filled_n += 1
                                        except Exception:
                                            pass
                                    logger.info(f"[W{worker_id}] Pass 2: {_filled_n} fields via brute-force")

                                # Pass 3: Shadow DOM JS pierce
                                if _filled_n == 0:
                                    try:
                                        _sf = await active_page.evaluate("""(d) => {
                                            let n=0;
                                            function go(root){
                                                root.querySelectorAll('input[type="email"],input[type="password"],input[type="text"],input[type="tel"],input:not([type])').forEach(inp=>{
                                                    if(inp.offsetParent===null&&inp.type!=='email'&&inp.type!=='password')return;
                                                    const h=((inp.name||'')+(inp.placeholder||'')+(inp.id||'')+(inp.getAttribute('aria-label')||'')).toLowerCase();
                                                    let v='';
                                                    if(inp.type==='email'||h.includes('email'))v=d.email;
                                                    else if(inp.type==='password')v=d.password;
                                                    else if(h.includes('first')||h.includes('fname'))v=d.first;
                                                    else if(h.includes('last')||h.includes('lname'))v=d.last;
                                                    else if(h.includes('phone')||h.includes('mobile')||h.includes('tel'))v=d.phone;
                                                    else if(h.includes('zip')||h.includes('postal'))v=d.zip;
                                                    else if(h.includes('name'))v=d.full;
                                                    if(!v)return;
                                                    try{const s=Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype,'value').set;s.call(inp,v);inp.dispatchEvent(new Event('input',{bubbles:true}));inp.dispatchEvent(new Event('change',{bubbles:true}));n++;}catch(e){}
                                                });
                                                root.querySelectorAll('*').forEach(el=>{if(el.shadowRoot)go(el.shadowRoot);});
                                            }
                                            go(document);return n;
                                        }""", {"email": config.get("email",""), "password": config.get("password",""),
                                               "first": config.get("first_name",""), "last": config.get("last_name",""),
                                               "phone": config.get("phone",""), "zip": _addr.get("zip", config.get("zip","")),
                                               "full": _full})
                                        _filled_n += (_sf or 0)
                                    except Exception:
                                        pass

                                logger.info(f"[W{worker_id}] TOTAL: {_filled_n} fields filled on {active_page.url}")

                                if _filled_n == 0:
                                    # Reset and keep watching — might be a search bar
                                    _origin_url = active_page.url
                                    logger.warning(f"[W{worker_id}] Saw inputs but filled 0 — keeping watch")
                                    continue

                                # ── CAPTCHA + SUBMIT ──────────────────────────
                                if await detect_captcha(active_page):
                                    _ci = await extract_captcha_info(active_page, url)
                                    if capsolver_key and _ci.get("sitekey"):
                                        _tok = await solve_captcha_capsolver(capsolver_key, _ci, url)
                                        if _tok: await inject_captcha_token(active_page, _ci["type"], _tok)
                                        else: await wait_for_manual_captcha(active_page, brand, worker_id, captcha_timeout)
                                    else:
                                        await wait_for_manual_captcha(active_page, brand, worker_id, captcha_timeout)

                                _url_before = active_page.url
                                submitted = await click_submit(active_page)
                                if submitted:
                                    await active_page.wait_for_timeout(1500)
                                    try:
                                        _pt = await active_page.inner_text("body", timeout=3000)
                                        _low = _pt.lower()
                                        for kw in ["already registered","already have an account","already exists","already a member"]:
                                            if kw in _low:
                                                status, error = "success", "account already exists"; break
                                        else:
                                            for kw in ["thank you for","successfully registered","successfully created",
                                                       "account created","check your email","verify your email",
                                                       "you're now a member","you are now a member","enrollment complete",
                                                       "registration complete","you're all set","you are all set",
                                                       "confirmation email","verification email sent"]:
                                                if kw in _low:
                                                    status, error = "success", "take over"; break
                                            else:
                                                if active_page.url != _url_before:
                                                    status, error = "success", "take over (redirect)"
                                                elif await detect_form_fields(active_page) < 2:
                                                    status, error = "success", "take over (form gone)"
                                                else:
                                                    status, error = "failed", "take over: form still showing"
                                    except Exception:
                                        status, error = "success", "take over (assumed)" if active_page.url != _url_before else ("failed", "take over: unknown result")
                                else:
                                    status, error = "failed", "take over: submit button not found"
                                break  # Done — exit watch loop

                        except Exception as _we:
                            logger.debug(f"[W{worker_id}] watch loop error: {_we}")

                    # Close extra tabs
                    for _extra in context.pages[1:]:
                        try: await _extra.close()
                        except Exception: pass

                    append_result(url, brand, program, status, worker_id, error)
                    if status == "success":       stats["success"] += 1
                    elif "captcha" in status:     stats["captcha"] += 1
                    elif status in ("skipped", "dry_run"): stats["skipped"] += 1
                    else:                         stats["failed"] += 1
                    stats["processed"] += 1
                    append_progress_log(worker_id, brand, program, status, error)
                    _current_workers[worker_id] = {"brand": brand, "status": "done"}
                    write_progress(True, stats)
                    await asyncio.sleep(delay)
                    continue
        except Exception:
            pass


        write_progress(True, stats)

        logger.info(f"[W{worker_id}] → {brand} / {program}")

        # ── CONTEXT HEALTH CHECK ──────────────────────────────────────────
        # After a hard timeout or crash, the browser context can die silently.
        # Every subsequent site fails instantly with "Target page, context or
        # browser has been closed" — burning through the queue doing nothing.
        # Detect this and resurrect the context before attempting the site.
        context_is_dead = False
        try:
            await page.evaluate("1")  # Cheap liveness check
        except Exception as liveness_exc:
            err_str = str(liveness_exc)
            if any(k in err_str for k in ["closed", "crashed", "destroyed", "disconnected"]):
                context_is_dead = True

        if context_is_dead:
            page, context, browser = await _resurrect_context(
                worker_id, browser, context, page
            )
            if page is None:
                # Total resurrection failure — worker is dead, exit the loop.
                # Remaining URLs will be retried on the next run.
                logger.error(f"[W{worker_id}] ❌ Could not rebuild after browser crash — worker exiting ({queue.qsize()} URLs remain in queue)")
                append_result(url, brand, program, "failed", worker_id, "browser crashed, could not rebuild — worker stopped")
                stats["failed"] += 1
                stats["processed"] += 1
                write_progress(True, stats)
                break  # ← EXIT loop, don't continue burning through queue
        # ─────────────────────────────────────────────────────────────────

        try:
            # Hard per-site cap — if ANYTHING freezes (autocomplete, stuck network
            # request, infinite spinner) the worker moves on. Must clear the full
            # successful captcha path; in interactive modes it must also clear the
            # human wait so we don't kill a site the operator is actively solving.
            hard_cap = PER_SITE_HARD_CAP_SEC
            if MANUAL_MODE:
                hard_cap = max(hard_cap, MANUAL_WAIT_SECONDS + 30, captcha_timeout + 30)
            status, error = await asyncio.wait_for(
                process_entry(page, row, config, worker_id, dry_run, capsolver_key, captcha_timeout),
                timeout=hard_cap
            )
        except asyncio.TimeoutError:
            status, error = "timeout", f"site exceeded {hard_cap}s hard limit — skipped"
            logger.warning(f"[W{worker_id}] ⏰ HARD TIMEOUT — {brand} exceeded {hard_cap}s, moving on")
            # Navigate away to reset the page state before next site.
            # If this fails with a "closed" error the page is dead —
            # flag it so the liveness check on the next iteration rebuilds.
            try:
                await page.goto("about:blank", timeout=5000)
            except Exception as nav_exc:
                if any(k in str(nav_exc) for k in ["closed", "crashed", "destroyed", "disconnected"]):
                    logger.warning(f"[W{worker_id}] 🔄 Page died during timeout reset — will rebuild next iteration")
                    # Don't try to use this page again — force immediate rebuild
                    page, context, browser = await _resurrect_context(
                        worker_id, browser, context, page
                    )
                    if page is None:
                        logger.error(f"[W{worker_id}] ❌ Rebuild failed after timeout — worker exiting")
                        append_result(url, brand, program, status, worker_id, error)
                        stats["failed"] += 1
                        stats["processed"] += 1
                        write_progress(True, stats)
                        break
        except Exception as exc:
            exc_str = str(exc)
            status, error = "failed", f"unexpected: {exc}"
            # BUG FIX: If the exception is a dead-page crash, rebuild
            # immediately instead of letting the next iteration discover it.
            if any(k in exc_str for k in ["closed", "crashed", "destroyed", "disconnected"]):
                logger.warning(f"[W{worker_id}] 🔄 Page crashed during processing — rebuilding now")
                page, context, browser = await _resurrect_context(
                    worker_id, browser, context, page
                )
                if page is None:
                    logger.error(f"[W{worker_id}] ❌ Rebuild failed after crash — worker exiting")
                    append_result(url, brand, program, status, worker_id, error)
                    stats["failed"] += 1
                    stats["processed"] += 1
                    write_progress(True, stats)
                    break

        # BUG FIX: If process_entry *returned* a navigation_error caused by
        # a dead browser (not an exception), the page is a zombie.  Detect
        # this and rebuild before the next URL.
        if status == "navigation_error" and any(k in error for k in ["closed", "crashed", "destroyed", "disconnected"]):
            logger.warning(f"[W{worker_id}] 🔄 Navigation error = dead page — rebuilding")
            page, context, browser = await _resurrect_context(
                worker_id, browser, context, page
            )
            if page is None:
                logger.error(f"[W{worker_id}] ❌ Rebuild failed — worker exiting")
                append_result(url, brand, program, status, worker_id, error)
                stats["failed"] += 1
                stats["processed"] += 1
                write_progress(True, stats)
                break

        append_result(url, brand, program, status, worker_id, error)

        if status == "success":
            stats["success"] += 1
            logger.info(f"[W{worker_id}] ✓ {brand}")
        elif "captcha" in status:
            stats["captcha"] += 1
        elif status in ("skipped", "dry_run"):
            stats["skipped"] += 1
        else:
            stats["failed"] += 1

        stats["processed"] += 1
        pct = stats["processed"] * 100 // stats["total"]
        logger.info(f"  Progress: {stats['processed']}/{stats['total']} ({pct}%)")

        # Update progress log and file
        append_progress_log(worker_id, brand, program, status, error)
        _current_workers[worker_id] = {"brand": brand, "status": "done"}
        write_progress(True, stats)

        await asyncio.sleep(delay)

    # Remove worker from tracking when done
    _current_workers.pop(worker_id, None)
    try:
        await context.close()
    except Exception:
        pass


async def health_worker(worker_id: int, queue: asyncio.Queue, browser, stats: dict):
    context = await browser.new_context(
        user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
        viewport={"width": 1280, "height": 800},
    )
    page = await context.new_page()

    while True:
        try:
            row = queue.get_nowait()
        except asyncio.QueueEmpty:
            break
        await health_check_entry(page, row, worker_id)
        stats["processed"] += 1
        if stats["processed"] % 10 == 0:
            logger.info(f"  Health scan: {stats['processed']}/{stats['total']}")

    await context.close()


# ─────────────────────────────────────────────
#  OPTIONAL STEALTH BROWSER BACKEND (Camoufox)
# ─────────────────────────────────────────────
# Camoufox is an anti-detect Firefox fork. It's opt-in (LB_BROWSER=camoufox or
# --browser camoufox). If the package/browser isn't installed, or a launch
# fails, we return None and the caller transparently falls back to Chromium — a
# run never hard-fails just because Camoufox is missing.
_camoufox_managers = []  # keep AsyncCamoufox context managers alive until shutdown


async def _launch_camoufox_browser(headless: bool):
    """Launch a Camoufox stealth browser; return a Playwright Browser, or None."""
    try:
        from camoufox.async_api import AsyncCamoufox
    except ImportError:
        logger.warning("LB_BROWSER=camoufox but the 'camoufox' package isn't installed. "
                       "Install: pip install camoufox[geoip] && python -m camoufox fetch. "
                       "Falling back to Chromium for this run.")
        return None
    try:
        cm = AsyncCamoufox(
            headless=headless,
            humanize=True,               # human-like cursor motion
            os=("windows", "macos"),     # randomize the spoofed platform per launch
            locale="en-US",
            geoip=True,                  # align timezone/locale with the exit IP
        )
        browser = await cm.__aenter__()  # AsyncCamoufox yields a Playwright Browser
        _camoufox_managers.append(cm)
        logger.info("🦊 Camoufox stealth browser launched")
        return browser
    except Exception as e:
        logger.error(f"Camoufox launch failed ({e}) — falling back to Chromium.")
        return None


async def _close_camoufox_managers():
    for cm in _camoufox_managers:
        try:
            await cm.__aexit__(None, None, None)
        except Exception:
            pass
    _camoufox_managers.clear()


# ─────────────────────────────────────────────
#  MAIN MODES
# ─────────────────────────────────────────────

async def run_signups(args: argparse.Namespace) -> None:
    global CONFIG_PATH, RESULTS_LOG_PATH, PROGRESS_PATH
    if args.config:   CONFIG_PATH       = Path(args.config)
    if args.results:  RESULTS_LOG_PATH  = Path(args.results)
    if args.progress: PROGRESS_PATH     = Path(args.progress)

    # Clear any stale stop flag from a previous killed run.
    # If this file exists when we start, workers would exit immediately.
    try:
        STOP_FLAG_PATH.unlink(missing_ok=True)
    except Exception:
        pass

    # Apply manual mode flag
    global MANUAL_MODE
    if getattr(args, "manual", False):
        MANUAL_MODE = True
        logger.info("🙋 MANUAL MODE — bot will wait for you to navigate to each signup form")

    # Load permanently-dead URLs so workers skip them instantly
    load_dead_urls()
    if _dead_urls:
        logger.info(f"Dead URL cache: {len(_dead_urls)} permanently-failed URLs will be skipped")

    config = load_config()

    if config.get("email", "").upper().endswith("EXAMPLE.COM") or config.get("first_name", "").startswith("YOUR_"):
        logger.error("Config has placeholder values. Edit config.json first.")
        sys.exit(1)

    capsolver_key = "" if args.no_capsolver else load_capsolver_key()
    if capsolver_key:
        logger.info("✅ CapSolver API key loaded — CAPTCHAs will be auto-solved")
    else:
        logger.info("⚠️  No CapSolver key — CAPTCHAs will require manual solving")

    df = load_csv(smart_sort=True)

    # Load per-category limits if provided
    cat_limits = {}
    if args.category_limits and Path(args.category_limits).exists():
        try:
            with open(args.category_limits, encoding="utf-8") as f:
                cat_limits = json.load(f)
            logger.info(f"Category limits loaded: {len(cat_limits)} categories configured")
        except Exception as e:
            logger.warning(f"Could not read category limits: {e}")

    if args.retry:
        failed_urls = load_failed_urls()
        df = df[df["Direct Sign-Up URL"].str.strip().isin(failed_urls)].reset_index(drop=True)
    else:
        already = load_already_processed()
        # ── CRITICAL ORDER: filter already-done FIRST, then apply limit ──
        # If limit is applied first, already-done URLs eat into the slot budget
        # and the bot never advances past them on subsequent runs.
        if args.start_index > 0:
            df = df.iloc[args.start_index:].reset_index(drop=True)
        # Remove already-successful URLs BEFORE slicing to limit
        df = df[~df["Direct Sign-Up URL"].str.strip().isin(already)].reset_index(drop=True)
        if already:
            logger.info(f"Queue after skipping {len(already)} already-successful: {len(df)} sites remaining")
        # Now apply limit to the remaining unprocessed sites
        if args.limit:
            df = df.iloc[:args.limit].reset_index(drop=True)

    # Apply per-category limits — slice each category to requested count
    if cat_limits:
        parts = []
        for cat, lim in cat_limits.items():
            chunk = df[df["Category"].str.strip() == cat]
            if lim > 0:
                chunk = chunk.iloc[:lim]
            if lim != 0:  # 0 means skip entirely
                parts.append(chunk)
        # Include any categories not mentioned in limits at full count
        mentioned = set(cat_limits.keys())
        rest = df[~df["Category"].str.strip().isin(mentioned)]
        if parts:
            df = pd.concat(parts + [rest]).drop_duplicates(subset=["Direct Sign-Up URL"]).reset_index(drop=True)
        else:
            df = rest.reset_index(drop=True)
        logger.info(f"After category limits: {len(df)} sites queued")

    total = len(df)
    if total == 0:
        logger.info("Nothing to process.")
        return

    workers = min(args.workers, total)

    print(f"\n{'='*60}")
    print(f"  LoyaltyBot Parallel Auto-Signup")
    print(f"  Mode      : {'RETRY' if args.retry else 'DRY RUN' if args.dry_run else 'LIVE'}")
    print(f"  Workers   : {workers} browser windows")
    print(f"  Sites     : {total}")
    print(f"  Queue     : Smart-sorted (easy first)")
    print(f"  CAPTCHA   : {'CapSolver (auto)' if capsolver_key else 'Manual'}")
    print(f"  Est. time : ~{max(1, (total // workers) * 8)}s")
    print(f"{'='*60}\n")

    queue = asyncio.Queue()
    for _, row in df.iterrows():
        queue.put_nowait(row.to_dict())

    stats = {"success": 0, "failed": 0, "captcha": 0, "skipped": 0, "processed": 0, "total": total}

    # Initialize progress tracking
    global _start_time, _progress_log, _current_workers
    _start_time = time.time()
    _progress_log = []
    _current_workers = {}
    write_progress(True, stats)

    async with async_playwright() as p:
        global _playwright_instance, _headless_mode
        _playwright_instance = p
        _headless_mode = args.headless

        async def launch_browser():
            # Opt-in stealth backend. Falls back to Chromium if unavailable.
            if getattr(args, "browser", "chromium") == "camoufox":
                cam = await _launch_camoufox_browser(args.headless)
                if cam is not None:
                    return cam
            return await p.chromium.launch(
                headless=args.headless,
                args=[
                    "--disable-blink-features=AutomationControlled",
                    "--disable-infobars",
                    "--exclude-switches=enable-automation",
                    "--disable-automation",
                    "--disable-dev-shm-usage",
                    "--no-sandbox",
                    "--disable-setuid-sandbox",
                    "--no-first-run",
                    "--no-zygote",
                    "--disable-gpu",
                    "--window-size=1920,1080",
                    "--start-maximized",
                    "--disable-features=IsolateOrigins,site-per-process",
                    "--disable-ipc-flooding-protection",
                    "--disable-renderer-backgrounding",
                    "--disable-backgrounding-occluded-windows",
                    "--disable-background-timer-throttling",
                    "--disable-extensions",
                    "--disable-popup-blocking",
                    "--ignore-certificate-errors",
                    "--allow-running-insecure-content",
                    "--lang=en-US",
                ],
            )

        # Each worker gets its OWN browser process.
        # Previously all workers shared one browser — if it crashed, ALL workers
        # died simultaneously and burned through the queue doing nothing.
        # Now one crash takes out one worker max; the others keep running.
        browsers = []
        for _ in range(workers):
            b = await launch_browser()
            browsers.append(b)

        tasks = [
            asyncio.create_task(
                signup_worker(i + 1, queue, config, browsers[i], stats, args.dry_run, args.delay, capsolver_key, args.captcha_timeout)
            )
            for i in range(workers)
        ]
        await asyncio.gather(*tasks)

        for b in browsers:
            try:
                await b.close()
            except Exception:
                pass
        await _close_camoufox_managers()  # tidy Camoufox temp profiles, if any

    # Mark progress as finished
    write_progress(False, stats)

    # Clean up stop flag if it exists
    try:
        STOP_FLAG_PATH.unlink(missing_ok=True)
    except Exception:
        pass

    # Clean up shared aiohttp session
    global _aiohttp_session
    if _aiohttp_session and not _aiohttp_session.closed:
        await _aiohttp_session.close()
        _aiohttp_session = None

    print(f"\n{'='*60}")
    print(f"  RESULTS")
    print(f"  Total     : {stats['processed']}")
    print(f"  Success   : {stats['success']}")
    print(f"  Failed    : {stats['failed']}")
    print(f"  CAPTCHA   : {stats['captcha']}")
    print(f"  Skipped   : {stats['skipped']}")
    print(f"  Log       : {RESULTS_LOG_PATH}")
    print(f"{'='*60}\n")


async def run_health_check(args: argparse.Namespace) -> None:
    df = load_csv(smart_sort=False)
    if args.limit:
        df = df.iloc[:args.limit].reset_index(drop=True)

    if HEALTH_LOG_PATH.exists():
        checked = set()
        with open(HEALTH_LOG_PATH, newline="", encoding="utf-8") as f:
            for row in csv.DictReader(f):
                checked.add(row.get("url", "").strip())
        before = len(df)
        df = df[~df["Direct Sign-Up URL"].str.strip().isin(checked)].reset_index(drop=True)
        logger.info(f"Skipping {before - len(df)} already-checked URLs")

    total = len(df)
    if total == 0:
        logger.info("All URLs already checked.")
        return

    workers = min(args.workers, total)

    print(f"\n{'='*60}")
    print(f"  Site Health Check")
    print(f"  Workers : {workers}")
    print(f"  Sites   : {total}")
    print(f"{'='*60}\n")

    queue = asyncio.Queue()
    for _, row in df.iterrows():
        queue.put_nowait(row.to_dict())

    stats = {"processed": 0, "total": total}

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True, args=["--disable-blink-features=AutomationControlled"])
        tasks = [asyncio.create_task(health_worker(i + 1, queue, browser, stats)) for i in range(workers)]
        await asyncio.gather(*tasks)
        await browser.close()

    if HEALTH_LOG_PATH.exists():
        results = pd.read_csv(HEALTH_LOG_PATH, dtype=str).fillna("")
        counts = Counter(results["status"])
        print(f"\n{'='*60}")
        print(f"  HEALTH CHECK RESULTS")
        for status, count in counts.most_common():
            icon = {"healthy": "✅", "captcha": "🔒", "no_form": "⚠️", "dead": "💀", "timeout": "⏰", "error": "❌"}.get(status, "?")
            print(f"  {icon} {status:15} : {count}")
        print(f"  Total           : {len(results)}")
        print(f"{'='*60}\n")


def run_report(args: argparse.Namespace) -> None:
    """Read a results CSV and print the bucket breakdown, with the headline
    *fillable-only* success rate (junk + dead sites excluded from the
    denominator, matching how the 80-90% target is defined). No PII is printed —
    only counts and status/reason buckets."""
    path = Path(args.results) if args.results else RESULTS_LOG_PATH
    if not path.exists():
        print(f"\nNo results CSV at {path} — run a batch first (or pass --results PATH).\n")
        return

    rows = []
    with open(path, newline="", encoding="utf-8") as f:
        for row in csv.DictReader(f):
            rows.append(row)
    if not rows:
        print(f"\n{path} is empty.\n")
        return

    def bucket_fail(err: str) -> str:
        e = (err or "").lower()
        if "no form fields" in e:              return "no form fields (recognition)"
        if "form still present" in e or "error text on form" in e:
            return "form still present (rejected)"
        if "submit button not found" in e:     return "submit button not found"
        if "token injection" in e or "capsolver" in e:
            return "captcha token failed"
        return "other"

    def bucket_skip(err: str) -> str:
        e = (err or "").lower()
        if "does not resolve" in e or "dead url" in e or "invalid url" in e:
            return "dead / invalid URL"
        if "permanently failed" in e:          return "permanently failed (prior run)"
        return "junk / not a fillable form"

    from collections import Counter
    status_ct   = Counter()
    fail_reason = Counter()
    skip_reason = Counter()
    for r in rows:
        st = (r.get("status") or "").strip().lower()
        err = r.get("error") or ""
        status_ct[st] += 1
        if st == "failed":
            fail_reason[bucket_fail(err)] += 1
        elif st == "skipped":
            skip_reason[bucket_skip(err)] += 1

    total    = len(rows)
    success  = status_ct.get("success", 0)
    skipped  = status_ct.get("skipped", 0)
    captcha  = status_ct.get("captcha_failed", 0) + status_ct.get("captcha_skipped", 0)
    timeout  = status_ct.get("timeout", 0)
    failed   = status_ct.get("failed", 0)
    fillable = total - skipped          # denominator: only real signup forms

    bar = "=" * 60
    print(f"\n{bar}\n  LOYALTYBOT RUN REPORT — {path.name}\n{bar}")
    print(f"  Total rows processed : {total}")
    print(f"  Skipped (junk/dead)  : {skipped}   (excluded from rate)")
    print(f"  Fillable attempts    : {fillable}")
    print(f"{'-'*60}")
    print(f"  Success              : {success}")
    print(f"  Failed               : {failed}")
    print(f"  CAPTCHA unsolved     : {captcha}")
    print(f"  Timeout              : {timeout}")
    print(f"{'-'*60}")
    if fillable > 0:
        print(f"  >> FILLABLE-ONLY SUCCESS RATE : {success/fillable*100:5.1f}%  ({success}/{fillable})")
    else:
        print(f"  >> FILLABLE-ONLY SUCCESS RATE : n/a (no fillable attempts)")
    print(f"     (raw over all rows          : {success/total*100:5.1f}%  ({success}/{total}))")

    if fail_reason:
        print(f"{'-'*60}\n  Failure reasons:")
        for reason, n in fail_reason.most_common():
            print(f"    {n:>6}  {reason}")
    if skip_reason:
        print(f"{'-'*60}\n  Skip reasons:")
        for reason, n in skip_reason.most_common():
            print(f"    {n:>6}  {reason}")
    print(f"{bar}\n")


async def main(args: argparse.Namespace) -> None:
    if args.report:
        run_report(args)
    elif args.health_check:
        await run_health_check(args)
    else:
        await run_signups(args)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="LoyaltyBot — Parallel signup with CapSolver, smart queue, retry, health check")
    parser.add_argument("--manual", action="store_true",
                        help="Manual Mode: bot waits for you to navigate to signup form, then auto-fills and submits")
    parser.add_argument("--retry", action="store_true", help="Re-run only failed sites")
    parser.add_argument("--health-check", action="store_true", help="Scan URLs for health")
    parser.add_argument("--report", action="store_true",
                        help="Read the results CSV and print the bucket breakdown + fillable-only success rate (no run)")
    parser.add_argument("--dry-run", action="store_true", help="Fill forms, don't submit")
    parser.add_argument("--no-capsolver", action="store_true", help="Disable CapSolver (manual CAPTCHA mode)")
    parser.add_argument("--workers", type=int, default=DEFAULT_WORKERS)
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--start-index", type=int, default=0)
    parser.add_argument("--delay", type=float, default=DEFAULT_DELAY_SECONDS)
    parser.add_argument("--captcha-timeout", type=int, default=CAPTCHA_TIMEOUT_SEC)
    parser.add_argument("--headless", type=lambda v: v.lower() != "false", default=False)
    parser.add_argument("--browser", choices=["chromium", "camoufox"],
                        default=os.environ.get("LB_BROWSER", "chromium"),
                        help="Browser backend. 'camoufox' = stealth Firefox "
                             "(needs: pip install camoufox[geoip] && python -m camoufox fetch). "
                             "Falls back to Chromium if unavailable.")
    # Per-client overrides (used by dashboard server for multi-client runs)
    parser.add_argument("--config",   type=str, default=None, help="Path to client config.json")
    parser.add_argument("--progress", type=str, default=None, help="Path to progress.json output")
    parser.add_argument("--results",  type=str, default=None, help="Path to results CSV output")
    parser.add_argument("--category-limits", type=str, default=None, help="Path to JSON {category: limit}")
    return parser.parse_args()


if __name__ == "__main__":
    asyncio.run(main(parse_args()))
