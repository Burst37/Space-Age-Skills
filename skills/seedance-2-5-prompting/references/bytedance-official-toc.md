# Dreamina Seedance 2.5 Prompt Writing Guide — ByteDance official page (outline only)

**Source:** `bytedance.larkoffice.com/docx/A88jd0B47oAd8zxWp5ycZFMfnxh` — "Dreamina Seedance 2.5 Prompt Writing Guide," Feishu Docs, last updated Aug 12.
**Official release / full documentation:** https://docs.byteplus.com/en/docs/ModelArk/2607689

## Important caveat

This file was reconstructed from a browser-saved `.mht` snapshot of the ByteDance Feishu doc. Feishu Docs renders body paragraphs dynamically, and the snapshot only captured the **table of contents headings** and the short intro/disclaimer paragraph below — not the actual template text, examples, or step-by-step instructions under each heading. Treat the outline below as a map of what the official guide covers, not as the guide's content. For the real body text, open the official release link above or the Feishu doc directly.

## Outline captured from the snapshot

1. Basic Prompting Techniques
   1.1 The Core Prompt Formula (Basic Template, Example)
   1.2 When Using Reference Materials, Prepare Them and Define Their Roles (Material Quantity and Selection, Define Each Material's Role, Reference Role Template, Example)
   1.3 Special Syntax for Audio and Text (Dialogue, Language Reinforcement)
2. New Capabilities in Dreamina Seedance 2.5
   2.1 Multi-Reference Creation: Tell the Model Which Materials to Use in Each Scene (Step 1: Name and Map Each Subject Individually; Step 2: Group Materials by Type; Step 3: Create a Centralized Profile for Important Subjects; Step 4: Select References by Scene)
   2.2 30-Second Videos: Organize Events with Stages and End States (Long-Video Template, Example, Timestamps and Pacing Control)
   2.3 Parameter Rules for Editing, First/Last-Frame, and Extension Tasks
   2.4 Video Editing: Define the Master Video, Edit Scope, and Content to Preserve (General Editing Pattern Template/Example, Subject Replacement Template/Example, Background Replacement Template/Example, Audio Editing)
   2.5 Video Extension: Align the Boundary Frame Before Describing New Content (Forward Extension — Basic Template/Example/With Additional Reference Materials; Backward Extension — Basic Template/Example)

## Intro paragraph (captured verbatim)

> This guide helps users structure prompts more clearly, improving the model's understanding and execution of creative intent, reference-material roles, subject relationships, event sequences, and camera direction. Prompt writing primarily affects instruction following, material consistency, and generation controllability; it does not directly change the model's inherent capability limits.
>
> Visual quality, human realism, physical realism, complex camera movements, and cuts are still influenced by model capability, input materials, and generation randomness. The recommendations on visual style, emotional performance, and cinematography are intended to reduce ambiguity and increase the likelihood of achieving the desired result; they do not guarantee a specific level of visual quality or camera execution.

## Official skill (not installed by this repo)

The doc recommends ByteDance's own packaged skill, installable via:

```
npx --yes skills@latest add \
  "https://arkdocs-en.tos-ap-southeast-1.volces.com/skills/" \
  --skill sd25-pe \
  --yes
```

Then in an AI chat box: `/sd25-pe` + your prompt.

This command was **not run** as part of building this skill — it's documented here for reference only, in case you want to fetch ByteDance's actual packaged version later. The main `SKILL.md` in this folder is a synthesis built from the captured outline above plus a separately-sourced third-party prompt (see `director-engine-system-prompt.md`), not a copy of ByteDance's own skill package.
