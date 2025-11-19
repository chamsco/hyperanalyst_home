#!/bin/sh
PORT=${PORT:-3000}

echo "Starting deployment script..."
echo "PORT: $PORT"

if [ ! -d "dist" ]; then
  echo "Error: dist directory not found!"
  ls -la
  exit 1
fi

# Explicitly bind to 0.0.0.0 (IPv4) to avoid IPv6 issues with Docker/Traefik
echo "Starting serve via bunx on 0.0.0.0:$PORT"
exec bunx serve -s dist -l tcp://0.0.0.0:$PORT
