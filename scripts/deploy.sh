#!/bin/bash -ex

pushd `dirname $0` > /dev/null
base=$(pwd -P)
popd > /dev/null

src=$base/../dist/
dest=s3://swagger.piazzageo.io

aws s3 sync --delete --exclude '*.swp' --exclude '.git*' --exclude '.DS_STORE' $src $dest
