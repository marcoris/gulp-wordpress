#!/bin/bash
if [ "$1" = "local" ]
then
	# Clear local WordPress database
	docker exec -it $(docker ps -aqf "name=gulpwordpress_db_1") mysql -uroot -ptoor -e "DROP DATABASE IF EXISTS wordpress; CREATE DATABASE IF NOT EXISTS wordpress;"
	# Import local.sql
	cat ./sql/local.sql | docker exec -i gulpwordpress_db_1 mysql -uwordpress -pwordpress wordpress
	rm -f ./sql/local.sql
elif [ "$1" = "prod" ] || [ "$1" = "stage" ]
then
	# Remotely
	SSH_USER=$(grep SSH_USER .env | xargs)
	IFS='=' read -ra SSH_USER <<< "$SSH_USER"
	SSH_USER=${SSH_USER[1]}

	# Get ssh host
	SSH_HOST=$(grep SSH_HOST .env | xargs)
	IFS='=' read -ra SSH_HOST <<< "$SSH_HOST"
	SSH_HOST=${SSH_HOST[1]}

	# Get ssh key
	SSH_KEY=$SSH_USER
	IFS='.' read -ra SSH_KEY <<< "$SSH_KEY"
	SSH_KEY=${SSH_KEY[0]}

	# Set public directory
	PUBLICPATH="public_html"

	if [[ "$1" == "stage" ]]
	then
		# Set public directory
		PUBLICPATH+="/stage"		
	fi

	# Connect to host, clear remote WordPress database, import sql dump, remove sql dump file
	ssh -i ~/.ssh/$SSH_KEY $SSH_USER@$SSH_HOST "cd ~/$PUBLICPATH && wp db clean --yes && wp db import sql/$1.sql; rm -f sql/$1.sql"
else
	echo "Wrong parameter!"
	echo "npm run dbimport local"
	echo "npm run dbimport stage"
	echo "npm run dbimport prod"
fi
