@echo off
REM Clean up the dist folder
rmdir /s /q dist

REM Build the server and client
call npm run build:server
call npm run build:client

REM Create the dist folder structure
mkdir dist
mkdir dist\client
mkdir dist\server

REM Copy the built files to the dist folder
xcopy /E /I /Y src\client\dist\* dist\client\
xcopy /E /I /Y src\server\dist\* dist\server\

REM Copy the package.json and package-lock.json files to the dist folder
copy package.json dist\
setlocal enabledelayedexpansion

REM Read package.json and replace "src/" with an empty string
(for /f "delims=" %%i in (dist\package.json) do (
    set "line=%%i"
    set "line=!line:src/=!"
    echo !line!
)) > package.tmp

REM Overwrite package.json with the modified content
move /y package.tmp dist\package.json >nul

copy package-lock.json dist\
copy src\server\package.json dist\server\
copy src\server\package-lock.json dist\server\
copy src\client\package.json dist\client\
copy src\client\package-lock.json dist\client\

copy src\CHANGELOG.md dist\
copy src\LICENSE dist\
copy src\README.md dist\

echo Build process completed.
