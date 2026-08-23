import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ENV = "HYPERFRAMES_SKILL_PKG_VERSION";

// (a) env override wins — no ancestor lookup, exact version echoed back.
test("hyperframesPackageSpec: env override wins", async () => {
  const prev = process.env[ENV];
  process.env[ENV] = "9.9.9";
  try {
    const { hyperframesPackageSpec } = await import("./package-loader.mjs");
    assert.equal(hyperframesPackageSpec("@hyperframes/producer"), "@hyperframes/producer@9.9.9");
  } finally {
    if (prev === undefined) delete process.env[ENV];
    else process.env[ENV] = prev;
  }
});

// (b) resolvable version (in-repo) pins the bundled hyperframes/@hyperframes/cli version.
// The loader walks ancestor package.json files looking for one named "hyperframes"
// (or "@hyperframes/cli") — that's only true inside the original hyperframes
// monorepo checkout, not a repo that vendors this skill under a different root
// manifest name. So, same as test (c), build an isolated fixture with its own
// matching ancestor manifest rather than relying on this checkout's actual tree.
test("hyperframesPackageSpec: resolvable in-repo version pins it", () => {
  const dir = mkdtempSync(join(tmpdir(), "hf-pkgloader-pinned-"));
  try {
    writeFileSync(
      join(dir, "package.json"),
      JSON.stringify({ name: "hyperframes", version: "1.2.3" }) + "\n",
    );
    const scriptsDir = join(dir, "scripts");
    mkdirSync(scriptsDir);
    copyFileSync(join(HERE, "package-loader.mjs"), join(scriptsDir, "package-loader.mjs"));
    const probe = join(scriptsDir, "probe.mjs");
    writeFileSync(
      probe,
      [
        'import { hyperframesPackageSpec } from "./package-loader.mjs";',
        'process.stdout.write(hyperframesPackageSpec("@hyperframes/producer"));',
        "",
      ].join("\n"),
    );
    const childEnv = { ...process.env };
    delete childEnv[ENV];
    const res = spawnSync(process.execPath, [probe], {
      cwd: scriptsDir,
      encoding: "utf8",
      env: childEnv,
    });
    assert.equal(res.status, 0, res.stderr);
    assert.equal(res.stdout.trim(), "@hyperframes/producer@1.2.3");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

// (c) unresolvable + no override -> @latest fallback, no throw (global-install case).
// Copy the loader into an isolated temp dir whose ancestor chain has no hyperframes
// package.json, and run node from there so cwd cannot resolve one either.
test("hyperframesPackageSpec: unresolvable falls back to @latest without throwing", () => {
  const dir = mkdtempSync(join(tmpdir(), "hf-pkgloader-"));
  try {
    copyFileSync(join(HERE, "package-loader.mjs"), join(dir, "package-loader.mjs"));
    const probe = join(dir, "probe.mjs");
    writeFileSync(
      probe,
      [
        'import { hyperframesPackageSpec } from "./package-loader.mjs";',
        'process.stdout.write(hyperframesPackageSpec("@hyperframes/producer"));',
        "",
      ].join("\n"),
    );
    const res = spawnSync(process.execPath, [probe], { cwd: dir, encoding: "utf8" });
    assert.equal(res.status, 0, res.stderr);
    assert.equal(res.stdout.trim(), "@hyperframes/producer@latest");
    assert.match(res.stderr, /using @latest/);
    assert.match(res.stderr, new RegExp(ENV));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
