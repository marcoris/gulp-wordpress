#!/bin/bash
if [ "$1" = "local" ]
then
	# Locally
	docker exec -it $(docker ps -aqf "name=gulpwordpress_db_1") mysqldump -uroot -ptoor --opt --add-drop-table wordpress > ./sql/local.sql
	sed -i '1d' ./sql/local.sql
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

	ssh -i ~/.ssh/$SSH_KEY $SSH_USER@$SSH_HOST "cd ~/$PUBLICPATH && wp db export sql/$1.sql"
fi
