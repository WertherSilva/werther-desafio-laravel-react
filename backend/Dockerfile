FROM php:8.3

RUN apt-get update -y && apt-get install -y \
    openssl zip unzip git \
    libonig-dev \
    libxml2-dev \
    libicu-dev
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN docker-php-ext-install mbstring pdo_mysql intl

WORKDIR /app/backend
COPY . .
RUN composer install

EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]