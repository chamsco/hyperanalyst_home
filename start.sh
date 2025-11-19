#!/bin/sh
PORT=${PORT:-3000}

# Check if dist directory exists
if [ ! -d "dist" ]; then
  echo "Error: dist directory not found. Build may have failed."
  exit 1
fi

echo "Starting static server on port $PORT..."
exec bunx serve -s dist -l $PORT
