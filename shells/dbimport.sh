#!/bin/bash
find ./sql/ -iname "*.sql.gz" -exec mv {} ./wwwroot/db.sql.gz \;
zcat ./wwwroot/db.sql.gz | docker exec -i gulp-wordpress_db_1 mysql -uwordpress -pwordpress wordpress
rm ./wwwroot/db.sql.gz
