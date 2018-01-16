#!/bin/bash

# This script borrowed from platform-ui repo

echo pwd: $(pwd)

. ~/.nvm/nvm.sh

function check_call {
    "$@"
    local status=$?
    if [ $status -ne 0 ]; then
        echo "error with $1" >&2
        exit $status
    fi
}

# TODO: this is not working (not able to change versions)
NODE_VERSION=$(jq --raw-output .engines.node package.json)
echo "Set up nvm version $NODE_VERSION"
check_call nvm install $NODE_VERSION

echo "Run Yarn install"
yarn install
if [ $? -ne 0 ]; then
    echo "Error during Yarn install, retrying with clean cache..."  # Tsk.
    yarn cache clean
    check_call yarn install
fi

echo "Run build"
check_call yarn run build

echo "Distribution created in dist/"
