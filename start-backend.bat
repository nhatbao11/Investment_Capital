@echo off
echo 🚀 Starting Backend Server...

REM Kiểm tra Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

REM Kiểm tra npm
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Di chuyển vào thư mục backend
cd backend

REM Kiểm tra package.json
if not exist "package.json" (
    echo ❌ package.json not found in backend directory
    pause
    exit /b 1
)

REM Cài đặt dependencies nếu cần
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Kiểm tra .env file
if not exist ".env" (
    echo ⚠️  .env file not found. Creating from example...
    if exist "env.example" (
        copy env.example .env
        echo ✅ Created .env from env.example. Please update with your database credentials.
    ) else (
        echo ❌ env.example not found. Please create .env file manually.
        pause
        exit /b 1
    )
)

echo 🎉 Starting server...
echo 📡 Server will be available at: http://localhost:5000
echo 📊 API endpoints: http://localhost:5000/api/v1/
echo.
echo Press Ctrl+C to stop the server
echo.

REM Chạy server
npm run dev

pause
