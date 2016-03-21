#!/usr/bin/env bash -e

npm run build
lessc src/main/less/screen.less dist/css/screen.css --source-map-less-inline
rm -r ../manage/apps/tmp/public/api_docs/* || mkdir ../manage/apps/tmp/public/api_docs
cp -r dist/* ../manage/apps/tmp/public/api_docs/
echo "success!"