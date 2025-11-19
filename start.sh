#!/bin/sh
PORT=${PORT:-3000}

# Check if dist directory exists
if [ ! -d "dist" ]; then
  echo "Error: dist directory not found. Build may have failed."
  exit 1
fi

# Check if index.html exists in dist
if [ ! -f "dist/index.html" ]; then
  echo "Error: dist/index.html not found. Build may have failed."
  exit 1
fi

# Use Node.js server.js if available (preferred for production)
if [ -f "server.js" ]; then
  echo "Starting Node.js static server on port $PORT..."
  exec node server.js
# Fallback to vite preview
elif [ -f "node_modules/.bin/vite" ]; then
  echo "Starting Vite preview server on port $PORT..."
  exec node node_modules/.bin/vite preview --host 0.0.0.0 --port $PORT
elif command -v bunx >/dev/null 2>&1; then
  echo "Starting Vite preview server via bunx on port $PORT..."
  exec bunx vite preview --host 0.0.0.0 --port $PORT
else
  echo "Error: Could not find server.js or vite. Please ensure dependencies are installed."
  exit 1
fi

