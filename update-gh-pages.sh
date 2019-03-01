#!/bin/bash

npm run build-bundle && \

git stash && \

git checkout gh-pages && \

git pull && \

git stash pop

cp -r dist/ . && \

rm -rf dist/ && \

git commit -am 'Update dist bundle' && \

git push
