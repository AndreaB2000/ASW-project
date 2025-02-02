#!/bin/sh

# Define the hook directory and filenames
HOOKS_DIR=".git/hooks"
TEMPLATE_FILE="$HOOKS_DIR/commit-msg.sample"
HOOK_FILE="$HOOKS_DIR/commit-msg"

# Ensure the hooks directory exists
mkdir -p "$HOOKS_DIR"

# Write the commit message hook template
cat > "$TEMPLATE_FILE" << 'EOF'
#!/bin/bash

# Regex for Conventional Commit messages
conventional_regex="^(build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test)(\(\w+\))?(!)?: .{1,120}$"

# Read the commit message
commit_message=$(cat "$1")

if [[ ! $commit_message =~ $conventional_regex ]]; then
	echo ""
	echo -e "\e[31mError\e[0m: Commit message does not follow the Conventional Commit format."
	echo ""
    echo "Format:        <type>(<scope>)<!>: <description>"
    echo "Valid types:   build, chore, ci, docs, feat, fix, perf, refactor, revert, style, test"
	echo "Documentation: https://www.conventionalcommits.org/en/v1.0.0/"
    exit 1
fi

# Success
exit 0
EOF

# Rename the file to commit-msg
mv "$TEMPLATE_FILE" "$HOOK_FILE"

# Make the commit-msg hook executable
chmod +x "$HOOK_FILE"

echo "✅ Git commit-msg hook has been installed successfully!"

# Define the hook directory and filenames
HOOKS_DIR=".git/hooks"
TEMPLATE_FILE="$HOOKS_DIR/prepare-commit-msg.sample"
HOOK_FILE="$HOOKS_DIR/prepare-commit-msg"

# Write the prepare commit message hook template
cat > "$TEMPLATE_FILE" << 'EOF'
#!/bin/bash

if [ "$2" == "merge" ]; then
    # Get the current branch name
    current_branch=$(git rev-parse --abbrev-ref HEAD)

    # Get the branch being merged
    merged_branch=$(git name-rev --name-only $(git rev-parse MERGE_HEAD))

    # Write the custom commit message
    echo "chore: merge $current_branch with $merged_branch" > "$1"
fi
EOF

# Rename the file to prepare-commit-msg
mv "$TEMPLATE_FILE" "$HOOK_FILE"

# Make the prepare-commit-msg hook executable
chmod +x "$HOOK_FILE"

echo "✅ Git prepare-commit-msg hook has been installed successfully!"
