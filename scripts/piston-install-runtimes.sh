#!/usr/bin/env bash
# Install the language runtimes used by Projet Carthage on a self-hosted Piston.
# Run once after `docker compose -f docker-compose.piston.yml up -d`.

set -e
PISTON_URL="${PISTON_URL:-http://localhost:2000/api/v2}"

# Versions match src/app/api/db/execute/route.ts LANGUAGES table.
declare -a RUNTIMES=(
  "javascript 18.15.0"
  "python 3.10.0"
  "c 10.2.0"
  "c++ 10.2.0"
  "csharp 6.12.0"
  "dart 2.19.6"
)

echo "Installing Piston runtimes on $PISTON_URL ..."

for entry in "${RUNTIMES[@]}"; do
  lang="${entry% *}"
  ver="${entry#* }"
  echo "  -> $lang $ver"
  curl -fsS -X POST "$PISTON_URL/packages" \
    -H "Content-Type: application/json" \
    -d "{\"language\":\"$lang\",\"version\":\"$ver\"}" \
    && echo "     OK" \
    || echo "     FAIL"
done

echo
echo "Installed packages:"
curl -fsS "$PISTON_URL/runtimes" | sed 's/},{/},\n{/g'
