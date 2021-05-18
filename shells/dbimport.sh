#!/bin/bash
cat ./sql/local.sql | docker exec -i gulp-wordpress_db_1 mysql -uwordpress -pwordpress wordpress
rm -f ./sql/local.sql
rm -f ./sql/prod.sql
rm -f ./sql/stage.sql
