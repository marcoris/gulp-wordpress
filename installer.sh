#!/bin/bash
docker-compose up -d && npm install && gulp setup && composer self-update && composer install && gulp
