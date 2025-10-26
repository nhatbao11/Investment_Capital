#!/bin/bash

echo "🚀 Starting Backend Server..."

# Kiểm tra Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Kiểm tra npm
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Di chuyển vào thư mục backend
cd backend

# Kiểm tra package.json
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found in backend directory"
    exit 1
fi

# Cài đặt dependencies nếu cần
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Kiểm tra .env file
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from example..."
    if [ -f "env.example" ]; then
        cp env.example .env
        echo "✅ Created .env from env.example. Please update with your database credentials."
    else
        echo "❌ env.example not found. Please create .env file manually."
        exit 1
    fi
fi

# Kiểm tra database connection
echo "🔍 Testing database connection..."
node -e "
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'yt_capital_db'
    });
    
    console.log('✅ Database connection successful');
    await connection.end();
    return true;
  } catch (error) {
    console.log('❌ Database connection failed:', error.message);
    return false;
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});
"

if [ $? -ne 0 ]; then
    echo "❌ Database connection failed. Please check your .env file."
    exit 1
fi

echo "🎉 Starting server..."
echo "📡 Server will be available at: http://localhost:5000"
echo "📊 API endpoints: http://localhost:5000/api/v1/"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

# Chạy server
npm run dev
