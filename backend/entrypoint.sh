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

echo "Banco de dados conectado. Rodando migrations..."
php artisan migrate --force

echo "Rodando seeders..."
php artisan db:seed --force

exec "$@"