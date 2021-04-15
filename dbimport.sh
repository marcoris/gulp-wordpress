#!/bin/bash
find ./sql/ -iname "*.sql.gz" -exec mv {} ./wwwroot/db.sql.gz \;
# vagrant ssh -c "zcat /var/www/html/db.sql.gz | mysql -u wordpress -psecret wordpress"
docker exec -i gulp-wordpress_db_1 mysql zcat /var/www/html/db.sql.gz | mysql -uwordpress -pwordpress wordpress
rm ./wwwroot/db.sql.gz
