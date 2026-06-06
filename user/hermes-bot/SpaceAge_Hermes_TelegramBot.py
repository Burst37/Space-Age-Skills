#!/usr/bin/env python3
"""
SpaceAge_Hermes_TelegramBot.py
Space Age AI Solutions — Hermes Agent Telegram Controller

Commands:
    /run <task>        — fire Hermes on a task (new session)
    /resume <task>     — resume last session for this chat
    /status            — show active jobs
    /sessions          — list saved sessions
    /reset             — clear session for this chat
    /skills            — list available SA- skills
    /sync              — re-sync skills from source dir
    /kill              — stop running job for this chat
    /help              — command list

One job per chat at a time. Jobs run async — bot stays responsive.

Required env vars:
    TELEGRAM_BOT_TOKEN   — bot token from @BotFather (required, no default)
    TELEGRAM_ALLOWED_IDS — comma-separated chat IDs to whitelist (empty = allow all)
    LOG_LEVEL            — logging level (default: INFO)
"""

import os
import sys
import asyncio
import logging
import json
from pathlib import Path
from datetime import datetime, timezone
from telegram import Update
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    ContextTypes,
    filters,
)

# ── Path setup ──────────────────────────────────────────────────────────────────────
sys.path.insert(0, str(Path(__file__).parent))
from hermes_wrapper import HermesRunner, sync_skills, list_skills

# ── Config ────────────────────────────────────────────────────────────────────────────
BOT_TOKEN    = os.environ.get("TELEGRAM_BOT_TOKEN", "")   # no hardcoded default
ALLOWED_IDS  = os.environ.get("TELEGRAM_ALLOWED_IDS", "")   # comma-sep chat IDs; empty = allow all
LOG_LEVEL    = os.environ.get("LOG_LEVEL", "INFO")

logging.basicConfig(
    level=getattr(logging, LOG_LEVEL, logging.INFO),
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%S",
)
log = logging.getLogger("hermes_bot")

# ── Auth ─────────────────────────────────────────────────────────────────────────────────
ALLOWED_SET: set[int] = set()
if ALLOWED_IDS.strip():
    for x in ALLOWED_IDS.split(","):
        x = x.strip()
        if x.lstrip("-").isdigit():
            ALLOWED_SET.add(int(x))

def is_allowed(update: Update) -> bool:
    if not ALLOWED_SET:
        return True
    return update.effective_chat.id in ALLOWED_SET

# ── Job tracker ───────────────────────────────────────────────────────────────────
active_jobs: dict[int, dict] = {}

# ── Runner ───────────────────────────────────────────────────────────────────────────
runner = HermesRunner(auto_sync_skills=False)

# ── Helpers ─────────────────────────────────────────────────────────────────────────
def _run_key(chat_id: int, suffix: str = "") -> str:
    ts = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
    return f"tg_{chat_id}_{ts}{suffix}"

def _format_result(result: dict) -> str:
    lines = []
    if result.get("response"):
        lines.append(result["response"])
    lines.append("")
    meta = []
    if result.get("session_id"):
        meta.append(f"session: `{result['session_id'][:20]}...`")
    if result.get("input_tokens"):
        meta.append(f"tokens: {result['input_tokens']}↑ {result['output_tokens']}↓")
    if result.get("cost_usd") is not None:
        meta.append(f"cost: ${result['cost_usd']:.4f}")
    if result.get("timed_out"):
        meta.append("⚠️ timed out")
    if result.get("error_message"):
        meta.append(f"error: {result['error_message'][:200]}")
    if meta:
        lines.append("─── " + " | ".join(meta))
    return "\n".join(lines).strip()

async def _send_long(update: Update, text: str):
    """Send text, splitting at 4000 chars if needed."""
    MAX = 4000
    if not text:
        await update.message.reply_text("_(no response)_", parse_mode="Markdown")
        return
    for i in range(0, len(text), MAX):
        chunk = text[i:i+MAX]
        try:
            await update.message.reply_text(chunk, parse_mode="Markdown")
        except Exception:
            await update.message.reply_text(chunk)

# ── Job execution ─────────────────────────────────────────────────────────────────
async def _run_job(
    update: Update,
    query: str,
    run_key: str,
    resume: bool,
):
    chat_id = update.effective_chat.id
    try:
        result = await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: runner.run(query=query, run_key=run_key, resume=resume),
        )
        text = _format_result(result)
        await _send_long(update, text)
    except asyncio.CancelledError:
        await update.message.reply_text("🛑 Job cancelled.")
    except Exception as e:
        log.exception("Job error")
        await update.message.reply_text(f"❌ Error: {e}")
    finally:
        active_jobs.pop(chat_id, None)

# ── Commands ────────────────────────────────────────────────────────────────────
async def cmd_help(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update):
        return
    text = (
        "*Hermes Agent — Space Age Pipeline*\n\n"
        "`/run <task>` — new session\n"
        "`/resume <task>` — continue last session\n"
        "`/status` — active jobs\n"
        "`/sessions` — saved sessions\n"
        "`/reset` — clear session for this chat\n"
        "`/skills` — list SA- skills\n"
        "`/sync` — re-sync skills\n"
        "`/kill` — stop running job\n"
        "`/help` — this message\n\n"
        "_Plain text also runs as /run_"
    )
    await update.message.reply_text(text, parse_mode="Markdown")

