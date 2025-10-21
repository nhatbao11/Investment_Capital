#!/bin/bash

echo "🧪 Running View Tracking System Tests..."

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '#' | awk '/=/ {print $1}')
fi

# Run the test
node test_view_tracking.js

echo "✅ View tracking test completed!"
