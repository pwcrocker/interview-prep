#!/bin/bash

if [ -z "$POSTGRES_APP_DB" ]; then
    echo "Error: POSTGRES_APP_DB environment variable is not set."
    exit 1
fi

if [ -z "$POSTGRES_WRITE_USER" ]; then
    echo "Error: POSTGRES_WRITE_USER environment variable is not set."
    exit 1
fi

if [ -z "$POSTGRES_WRITE_PASSWORD" ]; then
    echo "Error: POSTGRES_WRITE_PASSWORD environment variable is not set."
    exit 1
fi

# Run psql with the environment variables and execute create_schema.sql
psql postgres postgres -v db_name="$POSTGRES_APP_DB" -v db_user="$POSTGRES_WRITE_USER" -v db_pwd="$POSTGRES_WRITE_PASSWORD" -f /create_schema.sql
psql postgres postgres -v db_name="$POSTGRES_APP_DB" -v db_user="$POSTGRES_WRITE_USER" -v db_pwd="$POSTGRES_WRITE_PASSWORD" -f /insert_mock_data.sql
