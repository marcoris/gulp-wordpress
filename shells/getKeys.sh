#!/bin/bash
if [[ $(type -t curl) ]]; then
curl https://api.wordpress.org/secret-key/1.1/salt/ -o keys.php -s
else
  error "Could not find curl, please install it"
  return 1
fi
