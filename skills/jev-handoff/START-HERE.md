# Give your AI agents Jev reflexes

> **This is Jack Roberts' original kit, unmodified.** The Space Age fork's
> own changes (resume support, retries, a second provider, review.csv,
> tests) are documented in `README.md` in this same folder — read that one
> first if you got here from the Space Age Skills repo.

Astra or Claude designs the task. Jev handles the repeated decisions. Your agent reviews the exceptions.

## Install

Copy `jev-handoff` into `~/.codex/skills/` for Codex, or `~/.claude/skills/` for Claude Code. The folder must contain `SKILL.md` directly. Open a new task after installing.

Set `OPENROUTER_API_KEY` in the terminal environment that runs the agent. Keep the key out of chat, source files and this kit. Python 3.10 or later is the only runner dependency.

## Try it

In Codex, start with `$jev-handoff`. In Claude Code, start with `/jev-handoff`. Then paste:

> Classify the 20 synthetic spam examples included in this skill. Validate the form with a dry run, then call Jev using my loaded OpenRouter key. Keep full results on disk. Show me total time, reported cost, errors and uncertain cases. Take no action on messages.

This authorizes one sample of 20 API requests. A dry run by itself makes no paid requests.

## Run it directly

From inside the `jev-handoff` folder:

```bash
python3 scripts/jev_run.py --input examples/spam-emails.jsonl --form examples/spam-form.json --output results/spam-01 --dry-run
```

Remove `--dry-run` for a paid run. Use a new output directory each time. Swap `spam` for `owner`, `urgency`, `buyer` or `sponsor` to try another form. Each example set contains 20 synthetic emails.

## What you get

`results.jsonl` stores answers, probabilities, usage and errors. `summary.json` reports wall time, median latency, reported cost and records needing review. No real email service is connected by this kit.

The skill works in an agent with terminal and file access. ChatGPT and Claude web chats require a separate tool connection. Jev is not installed inside the model itself.

A valid schema can still contain a wrong answer. Tune criteria on a sample, then test fresh examples. Reported successful-request usage can exclude costs incurred by failed or cancelled requests.

Made for Jack Roberts. Source details and current provider links are in `references/integration.md`.
