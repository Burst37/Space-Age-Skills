# Kling Skill (Kling 4.0 prompt builder)

Turns any subject, idea or reference image into production-grade Kling 4.0 video prompts.
All the instructions live in `SKILL.md`.

## How to use it

**Claude (claude.ai / Claude Code):** upload this zip as a skill (Settings → Capabilities → Skills), or drop the `kling-skill` folder into your skills directory. Trigger it with "kling skill" or `/kling-skill`.

**ChatGPT (Custom GPT or Project):** paste the body of `SKILL.md` (everything below the `---` frontmatter) into the Instructions field, or upload `SKILL.md` as a knowledge file and add the instruction: "Follow SKILL.md whenever I say 'kling skill'."

**Gemini (Gem), Grok, or any other LLM:** paste the contents of `SKILL.md` as the system prompt / custom instructions, or at the start of a chat with: "Use these rules for this conversation."

## Usage

- `kling skill [subject]` → full Kling 4.0 prompt(s)
- `kling skill` with no subject → offers 10 original Hollywood-style subjects
- Attach a reference image with your request to build an Omni Reference or image-to-video prompt

## Notes for non-Claude tools

`SKILL.md` mentions Claude-specific tools (AskUserQuestion, SendUserFile). Other LLMs simply ask the question in chat and print long batches as text instead, so no edits are needed.
