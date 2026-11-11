#!/usr/bin/env bash
# Enables revalidation of the portfolio's HTML pages in the live nginx config.
# Run on the server:
#   curl -fsSL https://raw.githubusercontent.com/deniscyborg/portfolio/main/deploy/fix-cache.sh | sudo bash
# Re-running changes nothing. If the config fails validation, the previous one is restored.
set -euo pipefail

CONF=/etc/nginx/sites-available/davydovdenis.de

[ -f "$CONF" ] || { echo "File not found: $CONF"; exit 1; }

if grep -q 'expires -1;' "$CONF"; then
  echo "Already configured, nothing to change."
else
  BACKUP="$CONF.bak.$(date +%Y%m%d%H%M%S)"
  cp "$CONF" "$BACKUP"
  # The line is inserted before try_files in every server block (80 and 443)
  sed -i '/try_files \$uri \$uri\/ \$uri\.html =404;/i\        expires -1;' "$CONF"
  if ! grep -q 'expires -1;' "$CONF"; then
    echo "No try_files line from deploy/nginx.conf found in $CONF — check: grep -n try_files $CONF"
    exit 1
  fi
  if ! nginx -t; then
    cp "$BACKUP" "$CONF"
    echo "Config validation failed, restored the previous one: $BACKUP"
    exit 1
  fi
  systemctl reload nginx
  echo "Done. Backup of the previous config: $BACKUP"
fi

echo "Page header:"
# Query the server itself: requests to its own public address may fail from inside the VPS
curl -sI --resolve davydovdenis.de:443:127.0.0.1 https://davydovdenis.de/en/ | grep -i '^cache-control' || echo "Cache-Control not found — check the config manually"
