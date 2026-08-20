# mattpocock-skills

Matt Pocock's production Claude skills — TypeScript, tooling, documentation, and developer experience workflows from the creator of Total TypeScript.

## Source
`mattpocock/skills` on GitHub — clone into `~/.claude/skills/`

## What This Skill Covers
- TypeScript error diagnosis and fix patterns
- Type-safe API design and inference tricks
- Monorepo setup (Turborepo, pnpm workspaces)
- Library authoring: tsconfig, bundling, exports map
- Documentation generation from source
- Zod schema design and validation patterns
- tRPC + Next.js type-safe full-stack patterns

## Slash Commands

### `/ts-fix`
Diagnose and fix TypeScript errors. Paste the error, get the fix with explanation.

**Steps:**
1. Read the full error including the call stack
2. Identify root cause: type mismatch, missing generic, `any` leak, or structural issue
3. Apply minimal fix — don't widen types to solve narrowing problems
4. Add a comment only if the fix is non-obvious

### `/ts-types`
Design or refine a TypeScript type system for a given domain.

**Steps:**
1. Map the domain entities to discriminated unions where applicable
2. Use `satisfies` over `as` — preserve inference
3. Avoid enums — use `const` objects with `as const` and `typeof`
4. Extract reusable utility types
5. Output the types with brief rationale for each decision

### `/monorepo-setup`
Scaffold a pnpm + Turborepo monorepo.

**Output:**
- `pnpm-workspace.yaml`
- Root `turbo.json` with `build`, `dev`, `lint`, `test` pipelines
- Shared `tsconfig` package
- Shared ESLint config package
- `.npmrc` with `shamefully-hoist=false`

### `/lib-publish`
Prepare a TypeScript library for npm publishing.

**Checklist:**
- [ ] `exports` map in package.json (CJS + ESM)
- [ ] `types` field pointing to `.d.ts`
- [ ] `files` array — only dist + README
- [ ] `tsconfig.json` with `declaration: true`, `declarationMap: true`
- [ ] Bundler: `tsup` or `pkgroll` (not Rollup from scratch)
- [ ] `prepublishOnly` script runs build + type-check

### `/zod-schema`
Generate a Zod schema from a description or existing TypeScript type.

**Rules:**
- Use `.describe()` on every field for LLM-friendly schemas
- Use `z.discriminatedUnion` over `z.union` when there's a discriminant key
- Coerce strings to numbers/dates at the boundary, not inside logic
- Export both the schema and the inferred type: `export type X = z.infer<typeof XSchema>`

## Key Patterns

```typescript
// Prefer satisfies for config objects — keeps inference, adds type-checking
const config = {
  port: 3000,
  host: "localhost",
} satisfies ServerConfig;

// Use const enums pattern instead of enums
const Status = { Active: "active", Inactive: "inactive" } as const;
type Status = (typeof Status)[keyof typeof Status];

// Generic with constraint — avoid unknown leaking out
function parse<T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
  return schema.parse(data);
}
```

## When to Use
- Building or refactoring TypeScript projects
- Designing type-safe APIs
- Setting up new monorepos or libraries
- Debugging complex TypeScript inference issues
