#!/bin/bash

set -e

if [[ ! ("$#" == 1) ]]; then
    echo 'Please provide network type. eg: setup-subdir-config.sh testnet'
    exit 1
fi

NETWORK="$1"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

echo "Copying ${NETWORK} config"

cp ${DIR}/${NETWORK}/default.json ${DIR}/../config/default.json
cp ${DIR}/${NETWORK}/vue.config.js ${DIR}/../../vue.config.js

echo "copied!"

