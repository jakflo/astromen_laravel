Seznam astronautu
=================

Požadavky
------------

- PHP 8.2.
- Node.js a NPM


Instalace
------------

- Naklonujte Git, v prikazove radce se prepnete na adresar projektu
- spuste prikazy composer install, npm install a npm run build
- v souboru .env nastavte pripojeni k DB
- prikazem php artisan migrate nechte vytvorit zakladni tabulky pro Laravel
- z db_dump.sql vytvorte tabulky pro aplikaci a naimpotujete data

Spuštení webu
----------------
- spuštění PHP: php -S localhost:8000 -t www
- web je pak přístupný na: http://localhost:8000
