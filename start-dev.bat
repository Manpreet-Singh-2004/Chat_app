@echo off
echo Starting frontend and backend dev servers...

start cmd /k "cd backend && npm run dev"
start cmd /k "cd frontend && npm run dev"

echo Dev servers launched.
