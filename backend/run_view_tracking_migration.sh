#!/bin/bash

# View Tracking Migration Script
# Chạy migration để thêm bảng view_tracking và các tính năng analytics

echo "🚀 Starting View Tracking Migration..."

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Kiểm tra MySQL
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    exit 1
fi

# Chạy migration
echo "📊 Creating view_tracking table and analytics views..."
node scripts/setup_view_tracking.js

if [ $? -eq 0 ]; then
    echo "✅ View Tracking Migration completed successfully!"
    echo ""
    echo "📋 What was created:"
    echo "   - view_tracking table for advanced analytics"
    echo "   - Analytics views for dashboard"
    echo "   - Indexes for better performance"
    echo "   - API endpoints for tracking and stats"
    echo ""
    echo "🔗 New API endpoints:"
    echo "   - POST /api/v1/view-tracking/:resource_type/:resource_id (track view)"
    echo "   - GET /api/v1/view-tracking/stats/:resource_type/:resource_id (resource stats)"
    echo "   - GET /api/v1/view-tracking/overall (overall stats)"
    echo "   - GET /api/v1/view-tracking/top (top content)"
    echo "   - GET /api/v1/view-tracking/dashboard (dashboard stats)"
    echo ""
    echo "🎯 Next steps:"
    echo "   1. Restart your server to load new routes"
    echo "   2. Update frontend to use new tracking API"
    echo "   3. Test the new analytics features"
else
    echo "❌ Migration failed. Please check the error messages above."
    exit 1
fi
