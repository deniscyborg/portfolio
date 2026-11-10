#!/usr/bin/env bash
# Включает проверку свежести HTML-страниц портфолио в рабочем конфиге nginx.
# Запуск на сервере:
#   curl -fsSL https://raw.githubusercontent.com/deniscyborg/portfolio/main/deploy/fix-cache.sh | sudo bash
# Повторный запуск ничего не меняет. Если конфиг не пройдёт проверку, вернётся прежний.
set -euo pipefail

CONF=/etc/nginx/sites-available/davydovdenis.de

[ -f "$CONF" ] || { echo "Нет файла $CONF"; exit 1; }

if grep -q 'expires -1;' "$CONF"; then
  echo "Уже настроено, ничего не меняю."
else
  BACKUP="$CONF.bak.$(date +%Y%m%d%H%M%S)"
  cp "$CONF" "$BACKUP"
  # Строка вставляется перед try_files в каждом блоке server (80 и 443)
  sed -i '/try_files \$uri \$uri\/ \$uri\.html =404;/i\        expires -1;' "$CONF"
  if ! grep -q 'expires -1;' "$CONF"; then
    echo "В $CONF не нашлась строка try_files из deploy/nginx.conf — пришлите вывод: grep -n try_files $CONF"
    exit 1
  fi
  if ! nginx -t; then
    cp "$BACKUP" "$CONF"
    echo "Проверка конфига не прошла, вернул прежний: $BACKUP"
    exit 1
  fi
  systemctl reload nginx
  echo "Готово. Копия прежнего конфига: $BACKUP"
fi

echo "Заголовок страницы:"
# Запрос идёт на сам сервер: обращение к своему внешнему адресу изнутри VPS может не проходить
curl -sI --resolve davydovdenis.de:443:127.0.0.1 https://davydovdenis.de/en/ | grep -i '^cache-control' || echo "Cache-Control не найден — проверьте конфиг вручную"
