@echo off
setlocal enabledelayedexpansion

:: Define the hook directory
set HOOKS_DIR=.git/hooks

:: Ensure the hooks directory exists
if not exist "%HOOKS_DIR%" mkdir "%HOOKS_DIR%"

:: Define the commit-msg hook filename
set TEMPLATE_FILE=%HOOKS_DIR%\commit-msg.sample
set HOOK_FILE=%HOOKS_DIR%\commit-msg

:: Write the commit-msg hook script
(
echo @echo off
echo setlocal enabledelayedexpansion
echo for /f "delims=" %%%%i in ('type %%1') do set "commit_message=%%%%i"
echo set "pattern=^(build^|chore^|ci^|docs^|feat^|fix^|perf^|refactor^|revert^|style^|test^)(\(\w+\))?(!)?: .{1,120}$"
echo echo !commit_message! ^| findstr /R /C:"!pattern!" >nul
echo if errorlevel 1 (
echo    echo.
echo    echo ERROR: Commit message does not follow the Conventional Commit format.
echo    echo Format:        ^<type^>(^<scope^>)^<!^>: ^<description^>
echo    echo Valid types:   build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test
echo    echo Documentation: https://www.conventionalcommits.org/en/v1.0.0/
echo    exit /b 1
echo )
echo exit /b 0
) > "%TEMPLATE_FILE%"

:: Rename the file to commit-msg
move /Y "%TEMPLATE_FILE%" "%HOOK_FILE%" >nul

:: Make the commit-msg hook executable
git config --add core.hooksPath .git/hooks

echo ✅ Git commit-msg hook has been installed successfully!

:: Define the prepare-commit-msg hook filename
set TEMPLATE_FILE=%HOOKS_DIR%\prepare-commit-msg.sample
set HOOK_FILE=%HOOKS_DIR%\prepare-commit-msg

:: Write the prepare-commit-msg hook script
(
echo @echo off
echo setlocal enabledelayedexpansion
echo if "%2"=="merge" (
echo    for /f "delims=" %%%%i in ('git rev-parse --abbrev-ref HEAD') do set "current_branch=%%%%i"
echo    for /f "delims=" %%%%i in ('git name-rev --name-only ^"git rev-parse MERGE_HEAD^"') do set "merged_branch=%%%%i"
echo    echo chore: merge !current_branch! with !merged_branch! > %1
echo )
) > "%TEMPLATE_FILE%"

:: Rename the file to prepare-commit-msg
move /Y "%TEMPLATE_FILE%" "%HOOK_FILE%" >nul

:: Make the prepare-commit-msg hook executable
git config --add core.hooksPath .git/hooks

echo ✅ Git prepare-commit-msg hook has been installed successfully!
