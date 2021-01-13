#!/bin/bash
find ./sql/ -iname "*.sql.gz" -exec mv {} ./wwwroot/db.sql.gz \;
vagrant ssh -c "zcat /var/www/html/db.sql.gz | mysql -u wordpress -psecret wordpress"
rm ./wwwroot/db.sql.gz
