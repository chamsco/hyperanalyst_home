#!/bin/sh
PORT=${PORT:-3000}
exec bunx vite preview --host 0.0.0.0 --port $PORT

