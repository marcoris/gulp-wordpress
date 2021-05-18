#!/bin/bash

# Get ssh username
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

if [[ "$1" == "prod" ]]
then
	# Set public directory
	PUBLICPATH="public_html"
else
	# Set public directory
	PUBLICPATH="public_html/stage"
fi

ssh -i ~/.ssh/$SSH_KEY $SSH_USER@$SSH_HOST "cd ~/$PUBLICPATH && rm -r sql; mkdir sql; wp db export sql/$1.sql --add-drop-table"
