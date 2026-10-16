# User profile (persistent context)

Specific advice needs the user's facts. Keep them in one profile so they're never asked twice.

## Where it lives

1. `./knowledge/build-partner-profile.md` in the project, else `~/.build-partner/profile.md`.
2. No file access (other LLMs): ask the user to keep the profile block below in their custom instructions / project knowledge, and print the updated block whenever it changes.

## Protocol

- **Start of every mode:** read the profile if it exists. Use it silently; don't recite it.
- **Missing a fact the answer depends on:** ask once (as options where possible), then add it.
- **Learned something durable** (new price, new launch date, a result): propose a one-line update; write on yes.
- **Stale** (date older than 90 days on numbers): confirm before relying on them.
- Never store secrets, passwords, API keys, or card/bank details.

## Template

```markdown
# Build Partner profile
Updated: YYYY-MM-DD

## Who
- Role / business:
- Stage: idea | pre-revenue | <$10k/mo | $10-100k/mo | $100k+/mo
- Team size:

## Offer
- What I sell:
- Price / pricing model:
- Ideal customer (who, what problem, what trigger):
- Main alternative they'd use instead:

## Numbers (with date)
- Monthly revenue:
- Leads / traffic per month:
- Conversion rate:
- Churn / retention:

## Channels & assets
- Audience size per channel:
- What's working:
- What's not:

## Constraints
- Time per week:
- Budget:
- Skills / tools I'm strong in:

## Goals
- 90-day goal (one number):
- 12-month goal:

## Decisions & results log
- YYYY-MM-DD: decided X because Y → result Z
```
