#!/bin/bash

echo "Restarting server..."

# Kill existing processes
pkill -f "node.*server.js"
pkill -f "npm.*start"

# Wait a moment
sleep 2

# Start server
cd /root/Investment_Capital/backend
npm start &

echo "Server restarted!"
echo "Test static files:"
echo "curl http://localhost:5000/uploads/posts/"
echo "curl http://localhost:5000/uploads/reports/banking_sector_2024.pdf"















