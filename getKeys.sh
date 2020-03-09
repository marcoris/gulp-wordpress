#!/bin/bash
if [[ $(type -t curl) ]]; then
curl -o keys.php https://api.wordpress.org/secret-key/1.1/salt/
else
  error "Could not find wget or curl, please install one of them"
  return 1
fi
