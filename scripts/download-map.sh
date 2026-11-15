#!/usr/bin/env bash
# Downloads an offline OpenStreetMap basemap of Berlin as a single PMTiles file.
# It extracts only the Berlin area from the latest daily Protomaps planet build
# (via HTTP range requests, so the 139 GB planet file is never downloaded).
#
# Requires the pmtiles CLI: `brew install pmtiles`
# (or a binary from https://github.com/protomaps/go-pmtiles/releases).
#
# Usage: npm run map:download   (or: bash scripts/download-map.sh [output-file])
set -euo pipefail

OUT="${1:-data/map/berlin.pmtiles}"
# Berlin (13.09–13.76 E, 52.34–52.68 N) plus a margin for context around the city edge.
BBOX="12.95,52.28,13.90,52.73"

if ! command -v pmtiles >/dev/null 2>&1; then
  echo "pmtiles CLI not found. Install it with: brew install pmtiles" >&2
  exit 1
fi

# Daily builds are only kept for a limited time, so pick the newest one.
BUILD=$(curl -fsS https://build-metadata.protomaps.dev/builds.json \
  | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{const b=JSON.parse(s);console.log(b[b.length-1].key)})')

mkdir -p "$(dirname "$OUT")"
echo "Extracting Berlin from https://build.protomaps.com/$BUILD into $OUT ..."
pmtiles extract "https://build.protomaps.com/$BUILD" "$OUT" --bbox="$BBOX"
echo "Done:"
pmtiles show "$OUT" | head -20
