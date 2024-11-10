#!/bin/bash


if [ -z "$1" ]; then
    echo "Error: Container ID not provided"
    echo "Usage: $0 <container_id>"
    exit 1
fi


CONTAINER_IP=$(docker inspect -f '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' $1)

if [ -z "$CONTAINER_IP" ]; then
    echo "Error: Could not get container IP address"
    exit 1
fi

echo "Container IP: $CONTAINER_IP"
