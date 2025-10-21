Write-Host "🧪 Running View Tracking System Tests..." -ForegroundColor Green

# Load environment variables
if (Test-Path ".env") {
    Get-Content .env | ForEach-Object {
        if ($_ -match "^([^#][^=]+)=(.*)$") {
            [Environment]::SetEnvironmentVariable($matches[1], $matches[2], "Process")
        }
    }
}

# Run the test
node test_view_tracking.js

Write-Host "✅ View tracking test completed!" -ForegroundColor Green
