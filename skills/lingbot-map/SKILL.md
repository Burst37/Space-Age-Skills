---
name: lingbot-map
description: LingBot-Map, a feed-forward 3D reconstruction research model (streaming/geometric context transformer) from Robbyant, published with an arXiv paper and HuggingFace weights. Use when evaluating GPU-based 3D reconstruction from video/images, or to understand its hardware requirements before attempting to run it.
source: https://github.com/Robbyant/lingbot-map
---

## Overview

LingBot-Map is a feed-forward 3D foundation model for streaming 3D reconstruction (paper: arXiv:2604.14141). This is a research codebase with published model weights (HuggingFace / ModelScope), not a self-hostable web app or agent tool — there is no docker-compose, no server mode, no "replaces $X SaaS" angle here. Apache-2.0 licensed.

**Read this before planning to run it — verified from the actual `README.md` and `pyproject.toml`:** it requires an NVIDIA GPU with CUDA 12.8, PyTorch 2.8.0, and (for the batch rendering pipeline) NVIDIA Kaolin, which needs building from source on any PyTorch version newer than the pinned one. This will not run on the Space Age VPS (146.190.78.120) — that's a CPU-only DigitalOcean droplet. Running this needs a GPU cloud instance (e.g. Lambda, RunPod, a GPU-enabled DigitalOcean droplet, or a local machine with an NVIDIA card).

## Setup (GPU machine only)

```bash
git clone https://github.com/Robbyant/lingbot-map.git
cd lingbot-map

pip install torch==2.8.0 torchvision==0.23.0 --index-url https://download.pytorch.org/whl/cu128
pip install -e .

# Recommended for efficient streaming inference (paged KV cache attention):
pip install --index-url https://pypi.org/simple flashinfer-python

# Optional: visualization deps
pip install -e ".[vis]"
```

Download weights from HuggingFace (`robbyant/lingbot-map`) or ModelScope (`Robbyant/lingbot-map`) — three checkpoint variants: `lingbot-map-long` (recommended, better for long sequences), `lingbot-map` (balanced), `lingbot-map-stage1` (loadable into the base VGGT model for bidirectional inference).

Run inference with `demo.py` once weights are in place — see the repo's `example/` folder for input format.

## When this is (and isn't) worth pursuing

This is a research artifact, not a product — there's no obvious "bill it replaces" the way the other repos in this Skills folder do. It's worth evaluating only if there's an actual project need for streaming 3D reconstruction from video/images (robotics, spatial mapping, AR/VR content pipelines). If that need doesn't currently exist in the Space Age pipeline, this is a "watch, don't deploy" entry — note it and move on rather than provisioning GPU infrastructure speculatively.

## Gotchas (from source inspection)

- PyTorch version is a hard pin for the batch renderer: anything newer than 2.8.0 means building NVIDIA Kaolin from source, which is real friction, not a config tweak. Stick to the pinned version unless only running `demo.py`.
- FlashInfer JIT-compiles CUDA kernels on first use — expect a slower first inference run while it compiles, faster after.
- Apache-2.0 is permissive — no license blocker to using outputs commercially if a real use case emerges.
