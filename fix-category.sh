#!/usr/bin/env bash
# categories.ts ke image URLs ko renamed files ke naam se map karta hai.
# Chalao project root se:  bash fix-category-images.sh

set -euo pipefail
FILE="src/data/categories.ts"

mapfile -t OLD_PATHS < <(grep -oE '/images/[^"]+' "$FILE" | sort -u)

for old in "${OLD_PATHS[@]}"; do
  newname="$(python3 - "${old#/images/}" <<'PY'
import sys, re, urllib.parse
n = urllib.parse.unquote(sys.argv[1])
n = n.replace("\u2014","-").replace("\u2013","-").replace("&","")
n = re.sub(r"\s+","-",n); n = re.sub(r"-+","-",n).strip("-").replace("-.",".")
print(n)
PY
)"
  new="/images/$newname"
  if [ "$old" != "$new" ]; then
    esc_old=$(printf '%s' "$old" | sed 's/[&/\]/\\&/g')
    esc_new=$(printf '%s' "$new" | sed 's/[&/\]/\\&/g')
    sed -i "s|${esc_old}|${esc_new}|g" "$FILE"
    echo "MAP: $old -> $new"
    [ -f "public/images/$newname" ] || echo "  WARN: public/images/$newname disk pe nahi mili"
  fi
done

echo ""
echo "Baaki purane paths (khali hona chahiye):"
grep -n '/images/[^"]*[ &]' "$FILE" || echo "  (sab saaf)"
