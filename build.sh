#!/bin/bash

# Clean up the dist folder
rm -rf dist

# Build the server and client
npm run build:server
npm run build:client
npm run build:docs

# Copy the package.json and package-lock.json files to the dist folder
cp package.json dist/
cp package-lock.json dist/
cp src/server/package.json dist/server/
cp src/server/package-lock.json dist/server/
cp src/client/package.json dist/client/
cp src/client/package-lock.json dist/client/

# Copy the README.md, LICENSE, and CHANGELOG.md files to the dist folder
cp README.md dist/
cp -r docs/ dist/
cp LICENSE dist/
cp CHANGELOG.md dist/