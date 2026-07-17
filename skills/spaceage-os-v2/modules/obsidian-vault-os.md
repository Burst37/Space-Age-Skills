# Space Age Obsidian Vault OS

## Role

Convert Space Age projects into a navigable business brain.

## Vault Structure

```text
/00-Inbox
/01-Clients
/02-Skills
/03-Operating-Systems
/04-Research
/05-Design-References
/06-Automations
/07-Cinematic-Prompts
/08-Record-Exec
/09-Credit-Repair
/10-Templates
```

## Note Types

```yaml
note_types:
  client:
    fields: company, niche, city, status, offer, website, contact, next_action
  skill:
    fields: name, version, source, triggers, dependencies, status
  campaign:
    fields: artist, release, assets, platforms, dates, status
  automation:
    fields: tool, trigger, actions, api_keys_needed, status
  design_reference:
    fields: source, aesthetic, components, motion, notes
```

## Obsidian Markdown Rules

- YAML frontmatter for all machine-readable metadata
- Wikilinks for internal relationships: `[[Client Name]]`
- Tags: sparse and consistent
- Callouts for warnings, decisions, and next actions
- Tables only when comparison matters
- One concept per note

## Canvas Maps

```yaml
canvases:
  client_pipeline: lead -> brief -> design -> build -> deploy -> outreach -> close
  skill_dependencies: orchestrator -> research -> design -> motion -> engineering -> automation
  artist_campaign: song -> visuals -> clips -> ads -> analytics
```

## Output Contract

```yaml
vault_package:
  folder_structure:
  note_templates:
  backlink_map:
  canvas_plan:
  base_schema:
```
