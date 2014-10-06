#!/usr/bin/env bash

sudo apt-get update
sudo apt-get install -y default-jre
sudo apt-get install -y nodejs
sudo apt-get install -y npm
cd /vagrant
sudo npm install
