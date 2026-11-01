#!/usr/bin/env bash
# Uso: build.sh md|pdf|ecuador|canva
set -euo pipefail
cd "$(git rev-parse --show-toplevel)/ebook/export"
[ -d node_modules ] || npm install --silent
case "${1:-}" in
  md)      npm run build ;;
  pdf)     npm run build:pdf ;;
  ecuador) npm run build:ecuador ;;
  canva)   npm run build:canva ;;
  *) echo "Uso: build.sh md|pdf|ecuador|canva" >&2; exit 1 ;;
esac
ls -la --time-style=long-iso . | grep -E "\.(md|pdf)$|canva-paginas" || true
