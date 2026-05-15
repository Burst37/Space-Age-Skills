---
name: autoresearch
description: Autonomous AI research loop by Andrej Karpathy — AI agents iteratively run experiments, evaluate results, and keep improvements automatically. Use IMMEDIATELY when the user wants to optimize prompts, improve skill performance, run ML experiments autonomously, or do iterative self-improvement of any system with a measurable objective. Also trigger for "let the AI figure it out", "run experiments overnight", "autonomous optimization", "iterative improvement loop", or any request to systematically find the best version of something through repeated testing.
version: 1.0
updated: 2026-05-15
---

# Autoresearch — Autonomous Improvement Loop

Andrej Karpathy's framework for AI agents to autonomously run experiments and keep improvements.

**GitHub:** https://github.com/karpathy/autoresearch

## Core Concept

```
1. Define an objective function (measurable score)
2. Agent modifies train.py (ONE file only)
3. Run experiment for fixed time budget (5 min default)
4. Score the result
5. Keep if better, discard if worse
6. Repeat 100x while you sleep
```

## Project Structure

```
prepare.py    — constants, data prep, runtime utilities (DO NOT MODIFY)
train.py      — model/optimizer/training loop (agent modifies THIS)
program.md    — agent instructions (your "skill")
pyproject.toml — dependencies
```

## Setup

```bash
git clone https://github.com/karpathy/autoresearch
cd autoresearch
pip install -e .

# Spin up Claude/Codex with ALL permissions disabled
# Then prompt: "Hi have a look at program.md and let's kick off a new experiment! let's do the setup first."
```

## Key Design Choices

- **Single file to modify** — agent only touches `train.py`. Keeps scope manageable, diffs reviewable.
- **Fixed time budget** — always runs exactly 5 minutes. Makes experiments directly comparable.
- **Self-contained** — no external dependencies beyond PyTorch. One GPU, one file, one metric.

## Applying Autoresearch to Non-ML Tasks

The loop generalizes to any system with a measurable score:

| Application | Objective Function | File Agent Modifies |
|-------------|-------------------|---------------------|
| Prompt optimization | Output quality score (0-10) | prompt.md |
| Skill improvement | Trigger rate % | SKILL.md description |
| Code performance | Benchmark runtime | algorithm.py |
| RAG quality | Retrieval accuracy | rag_pipeline.py |

## Running on Smaller Hardware

For Mac/non-H100: Use TinyStories dataset, reduce vocab_size (4096→256), lower MAX_SEQ_LEN to 256.
See forks for reduced-compute adaptations.
