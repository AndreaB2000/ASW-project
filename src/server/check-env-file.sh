#!/bin/bash

ENV_FILE="../../.env"
REQUIRED_VARS=("DB_PROTOCOL" "DB_APP_USERNAME" "DB_APP_PASSWORD" "DB_NAME" "DB_PORT" "DB_IP")

echo "Checking .env file ($ENV_FILE)"

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: .env file does not exist. Please create one specifying:"
    printf '%s\n' "${REQUIRED_VARS[@]}"
    exit 1
fi

missing_vars=()
for var in "${REQUIRED_VARS[@]}"; do
    if ! grep -q "^$var=" "$ENV_FILE"; then
        missing_vars+=("$var")
    fi
done

# Se ci sono variabili mancanti, mostra un errore
if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "Error: In the .env file the following variables are missing:"
    printf '%s\n' "${missing_vars[@]}"
    echo
    exit 1
fi

echo ".env file checked."
echo
exit 0