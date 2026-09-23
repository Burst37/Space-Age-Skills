#!/usr/bin/env bash
cd /root/agent-os || { echo "✗ /root/agent-os not found"; exit 1; }
echo "→ reverting to the backups taken before any change…"
mapfile -t ORIGS < <(find src public -name '*.bak.*' 2>/dev/null | sed -E 's/\.bak\.[0-9]+$//' | sort -u)
if [ ${#ORIGS[@]} -eq 0 ]; then echo "no backups found — nothing to revert"; exit 0; fi
for o in "${ORIGS[@]}"; do
  earliest=$(ls -1 "$o".bak.* 2>/dev/null | sort | head -1)
  [ -n "$earliest" ] && cp "$earliest" "$o" && echo "  restored $o"
done
find src public -name '*.bak.*' -delete 2>/dev/null
echo "→ rebuilding…"
if npm run build; then
  pm2 restart all 2>/dev/null || true
  echo "✓ REVERTED — your dashboard is back to how it was. Hard-refresh (Ctrl+Shift+R)"
else
  echo "✗ build failed — paste the red lines to Claude"
fi
