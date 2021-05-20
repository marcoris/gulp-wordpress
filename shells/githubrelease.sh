#!/bin/bash
git add CHANGELOG.md README.md package.json && git commit -m "bump up to v$1" && git push -f && git tag v$1 -m "Version $1" && git push --tags