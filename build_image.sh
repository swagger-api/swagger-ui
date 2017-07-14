#!/bin/bash

# In order to push you need to set the following env vars for the build environment:

# AWS_SECRET_KEY_ID
# AWS_ACCESS_KEY
# AWS_REGION

registry="535558409775.dkr.ecr.ca-central-1.amazonaws.com"
repository="swagger"
tag=$(git rev-parse HEAD)
image="$registry/$repository:$tag"
login_cmd="$(aws ecr get-login --no-include-email --region "$AWS_REGION")"

function build() {
  eval "$login_cmd"
  docker build -t "$image" .
}

function push() {
  docker push "$image"
}

function run() {
  set -e
  build
  push
}

if [[ "$1" ]]; then
  "$@"
  exit $!
else
  echo Usage:
  echo
  echo "$0 COMMAND"
  echo
  echo Possible commands:
  echo
  echo   To build and push an image:
  echo     run
  echo
  echo   To only build or push you can use:
  echo     build, push
fi

