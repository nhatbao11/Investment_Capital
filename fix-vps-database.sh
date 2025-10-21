#!/bin/bash

# Script để sửa database trên VPS
echo "🔧 Đang sửa foreign key constraint trên VPS..."

# Upload script lên VPS
echo "📤 Uploading fix script to VPS..."
scp backend/scripts/fix_vps_foreign_key.js root@your-vps-ip:/root/

# Chạy script trên VPS
echo "🚀 Running fix script on VPS..."
ssh root@your-vps-ip "cd /root && node fix_vps_foreign_key.js"

echo "✅ Hoàn thành! Database trên VPS đã được sửa."
