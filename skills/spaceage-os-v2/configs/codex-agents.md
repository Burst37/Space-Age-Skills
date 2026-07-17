# Space Age Codex Agent Rules

## Use For

- implementation
- refactors
- tests
- repo-level edits
- Remotion video systems
- frontend production builds

## Always Require

```yaml
before_edit:
  - inspect files
  - identify commands
  - make small plan
after_edit:
  - run tests or explain why not
  - run typecheck/build when available
  - summarize changed files
```
