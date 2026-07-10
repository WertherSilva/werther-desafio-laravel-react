#!/bin/sh

set -e

echo "Aguardando conexão com o banco de dados..."

count=0
until php artisan db:show > /dev/null 2>&1; do
    count=$((count + 1))
    if [ $count -ge 30 ]; then
        echo "Timeout esperando o banco de dados."
        exit 1
    fi
    echo "Tentativa $count..."
    sleep 2
done

LOCK_FILE="/app/backend/storage/app/.seeded"

# echo "Limpando todo o banco de dados e removendo arquivo .seeded"
# php artisan db:wipe
# if [ -f "$LOCK_FILE" ]; then
#     rm "$LOCK_FILE"
# fi

echo "Banco de dados conectado. Rodando migrations..."
php artisan migrate --force

if [ ! -f "$LOCK_FILE" ]; then
    echo "Primeira execução detectada. Rodando seeders..."
    php artisan db:seed --force
    touch "$LOCK_FILE"
else
    echo "Seeders já executados."
fi

exec "$@"