async def cmd_run(update: Update, ctx: ContextTypes.DEFAULT_TYPE, resume: bool = False):
    if not is_allowed(update):
        return
    chat_id = update.effective_chat.id

    query = " ".join(ctx.args).strip() if ctx.args else ""
    if not query:
        await update.message.reply_text("Usage: `/run <your task>`", parse_mode="Markdown")
        return

    if chat_id in active_jobs:
        await update.message.reply_text(
            f"⚠️ Job already running: _{active_jobs[chat_id]['query'][:60]}_\n"
            "Use `/kill` to cancel it first.",
            parse_mode="Markdown",
        )
        return

    run_key = f"tg_{chat_id}" if resume else _run_key(chat_id)
    label = "▶️ Resuming" if resume else "🚀 Starting"
    await update.message.reply_text(
        f"{label}: _{query[:80]}_\n`run_key: {run_key}`",
        parse_mode="Markdown",
    )

    task = asyncio.create_task(_run_job(update, query, run_key, resume=resume))
    active_jobs[chat_id] = {
        "task": task,
        "query": query,
        "run_key": run_key,
        "started": datetime.now(timezone.utc).isoformat(),
    }

async def cmd_resume(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    await cmd_run(update, ctx, resume=True)

async def cmd_status(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update):
        return
    chat_id = update.effective_chat.id
    job = active_jobs.get(chat_id)
    if not job:
        await update.message.reply_text("✅ No active jobs.")
        return
    elapsed = ""
    try:
        started = datetime.fromisoformat(job["started"])
        secs = int((datetime.now(timezone.utc) - started).total_seconds())
        elapsed = f" ({secs}s elapsed)"
    except Exception:
        pass
    await update.message.reply_text(
        f"⏳ Running{elapsed}:\n_{job['query'][:80]}_\n`{job['run_key']}`",
        parse_mode="Markdown",
    )

async def cmd_sessions(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update):
        return
    sessions = runner.list_sessions()
    if not sessions:
        await update.message.reply_text("No saved sessions.")
        return
    lines = ["*Saved Sessions*\n"]
    for key, val in sessions.items():
        sid = val.get("session_id", "?")[:20]
        ts  = val.get("updated_at", "")[:19]
        lines.append(f"`{key}`\n  session: `{sid}...`\n  updated: {ts}\n")
    await update.message.reply_text("\n".join(lines), parse_mode="Markdown")

async def cmd_reset(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update):
        return
    chat_id = update.effective_chat.id
    run_key = f"tg_{chat_id}"
    runner.reset_session(run_key)
    await update.message.reply_text(f"🗑 Session cleared: `{run_key}`", parse_mode="Markdown")

async def cmd_kill(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update):
        return
    chat_id = update.effective_chat.id
    job = active_jobs.get(chat_id)
    if not job:
        await update.message.reply_text("No active job to kill.")
        return
    job["task"].cancel()
    active_jobs.pop(chat_id, None)
    await update.message.reply_text("🛑 Job killed.")

async def cmd_skills(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update):
        return
    await update.message.reply_text("🔍 Scanning skills...")
    skills = list_skills()
    if not skills:
        await update.message.reply_text("No skills found.")
        return
    lines = [f"*{len(skills)} Skills Available*\n"]
    for s in skills:
        desc = s["description"][:60] if s["description"] else ""
        lines.append(f"`{s['key']}`\n_{desc}_\n")
    await _send_long(update, "\n".join(lines))

async def cmd_sync(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    if not is_allowed(update):
        return
    await update.message.reply_text("🔄 Syncing skills...")
    summary = await asyncio.get_event_loop().run_in_executor(None, sync_skills)
    synced  = len(summary.get("synced", []))
    skipped = len(summary.get("skipped", []))
    errors  = summary.get("errors", [])
    msg = f"✅ Synced: {synced} | Skipped: {skipped}"
    if errors:
        msg += f"\n⚠️ Errors:\n" + "\n".join(errors[:5])
    await update.message.reply_text(msg)

async def handle_text(update: Update, ctx: ContextTypes.DEFAULT_TYPE):
    """Plain text → treat as /run"""
    if not is_allowed(update):
        return
    if not update.message or not update.message.text:
        return
    text = update.message.text.strip()
    if not text or text.startswith("/"):
        return
    ctx.args = text.split()
    await cmd_run(update, ctx, resume=False)

# ── Main ──────────────────────────────────────────────────────────────────────────────
def main():
    if not BOT_TOKEN:
        log.error("TELEGRAM_BOT_TOKEN is not set. Export this env var before starting.")
        sys.exit(1)

    log.info("Starting Space Age Hermes Telegram Bot...")
    log.info(f"Auth: {'restricted to ' + ALLOWED_IDS if ALLOWED_SET else 'open (set TELEGRAM_ALLOWED_IDS to restrict)'}")

    app = Application.builder().token(BOT_TOKEN).build()

    app.add_handler(CommandHandler("start",   cmd_help))
    app.add_handler(CommandHandler("help",    cmd_help))
    app.add_handler(CommandHandler("run",     cmd_run))
    app.add_handler(CommandHandler("resume",  cmd_resume))
    app.add_handler(CommandHandler("status",  cmd_status))
    app.add_handler(CommandHandler("sessions",cmd_sessions))
    app.add_handler(CommandHandler("reset",   cmd_reset))
    app.add_handler(CommandHandler("kill",    cmd_kill))
    app.add_handler(CommandHandler("skills",  cmd_skills))
    app.add_handler(CommandHandler("sync",    cmd_sync))
    app.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_text))

    log.info("Bot polling...")
    app.run_polling(drop_pending_updates=True)

if __name__ == "__main__":
    main()
