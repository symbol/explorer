#!/bin/bash

set -ex

npm ci
# generate version.txt to be used in publishing
echo $(npm run version --silent) > version.txt
