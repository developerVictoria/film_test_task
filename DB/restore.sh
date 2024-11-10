#!/bin/bash

# Check if container ID is provided
if [ -z "$1" ]; then
    echo "Error: Container ID not provided"
    echo "Usage: $0 <container_id>"
    exit 1
fi

# Get container IP address
CONTAINER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $1)

if [ -z "$CONTAINER_IP" ]; then
    echo "Error: Could not get container IP address"
    exit 1
fi

echo "Container IP: $CONTAINER_IP"


wait_for_postgres() {
    echo "Waiting for PostgreSQL to start..."
    while ! PGPASSWORD=postgres psql -h $CONTAINER_IP -p 5432 -U postgres -d postgres -c "SELECT 1" >/dev/null 2>&1; do
        echo "Waiting..."
        sleep 1
    done
    echo "PostgreSQL is ready!"
}


wait_for_postgres


echo "Creating database..."
PGPASSWORD=postgres psql -h $CONTAINER_IP -p 5432 -U postgres -d postgres -c "CREATE DATABASE dvdrental;"


echo "Restoring database from backup..."
PGPASSWORD=postgres pg_restore -h $CONTAINER_IP -p 5432 -U postgres -d dvdrental dvdrental.tar

echo "Database restoration completed!"




