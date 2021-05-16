#!/bin/bash

# Get ssh username
PRODUCTION_SSH_USER=$(grep PRODUCTION_SSH_USER .env | xargs)
IFS='=' read -ra PRODUCTION_SSH_USER <<< "$PRODUCTION_SSH_USER"
PRODUCTION_SSH_USER=${PRODUCTION_SSH_USER[1]}

# Get ssh host
PRODUCTION_SSH_HOST=$(grep PRODUCTION_SSH_HOST .env | xargs)
IFS='=' read -ra PRODUCTION_SSH_HOST <<< "$PRODUCTION_SSH_HOST"
PRODUCTION_SSH_HOST=${PRODUCTION_SSH_HOST[1]}

# Get ssh key
SSH_KEY=$PRODUCTION_SSH_USER
IFS='.' read -ra SSH_KEY <<< "$SSH_KEY"
SSH_KEY=${SSH_KEY[0]}

DATE=`date "+%Y-%m-%d-%H-%M-%s"`
ssh -i ~/.ssh/$SSH_KEY $PRODUCTION_SSH_USER@$PRODUCTION_SSH_HOST "cd ~/public_html; rm -r ./backup/*; wp db export ./backup/live_$DATE.sql --add-drop-table"
