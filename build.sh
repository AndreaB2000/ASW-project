#!/bin/bash

# Clean up the dist folder
rm -rf dist

# Build the server and client
npm run build:server
npm run build:client

# Create the dist folder
mkdir dist
mkdir dist/client
mkdir dist/server

# Copy the built files to the dist folder
mv src/client/dist/* dist/client/ 
mv src/server/dist/* dist/server/

# Copy the package.json and package-lock.json files to the dist folder
cp package.json dist/
sed -i 's#src/##g' dist/package.json
cp package-lock.json dist/
cp src/server/package.json dist/server/
cp src/server/package-lock.json dist/server/
cp src/client/package.json dist/client/
cp src/client/package-lock.json dist/client/

# Copy the README.md, LICENSE, and CHANGELOG.md files to the dist folder
cp README.md dist/
cp LICENSE dist/
cp CHANGELOG.md dist/