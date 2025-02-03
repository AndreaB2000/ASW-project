@echo off
REM Clean up the dist folder
rmdir /s /q dist

REM Build the server and client
call npm run build:server
call npm run build:client

REM Copy the package.json and package-lock.json files to the dist folder
copy package.json dist\
setlocal enabledelayedexpansion

copy package-lock.json dist\
copy src\server\package.json dist\server\
copy src\server\package-lock.json dist\server\
copy src\client\package.json dist\client\
copy src\client\package-lock.json dist\client\

copy CHANGELOG.md dist\
copy LICENSE dist\
copy README.md dist\

echo Build process completed.
