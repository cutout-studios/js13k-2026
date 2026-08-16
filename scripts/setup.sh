#!/bin/bash

brew bundle

git clone --recursive https://github.com/fhanau/Efficient-Compression-Tool.git .output/ect
mkdir -p .output/ect/build
cd .output/ect/build
cmake ../src
make
