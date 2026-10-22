FROM php:8.5-apache

# Production PHP settings; hide the PHP version header.
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" \
 && printf 'expose_php = Off\n' > "$PHP_INI_DIR/conf.d/zz-security.ini" \
 && a2enmod headers

COPY docker/apache-security.conf /etc/apache2/conf-available/zz-security.conf
RUN a2enconf zz-security

COPY . /var/www/html

# Server config is baked in above; keep it out of the web root.
RUN rm -rf /var/www/html/docker
