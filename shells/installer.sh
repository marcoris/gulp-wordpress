#!/bin/bash
{
  docker ps -q && docker-compose up -d && npm install && gulp firstSetup && composer self-update && composer install
} || {
  echo "Docker is not running. Please start docker on your computer."
  echo "When docker has finished starting up press [ENTER] to continue..."
  read
}