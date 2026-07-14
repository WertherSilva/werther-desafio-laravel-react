#!/bin/sh

set -e

cd /app/backend

echo "Preparando o backend..."

if [ ! -f vendor/autoload.php ]; then
	echo "Instalando dependências do Composer..."

	composer install \
		--no-interaction \
		--prefer-dist
fi

if [ ! -f .env ]; then
	echo "Criando .env a partir do .env.example..."
	cp .env.example .env
fi

php artisan config:clear

if ! grep -q "^APP_KEY=.\+" .env; then
	echo "Gerando APP_KEY..."
	php artisan key:generate --force
else
	echo "APP_KEY já existe."
fi

if ! grep -q "^JWT_SECRET=.\+" .env; then
	echo "Gerando JWT_SECRET..."
	php artisan jwt:secret --force
else
	echo "JWT_SECRET já existe."
fi


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

echo "Limpando todo o banco de dados:"
php artisan db:wipe

echo "Banco de dados conectado. Rodando migrations..."
php artisan migrate --force

php artisan optimize:clear

php artisan db:seed --force

exec "$@"