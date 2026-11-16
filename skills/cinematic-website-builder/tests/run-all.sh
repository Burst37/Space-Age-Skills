#!/usr/bin/env bash
# CWB v3.5 regression: every check must land on its expected exit code.
#   CWB_NODE_MODULES=/path/to/node_modules tests/run-all.sh
set -u
cd "$(dirname "$0")/.."
[ -n "${CWB_NODE_MODULES:-}" ] && export CWB_NODE_MODULES   # else scripts fall back to ./node_modules and the global npm root
T=$(mktemp -d); pass=0; fail=0
check() { # name expected-exit command...
  local name=$1 want=$2; shift 2
  "$@" > "$T/$name.log" 2>&1; local got=$?
  if [ "$got" = "$want" ]; then pass=$((pass+1)); echo "ok   $name (exit $got)"; else fail=$((fail+1)); echo "FAIL $name (exit $got, want $want) — $T/$name.log"; fi
}
checkp() { # name expected-exit regex command...  (negative checks must fail for the RIGHT reason)
  local name=$1 want=$2 re=$3; shift 3
  "$@" > "$T/$name.log" 2>&1; local got=$?
  if [ "$got" = "$want" ] && grep -Eq "$re" "$T/$name.log"; then pass=$((pass+1)); echo "ok   $name (exit $got, matched /$re/)"; else fail=$((fail+1)); echo "FAIL $name (exit $got, want $want + /$re/) — $T/$name.log"; fi
}
node tests/make-assets.mjs > /dev/null   # stand-in media + fixtures (not committed)
node scripts/assemble.mjs tests/gallery.html -o tests/gallery.dist.html --all > /dev/null
check gallery-regression 0 node scripts/verify.mjs tests/gallery.dist.html --out "$T/qa" --skip-aeo --motion-plan tests/motion-plan.gallery.yaml
checkp motion-plan-negative 1 "frame-scrub-missing.*not booted" node scripts/verify.mjs tests/gallery.dist.html --out "$T/qa-neg" --skip-aeo --skip-offline --skip-wide --motion-plan tests/motion-plan.negative.yaml
checkp design-negative 1 "overflows the viewport.*320px" node scripts/verify.mjs tests/fixtures/design-negative.html --root tests --out "$T/qa-design" --skip-aeo --skip-offline
check greybox-astonishing 0 node scripts/greybox.mjs references/examples/astonishing/wireframe.yaml --out "$T/greybox"
checkp greybox-negative 1 "sitemap URL has no wireframe" node scripts/greybox.mjs tests/fixtures/wireframe-negative.yaml --out "$T/greybox-neg" --sitemap tests/fixtures/sitemap-negative.xml --no-shots
check motion-pick 0 node scripts/motion-pick.mjs references/examples/astonishing/wireframe.yaml --out "$T/motion" --taste taste-profile.yaml
check type-specimens 0 node scripts/type-specimens.mjs references/examples/astonishing/type-inputs.yaml --out "$T/type" --mode auto
python3 -m http.server 8761 --directory tests/launch/good > /dev/null 2>&1 & G=$!
python3 -m http.server 8762 --directory tests/launch/bad > /dev/null 2>&1 & B=$!
sleep 1
check launch-good 0 node scripts/launch-check.mjs http://127.0.0.1:8761 --domain example.com
checkp launch-bad 1 "canonical points at another host" node scripts/launch-check.mjs http://127.0.0.1:8762 --domain example.com
kill $G $B 2>/dev/null
cp tests/fixtures/ai-letters.yaml tests/fixtures/letters-*.png "$T/"
checkp letter-check 1 "reads .{1,2}HOPF.{1,2}, expected .{1,2}HOPE" node scripts/letter-check.mjs "$T/ai-letters.yaml"
GF=references/examples/astonishing
check goldfish-pack 0 node scripts/goldfish.mjs pack GR2 --handoff $GF --target $GF/design-spec.md --source $GF/wireframe.md --out "$T/gf"
echo "chat" > "$T/session_memory.md"
checkp goldfish-pack-refuses-notes 1 "refusing conversation-like inputs" node scripts/goldfish.mjs pack GR1 --handoff $GF --source "$T/session_memory.md" --out "$T/gf-neg"
check goldfish-lint-example 0 node scripts/goldfish.mjs lint $GF/reviews/GR1-brief.md --resolved
checkp goldfish-lint-negative 1 "no evidence" node scripts/goldfish.mjs lint tests/fixtures/goldfish-negative.md --resolved
check lead-jobs 0 node tests/lead-jobs.test.mjs
check shot-lint 0 node scripts/shot-lint.mjs tests/fixtures/shots --today 2026-11-16
checkp shot-lint-negative 1 "more than one move" node scripts/shot-lint.mjs tests/fixtures/shots-negative --today 2026-11-16
checkp aeo-builtin-shell 1 "aeo:.*content missing from raw HTML" env SEO_AEO_SKILL=/nonexistent node scripts/verify.mjs tests/aeo-fixtures/fail-shell.html --out "$T/qa-aeo1" --skip-offline --skip-wide --skip-axe
checkp aeo-builtin-blocked 1 "aeo:.*OAI-SearchBot blocked" env SEO_AEO_SKILL=/nonexistent node scripts/verify.mjs tests/aeo-fixtures/blocked/pass.html --out "$T/qa-aeo2" --skip-offline --skip-wide --skip-axe
echo "---"; echo "$pass passed, $fail failed (logs: $T)"
[ "$fail" = 0 ]
