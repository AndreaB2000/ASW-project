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
@echo off
setlocal DISABLEDELAYEDEXPANSION
echo #!/bin/bash > "%TEMPLATE_FILE%"
echo. >> "%TEMPLATE_FILE%"
echo # Regex for Conventional Commit messages >> "%TEMPLATE_FILE%"
echo conventional_regex="^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\(\w+\))?(!)?: .{1,120}$" >> "%TEMPLATE_FILE%"
echo. >> "%TEMPLATE_FILE%"
echo # Read the commit message >> "%TEMPLATE_FILE%"
echo commit_message=$(cat "$1") >> "%TEMPLATE_FILE%"
echo. >> "%TEMPLATE_FILE%"
echo if [[ ! $commit_message =~ $conventional_regex ]]; then >> "%TEMPLATE_FILE%"
echo 	echo "" >> "%TEMPLATE_FILE%"
echo 	echo -e "\e[31mError\e[0m: Commit message does not follow the Conventional Commit format." >> "%TEMPLATE_FILE%"
echo 	echo "" >> "%TEMPLATE_FILE%"
echo     echo "Format:        <type>(<scope>)<!>: <description>" >> "%TEMPLATE_FILE%"
echo     echo "Valid types:   build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test" >> "%TEMPLATE_FILE%"
echo 	echo "Documentation: https://www.conventionalcommits.org/en/v1.0.0/" >> "%TEMPLATE_FILE%"
echo     exit 1 >> "%TEMPLATE_FILE%"
echo fi >> "%TEMPLATE_FILE%"
echo. >> "%TEMPLATE_FILE%"
echo # Success >> "%TEMPLATE_FILE%"
echo exit 0 >> "%TEMPLATE_FILE%"
echo     exit 1 >> "%TEMPLATE_FILE%"
echo fi >> "%TEMPLATE_FILE%"
echo. >> "%TEMPLATE_FILE%"
echo # Success >> "%TEMPLATE_FILE%"
echo exit 0 >> "%TEMPLATE_FILE%"
:: Rename the file to commit-msg
move /Y "%TEMPLATE_FILE%" "%HOOK_FILE%" >nul


echo ✅ Git commit-msg hook has been installed successfully!

:: Define the prepare-commit-msg hook filename
set TEMPLATE_FILE=%HOOKS_DIR%\prepare-commit-msg.sample
set HOOK_FILE=%HOOKS_DIR%\prepare-commit-msg

:: Write the prepare-commit-msg hook script
@echo off
echo #!/bin/bash > "%TEMPLATE_FILE%"
echo. >> "%TEMPLATE_FILE%"
echo if [ "$2" == "merge" ]; then >> "%TEMPLATE_FILE%"
echo     # Get the current branch name >> "%TEMPLATE_FILE%"
echo     current_branch=$(git rev-parse --abbrev-ref HEAD) >> "%TEMPLATE_FILE%"
echo. >>  "%TEMPLATE_FILE%"
echo     # Get the branch being merged >>  %TEMPLATE_FILE%"
echo     merged_branch=$(git name-rev --name-only $(git rev-parse MERGE_HEAD)) >> "%TEMPLATE_FILE%"
echo     # Write the custom commit message >> "%TEMPLATE_FILE%"
echo     echo "chore: merge $current_branch with $merged_branch" ^> "$1" >> "%TEMPLATE_FILE%"
echo fi >> "%TEMPLATE_FILE%"

:: Rename the file to prepare-commit-msg
move /Y "%TEMPLATE_FILE%" "%HOOK_FILE%" >nul

echo ✅ Git prepare-commit-msg hook has been installed successfully!
